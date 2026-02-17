package com.pfe.backend.auth;

import com.pfe.backend.user.UserEntity;
import com.pfe.backend.user.UserRepository;
import com.pfe.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
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
    var email = normalizeEmail(request.email());
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    var role = parseRole(request.role());
    var user = UserEntity.builder()
      .name(request.fullName().trim())
      .email(email)
      .passwordHash(passwordEncoder.encode(request.password()))
      .role(role)
      .build();

    var saved = userRepository.save(user);
    return toLoginResponse(saved);
  }

  private UserRole parseRole(String rawRole) {
    try {
      return UserRole.valueOf(rawRole.trim().toUpperCase());
    } catch (Exception ex) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
    }
  }

  private String normalizeEmail(String email) {
    return email == null ? "" : email.trim().toLowerCase();
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
