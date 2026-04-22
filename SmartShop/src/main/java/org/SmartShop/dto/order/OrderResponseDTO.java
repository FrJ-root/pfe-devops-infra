package org.SmartShop.dto.order;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class OrderResponseDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private String status;
    private BigDecimal totalTTC;
    private BigDecimal taxAmount;
    private BigDecimal subTotalHT;
    private LocalDateTime createdAt;
    private BigDecimal discountAmount;
    private BigDecimal amountRemaining;
    private List<OrderItemResponseDTO> items;
}