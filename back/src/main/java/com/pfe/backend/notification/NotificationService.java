package com.pfe.backend.notification;

import com.pfe.backend.followup.FollowupEntity;
import com.pfe.backend.followup.FollowupRepository;
import com.pfe.backend.project.ProjectEntity;
import com.pfe.backend.project.ProjectRepository;
import com.pfe.backend.project.ProjectStatus;
import com.pfe.backend.user.UserEntity;
import com.pfe.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
  private final ProjectRepository projectRepository;
  private final FollowupRepository followupRepository;
  private final UserRepository userRepository;
  private final NotificationRepository notificationRepository;
  private final NotificationParametresRepository notificationParametresRepository;
  private final EmailService emailService;
  private final SmsService smsService;

  @Value("${notification.delai-jours:3}")
  private int defaultDelaiJours;

  public List<Notification> verifierEtNotifierRetards(String piloteId, boolean manuel) {
    int delaiJours = getDelaiJoursActuel();
    Instant seuil = Instant.now().minus(delaiJours, ChronoUnit.DAYS);
    List<ProjectEntity> projetsActifs = projectRepository.findAll().stream()
      .filter(this::isProjetActif)
      .toList();

    log.info("Verification retards: {} projet(s) actifs, seuil {} jour(s)", projetsActifs.size(), delaiJours);

    List<Notification> notifications = new ArrayList<>();
    for (ProjectEntity projet : projetsActifs) {
      if (!isProjetEnRetard(projet.getId(), seuil)) {
        continue;
      }

      Notification notification = traiterProjetEnRetard(projet, piloteId, manuel, delaiJours);
      notifications.add(notificationRepository.save(notification));
    }

    log.info("{} notification(s) enregistree(s) apres verification des retards", notifications.size());
    return notifications;
  }

  public List<Notification> getHistorique() {
    return notificationRepository.findAllByOrderByDateEnvoiDesc();
  }

  public long getBadgeCount() {
    Instant since = Instant.now().minus(24, ChronoUnit.HOURS);
    return notificationRepository.countByStatutAndDateEnvoiAfter(NotificationStatut.ENVOYE, since);
  }

  public NotificationParametresEntity updateParametres(int delaiJours) {
    if (delaiJours < 1) {
      throw new ResponseStatusException(BAD_REQUEST, "Le delai doit etre superieur ou egal a 1");
    }

    NotificationParametresEntity parametres = NotificationParametresEntity.builder()
      .id(NotificationParametresEntity.DEFAULT_ID)
      .delaiJours(delaiJours)
      .updatedAt(Instant.now())
      .build();
    return notificationParametresRepository.save(parametres);
  }

  public NotificationParametresEntity getParametres() {
    return notificationParametresRepository.findById(NotificationParametresEntity.DEFAULT_ID)
      .orElseGet(() -> NotificationParametresEntity.builder()
        .id(NotificationParametresEntity.DEFAULT_ID)
        .delaiJours(defaultDelaiJours)
        .updatedAt(Instant.now())
        .build());
  }

  private Notification traiterProjetEnRetard(ProjectEntity projet,
                                             String piloteId,
                                             boolean manuel,
                                             int delaiJours) {
    Instant now = Instant.now();
    Notification.NotificationBuilder builder = Notification.builder()
      .ficheId(projet.getId())
      .chefProjetId(projet.getChefId())
      .projetNom(projet.getName())
      .type(NotificationType.RETARD_FICHE_SUIVI)
      .statut(NotificationStatut.EN_ATTENTE)
      .dateEnvoi(now)
      .envoyeParPilote(manuel)
      .piloteId(piloteId);

    Optional<UserEntity> chefOpt = userRepository.findById(projet.getChefId());
    if (chefOpt.isEmpty()) {
      return builder
        .canal(NotificationCanal.EMAIL_SMS)
        .statut(NotificationStatut.ECHEC)
        .message(messageRetard(projet.getName(), delaiJours))
        .erreur("Chef de projet introuvable")
        .build();
    }

    UserEntity chef = chefOpt.get();
    builder.chefProjetEmail(chef.getEmail());
    builder.chefProjetPhone(chef.getPhone());

    boolean emailSent = false;
    boolean smsSent = false;
    List<String> erreurs = new ArrayList<>();

    if (isBlank(chef.getEmail())) {
      erreurs.add("Adresse email absente");
    } else {
      try {
        emailService.envoyerNotificationRetard(chef.getEmail(), chef.getName(), projet.getName(), delaiJours);
        emailSent = true;
      } catch (Exception ex) {
        erreurs.add("Email: " + ex.getMessage());
      }
    }

    if (isBlank(chef.getPhone())) {
      erreurs.add("Numero de telephone absent");
    } else {
      try {
        smsService.envoyerNotificationRetard(chef.getPhone(), projet.getName(), delaiJours);
        smsSent = true;
      } catch (Exception ex) {
        erreurs.add("SMS: " + ex.getMessage());
      }
    }

    boolean emailExpected = !isBlank(chef.getEmail());
    boolean smsExpected = !isBlank(chef.getPhone());
    boolean envoiComplet = (emailExpected ? emailSent : true)
      && (smsExpected ? smsSent : true)
      && (emailExpected || smsExpected);

    NotificationCanal canal = deduireCanal(chef);
    NotificationStatut statut = envoiComplet ? NotificationStatut.ENVOYE : NotificationStatut.ECHEC;
    String erreur = erreurs.isEmpty() ? null : String.join(" | ", erreurs);

    if (statut == NotificationStatut.ECHEC) {
      log.warn("Echec notification projet {}: {}", projet.getId(), erreur);
    }

    return builder
      .canal(canal)
      .statut(statut)
      .message(messageRetard(projet.getName(), delaiJours))
      .erreur(erreur)
      .build();
  }

  private NotificationCanal deduireCanal(UserEntity chef) {
    boolean hasEmail = !isBlank(chef.getEmail());
    boolean hasPhone = !isBlank(chef.getPhone());
    if (hasEmail && hasPhone) {
      return NotificationCanal.EMAIL_SMS;
    }
    if (hasEmail) {
      return NotificationCanal.EMAIL;
    }
    if (hasPhone) {
      return NotificationCanal.SMS;
    }
    return NotificationCanal.EMAIL_SMS;
  }

  private boolean isProjetEnRetard(String projectId, Instant seuil) {
    return followupRepository.findTopByProjectIdOrderByUpdatedAtDesc(projectId)
      .map(followup -> extractDateReference(followup).isBefore(seuil))
      .orElse(true);
  }

  private Instant extractDateReference(FollowupEntity followup) {
    if (followup.getUpdatedAt() != null) {
      return followup.getUpdatedAt();
    }
    if (followup.getCreatedAt() != null) {
      return followup.getCreatedAt();
    }
    return Instant.EPOCH;
  }

  private boolean isProjetActif(ProjectEntity project) {
    return project.getStatus() == null
      || project.getStatus() == ProjectStatus.PLANIFICATION
      || project.getStatus() == ProjectStatus.EN_COURS;
  }

  private int getDelaiJoursActuel() {
    return notificationParametresRepository.findById(NotificationParametresEntity.DEFAULT_ID)
      .map(NotificationParametresEntity::getDelaiJours)
      .filter(delai -> delai != null && delai > 0)
      .orElse(defaultDelaiJours);
  }

  private String messageRetard(String nomProjet, int delaiJours) {
    return "Aucune fiche de suivi du projet '%s' n'a ete soumise depuis %d jours."
      .formatted(nomProjet, delaiJours);
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
