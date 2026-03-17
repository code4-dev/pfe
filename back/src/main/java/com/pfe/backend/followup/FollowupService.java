package com.pfe.backend.followup;

import com.pfe.backend.project.ProjectRepository;
import com.pfe.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowupService {
  private final FollowupRepository followupRepository;
  private final ProjectRepository projectRepository;

  public List<FollowupController.FollowupResponse> list(String projectId, UserEntity user) {
    ensureProjectOwned(projectId, user);
    return followupRepository.findByProjectIdOrderByUpdatedAtDesc(projectId)
      .stream()
      .map(this::toDto)
      .toList();
  }

  public FollowupController.FollowupResponse get(String projectId, String id, UserEntity user) {
    ensureProjectOwned(projectId, user);
    return toDto(getOwnedFollowup(projectId, id));
  }

  public FollowupController.FollowupResponse create(String projectId,
                                                    FollowupController.FollowupCreateRequest req,
                                                    UserEntity user) {
    ensureProjectOwned(projectId, user);
    var now = Instant.now();
    var followup = FollowupEntity.builder()
      .projectId(projectId)
      .title(req.title())
      .description(req.description())
      .progress(req.progress())
      .issues(req.issues())
      .decisions(req.decisions())
      .reportDate(req.reportDate())
      .contractReference(req.contractReference())
      .requester(req.requester())
      .requestType(req.requestType())
      .procedureConcerned(req.procedureConcerned())
      .attachments(req.attachments())
      .feasibility(req.feasibility())
      .deliveryType(req.deliveryType())
      .diagnosticComment(req.diagnosticComment())
      .estimatedCharge(req.estimatedCharge())
      .estimatedDelay(req.estimatedDelay())
      .decisionRmap(req.decisionRmap())
      .decisionDate(req.decisionDate())
      .sourceRequestDate(req.sourceRequestDate())
      .sourceReceptionDate(req.sourceReceptionDate())
      .devEnvRequestDate(req.devEnvRequestDate())
      .devEnvOpenDate(req.devEnvOpenDate())
      .workSummary(req.workSummary())
      .versionNumber(req.versionNumber())
      .testEnvRequestDate(req.testEnvRequestDate())
      .testEnvOpenDate(req.testEnvOpenDate())
      .workEndDate(req.workEndDate())
      .packageSendDate(req.packageSendDate())
      .closureObservation(req.closureObservation())
      .createdAt(now)
      .updatedAt(now)
      .build();

    return toDto(followupRepository.save(followup));
  }

  public FollowupController.FollowupResponse update(String projectId,
                                                    String id,
                                                    FollowupController.FollowupUpdateRequest req,
                                                    UserEntity user) {
    ensureProjectOwned(projectId, user);
    var followup = getOwnedFollowup(projectId, id);
    followup.setTitle(req.title());
    followup.setDescription(req.description());
    followup.setProgress(req.progress());
    followup.setIssues(req.issues());
    followup.setDecisions(req.decisions());
    followup.setReportDate(req.reportDate());
    followup.setContractReference(req.contractReference());
    followup.setRequester(req.requester());
    followup.setRequestType(req.requestType());
    followup.setProcedureConcerned(req.procedureConcerned());
    followup.setAttachments(req.attachments());
    followup.setFeasibility(req.feasibility());
    followup.setDeliveryType(req.deliveryType());
    followup.setDiagnosticComment(req.diagnosticComment());
    followup.setEstimatedCharge(req.estimatedCharge());
    followup.setEstimatedDelay(req.estimatedDelay());
    followup.setDecisionRmap(req.decisionRmap());
    followup.setDecisionDate(req.decisionDate());
    followup.setSourceRequestDate(req.sourceRequestDate());
    followup.setSourceReceptionDate(req.sourceReceptionDate());
    followup.setDevEnvRequestDate(req.devEnvRequestDate());
    followup.setDevEnvOpenDate(req.devEnvOpenDate());
    followup.setWorkSummary(req.workSummary());
    followup.setVersionNumber(req.versionNumber());
    followup.setTestEnvRequestDate(req.testEnvRequestDate());
    followup.setTestEnvOpenDate(req.testEnvOpenDate());
    followup.setWorkEndDate(req.workEndDate());
    followup.setPackageSendDate(req.packageSendDate());
    followup.setClosureObservation(req.closureObservation());
    followup.setUpdatedAt(Instant.now());
    return toDto(followupRepository.save(followup));
  }

  public void delete(String projectId, String id, UserEntity user) {
    ensureProjectOwned(projectId, user);
    followupRepository.delete(getOwnedFollowup(projectId, id));
  }

  private FollowupEntity getOwnedFollowup(String projectId, String id) {
    return followupRepository.findByIdAndProjectId(id, projectId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Followup not found"));
  }

  private void ensureProjectOwned(String projectId, UserEntity user) {
    var project = projectRepository.findById(projectId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    if (!project.getChefId().equals(user.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
    }
  }

  private FollowupController.FollowupResponse toDto(FollowupEntity followup) {
    return new FollowupController.FollowupResponse(
      followup.getId(),
      followup.getProjectId(),
      followup.getTitle(),
      followup.getDescription(),
      followup.getProgress(),
      followup.getIssues(),
      followup.getDecisions(),
      followup.getReportDate(),
      followup.getContractReference(),
      followup.getRequester(),
      followup.getRequestType(),
      followup.getProcedureConcerned(),
      followup.getAttachments(),
      followup.getFeasibility(),
      followup.getDeliveryType(),
      followup.getDiagnosticComment(),
      followup.getEstimatedCharge(),
      followup.getEstimatedDelay(),
      followup.getDecisionRmap(),
      followup.getDecisionDate(),
      followup.getSourceRequestDate(),
      followup.getSourceReceptionDate(),
      followup.getDevEnvRequestDate(),
      followup.getDevEnvOpenDate(),
      followup.getWorkSummary(),
      followup.getVersionNumber(),
      followup.getTestEnvRequestDate(),
      followup.getTestEnvOpenDate(),
      followup.getWorkEndDate(),
      followup.getPackageSendDate(),
      followup.getClosureObservation(),
      followup.getCreatedAt(),
      followup.getUpdatedAt()
    );
  }
}
