package org.server.socialapp.repositories;

import org.server.socialapp.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
	boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	User findByUsername(String username);
	User findUserById(String id);

	List<User> findByUsernameContaining(String username);
    List<User> findByNameContainingAndSurnameContaining(String name, String surname);
}
