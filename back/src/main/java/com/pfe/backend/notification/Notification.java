package com.pfe.backend.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
  @Id
  private String id;

  private String ficheId;
  private String chefProjetId;
  private String chefProjetEmail;
  private String chefProjetPhone;
  private String projetNom;

  private NotificationType type;
  private NotificationCanal canal;
  private NotificationStatut statut;

  private String message;
  private String erreur;

  private Instant dateEnvoi;

  private boolean envoyeParPilote;
  private String piloteId;
}
