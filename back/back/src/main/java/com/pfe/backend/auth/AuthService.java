package com.pfe.backend.auth;

import com.pfe.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  @Value("${app.jwt.expiration-seconds}")
  private long expiresIn;

  public AuthController.LoginResponse login(AuthController.LoginRequest request) {
    var auth = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(request.email(), request.password())
    );
    var user = (UserEntity) auth.getPrincipal();
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
