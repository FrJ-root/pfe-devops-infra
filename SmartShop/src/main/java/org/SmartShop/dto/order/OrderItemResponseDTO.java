package org.SmartShop.dto.order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponseDTO {
    private int quantity;
    private String productName;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}