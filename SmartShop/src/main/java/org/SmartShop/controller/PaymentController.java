package org.SmartShop.controller;

import org.SmartShop.dto.payment.PaymentResponseDTO;
import org.SmartShop.dto.payment.PaymentRequestDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.SmartShop.service.OrderService;
import org.SmartShop.service.PaymentService;
import org.SmartShop.repository.ClientRepository;
import org.SmartShop.entity.Client;
import org.SmartShop.dto.order.OrderResponseDTO;
import org.SmartShop.entity.enums.UserRole;
import org.SmartShop.exception.custom.ForbiddenException;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final ClientRepository clientRepository;
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> recordPayment(@RequestBody @Valid PaymentRequestDTO dto,
            HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");

        if (role == UserRole.CLIENT) {
            Long sessionUserId = (Long) session.getAttribute("USER_ID");
            Client client = clientRepository.findByLinkedAccountId(sessionUserId)
                    .orElseThrow(() -> new ForbiddenException("No client linked to this account"));

            OrderResponseDTO order = orderService.getOrderById(dto.getOrderId());
            if (!order.getClientId().equals(client.getId())) {
                throw new ForbiddenException("Access Denied: You cannot pay for someone else's order -_-");
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.recordPayment(dto));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByOrder(@PathVariable Long orderId,
            HttpSession session) {
        return ResponseEntity.ok(paymentService.getPaymentsByOrder(orderId));
    }

    private void checkAdminAccess(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        if (role != UserRole.ADMIN) {
            throw new RuntimeException("Access Denied: Admin role required -_-");
        }
    }

}