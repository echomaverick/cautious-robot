package org.server.socialapp.services;

import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.exceptions.NotFoundException;
import org.server.socialapp.models.Post;
import org.server.socialapp.models.User;
import org.server.socialapp.repositories.PostRepository;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PostService {

	private static final Logger logger = LoggerFactory.getLogger(PostService.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PostRepository postRepository;

	public Post createPost(String username , Post post) {
		try {
			User user = userRepository.findByUsername(username);
			if (user == null) {
				throw new NotFoundException("User not found with username: " + username);
			}

			post.setUserId(user.getId());
			post.setPostDate(LocalDate.now().toString());

			logger.info("Saving post with date: {}" , post.getPostDate());
			Post savedPost = postRepository.save(post);

			logger.info("Post created with ID: {} and date: {}" , savedPost.getId() , savedPost.getPostDate());
			return savedPost;

		} catch (NotFoundException e) {
			logger.error("Error creating post: {}" , e.getMessage());
			throw e;
		} catch (Exception e) {
			logger.error("Unexpected error occurred while creating post: {}" , e.getMessage());
			throw new InternalServerErrorException("Error creating post");
		}
	}

	public List<Post> getUserPosts(String userId) {
		try {
			return postRepository.findByUserId(userId);
		} catch (Exception e) {
			logger.error("Error fetching posts for user ID {}: {}" , userId , e.getMessage());
			throw new InternalServerErrorException("Error fetching user posts");
		}
	}

	public List<Post> getAllDBPosts() {
		try {
			List<Post> posts = postRepository.findAll();
			posts.forEach(post -> logger.info("Fetched post with date: {}" , post.getPostDate()));
			return posts;
		} catch (Exception e) {
			logger.error("Error fetching all posts: {}" , e.getMessage());
			throw new InternalServerErrorException("Error fetching all posts");
		}
	}

	public Post getPostById(String postId) {
		try {
			return postRepository.findById(postId)
					.orElseThrow(() -> new NotFoundException("Post not found with ID: " + postId));
		} catch (NotFoundException e) {
			logger.error("Error fetching post with ID {}: {}" , postId , e.getMessage());
			throw e;
		} catch (Exception e) {
			logger.error("Unexpected error occurred while fetching post with ID {}: {}" , postId , e.getMessage());
			throw new InternalServerErrorException("Error fetching post");
		}
	}
}
