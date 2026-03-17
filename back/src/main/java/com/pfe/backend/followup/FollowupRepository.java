package com.pfe.backend.followup;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FollowupRepository extends MongoRepository<FollowupEntity, String> {
  List<FollowupEntity> findByProjectIdOrderByUpdatedAtDesc(String projectId);
  Optional<FollowupEntity> findByIdAndProjectId(String id, String projectId);
}
