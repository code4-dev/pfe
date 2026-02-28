package com.pfe.backend.admin.user;

import com.pfe.backend.user.UserEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {
  private final AdminUserService adminUserService;

  public record UserResponse(String id, String name, String email, String role) {
  }

  public record CreateUserRequest(
    @NotBlank @Size(min = 3, max = 120) String name,
    @Email @NotBlank String email,
    @NotBlank @Size(min = 8, max = 128) String password,
    @NotBlank String role
  ) {
  }

  public record UpdateUserRequest(
    @Size(min = 3, max = 120) String name,
    @Email String email,
    @Size(min = 8, max = 128) String password,
    String role
  ) {
  }

  public record UpdateRoleRequest(@NotBlank String role) {
  }

  @GetMapping
  public List<UserResponse> list() {
    return adminUserService.list();
  }

  @PostMapping
  public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
    return adminUserService.create(request);
  }

  @PutMapping("/{id}")
  public UserResponse update(@PathVariable String id,
                             @Valid @RequestBody UpdateUserRequest request,
                             @AuthenticationPrincipal UserEntity authenticatedUser) {
    return adminUserService.update(id, request, authenticatedUser);
  }

  @PatchMapping("/{id}/role")
  public UserResponse updateRole(@PathVariable String id,
                                 @Valid @RequestBody UpdateRoleRequest request,
                                 @AuthenticationPrincipal UserEntity authenticatedUser) {
    return adminUserService.updateRole(id, request.role(), authenticatedUser);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id, @AuthenticationPrincipal UserEntity authenticatedUser) {
    adminUserService.delete(id, authenticatedUser);
  }
}
