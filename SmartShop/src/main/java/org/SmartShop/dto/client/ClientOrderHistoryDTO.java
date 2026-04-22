package org.SmartShop.dto.client;

import org.SmartShop.entity.enums.OrderStatus;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class ClientOrderHistoryDTO {
    private LocalDateTime createdAt;
    private BigDecimal totalTTC;
    private OrderStatus status;
    private Long id;
}