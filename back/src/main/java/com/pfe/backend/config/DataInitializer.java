package com.pfe.backend.config;

import com.pfe.backend.nomenclature.NomenclatureEntity;
import com.pfe.backend.nomenclature.NomenclatureRepository;
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
  private final NomenclatureRepository nomenclatureRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) {
    userRepository.findByEmailIgnoreCase("admin@example.com").orElseGet(() ->
      userRepository.save(UserEntity.builder()
        .name("Administrateur")
        .email("admin@example.com")
        .passwordHash(passwordEncoder.encode("password123"))
        .role(UserRole.ADMIN)
        .build())
    );

    userRepository.findByEmailIgnoreCase("chef@example.com").orElseGet(() ->
      userRepository.save(UserEntity.builder()
        .name("Chef de Projet")
        .email("chef@example.com")
        .passwordHash(passwordEncoder.encode("password123"))
        .role(UserRole.CHEF)
        .build())
    );

    seedNomenclature("PROJECT_STATUS", "PLANIFICATION", "Planification", 10);
    seedNomenclature("PROJECT_STATUS", "EN_COURS", "En cours", 20);
    seedNomenclature("PROJECT_STATUS", "TERMINE", "Termine", 30);
    seedNomenclature("PROJECT_STATUS", "SUSPENDU", "Suspendu", 40);
  }

  private void seedNomenclature(String category, String code, String label, int sortOrder) {
    if (nomenclatureRepository.existsByCategoryAndCode(category, code)) {
      return;
    }
    var now = java.time.Instant.now();
    nomenclatureRepository.save(NomenclatureEntity.builder()
      .category(category)
      .code(code)
      .label(label)
      .description(null)
      .sortOrder(sortOrder)
      .active(true)
      .createdAt(now)
      .updatedAt(now)
      .build());
  }
}
