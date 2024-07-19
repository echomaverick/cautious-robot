package org.server.socialapp.repositories;

import org.server.socialapp.models.History;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface HistoryRepository extends MongoRepository<History, String> {
	boolean existsById(long id);

	List<History> findByUsername(String username);

	Optional<History> findById(String id);

	History findBySessionId(String sessionId);
}
