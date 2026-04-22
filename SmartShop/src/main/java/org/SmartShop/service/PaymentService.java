package org.SmartShop.service;

import org.SmartShop.dto.payment.PaymentRequestDTO;
import org.SmartShop.dto.payment.PaymentResponseDTO;
import java.util.List;

public interface PaymentService {
    PaymentResponseDTO recordPayment(PaymentRequestDTO dto);
    List<PaymentResponseDTO> getPaymentsByOrder(Long orderId);
}