package org.server.socialapp.services;

import org.server.socialapp.models.Comments;
import org.server.socialapp.models.Post;
import org.server.socialapp.models.User;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CommentsService {
	private static final Logger logger = LoggerFactory.getLogger(CommentsService.class);

	@Autowired
	private UserRepository userRepository;

	@Transactional
	public Comments createComment(String username , String postId , Comments comment) {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new IllegalArgumentException("User not found with username: " + username);
		}

		Post post = user.getPosts().stream()
				.filter(p -> p.getId().equals(postId))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

		comment.setUsername(username);
		post.getCommentsList().add(comment);

		userRepository.save(user);

		logger.info("Comment created with ID: {}" , comment.getId());
		return comment;
	}
}