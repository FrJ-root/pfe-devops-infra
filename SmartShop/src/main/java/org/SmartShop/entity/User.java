package org.SmartShop.entity;

import lombok.*;
import jakarta.persistence.*;
import org.SmartShop.entity.enums.UserRole;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToOne(mappedBy = "linkedAccount", cascade = CascadeType.ALL)
    private Client clientDetails;
}
