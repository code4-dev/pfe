package com.pfe.backend.project;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<ProjectEntity, String> {
  List<ProjectEntity> findByChefIdOrderByCreatedAtDesc(String chefId);
}
