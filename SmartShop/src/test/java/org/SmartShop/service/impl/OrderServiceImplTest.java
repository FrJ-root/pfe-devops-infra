package org.SmartShop.service.impl;

import org.springframework.test.util.ReflectionTestUtils;
import org.SmartShop.repository.PromoCodeRepository;
import org.SmartShop.dto.order.OrderItemRequestDTO;
import org.mockito.junit.jupiter.MockitoExtension;
import org.SmartShop.repository.ProductRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.SmartShop.repository.ClientRepository;
import static org.junit.jupiter.api.Assertions.*;
import org.SmartShop.dto.order.OrderResponseDTO;
import org.SmartShop.repository.OrderRepository;
import org.SmartShop.dto.order.OrderRequestDTO;
import static org.mockito.ArgumentMatchers.any;
import org.SmartShop.entity.enums.OrderStatus;
import org.SmartShop.service.LoyaltyService;
import org.junit.jupiter.api.DisplayName;
import org.SmartShop.mapper.OrderMapper;
import org.junit.jupiter.api.BeforeEach;
import org.SmartShop.entity.Product;
import static org.mockito.Mockito.*;
import org.SmartShop.entity.Client;
import org.SmartShop.entity.Order;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import java.math.BigDecimal;
import java.util.Optional;
import org.mockito.Mock;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private PromoCodeRepository promoCodeRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ClientRepository clientRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private LoyaltyService loyaltyService;
    @InjectMocks
    private OrderServiceImpl orderService;
    @Mock
    private OrderMapper orderMapper;
    private Product mockProduct;
    private Client mockClient;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "tvaRate", new BigDecimal("0.20"));

        mockClient = new Client();
        mockClient.setId(1L);

        mockProduct = Product.builder()
                .id(1L)
                .name("Laptop Test")
                .unitPriceHT(new BigDecimal("1000.00"))
                .stockAvailable(10)
                .build();
    }

    @Test
    @DisplayName("Devrait créer une commande standard avec calcul TVA correct")
    void testCreateOrder_StandardCalculation() {
        OrderRequestDTO request = new OrderRequestDTO();
        request.setClientId(1L);
        OrderItemRequestDTO itemDto = new OrderItemRequestDTO();
        itemDto.setProductId(1L);
        itemDto.setQuantity(2);
        request.setItems(List.of(itemDto));

        when(clientRepository.findById(1L)).thenReturn(Optional.of(mockClient));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(loyaltyService.calculateLoyaltyDiscount(any(), any())).thenReturn(BigDecimal.ZERO);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderMapper.toDto(any(Order.class))).thenReturn(new OrderResponseDTO());

        orderService.createOrder(request);

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();

        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(0, new BigDecimal("2000.00").compareTo(savedOrder.getSubTotalHT()), "Le sous-total est incorrect");
        assertEquals(0, new BigDecimal("2000.00").compareTo(savedOrder.getHtAfterDiscount()));
        assertEquals(0, new BigDecimal("400.00").compareTo(savedOrder.getTaxAmount()), "Le montant TVA est incorrect");
        assertEquals(0, new BigDecimal("2400.00").compareTo(savedOrder.getTotalTTC()), "Le TTC est incorrect");
    }

    @Test
    @DisplayName("Devrait rejeter la commande si le stock est insuffisant")
    void testCreateOrder_InsufficientStock_ShouldReject() {
        OrderRequestDTO request = new OrderRequestDTO();
        request.setClientId(1L);
        OrderItemRequestDTO itemDto = new OrderItemRequestDTO();
        itemDto.setProductId(1L);
        itemDto.setQuantity(15);
        request.setItems(List.of(itemDto));

        when(clientRepository.findById(1L)).thenReturn(Optional.of(mockClient));
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(loyaltyService.calculateLoyaltyDiscount(any(), any())).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));
        when(orderMapper.toDto(any())).thenReturn(new OrderResponseDTO());

        orderService.createOrder(request);

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals(OrderStatus.REJECTED, savedOrder.getStatus(), "La commande devrait être REJECTED pour stock insuffisant");
    }
}