package com.shopease.authservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
                String displayName = safeName(userName);
                String plainText = String.format(
                                "Hi %s,%n%nWe noticed a sign-in to your ShopEase account. If this was you, no action is required.%n%nIf you did not sign in, please secure your account immediately.",
                                displayName
                );
                String html = buildLoginNotificationHtml(displayName);

        try {
                        sendHtmlEmail(to, subject, plainText, html);
        } catch (Exception ex) {
            // swallow exceptions for now - logging would be ideal
            System.err.println("Failed to send login notification to " + to + ": " + ex.getMessage());
        }
    }

    public void sendRegistrationConfirmation(String to, String userName) {
        if (to == null || to.isBlank() || mailSender == null) return;

        String subject = "Welcome to ShopEase";
                String displayName = safeName(userName);
                String plainText = String.format(
                                "Hi %s,%n%nYour ShopEase account has been created successfully. You can now explore products, manage your profile, and enjoy a smooth shopping experience.%n%nThanks for joining ShopEase!",
                                displayName
                );
                String html = buildRegistrationConfirmationHtml(displayName);

        try {
                        sendHtmlEmail(to, subject, plainText, html);
        } catch (Exception ex) {
            System.err.println("Failed to send registration confirmation to " + to + ": " + ex.getMessage());
        }
    }

        private void sendHtmlEmail(String to, String subject, String plainText, String html) throws MessagingException {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
                helper.setFrom(fromAddress);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(plainText, html);
                mailSender.send(mimeMessage);
        }

        private String buildRegistrationConfirmationHtml(String userName) {
                return baseTemplate(
                                "Welcome to ShopEase",
                                "Your account is ready",
                                "Your ShopEase account has been created successfully. You can now browse products, save favorites, checkout securely, and track your orders from one place.",
                                "Explore ShopEase",
                                "http://localhost:5173/home",
                                userName,
                                "account"
                );
        }

        private String buildLoginNotificationHtml(String userName) {
                return baseTemplate(
                                "Security notification",
                                "New sign-in detected",
                                "We noticed a sign-in to your ShopEase account. If this was you, no action is required. If this wasn't you, please change your password right away and review your account activity.",
                                "Go to ShopEase",
                                "http://localhost:5173/login",
                                userName,
                                "security"
                );
        }

        private String baseTemplate(String eyebrow, String title, String message, String ctaLabel, String ctaUrl, String userName, String badgeType) {
                String badgeColor = "#2563eb";
                String badgeBg = "rgba(37, 99, 235, 0.12)";
                if ("security".equals(badgeType)) {
                        badgeColor = "#b45309";
                        badgeBg = "rgba(245, 158, 11, 0.14)";
                }

                return """
                                <!doctype html>
                                <html lang="en">
                                    <head>
                                        <meta charset="UTF-8" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                        <meta name="x-apple-disable-message-reformatting" />
                                        <title>ShopEase</title>
                                    </head>
                                    <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#183153;">
                                        <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
                                            %s
                                        </div>
                                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 0;">
                                            <tr>
                                                <td align="center">
                                                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(29, 41, 67, 0.12);">
                                                        <tr>
                                                            <td style="background:linear-gradient(135deg,#2d6cdf 0%%,#6b5ce7 100%%);padding:34px 36px;color:#fff;">
                                                                <div style="display:inline-block;padding:7px 14px;border-radius:999px;background:%s;color:%s;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
                                                                    %s
                                                                </div>
                                                                <h1 style="margin:18px 0 10px;font-size:30px;line-height:1.15;">%s</h1>
                                                                <p style="margin:0;font-size:15px;line-height:1.7;opacity:.95;max-width:520px;">
                                                                    Hi %s, %s
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:34px 36px 20px;">
                                                                <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#4a5f7b;">
                                                                    %s
                                                                </p>
                                                                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0 24px;">
                                                                    <tr>
                                                                        <td style="border-radius:14px;background:#2563eb;">
                                                                            <a href="%s" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">
                                                                                %s
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <div style="padding:18px 20px;background:#f8fbff;border:1px solid #e3ebf7;border-radius:18px;">
                                                                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#274a7a;letter-spacing:.02em;text-transform:uppercase;">Why ShopEase</p>
                                                                    <ul style="margin:0;padding-left:18px;color:#4a5f7b;line-height:1.9;font-size:14px;">
                                                                        <li>Curated products with a premium shopping experience</li>
                                                                        <li>Secure checkout and easy order tracking</li>
                                                                        <li>Wishlist, cart, and profile saved for quick access</li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:0 36px 30px;">
                                                                <div style="border-top:1px solid #e5ecf5;padding-top:22px;color:#6b7d99;font-size:12px;line-height:1.7;">
                                                                    <p style="margin:0 0 10px;">If you did not expect this email, you can safely ignore it.</p>
                                                                    <p style="margin:0;">&copy; ShopEase. All rights reserved.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </body>
                                </html>
                                """.formatted(
                                escapeHtml(userName + " | ShopEase"),
                                badgeBg,
                                badgeColor,
                                escapeHtml(eyebrow),
                                escapeHtml(title),
                                escapeHtml(userName),
                                escapeHtml(message),
                                escapeHtml(message),
                                escapeHtml(ctaUrl),
                                escapeHtml(ctaLabel)
                );
        }

        private String safeName(String userName) {
                return userName == null || userName.isBlank() ? "there" : userName.trim();
        }

        private String escapeHtml(String value) {
                if (value == null) return "";
                return value
                                .replace("&", "&amp;")
                                .replace("<", "&lt;")
                                .replace(">", "&gt;")
                                .replace("\"", "&quot;")
                                .replace("'", "&#39;");
        }
}
