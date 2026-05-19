package com.shopease.authservice.service;

import com.shopease.authservice.dto.AuthResponse;
import com.shopease.authservice.dto.AddressDto;
import com.shopease.authservice.dto.LoginRequest;
import com.shopease.authservice.dto.RegisterRequest;
import com.shopease.authservice.dto.UpdateProfileRequest;
import com.shopease.authservice.dto.UserDto;
import com.shopease.authservice.dto.UserProfileDto;
import com.shopease.authservice.entity.UserEntity;
import com.shopease.authservice.entity.UserRole;
import com.shopease.authservice.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found. Please sign up first."
                ));

        String storedPassword = user.getPasswordHash();
        boolean passwordMatches = passwordEncoder.matches(request.password(), storedPassword);

        // Backward compatibility for users created before passwords were hashed.
        // If the stored value is still plain text, allow login once and upgrade it.
        if (!passwordMatches && storedPassword != null && storedPassword.equals(request.password())) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            userRepository.save(user);
            passwordMatches = true;
        }

        if (!passwordMatches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password. Please try again.");
        }

        // Send login notification email
        emailService.sendLoginNotification(user.getEmail(), user.getName());

        return buildResponse(user, "Login successful");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim();
        UserEntity existingUser = userRepository.findByEmailIgnoreCase(email).orElse(null);

        if (existingUser != null) {
            if (passwordEncoder.matches(request.password(), existingUser.getPasswordHash())) {
                return buildResponse(existingUser, "Account already exists. Logged in successfully.");
            }

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already exists with this email. Please login instead."
            );
        }

        UserEntity user = new UserEntity();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(parseRole(request.role()));

        UserEntity savedUser = userRepository.save(user);
        emailService.sendRegistrationConfirmation(savedUser.getEmail(), savedUser.getName());
        return buildResponse(savedUser, "Registration successful");
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(Long userId) {
        UserEntity user = getUserById(userId);
        return toUserProfileDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> listAllUsers() {
        return userRepository.findAll().stream().map(u -> new UserDto(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole().name()
        )).toList();
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        UserEntity user = getUserById(userId);

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }

        user.setPhone(cleanText(request.phone()));
        user.setGender(cleanText(request.gender()));
        user.setAddress(cleanText(request.address()));
        user.setProfileImage(cleanText(request.profileImage()));
        user.setDateOfBirth(parseDate(request.dateOfBirth()));
        user.setAddressesJson(writeAddresses(request.addresses()));

        UserEntity savedUser = userRepository.save(user);
        return toUserProfileDto(savedUser);
    }

    private AuthResponse buildResponse(UserEntity user, String message) {
        String token = UUID.randomUUID().toString().replace("-", "");
        UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(message, token, userDto, userDto.role());
    }

    private UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserProfileDto toUserProfileDto(UserEntity user) {
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null,
                user.getGender(),
                user.getAddress(),
                user.getProfileImage(),
                readAddresses(user.getAddressesJson())
        );
    }

    private String cleanText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dateOfBirth format. Use yyyy-MM-dd.");
        }
    }

    private String writeAddresses(List<AddressDto> addresses) {
        List<AddressDto> safeAddresses = addresses == null ? Collections.emptyList() : addresses;
        try {
            return objectMapper.writeValueAsString(safeAddresses);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid addresses payload");
        }
    }

    private List<AddressDto> readAddresses(String addressesJson) {
        if (addressesJson == null || addressesJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(addressesJson, new TypeReference<List<AddressDto>>() {
            });
        } catch (JsonProcessingException exception) {
            return Collections.emptyList();
        }
    }

    private UserRole parseRole(String roleValue) {
        if (roleValue == null || roleValue.isBlank()) {
            return UserRole.USER;
        }

        try {
            return UserRole.valueOf(roleValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            return UserRole.USER;
        }
    }
}