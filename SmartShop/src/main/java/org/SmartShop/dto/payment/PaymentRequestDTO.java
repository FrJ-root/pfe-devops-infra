package org.SmartShop.dto.payment;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.SmartShop.entity.enums.PaymentStatus;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment type is required")
    private String paymentType;

    private String reference;
    private String bank;
    private LocalDate dueDate;
    private PaymentStatus status;
}