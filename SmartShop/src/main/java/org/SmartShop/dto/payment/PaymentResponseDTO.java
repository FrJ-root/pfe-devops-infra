package org.SmartShop.dto.payment;

import org.SmartShop.entity.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class PaymentResponseDTO {
    private Long id;
    private int paymentNumber;
    private BigDecimal amount;
    private String paymentType;
    private PaymentStatus status;
    private LocalDate paymentDate;
}