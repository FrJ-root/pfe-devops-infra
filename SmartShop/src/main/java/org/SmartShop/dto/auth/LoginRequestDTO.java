package org.SmartShop.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "Ooops! . Username is required -_-")
    private String username;

    @NotBlank(message = "Ooops! . Password is required -_-")
    private String password;
}