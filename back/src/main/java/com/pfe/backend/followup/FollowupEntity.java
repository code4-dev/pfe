package com.pfe.backend.followup;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "followups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupEntity {
  @Id
  private String id;

  private String projectId;

  private String title;
  private String description;
  private Integer progress;

  private String issues;
  private String decisions;
  private String reportDate;
  private String contractReference;
  private String requester;
  private String requestType;
  private String procedureConcerned;
  private String attachments;
  private String feasibility;
  private String deliveryType;
  private String diagnosticComment;
  private String estimatedCharge;
  private String estimatedDelay;
  private String decisionRmap;
  private String decisionDate;
  private String sourceRequestDate;
  private String sourceReceptionDate;
  private String devEnvRequestDate;
  private String devEnvOpenDate;
  private String workSummary;
  private String versionNumber;
  private String testEnvRequestDate;
  private String testEnvOpenDate;
  private String workEndDate;
  private String packageSendDate;
  private String closureObservation;

  private Instant createdAt;
  private Instant updatedAt;
}
