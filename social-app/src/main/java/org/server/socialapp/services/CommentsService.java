package org.server.socialapp.services;

import org.server.socialapp.models.Comments;
import org.server.socialapp.models.Post;
import org.server.socialapp.models.User;
import org.server.socialapp.repositories.PostRepository;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommentsService {

	private static final Logger logger = LoggerFactory.getLogger(CommentsService.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PostRepository postRepository;

	@Transactional
	public Comments createComment(String userId , String postId , Comments comment) {
		Optional<User> userOptional = userRepository.findById(userId);
		if (userOptional.isEmpty()) {
			throw new IllegalArgumentException("User not found with userId: " + userId);
		}

		User user = userOptional.get();

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + postId));

		comment.setUserId(user.getId());
		post.getCommentsList().add(comment);

		postRepository.save(post);

		logger.info("Comment created with ID: {}" , comment.getId());
		return comment;
	}
}
