package com.pfe.backend.followup;

import com.pfe.backend.user.UserEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/followups")
@RequiredArgsConstructor
public class FollowupController {
  private final FollowupService followupService;

  public record FollowupCreateRequest(
    @NotBlank @Size(min = 5, max = 160) String title,
    @NotBlank @Size(min = 20) String description,
    @NotNull @Min(0) @Max(100) Integer progress,
    String issues,
    String decisions,
    String reportDate,
    String contractReference,
    String requester,
    String requestType,
    String procedureConcerned,
    String attachments,
    String feasibility,
    String deliveryType,
    String diagnosticComment,
    String estimatedCharge,
    String estimatedDelay,
    String decisionRmap,
    String decisionDate,
    String sourceRequestDate,
    String sourceReceptionDate,
    String devEnvRequestDate,
    String devEnvOpenDate,
    String workSummary,
    String versionNumber,
    String testEnvRequestDate,
    String testEnvOpenDate,
    String workEndDate,
    String packageSendDate,
    String closureObservation
  ) {
  }

  public record FollowupUpdateRequest(
    @NotBlank @Size(min = 5, max = 160) String title,
    @NotBlank @Size(min = 20) String description,
    @NotNull @Min(0) @Max(100) Integer progress,
    String issues,
    String decisions,
    String reportDate,
    String contractReference,
    String requester,
    String requestType,
    String procedureConcerned,
    String attachments,
    String feasibility,
    String deliveryType,
    String diagnosticComment,
    String estimatedCharge,
    String estimatedDelay,
    String decisionRmap,
    String decisionDate,
    String sourceRequestDate,
    String sourceReceptionDate,
    String devEnvRequestDate,
    String devEnvOpenDate,
    String workSummary,
    String versionNumber,
    String testEnvRequestDate,
    String testEnvOpenDate,
    String workEndDate,
    String packageSendDate,
    String closureObservation
  ) {
  }

  public record FollowupResponse(
    String id,
    String projectId,
    String title,
    String description,
    Integer progress,
    String issues,
    String decisions,
    String reportDate,
    String contractReference,
    String requester,
    String requestType,
    String procedureConcerned,
    String attachments,
    String feasibility,
    String deliveryType,
    String diagnosticComment,
    String estimatedCharge,
    String estimatedDelay,
    String decisionRmap,
    String decisionDate,
    String sourceRequestDate,
    String sourceReceptionDate,
    String devEnvRequestDate,
    String devEnvOpenDate,
    String workSummary,
    String versionNumber,
    String testEnvRequestDate,
    String testEnvOpenDate,
    String workEndDate,
    String packageSendDate,
    String closureObservation,
    Instant createdAt,
    Instant updatedAt
  ) {
  }

  @GetMapping
  public List<FollowupResponse> list(@PathVariable String projectId, @AuthenticationPrincipal UserEntity user) {
    return followupService.list(projectId, user);
  }

  @GetMapping("/{id}")
  public FollowupResponse get(@PathVariable String projectId,
                              @PathVariable String id,
                              @AuthenticationPrincipal UserEntity user) {
    return followupService.get(projectId, id, user);
  }

  @PostMapping
  public FollowupResponse create(@PathVariable String projectId,
                                 @Valid @RequestBody FollowupCreateRequest req,
                                 @AuthenticationPrincipal UserEntity user) {
    return followupService.create(projectId, req, user);
  }

  @PutMapping("/{id}")
  public FollowupResponse update(@PathVariable String projectId,
                                 @PathVariable String id,
                                 @Valid @RequestBody FollowupUpdateRequest req,
                                 @AuthenticationPrincipal UserEntity user) {
    return followupService.update(projectId, id, req, user);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String projectId,
                     @PathVariable String id,
                     @AuthenticationPrincipal UserEntity user) {
    followupService.delete(projectId, id, user);
  }
}
