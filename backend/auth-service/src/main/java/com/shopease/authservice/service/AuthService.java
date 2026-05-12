package com.shopease.authservice.service;

import com.shopease.authservice.dto.AuthResponse;
import com.shopease.authservice.dto.AddressDto;
import com.shopease.authservice.dto.LoginRequest;
import com.shopease.authservice.dto.RegisterRequest;
import com.shopease.authservice.dto.UpdateProfileRequest;
import com.shopease.authservice.dto.UserDto;
import com.shopease.authservice.dto.AdminUserDto;
import com.shopease.authservice.dto.UserProfileDto;
import com.shopease.authservice.dto.AdminLoginRequest;
import com.shopease.authservice.dto.AdminAuthResponse;
import com.shopease.authservice.dto.AdminDto;
import com.shopease.authservice.entity.UserEntity;
import com.shopease.authservice.entity.UserRole;
import com.shopease.authservice.entity.AdminEntity;
import com.shopease.authservice.repository.UserRepository;
import com.shopease.authservice.repository.AdminRepository;
import com.shopease.authservice.security.JwtUtil;
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
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim();
        UserEntity user = userRepository.findByEmailIgnoreCase(email).orElse(null);

        if (user != null) {
            if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password. Please try again.");
            }
            return buildResponse(user, "Login successful");
        }

        AdminEntity admin = adminRepository.findByEmailIgnoreCase(email).orElse(null);
        if (admin != null) {
            if (!passwordEncoder.matches(request.password(), admin.getPasswordHash())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password. Please try again.");
            }
            return buildResponseForAdmin(admin, "Login successful");
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found. Please sign up first."
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim();
        UserEntity existingUser = userRepository.findByEmailIgnoreCase(email).orElse(null);
        AdminEntity existingAdmin = adminRepository.findByEmailIgnoreCase(email).orElse(null);

        if (existingUser != null || existingAdmin != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Account already exists with this email. Please login instead."
            );
        }

        try {
            if (parseRole(request.role()) == UserRole.ADMIN) {
                AdminEntity admin = new AdminEntity();
                admin.setUsername(request.name().trim());
                admin.setEmail(email);
                admin.setPasswordHash(passwordEncoder.encode(request.password()));
                AdminEntity savedAdmin = adminRepository.save(admin);
                return buildResponseForAdmin(savedAdmin, "Registration successful");
            }

            UserEntity user = new UserEntity();
            user.setName(request.name().trim());
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(request.password()));
            user.setRole(UserRole.USER);

            UserEntity savedUser = userRepository.save(user);
            return buildResponse(savedUser, "Registration successful");
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Registration failed: " + exception.getMessage(), exception);
        }
    }

    @Transactional
    public AdminAuthResponse adminLogin(AdminLoginRequest request) {
        AdminEntity admin = adminRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Admin not found."
                ));

        if (!passwordEncoder.matches(request.password(), admin.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password. Please try again.");
        }

        return buildAdminResponse(admin, "Admin login successful");
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(Long userId) {
        UserEntity user = getUserById(userId);
        return toUserProfileDto(user);
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
        user.setDateOfBirth(parseDate(request.dateOfBirth()));
        user.setAddressesJson(writeAddresses(request.addresses()));

        UserEntity savedUser = userRepository.save(user);
        return toUserProfileDto(savedUser);
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        Stream<AdminUserDto> usersStream = userRepository.findAll().stream()
            .map(user -> {
                String role = user.getRole() != null ? user.getRole().name() : UserRole.USER.name();
                String name = user.getName() != null ? user.getName() : "User";

                return new AdminUserDto(
                    user.getId(),
                    name,
                    user.getEmail(),
                    role,
                    user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                    user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null
                );
            });

        Stream<AdminUserDto> adminsStream = adminRepository.findAll().stream()
            .map(admin -> new AdminUserDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                "ADMIN",
                admin.getCreatedAt() != null ? admin.getCreatedAt().toString() : null,
                admin.getCreatedAt() != null ? admin.getCreatedAt().toString() : null
            ));

        return Stream.concat(usersStream, adminsStream)
            .sorted(Comparator.comparing(
                dto -> dto.createdAt() == null ? "" : dto.createdAt(),
                Comparator.reverseOrder()
            ))
            .collect(Collectors.toList());
    }

    private AuthResponse buildResponse(UserEntity user, String message) {
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        UserDto userDto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(message, token, userDto, userDto.role());
    }

    private AuthResponse buildResponseForAdmin(AdminEntity admin, String message) {
        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail(), "ADMIN");
        UserDto adminDto = new UserDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                "ADMIN"
        );

        return new AuthResponse(message, token, adminDto, "ADMIN");
    }

    private AdminAuthResponse buildAdminResponse(AdminEntity admin, String message) {
        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail(), "ADMIN");
        AdminDto adminDto = new AdminDto(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail()
        );

        return new AdminAuthResponse(message, token, adminDto, "ADMIN");
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