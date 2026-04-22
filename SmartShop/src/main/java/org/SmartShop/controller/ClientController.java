package org.SmartShop.controller;

import org.SmartShop.dto.client.ClientOrderHistoryDTO;
import org.SmartShop.dto.client.ClientResponseDTO;
import org.SmartShop.dto.client.ClientRequestDTO;
import org.SmartShop.repository.ClientRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.SmartShop.entity.enums.UserRole;
import org.SmartShop.service.ClientService;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.SmartShop.entity.Client;
import jakarta.validation.Valid;
import java.util.List;
import org.SmartShop.exception.custom.ForbiddenException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientRepository clientRepository;

    @GetMapping("/me")
    public ResponseEntity<ClientResponseDTO> getMe(HttpSession session) {
        Long sessionUserId = (Long) session.getAttribute("USER_ID");
        Client client = clientRepository.findByLinkedAccountId(sessionUserId)
                .orElseThrow(() -> new ForbiddenException("No client linked to this account"));
        return ResponseEntity.ok(clientService.getClientById(client.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> updateClient(@PathVariable Long id,
            @RequestBody @Valid ClientRequestDTO dto, HttpSession session) {
        checkAccess(id, session);
        return ResponseEntity.ok(clientService.updateClient(id, dto));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<ClientOrderHistoryDTO>> getOrderHistory(@PathVariable Long id, HttpSession session) {
        checkAccess(id, session);
        return ResponseEntity.ok(clientService.getClientOrderHistory(id));
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> createClient(@RequestBody @Valid ClientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> getClient(@PathVariable Long id, HttpSession session) {
        checkAccess(id, session);
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    private void checkAccess(Long requestedClientId, HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        Long sessionUserId = (Long) session.getAttribute("USER_ID");

        if (role == UserRole.ADMIN)
            return;

        Client client = clientRepository.findById(requestedClientId)
                .orElseThrow(() -> new RuntimeException("Ooops! . Client not found"));

        if (!client.getLinkedAccount().getId().equals(sessionUserId)) {
            throw new RuntimeException("Access Denied: You can only view your own data -_-");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id, HttpSession session) {
        checkAdminAccess(session);
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getClientCount(HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(clientService.getClientCount());
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> getAllClients(HttpSession session) {
        checkAdminAccess(session);
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<Void> blockClient(@PathVariable Long id, HttpSession session) {
        checkAdminAccess(session);
        clientService.blockClient(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/unblock")
    public ResponseEntity<Void> unblockClient(@PathVariable Long id, HttpSession session) {
        checkAdminAccess(session);
        clientService.unblockClient(id);
        return ResponseEntity.ok().build();
    }

    private void checkAdminAccess(HttpSession session) {
        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        if (role != UserRole.ADMIN) {
            throw new RuntimeException("Access Denied: Admin role required -_-");
        }
    }
}