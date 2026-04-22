package org.SmartShop.dto.auth;

import org.SmartShop.entity.enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    private Long id;
    private UserRole role;
    private String username;
}