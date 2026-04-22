package org.SmartShop.dto.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ClientRequestDTO {
    @NotBlank(message = "Ooops! . Name is required")
    private String name;

    @Email(message = "Ooops! . Invalid email format")
    @NotBlank(message = "Ooops! . Email is required")
    private String email;

    @NotBlank(message = "Ooops! . Username is required")
    private String username;

    @NotBlank(message = "Ooops! . Password is required")
    private String password;
}