package com.pfe.backend.nomenclature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "nomenclatures")
@CompoundIndex(name = "uniq_category_code", def = "{'category': 1, 'code': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NomenclatureEntity {
  @Id
  private String id;

  private String category;

  private String code;

  private String label;

  private String description;

  private Integer sortOrder;

  private boolean active;

  private Instant createdAt;

  private Instant updatedAt;
}
