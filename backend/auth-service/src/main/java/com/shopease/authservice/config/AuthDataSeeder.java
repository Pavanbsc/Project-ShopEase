package com.shopease.authservice.config;

import com.shopease.authservice.entity.UserEntity;
import com.shopease.authservice.entity.UserRole;
import com.shopease.authservice.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuthDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUserIfMissing(
                "Demo User",
                "user@shopease.com",
                "User@123",
                UserRole.USER
        );
    }

    private void seedUserIfMissing(String name, String email, String password, UserRole role) {
        userRepository.findByEmailIgnoreCase(email).ifPresentOrElse(existing -> {
            if (existing.getRole() != role) {
                existing.setRole(role);
                userRepository.save(existing);
            }
        }, () -> {
            UserEntity user = new UserEntity();
            user.setName(name);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
        });
    }
}