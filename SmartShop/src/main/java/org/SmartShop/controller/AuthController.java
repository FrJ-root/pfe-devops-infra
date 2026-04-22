package org.SmartShop.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpSession;
import org.SmartShop.service.AuthService;
import org.SmartShop.dto.auth.AuthResponseDTO;
import org.SmartShop.dto.auth.LoginRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO loginRequest, HttpSession session) {
        return ResponseEntity.ok(authService.login(loginRequest, session));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok("Logged out successfully");
    }

}