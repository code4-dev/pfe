package com.pfe.backend.nomenclature;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NomenclatureService {
  private final NomenclatureRepository nomenclatureRepository;

  public List<NomenclatureController.NomenclatureResponse> list(String rawCategory) {
    List<NomenclatureEntity> entities;
    if (rawCategory == null || rawCategory.isBlank()) {
      entities = nomenclatureRepository.findAll(
        Sort.by(
          Sort.Order.asc("category"),
          Sort.Order.asc("sortOrder"),
          Sort.Order.asc("code")
        )
      );
    } else {
      entities = nomenclatureRepository.findByCategoryOrderBySortOrderAscCodeAsc(normalizeKey(rawCategory));
    }
    return entities.stream().map(this::toDto).toList();
  }

  public NomenclatureController.NomenclatureResponse create(NomenclatureController.CreateNomenclatureRequest request) {
    var category = normalizeKey(request.category());
    var code = normalizeKey(request.code());
    if (nomenclatureRepository.existsByCategoryAndCode(category, code)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Nomenclature code already exists in this category");
    }

    var now = Instant.now();
    var entity = NomenclatureEntity.builder()
      .category(category)
      .code(code)
      .label(normalizeLabel(request.label()))
      .description(cleanDescription(request.description()))
      .sortOrder(resolveSortOrder(request.sortOrder()))
      .active(request.active() == null || request.active())
      .createdAt(now)
      .updatedAt(now)
      .build();

    return toDto(nomenclatureRepository.save(entity));
  }

  public NomenclatureController.NomenclatureResponse update(String id, NomenclatureController.UpdateNomenclatureRequest request) {
    var entity = nomenclatureRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nomenclature not found"));

    var category = request.category() == null ? entity.getCategory() : normalizeKey(request.category());
    var code = request.code() == null ? entity.getCode() : normalizeKey(request.code());
    if ((!category.equals(entity.getCategory()) || !code.equals(entity.getCode()))
      && nomenclatureRepository.existsByCategoryAndCode(category, code)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Nomenclature code already exists in this category");
    }

    if (request.label() != null) {
      entity.setLabel(normalizeLabel(request.label()));
    }
    if (request.description() != null) {
      entity.setDescription(cleanDescription(request.description()));
    }
    if (request.sortOrder() != null) {
      entity.setSortOrder(resolveSortOrder(request.sortOrder()));
    }
    if (request.active() != null) {
      entity.setActive(request.active());
    }
    entity.setCategory(category);
    entity.setCode(code);
    entity.setUpdatedAt(Instant.now());

    return toDto(nomenclatureRepository.save(entity));
  }

  public void delete(String id) {
    var entity = nomenclatureRepository.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nomenclature not found"));
    nomenclatureRepository.delete(entity);
  }

  private String normalizeKey(String input) {
    if (input == null || input.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category/code cannot be blank");
    }
    return input.trim().toUpperCase();
  }

  private Integer resolveSortOrder(Integer sortOrder) {
    return sortOrder == null ? 0 : sortOrder;
  }

  private String normalizeLabel(String label) {
    if (label == null || label.trim().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Label cannot be blank");
    }
    return label.trim();
  }

  private String cleanDescription(String description) {
    if (description == null) {
      return null;
    }
    var cleaned = description.trim();
    return cleaned.isEmpty() ? null : cleaned;
  }

  private NomenclatureController.NomenclatureResponse toDto(NomenclatureEntity entity) {
    return new NomenclatureController.NomenclatureResponse(
      entity.getId(),
      entity.getCategory(),
      entity.getCode(),
      entity.getLabel(),
      entity.getDescription(),
      entity.getSortOrder(),
      entity.isActive(),
      entity.getCreatedAt(),
      entity.getUpdatedAt()
    );
  }
}
