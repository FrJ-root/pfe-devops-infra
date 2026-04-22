package org.SmartShop.service.impl;

import org.SmartShop.entity.User;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpSession;
import org.SmartShop.service.AuthService;
import org.springframework.stereotype.Service;
import org.SmartShop.dto.auth.AuthResponseDTO;
import org.SmartShop.dto.auth.LoginRequestDTO;
import org.SmartShop.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public AuthResponseDTO login(LoginRequestDTO request, HttpSession session) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        session.setAttribute("USER_ID", user.getId());
        session.setAttribute("USER_ROLE", user.getRole());

        return AuthResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    @Override
    public void logout(HttpSession session) {
        session.invalidate();
    }
}