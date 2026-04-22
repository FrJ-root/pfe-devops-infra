package org.SmartShop.entity;

import org.SmartShop.entity.enums.OrderStatus;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    private BigDecimal htAfterDiscount;
    private BigDecimal discountAmount;
    private LocalDateTime createdAt;
    private BigDecimal subTotalHT;
    private BigDecimal taxAmount;
    private BigDecimal totalTTC;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private String promoCode;
    private BigDecimal amountRemaining;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order")
    private List<Payment> payments;
}