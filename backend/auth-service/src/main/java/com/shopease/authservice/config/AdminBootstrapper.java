package com.shopease.authservice.config;

import com.shopease.authservice.entity.AdminEntity;
import com.shopease.authservice.repository.AdminRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrapper implements ApplicationRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrapper(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedAdminIfMissing("meghana", "meghana@gmail.com", "admin@2004");
    }

    private void seedAdminIfMissing(String username, String email, String password) {
        adminRepository.findByEmailIgnoreCase(email).ifPresentOrElse(
            existing -> {
                // Admin already exists, do nothing
            },
            () -> {
                AdminEntity admin = new AdminEntity();
                admin.setUsername(username);
                admin.setEmail(email);
                admin.setPasswordHash(passwordEncoder.encode(password));
                adminRepository.save(admin);
            }
        );
    }
}
