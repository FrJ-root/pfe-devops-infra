package org.SmartShop.dto.product;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private BigDecimal unitPriceHT;
    private int stockAvailable;
    private boolean deleted;
}