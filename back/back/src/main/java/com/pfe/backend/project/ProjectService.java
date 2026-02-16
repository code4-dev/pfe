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
      project.getStatus(),
      project.getDueDate(),
      project.getCreatedAt(),
      project.getChefId()
    );
  }
}
