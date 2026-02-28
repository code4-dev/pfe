package com.pfe.backend.nomenclature;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NomenclatureRepository extends MongoRepository<NomenclatureEntity, String> {
  List<NomenclatureEntity> findByCategoryOrderBySortOrderAscCodeAsc(String category);

  boolean existsByCategoryAndCode(String category, String code);
}
