package com.shopease.authservice.config;

import com.shopease.authservice.entity.UserEntity;
import com.shopease.authservice.entity.UserRole;
import com.shopease.authservice.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

/**
 * Initializes demo users in the database on application startup if they don't exist.
 * This enables login without requiring registration first.
 */
@Configuration
public class DataInitializer {

    @Bean
    public ApplicationRunner initializeDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user exists
            if (userRepository.findByEmailIgnoreCase("admin@shopease.com").isEmpty()) {
                UserEntity adminUser = new UserEntity();
                adminUser.setName("Admin User");
                adminUser.setEmail("admin@shopease.com");
                adminUser.setPasswordHash(passwordEncoder.encode("Admin@123"));
                adminUser.setRole(UserRole.ADMIN);
                adminUser.setPhone("+91-9876543210");
                adminUser.setDateOfBirth(LocalDate.of(1990, 1, 15));
                adminUser.setGender("Male");
                adminUser.setAddress("Bangalore, India");
                
                userRepository.save(adminUser);
                System.out.println("✓ Demo admin user created: admin@shopease.com / Admin@123");
            }

            // Check if demo user exists
            if (userRepository.findByEmailIgnoreCase("user@shopease.com").isEmpty()) {
                UserEntity demoUser = new UserEntity();
                demoUser.setName("Demo User");
                demoUser.setEmail("user@shopease.com");
                demoUser.setPasswordHash(passwordEncoder.encode("User@123"));
                demoUser.setRole(UserRole.USER);
                demoUser.setPhone("+91-9999999999");
                demoUser.setDateOfBirth(LocalDate.of(1995, 5, 20));
                demoUser.setGender("Female");
                demoUser.setAddress("Mumbai, India");
                
                userRepository.save(demoUser);
                System.out.println("✓ Demo user created: user@shopease.com / User@123");
            }
        };
    }
}
