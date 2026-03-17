package com.pfe.backend.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document(collection = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectEntity {
  @Id
  private String id;

  private String name;

  private String description;

  private String clientName;

  private String contractReference;

  private String projectContext;

  private String projectCharacter;

  private String projectType;

  private String developmentMode;

  private String historical;

  private String perimeter;

  private String projectOwner;

  private String projectLead;

  private String projectTeam;

  private Integer estimatedChargeHm;

  private Double estimatedBudgetMd;

  private Integer estimatedDelayMonths;

  private Integer budgetChargeCp;

  private Integer budgetChargeId;

  private Integer budgetChargeTotal;

  private Double budgetMdCp;

  private Double budgetMdId;

  private Double budgetMdTotal;

  private String potentialRisks;

  private String prerequisites;

  private ProjectStatus status;

  private LocalDate dueDate;

  private Instant createdAt;

  private String chefId;
}
