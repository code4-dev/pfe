package com.pfe.backend.nomenclature;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/nomenclatures")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class NomenclatureController {
  private final NomenclatureService nomenclatureService;

  public record NomenclatureResponse(
    String id,
    String category,
    String code,
    String label,
    String description,
    Integer sortOrder,
    boolean active,
    Instant createdAt,
    Instant updatedAt
  ) {
  }

  public record CreateNomenclatureRequest(
    @NotBlank @Size(max = 80) String category,
    @NotBlank @Size(max = 80) String code,
    @NotBlank @Size(max = 120) String label,
    @Size(max = 500) String description,
    @Min(0) @Max(10000) Integer sortOrder,
    Boolean active
  ) {
  }

  public record UpdateNomenclatureRequest(
    @Size(max = 80) String category,
    @Size(max = 80) String code,
    @Size(max = 120) String label,
    @Size(max = 500) String description,
    @Min(0) @Max(10000) Integer sortOrder,
    Boolean active
  ) {
  }

  @GetMapping
  public List<NomenclatureResponse> list(@RequestParam(required = false) String category) {
    return nomenclatureService.list(category);
  }

  @PostMapping
  public NomenclatureResponse create(@Valid @RequestBody CreateNomenclatureRequest request) {
    return nomenclatureService.create(request);
  }

  @PutMapping("/{id}")
  public NomenclatureResponse update(@PathVariable String id, @Valid @RequestBody UpdateNomenclatureRequest request) {
    return nomenclatureService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id) {
    nomenclatureService.delete(id);
  }
}
