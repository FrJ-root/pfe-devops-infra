package org.SmartShop.config;

import org.SmartShop.entity.User;
import org.SmartShop.entity.PromoCode;
import org.SmartShop.entity.enums.UserRole;
import org.SmartShop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.SmartShop.repository.PromoCodeRepository;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PromoCodeRepository promoRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password("pass123")
                        .role(UserRole.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("---- ADMIN USER CREATED: admin / pass123 ----");
            }
            if (promoRepository.count() == 0) {
                promoRepository.save(new PromoCode(null, "PROMO-2024", true, false, false));
                promoRepository.save(new PromoCode(null, "PROMO-SOLO", true, true, false));
                System.out.println("---- PROMO CODES CREATED ----");
            }
        };
    }

}