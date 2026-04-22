package org.SmartShop.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PromoCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private boolean active;
    private boolean singleUse;
    private boolean used;
}