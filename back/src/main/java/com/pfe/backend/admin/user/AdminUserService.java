package com.pfe.backend.admin.user;

import com.pfe.backend.user.UserEntity;
import com.pfe.backend.user.UserRepository;
import com.pfe.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public List<AdminUserController.UserResponse> list() {
    return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
      .stream()
      .map(this::toDto)
      .toList();
  }

  public AdminUserController.UserResponse create(AdminUserController.CreateUserRequest request) {
    var email = normalizeEmail(request.email());
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    var user = UserEntity.builder()
      .name(normalizeName(request.name()))
      .email(email)
      .passwordHash(passwordEncoder.encode(validatePassword(request.password())))
      .role(parseRole(request.role()))
      .build();

    return toDto(userRepository.save(user));
  }

  public AdminUserController.UserResponse update(String id,
                                                 AdminUserController.UpdateUserRequest request,
                                                 UserEntity authenticatedUser) {
    var user = getById(id);
    if (request.name() != null) {
      user.setName(normalizeName(request.name()));
    }
    if (request.email() != null) {
      var normalizedEmail = normalizeEmail(request.email());
      var existing = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
      if (existing != null && !existing.getId().equals(user.getId())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
      }
      user.setEmail(normalizedEmail);
    }
    if (request.password() != null) {
      user.setPasswordHash(passwordEncoder.encode(validatePassword(request.password())));
    }
    if (request.role() != null) {
      applyRoleChange(user, parseRole(request.role()), authenticatedUser);
    }

    return toDto(userRepository.save(user));
  }

  public AdminUserController.UserResponse updateRole(String id, String rawRole, UserEntity authenticatedUser) {
    var user = getById(id);
    applyRoleChange(user, parseRole(rawRole), authenticatedUser);
    return toDto(userRepository.save(user));
  }

  public void delete(String id, UserEntity authenticatedUser) {
    var user = getById(id);
    if (user.getId().equals(authenticatedUser.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete your own account");
    }
    if (user.getRole() == UserRole.ADMIN && userRepository.countByRole(UserRole.ADMIN) <= 1) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "At least one admin account is required");
    }
    userRepository.delete(user);
  }

  private void applyRoleChange(UserEntity user, UserRole newRole, UserEntity authenticatedUser) {
    if (user.getId().equals(authenticatedUser.getId()) && newRole != UserRole.ADMIN) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot remove your own admin role");
    }

    if (user.getRole() == UserRole.ADMIN && newRole != UserRole.ADMIN && userRepository.countByRole(UserRole.ADMIN) <= 1) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "At least one admin account is required");
    }
    user.setRole(newRole);
  }

  private UserEntity getById(String id) {
    return userRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  private UserRole parseRole(String rawRole) {
    if (rawRole == null || rawRole.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
    }
    try {
      return UserRole.valueOf(rawRole.trim().toUpperCase());
    } catch (Exception ex) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
    }
  }

  private String normalizeEmail(String email) {
    if (email == null || email.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
    }
    return email.trim().toLowerCase();
  }

  private String normalizeName(String name) {
    if (name == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
    }
    var normalized = name.trim();
    if (normalized.length() < 3) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name must contain at least 3 characters");
    }
    return normalized;
  }

  private String validatePassword(String password) {
    if (password == null || password.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
    }
    if (password.length() < 8) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must contain at least 8 characters");
    }
    return password;
  }

  private AdminUserController.UserResponse toDto(UserEntity user) {
    return new AdminUserController.UserResponse(
      user.getId(),
      user.getName(),
      user.getEmail(),
      user.getRole().name().toLowerCase()
    );
  }
}
