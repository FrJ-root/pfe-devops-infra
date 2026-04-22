package org.SmartShop.security;

import jakarta.servlet.http.HttpSession;
import org.SmartShop.entity.enums.UserRole;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.SmartShop.exception.custom.ForbiddenException;
import org.springframework.web.servlet.HandlerInterceptor;
import org.SmartShop.exception.custom.UnauthorizedException;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String uri = request.getRequestURI();
        if (uri.startsWith("/api/auth") || uri.contains("swagger") || uri.contains("api-docs")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new UnauthorizedException("Non authentifié : Veuillez vous connecter.");
        }

        UserRole role = (UserRole) session.getAttribute("USER_ROLE");
        String method = request.getMethod();

        if (role == UserRole.ADMIN) {
            return true;
        }

        if (role == UserRole.CLIENT) {
            if (method.equals("DELETE")) {
                throw new ForbiddenException("Access Denied: Clients cannot delete resources.");
            }
        }

        return true;
    }
}