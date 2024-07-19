package org.server.socialapp.services;

import org.server.socialapp.exceptions.ResourceNotFoundException;
import org.server.socialapp.models.Like;
import org.server.socialapp.models.Post;
import org.server.socialapp.repositories.LikesRepository;
import org.server.socialapp.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LikesService {

	@Autowired
	private LikesRepository likesRepository;
	@Autowired
	private PostRepository postRepository;

	@Transactional
	public Like likePost(String userId , String postId) {
		List<Like> userLikes = likesRepository.findByUserId(userId);
		Like like;
		if (userLikes.isEmpty()) {
			like = new Like(userId);
		} else {
			like = userLikes.get(0);
		}
		if (!like.getPostId().equals(postId)) {
			like.getPostId().add(postId);
		}

		likesRepository.save(like);

		Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
		if (!post.getLikes().contains(userId)) {
			post.getLikes().add(userId);
		}
		postRepository.save(post);

		return like;
	}

	@Transactional
	public Like likeComment(String userId , String commentId) {
		List<Like> userLikes = likesRepository.findByUserId(userId);
		Like like;
		if (userLikes.isEmpty()) {
			like = new Like(userId);
		} else {
			like = userLikes.get(0);
		}

		if (like.getCommentId() == null) {
			like.setCommentId(new ArrayList<>());
		}

		if (!like.getCommentId().contains(commentId)) {
			like.getCommentId().add(commentId);
		}

		return likesRepository.save(like);
	}

	@Transactional
	public void unlikePost(String userId , String postId) {
		List<Like> userLikes = likesRepository.findByUserId(userId);
		if (!userLikes.isEmpty()) {
			Like like = userLikes.get(0);
			if (like.getPostId() != null) {
				like.getPostId().remove(postId);
				likesRepository.save(like);
			}
		}
	}

	@Transactional
	public void unlikeComment(String userId , String commentId) {
		List<Like> userLikes = likesRepository.findByUserId(userId);
		if (!userLikes.isEmpty()) {
			Like like = userLikes.get(0);
			if (like.getCommentId() != null) {
				like.getCommentId().remove(commentId);
				likesRepository.save(like);
			}
		}
	}

	public int getLikesCountForPost(String postId) {
		List<Like> likes = likesRepository.findByPostIdContaining(postId);
		return likes.size();
	}

	public List<Like> getLikesForComment(String commentId) {
		return likesRepository.findByCommentIdContaining(commentId);
	}

	public List<Like> getLikesForUser(String userId) {
		return likesRepository.findByUserId(userId);
	}
}
