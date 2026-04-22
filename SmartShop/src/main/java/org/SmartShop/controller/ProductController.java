package org.SmartShop.controller;

import org.SmartShop.dto.product.ProductResponseDTO;
import org.SmartShop.dto.product.ProductRequestDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Sort;
import org.SmartShop.service.ProductService;
import org.springframework.data.domain.Page;
import org.SmartShop.entity.enums.UserRole;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, HttpSession session) {
        checkAdminAccess(session);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody @Valid ProductRequestDTO dto,
            HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long id,
            @RequestBody @Valid ProductRequestDTO dto, HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(productService.getAllProducts(search, pageable));
    }

    private void checkAdminAccess(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        if (role != UserRole.ADMIN) {
            throw new RuntimeException("Access Denied: Admin role required -_-");
        }
    }

}