package org.SmartShop.entity;

import org.SmartShop.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int paymentNumber;
    private BigDecimal amount;
    private String paymentType;

    private LocalDate paymentDate;
    private LocalDate encashmentDate;
    private LocalDate dueDate;

    private String reference;
    private String bank;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}