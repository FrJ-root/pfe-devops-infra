package org.SmartShop.mapper;

import org.SmartShop.entity.OrderItem;
import org.SmartShop.entity.Order;
import org.SmartShop.dto.order.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "clientName", source = "client.name")
    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    OrderResponseDTO toDto(Order order);

    @Mapping(target = "productName", source = "product.name")
    OrderItemResponseDTO toItemDto(OrderItem item);
}