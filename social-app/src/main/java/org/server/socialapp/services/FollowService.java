package org.server.socialapp.services;

import org.server.socialapp.models.User;
import org.server.socialapp.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private static final Logger logger = LoggerFactory.getLogger(FollowService.class);

    @Autowired
    private UserRepository userRepository;

    public void followUser(String followerId, String followingId) {
        logger.info("Attempting to follow: {} by {}", followingId, followerId);

        User follower = userRepository.findById(followerId).orElseThrow(() ->
                new IllegalArgumentException("Invalid follower ID provided: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() ->
                new IllegalArgumentException("Invalid following ID provided: " + followingId));

        if (follower.getFollowing().contains(following)) {
            logger.warn("{} is already following {}", follower.getUsername(), following.getUsername());
            return;
        }

        follower.getFollowing().add(following);
        userRepository.save(follower);
        logger.info("{} started following {}", follower.getUsername(), following.getUsername());

        if (!following.getFollowers().contains(follower)) {
            following.getFollowers().add(follower);
            userRepository.save(following);
            logger.info("{} followed by {}", following.getUsername(), follower.getUsername());
        }
    }

    public void unfollowUser(String followerId, String followingId) {
        logger.info("Attempting to unfollow: {} by {}", followingId, followerId);

        User follower = userRepository.findById(followerId).orElseThrow(() ->
                new IllegalArgumentException("Invalid follower ID provided: " + followerId));
        User following = userRepository.findById(followingId).orElseThrow(() ->
                new IllegalArgumentException("Invalid following ID provided: " + followingId));

        if (follower.getFollowing().contains(following)) {
            follower.getFollowing().remove(following);
            userRepository.save(follower);
            logger.info("{} unfollowed {}", follower.getUsername(), following.getUsername());
        }

        if (following.getFollowers().contains(follower)) {
            following.getFollowers().remove(follower);
            userRepository.save(following);
            logger.info("{} removed from followers of {}", follower.getUsername(), following.getUsername());
        }
    }
}
