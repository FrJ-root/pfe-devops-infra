package org.SmartShop.mapper;

import org.mapstruct.*;
import org.SmartShop.dto. product.*;
import org.SmartShop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Product toEntity(ProductRequestDTO dto);
    ProductResponseDTO toDto(Product entity);
}