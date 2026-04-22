package org.SmartShop.service.impl;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.SmartShop.dto.order.OrderItemRequestDTO;
import org.SmartShop.dto.order.OrderResponseDTO;
import org.SmartShop.dto.order.OrderRequestDTO;
import org.SmartShop.entity.enums.OrderStatus;
import org.springframework.stereotype.Service;
import org.SmartShop.service.LoyaltyService;
import org.SmartShop.service.OrderService;
import org.SmartShop.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.SmartShop.repository.*;
import java.time.LocalDateTime;
import org.SmartShop.entity.*;
import java.math.RoundingMode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final LoyaltyService loyaltyService;
    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final PromoCodeRepository promoCodeRepository;

    @Value("${app.business.tva-rate:0.20}")
    private BigDecimal tvaRate;

    private static final BigDecimal PROMO_RATE = new BigDecimal("0.05");

    @Override
    public OrderResponseDTO updateStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == newStatus) {
            return orderMapper.toDto(order);
        }

        // Handle reverting side effects if moving AWAY from CONFIRMED
        if (order.getStatus() == OrderStatus.CONFIRMED && newStatus != OrderStatus.CONFIRMED) {
            revertStock(order);
            revertClientStats(order);
        }

        // Handle applying side effects if moving TO CONFIRMED
        if (newStatus == OrderStatus.CONFIRMED) {
            // Must be fully paid
            if (order.getAmountRemaining().compareTo(BigDecimal.ZERO) > 0) {
                throw new RuntimeException("Order not fully paid. Remaining: " + order.getAmountRemaining());
            }

            // Decrement stock and update stats
            for (OrderItem item : order.getOrderItems()) {
                Product p = item.getProduct();
                if (p.getStockAvailable() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + p.getName());
                }
                p.setStockAvailable(p.getStockAvailable() - item.getQuantity());
                productRepository.save(p);
            }
            updateClientStats(order);
        } else if (newStatus == OrderStatus.CANCELED) {
            // No strict restriction for admin on when they can cancel, but typically from
            // PENDING
        }

        order.setStatus(newStatus);
        return orderMapper.toDto(orderRepository.save(order));
    }

    private void revertStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Product p = item.getProduct();
            p.setStockAvailable(p.getStockAvailable() + item.getQuantity());
            productRepository.save(p);
        }
    }

    private void revertClientStats(Order order) {
        Client client = order.getClient();
        if (client.getTotalOrders() > 0) {
            client.setTotalOrders(client.getTotalOrders() - 1);
        }

        BigDecimal currentSpent = client.getTotalSpent() != null ? client.getTotalSpent() : BigDecimal.ZERO;
        BigDecimal newSpent = currentSpent.subtract(order.getTotalTTC());
        client.setTotalSpent(newSpent.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newSpent);

        loyaltyService.updateClientTier(client);
        clientRepository.save(client);
    }

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Ooops! . Une commande doit avoir un client valide ^_-"));

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Ooops! . Une commande ne peut pas etre vide ^_-");
        }

        Order order = new Order();
        order.setClient(client);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subTotalHT = BigDecimal.ZERO;
        boolean stockInsufficient = false;

        for (OrderItemRequestDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(
                            () -> new RuntimeException("Ooops! . Produit introuvable ID: " + itemDto.getProductId()));

            if (product.getStockAvailable() < itemDto.getQuantity()) {
                stockInsufficient = true;
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setUnitPrice(product.getUnitPriceHT());

            BigDecimal lineTotal = product.getUnitPriceHT().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            orderItem.setLineTotal(lineTotal);

            orderItems.add(orderItem);
            subTotalHT = subTotalHT.add(lineTotal);
        }

        order.setOrderItems(orderItems);
        order.setSubTotalHT(subTotalHT);

        if (stockInsufficient) {
            order.setStatus(OrderStatus.REJECTED);
        }

        BigDecimal promoDiscount = BigDecimal.ZERO;
        if (dto.getPromoCode() != null && !dto.getPromoCode().isBlank()) {
            if (!dto.getPromoCode().matches("PROMO-[A-Z0-9]{4}")) {
                throw new RuntimeException("Ooops! . Format Code Promo invalide. Attendu: PROMO-XXXX");
            }

            PromoCode promo = promoCodeRepository.findByCode(dto.getPromoCode())
                    .orElseThrow(() -> new RuntimeException("Ooops! . Code Promo inexistant ou invalide"));

            if (!promo.isActive()) {
                throw new RuntimeException("Ooops! . Ce Code Promo n'est plus actif");
            }
            if (promo.isSingleUse() && promo.isUsed()) {
                throw new RuntimeException("Ooops! . Ce Code Promo a déjà été utilisé");
            }

            promoDiscount = subTotalHT.multiply(PROMO_RATE).setScale(2, RoundingMode.HALF_UP);
            order.setPromoCode(promo.getCode());

            if (promo.isSingleUse()) {
                promo.setUsed(true);
                promoCodeRepository.save(promo);
            }
        }

        BigDecimal loyaltyDiscount = loyaltyService.calculateLoyaltyDiscount(client, subTotalHT);
        BigDecimal totalDiscount = loyaltyDiscount.add(promoDiscount);
        order.setDiscountAmount(totalDiscount);

        BigDecimal htAfterDiscount = subTotalHT.subtract(totalDiscount);
        if (htAfterDiscount.compareTo(BigDecimal.ZERO) < 0)
            htAfterDiscount = BigDecimal.ZERO;
        order.setHtAfterDiscount(htAfterDiscount);

        BigDecimal taxAmount = htAfterDiscount.multiply(tvaRate).setScale(2, RoundingMode.HALF_UP);
        order.setTaxAmount(taxAmount);

        BigDecimal totalTTC = htAfterDiscount.add(taxAmount).setScale(2, RoundingMode.HALF_UP);
        order.setTotalTTC(totalTTC);
        order.setAmountRemaining(totalTTC);

        return orderMapper.toDto(orderRepository.save(order));
    }

    @Override
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Ooops! . Order not found"));
        return orderMapper.toDto(order);
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(orderMapper::toDto).toList();
    }

    @Override
    public List<OrderResponseDTO> getOrdersByClientId(Long clientId) {
        return orderRepository.findByClientId(clientId).stream().map(orderMapper::toDto).toList();
    }

    private void updateClientStats(Order order) {
        Client client = order.getClient();
        client.setTotalOrders(client.getTotalOrders() + 1);
        BigDecimal currentSpent = client.getTotalSpent() != null ? client.getTotalSpent() : BigDecimal.ZERO;
        client.setTotalSpent(currentSpent.add(order.getTotalTTC()));

        if (client.getFirstOrderDate() == null)
            client.setFirstOrderDate(LocalDate.now());
        client.setLastOrderDate(LocalDate.now());

        loyaltyService.updateClientTier(client);
        clientRepository.save(client);
    }

}