package org.server.socialapp.services;

import org.server.socialapp.models.Post;
import org.server.socialapp.models.User;
import org.server.socialapp.repositories.PostRepository;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

	private static final Logger logger = LoggerFactory.getLogger(PostService.class);

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PostRepository postRepository;

	public Post createPost(String username , Post post) {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new IllegalArgumentException("User not found");
		}
		post.setUserId(user.getId());

		Post savedPost = postRepository.save(post);

		logger.info("Post created with ID: {}" , savedPost);
		return post;
	}

	public List<Post> getUserPosts(String userId) {
		return postRepository.findByUserId(userId);
	}

	public List<Post> getAllDBPosts() {
		return postRepository.findAll();
	}
	public Post getPostById(String postId) {
		return postRepository.findById(postId).orElse(null);
	}
}
