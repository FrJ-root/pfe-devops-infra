package org.SmartShop.dto.order;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    @NotNull
    private Long clientId;

    @NotEmpty(message = "Order must contain items")
    private List<OrderItemRequestDTO> items;

    @Pattern(regexp = "PROMO-[A-Z0-9]{4}", message = "Invalid Promo Code format")
    private String promoCode;
}