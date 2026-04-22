package org.SmartShop.service;

import jakarta.servlet.http.HttpSession;
import org.SmartShop.dto.auth.AuthResponseDTO;
import org.SmartShop.dto.auth.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO request, HttpSession session);
    void logout(HttpSession session);
}