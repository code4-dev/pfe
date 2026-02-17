package com.pfe.backend.project;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjectStatus {
  PLANIFICATION("planification"),
  EN_COURS("en-cours"),
  TERMINE("termine"),
  SUSPENDU("suspendu");

  private final String value;

  ProjectStatus(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @JsonCreator
  public static ProjectStatus fromValue(String raw) {
    for (ProjectStatus status : values()) {
      if (status.value.equalsIgnoreCase(raw)) {
        return status;
      }
    }
    throw new IllegalArgumentException("Invalid status: " + raw);
  }
}
