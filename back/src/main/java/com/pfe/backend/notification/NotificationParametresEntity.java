package com.pfe.backend.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notification_parametres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationParametresEntity {
  public static final String DEFAULT_ID = "notification-config";

  @Id
  private String id;

  private Integer delaiJours;
  private Instant updatedAt;
}
