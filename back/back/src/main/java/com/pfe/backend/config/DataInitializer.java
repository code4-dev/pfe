package com.pfe.backend.config;

import com.pfe.backend.user.UserEntity;
import com.pfe.backend.user.UserRepository;
import com.pfe.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) {
    userRepository.findByEmail("chef@example.com").orElseGet(() ->
      userRepository.save(UserEntity.builder()
        .name("Chef de Projet")
        .email("chef@example.com")
        .passwordHash(passwordEncoder.encode("password123"))
        .role(UserRole.CHEF)
        .build())
    );
  }
}
