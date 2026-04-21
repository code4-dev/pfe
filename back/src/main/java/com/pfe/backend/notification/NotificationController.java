package com.pfe.backend.notification;

import com.pfe.backend.user.UserEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
  private final NotificationService notificationService;

  public record NotificationParametresRequest(@Min(1) int delaiJours) {
  }

  public record NotificationParametresResponse(int delaiJours, Instant updatedAt) {
  }

  @PostMapping("/envoyer")
  @PreAuthorize("hasAnyRole('PILOTE', 'PILOTE_QUALITE')")
  public List<Notification> envoyerManuellement(@AuthenticationPrincipal UserEntity user) {
    String piloteId = user != null ? user.getId() : null;
    log.info("Declenchement manuel des notifications de retard par {}", piloteId);
    return notificationService.verifierEtNotifierRetards(piloteId, true);
  }

  @GetMapping("/historique")
  @PreAuthorize("hasAnyRole('PILOTE', 'PILOTE_QUALITE', 'ADMIN')")
  public List<Notification> getHistorique() {
    return notificationService.getHistorique();
  }

  @GetMapping("/badge")
  @PreAuthorize("hasAnyRole('PILOTE', 'PILOTE_QUALITE', 'ADMIN')")
  public Map<String, Long> getBadgeCount() {
    return Map.of("count", notificationService.getBadgeCount());
  }

  @PutMapping("/parametres")
  @PreAuthorize("hasAnyRole('PILOTE', 'PILOTE_QUALITE')")
  public NotificationParametresResponse updateParametres(@Valid @RequestBody NotificationParametresRequest request) {
    NotificationParametresEntity updated = notificationService.updateParametres(request.delaiJours());
    return new NotificationParametresResponse(updated.getDelaiJours(), updated.getUpdatedAt());
  }

  @GetMapping("/parametres")
  @PreAuthorize("hasAnyRole('PILOTE', 'PILOTE_QUALITE', 'ADMIN')")
  public NotificationParametresResponse getParametres() {
    NotificationParametresEntity current = notificationService.getParametres();
    return new NotificationParametresResponse(current.getDelaiJours(), current.getUpdatedAt());
  }
}
