package com.shopease.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender, @Value("${spring.mail.username:no-reply@shopease.local}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendLoginNotification(String to, String userName) {
        if (to == null || to.isBlank() || mailSender == null) return;

        String subject = "New sign-in to your ShopEase account";
        String text = String.format("Hi %s,\n\nWe noticed a sign-in to your ShopEase account. If this was you, no action is required.\n\nIf you did not sign in, please secure your account immediately.", userName == null ? "there" : userName);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (Exception ex) {
            // swallow exceptions for now - logging would be ideal
            System.err.println("Failed to send login notification to " + to + ": " + ex.getMessage());
        }
    }
}
