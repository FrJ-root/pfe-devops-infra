package org.SmartShop.service.impl;

import org.springframework.transaction.annotation.Transactional;
import org.SmartShop.dto.payment.PaymentResponseDTO;
import org.SmartShop.dto.payment.PaymentRequestDTO;
import org.SmartShop.repository.PaymentRepository;
import org.SmartShop.entity.enums.PaymentStatus;
import org.SmartShop.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.SmartShop.service.PaymentService;
import org.SmartShop.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.SmartShop.entity.Payment;
import org.SmartShop.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final org.SmartShop.service.SqsMessageSender sqsMessageSender;

    private static final BigDecimal CASH_LIMIT = new BigDecimal("20000.00");

    @Override
    public PaymentResponseDTO recordPayment(PaymentRequestDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (dto.getAmount().compareTo(order.getAmountRemaining()) > 0) {
            throw new RuntimeException("Payment exceeds remaining balance. Remaining to pay: " + order.getAmountRemaining());
        }

        validatePaymentRules(dto);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(dto.getAmount());
        payment.setPaymentType(dto.getPaymentType().toUpperCase());
        payment.setReference(dto.getReference());
        payment.setBank(dto.getBank());
        payment.setDueDate(dto.getDueDate());
        payment.setPaymentDate(LocalDate.now());

        if ("ESPECES".equalsIgnoreCase(dto.getPaymentType())) {
            payment.setStatus(PaymentStatus.ENCAISSE);
            payment.setEncashmentDate(LocalDate.now());
        } else {
            payment.setStatus(PaymentStatus.EN_ATTENTE);
        }

        int nextNum = (order.getPayments() != null ? order.getPayments().size() : 0) + 1;
        payment.setPaymentNumber(nextNum);

        Payment savedPayment = paymentRepository.save(payment);

        BigDecimal newRemaining = order.getAmountRemaining().subtract(dto.getAmount());
        order.setAmountRemaining(newRemaining);
        orderRepository.save(order);

        // Send Async Message via SQS
        sqsMessageSender.sendMessage("Payment RECORDED for Order ID: " + order.getId() + " | Amount: " + dto.getAmount() + " DH");

        return paymentMapper.toDto(savedPayment);
    }

    private void validatePaymentRules(PaymentRequestDTO dto) {
        String type = dto.getPaymentType().toUpperCase();

        switch (type) {
            case "ESPECES":
                if (dto.getAmount().compareTo(CASH_LIMIT) > 0) {
                    throw new RuntimeException("Legal Limit Exceeded: Cash payments cannot exceed 20,000 DH");
                }
                if (dto.getReference() == null || dto.getReference().isBlank()) {
                    throw new RuntimeException("Cash payment requires a Receipt Reference");
                }
                break;

            case "CHEQUE":
                if (dto.getReference() == null || dto.getReference().isBlank())
                    throw new RuntimeException("Check requires a Number (Reference)");
                if (dto.getBank() == null || dto.getBank().isBlank())
                    throw new RuntimeException("Check requires a Bank name");
                if (dto.getDueDate() == null)
                    throw new RuntimeException("Check requires a Due Date");
                break;

            case "VIREMENT":
                if (dto.getReference() == null || dto.getReference().isBlank())
                    throw new RuntimeException("Transfer requires a Reference");
                if (dto.getBank() == null || dto.getBank().isBlank())
                    throw new RuntimeException("Transfer requires a Bank name");
                break;

            default:
                throw new RuntimeException("Invalid Payment Type. Accepted: ESPECES, CHEQUE, VIREMENT");
        }

    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(paymentMapper::toDto)
                .toList();
    }

}