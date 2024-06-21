package org.server.socialapp.repositories;

import org.server.socialapp.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
	Post findByUserId(String userId);
}
