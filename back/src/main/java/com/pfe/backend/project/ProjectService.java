package com.pfe.backend.project;

import com.pfe.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
  private final ProjectRepository projectRepository;

  public List<ProjectController.ProjectResponse> list(UserEntity user) {
    return projectRepository.findByChefIdOrderByCreatedAtDesc(user.getId())
      .stream()
      .map(this::toDto)
      .toList();
  }

  public ProjectController.ProjectResponse get(String id, UserEntity user) {
    return toDto(getOwned(id, user));
  }

  public ProjectController.ProjectResponse create(ProjectController.ProjectCreateRequest req, UserEntity user) {
    var project = ProjectEntity.builder()
      .name(req.name())
      .description(req.description())
      .clientName(req.clientName())
      .contractReference(req.contractReference())
      .projectContext(req.projectContext())
      .projectCharacter(req.projectCharacter())
      .projectType(req.projectType())
      .developmentMode(req.developmentMode())
      .historical(req.historical())
      .perimeter(req.perimeter())
      .projectOwner(req.projectOwner())
      .projectLead(req.projectLead())
      .projectTeam(req.projectTeam())
      .estimatedChargeHm(req.estimatedChargeHm())
      .estimatedBudgetMd(req.estimatedBudgetMd())
      .estimatedDelayMonths(req.estimatedDelayMonths())
      .budgetChargeCp(req.budgetChargeCp())
      .budgetChargeId(req.budgetChargeId())
      .budgetChargeTotal(req.budgetChargeTotal())
      .budgetMdCp(req.budgetMdCp())
      .budgetMdId(req.budgetMdId())
      .budgetMdTotal(req.budgetMdTotal())
      .potentialRisks(req.potentialRisks())
      .prerequisites(req.prerequisites())
      .status(req.status())
      .dueDate(req.dueDate())
      .createdAt(Instant.now())
      .chefId(user.getId())
      .build();
    return toDto(projectRepository.save(project));
  }

  public ProjectController.ProjectResponse update(String id,
                                                  ProjectController.ProjectUpdateRequest req,
                                                  UserEntity user) {
    var project = getOwned(id, user);
    if (req.name() != null) {
      project.setName(req.name());
    }
    if (req.description() != null) {
      project.setDescription(req.description());
    }
    if (req.clientName() != null) {
      project.setClientName(req.clientName());
    }
    if (req.contractReference() != null) {
      project.setContractReference(req.contractReference());
    }
    if (req.projectContext() != null) {
      project.setProjectContext(req.projectContext());
    }
    if (req.projectCharacter() != null) {
      project.setProjectCharacter(req.projectCharacter());
    }
    if (req.projectType() != null) {
      project.setProjectType(req.projectType());
    }
    if (req.developmentMode() != null) {
      project.setDevelopmentMode(req.developmentMode());
    }
    if (req.historical() != null) {
      project.setHistorical(req.historical());
    }
    if (req.perimeter() != null) {
      project.setPerimeter(req.perimeter());
    }
    if (req.projectOwner() != null) {
      project.setProjectOwner(req.projectOwner());
    }
    if (req.projectLead() != null) {
      project.setProjectLead(req.projectLead());
    }
    if (req.projectTeam() != null) {
      project.setProjectTeam(req.projectTeam());
    }
    if (req.estimatedChargeHm() != null) {
      project.setEstimatedChargeHm(req.estimatedChargeHm());
    }
    if (req.estimatedBudgetMd() != null) {
      project.setEstimatedBudgetMd(req.estimatedBudgetMd());
    }
    if (req.estimatedDelayMonths() != null) {
      project.setEstimatedDelayMonths(req.estimatedDelayMonths());
    }
    if (req.budgetChargeCp() != null) {
      project.setBudgetChargeCp(req.budgetChargeCp());
    }
    if (req.budgetChargeId() != null) {
      project.setBudgetChargeId(req.budgetChargeId());
    }
    if (req.budgetChargeTotal() != null) {
      project.setBudgetChargeTotal(req.budgetChargeTotal());
    }
    if (req.budgetMdCp() != null) {
      project.setBudgetMdCp(req.budgetMdCp());
    }
    if (req.budgetMdId() != null) {
      project.setBudgetMdId(req.budgetMdId());
    }
    if (req.budgetMdTotal() != null) {
      project.setBudgetMdTotal(req.budgetMdTotal());
    }
    if (req.potentialRisks() != null) {
      project.setPotentialRisks(req.potentialRisks());
    }
    if (req.prerequisites() != null) {
      project.setPrerequisites(req.prerequisites());
    }
    if (req.status() != null) {
      project.setStatus(req.status());
    }
    if (req.dueDate() != null) {
      project.setDueDate(req.dueDate());
    }
    return toDto(projectRepository.save(project));
  }

  public void delete(String id, UserEntity user) {
    var project = getOwned(id, user);
    projectRepository.delete(project);
  }

  private ProjectEntity getOwned(String id, UserEntity user) {
    var project = projectRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

    if (!project.getChefId().equals(user.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
    }

    return project;
  }

  private ProjectController.ProjectResponse toDto(ProjectEntity project) {
    return new ProjectController.ProjectResponse(
      project.getId(),
      project.getName(),
      project.getDescription(),
      project.getClientName(),
      project.getContractReference(),
      project.getProjectContext(),
      project.getProjectCharacter(),
      project.getProjectType(),
      project.getDevelopmentMode(),
      project.getHistorical(),
      project.getPerimeter(),
      project.getProjectOwner(),
      project.getProjectLead(),
      project.getProjectTeam(),
      project.getEstimatedChargeHm(),
      project.getEstimatedBudgetMd(),
      project.getEstimatedDelayMonths(),
      project.getBudgetChargeCp(),
      project.getBudgetChargeId(),
      project.getBudgetChargeTotal(),
      project.getBudgetMdCp(),
      project.getBudgetMdId(),
      project.getBudgetMdTotal(),
      project.getPotentialRisks(),
      project.getPrerequisites(),
      project.getStatus(),
      project.getDueDate(),
      project.getCreatedAt(),
      project.getChefId()
    );
  }
}
