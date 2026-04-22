package org.SmartShop.controller;

import org.SmartShop.entity.Client;
import org.SmartShop.exception.custom.ForbiddenException;
import org.SmartShop.repository.ClientRepository;
import org.springframework.web.bind.annotation.*;
import org.SmartShop.dto.order.OrderResponseDTO;
import org.SmartShop.dto.order.OrderRequestDTO;
import org.springframework.http.ResponseEntity;
import org.SmartShop.entity.enums.OrderStatus;
import org.SmartShop.entity.enums.UserRole;
import org.springframework.http.HttpStatus;
import org.SmartShop.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final ClientRepository clientRepository;

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status,
            HttpSession session) {

        checkAdminAccess(session);
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody @Valid OrderRequestDTO dto, HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(dto));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        Long sessionUserId = (Long) session.getAttribute("USER_ID");

        if (role == UserRole.ADMIN) {
            return ResponseEntity.ok(orderService.getAllOrders());
        }

        Client client = clientRepository.findByLinkedAccountId(sessionUserId)
                .orElseThrow(() -> new ForbiddenException("No client linked to this account"));

        return ResponseEntity.ok(orderService.getOrdersByClientId(client.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long id, HttpSession session) {
        OrderResponseDTO order = orderService.getOrderById(id);

        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        Long sessionUserId = (Long) session.getAttribute("USER_ID");

        if (role == UserRole.CLIENT) {
            Client client = clientRepository.findByLinkedAccountId(sessionUserId)
                    .orElseThrow(() -> new ForbiddenException("No client linked to this account"));

            if (!order.getClientId().equals(client.getId())) {
                throw new ForbiddenException("Access Denied: This is not your order -_-");
            }
        }
        return ResponseEntity.ok(order);
    }

    private void checkAdminAccess(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        if (role != UserRole.ADMIN) {
            throw new RuntimeException("Access Denied: Admin role required -_-");
        }
    }

}