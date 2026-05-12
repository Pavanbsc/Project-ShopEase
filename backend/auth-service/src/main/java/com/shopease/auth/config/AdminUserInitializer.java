package com.shopease.auth.config;

import com.shopease.auth.entity.User;
import com.shopease.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// LEGACY COMPONENT - DISABLED. Use com.shopease.authservice.config.AdminBootstrapper instead
//@Component
public class AdminUserInitializer {

    // @Autowired
    // private UserRepository userRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    // @EventListener(ApplicationReadyEvent.class)
    // public void initializeAdmin() {
    //     String adminEmail = "meghana@gmail.com";
    //     if (userRepository.existsByEmail(adminEmail)) {
    //         return;
    //     }

    //     User admin = new User();
    //     admin.setName("meghana");
    //     admin.setEmail(adminEmail);
    //     admin.setPasswordHash(passwordEncoder.encode("admin@2004"));
    //     admin.setRole("ADMIN");
    //     admin.setEnabled(true);
    //     userRepository.save(admin);
    // }
}
