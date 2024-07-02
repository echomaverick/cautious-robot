package org.server.socialapp.services;

import org.server.socialapp.models.SavePost;
import org.server.socialapp.repositories.SavePostRepository;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class SavePostService {
    private static final Logger logger = LoggerFactory.getLogger(SavePostService.class);

    @Autowired
    private SavePostRepository savePostRepository;

    @Autowired
    private UserRepository userRepository;

    public SavePost savePosts(String userId, List<String> postIds) {
        if (!userRepository.existsById(userId)) {
            logger.error("User {} does not exist", userId);
            throw new IllegalArgumentException("User " + userId + " does not exist");
        }

        Optional<SavePost> existingSavePostOptional = savePostRepository.findByUserId(userId);

        SavePost savePost;
        if (existingSavePostOptional.isPresent()) {
            savePost = existingSavePostOptional.get();
            List<String> newPostIds = postIds.stream()
                    .filter(postId -> !savePost.getPostIds().contains(postId))
                    .toList();
            if (newPostIds.isEmpty()) {
                logger.warn("User {} is trying to save posts that are already saved", userId);
                throw new IllegalArgumentException("User " + userId + " is trying to save posts that are already saved");
            }
            savePost.getPostIds().addAll(newPostIds);
        } else {
            savePost = new SavePost(userId, postIds);
        }

        return savePostRepository.save(savePost);
    }
	 public SavePost unsavePost(String userId, String postId) {
        Optional<SavePost> existingSavePostOptional = savePostRepository.findByUserId(userId);

        if (existingSavePostOptional.isPresent()) {
            SavePost savePost = existingSavePostOptional.get();
            if (savePost.getPostIds().remove(postId)) {
                return savePostRepository.save(savePost);
            } else {
                logger.warn("Post {} not found in saved posts for user {}", postId, userId);
                throw new IllegalArgumentException("Post " + postId + " not found in saved posts for user " + userId);
            }
        } else {
            logger.warn("No saved posts found for user {}", userId);
            throw new IllegalArgumentException("No saved posts found for user " + userId);
        }
    }
	public SavePost getSavedPostsForUser(String userId) {
        Optional<SavePost> savedPostsOptional = savePostRepository.findByUserId(userId);
        return savedPostsOptional.orElse(null);
    }
}
