package org.SmartShop.entity;

import org.SmartShop.entity.enums.ClientStatus;
import org.SmartShop.entity.enums.CustomerTier;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private CustomerTier tier;

    private int totalOrders;
    private BigDecimal totalSpent;

    private LocalDate firstOrderDate;
    private LocalDate lastOrderDate;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User linkedAccount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ClientStatus status = ClientStatus.ACTIVE;

    @Builder.Default
    private Boolean deleted = false;
}