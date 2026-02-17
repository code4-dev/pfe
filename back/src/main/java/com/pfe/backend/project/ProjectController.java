package com.pfe.backend.project;

import com.pfe.backend.user.UserEntity;
import jakarta.validation.Valid;
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
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
  private final ProjectService projectService;

  public record ProjectCreateRequest(
    @NotBlank @Size(min = 3) String name,
    @NotBlank @Size(min = 10) String description,
    @NotNull ProjectStatus status,
    @NotNull LocalDate dueDate
  ) {
  }

  public record ProjectUpdateRequest(
    @Size(min = 3) String name,
    @Size(min = 10) String description,
    ProjectStatus status,
    LocalDate dueDate
  ) {
  }

  public record ProjectResponse(
    String id,
    String name,
    String description,
    ProjectStatus status,
    LocalDate dueDate,
    Instant createdAt,
    String chefId
  ) {
  }

  @GetMapping
  public List<ProjectResponse> list(@AuthenticationPrincipal UserEntity user) {
    return projectService.list(user);
  }

  @GetMapping("/{id}")
  public ProjectResponse get(@PathVariable String id, @AuthenticationPrincipal UserEntity user) {
    return projectService.get(id, user);
  }

  @PostMapping
  public ProjectResponse create(@Valid @RequestBody ProjectCreateRequest req, @AuthenticationPrincipal UserEntity user) {
    return projectService.create(req, user);
  }

  @PutMapping("/{id}")
  public ProjectResponse update(@PathVariable String id,
                                @Valid @RequestBody ProjectUpdateRequest req,
                                @AuthenticationPrincipal UserEntity user) {
    return projectService.update(id, req, user);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id, @AuthenticationPrincipal UserEntity user) {
    projectService.delete(id, user);
  }
}
