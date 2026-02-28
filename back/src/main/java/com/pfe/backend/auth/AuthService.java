package com.pfe.backend.auth;

import com.pfe.backend.user.UserEntity;
import com.pfe.backend.user.UserRepository;
import com.pfe.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${app.jwt.expiration-seconds}")
  private long expiresIn;

  public AuthController.LoginResponse login(AuthController.LoginRequest request) {
    var email = normalizeEmail(request.email());
    var auth = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(email, request.password())
    );
    var user = (UserEntity) auth.getPrincipal();
    return toLoginResponse(user);
  }

  public AuthController.LoginResponse register(AuthController.RegisterRequest request) {
    var fullName = normalizeFullName(request.fullName());
    var email = normalizeEmail(request.email());
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    var user = UserEntity.builder()
      .name(fullName)
      .email(email)
      .passwordHash(passwordEncoder.encode(request.password()))
      .role(UserRole.CHEF)
      .build();

    UserEntity saved;
    try {
      saved = userRepository.save(user);
    } catch (DuplicateKeyException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }
    return toLoginResponse(saved);
  }

  private String normalizeEmail(String email) {
    if (email == null || email.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
    }
    return email.trim().toLowerCase();
  }

  private String normalizeFullName(String fullName) {
    if (fullName == null || fullName.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
    }
    var normalized = fullName.trim();
    if (normalized.length() < 3) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name must contain at least 3 characters");
    }
    return normalized;
  }

  private AuthController.LoginResponse toLoginResponse(UserEntity user) {
    var token = jwtService.generateToken(user);
    return new AuthController.LoginResponse(
      token,
      "Bearer",
      expiresIn,
      new AuthController.UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getRole().name().toLowerCase()
      )
    );
  }
}
