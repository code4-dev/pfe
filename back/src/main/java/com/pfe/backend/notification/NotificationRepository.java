package com.pfe.backend.notification;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByChefProjetIdOrderByDateEnvoiDesc(String chefProjetId);

  List<Notification> findByStatutOrderByDateEnvoiDesc(NotificationStatut statut);

  List<Notification> findByFicheIdOrderByDateEnvoiDesc(String ficheId);

  long countByStatutAndDateEnvoiAfter(NotificationStatut statut, Instant dateEnvoi);

  List<Notification> findAllByOrderByDateEnvoiDesc();
}
