package org.server.socialapp.services;

import org.server.socialapp.models.FollowerDTO;
import org.server.socialapp.repositories.FollowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FollowService {

	private static final Logger logger = LoggerFactory.getLogger(FollowService.class);

	@Autowired
	private FollowRepository followRepository;

	public void followUser(String followerId , String followingId) {
		logger.info("Attempting to follow: {} by {}" , followingId , followerId);

		FollowerDTO followerDTO = followRepository.findByUserId(followerId);
		if (followerDTO == null) {
			followerDTO = new FollowerDTO(followerId);
		}

		List<String> followingIds = followerDTO.getFollowingId();
		if (!followingIds.contains(followingId)) {
			followingIds.add(followingId);
			followRepository.save(followerDTO);
			logger.info("{} started following {}" , followerId , followingId);
		} else {
			logger.warn("{} is already following {}" , followerId , followingId);
		}

		FollowerDTO followingDTO = followRepository.findByUserId(followingId);
		if (followingDTO == null) {
			followingDTO = new FollowerDTO(followingId);
		}

		List<String> followerIds = followingDTO.getFollowerId();
		if (!followerIds.contains(followerId)) {
			followerIds.add(followerId);
			followRepository.save(followingDTO);
			logger.info("{} followed by {}" , followingId , followerId);
		}
	}

	public void unfollowUser(String followerId , String followingId) {
		logger.info("Attempting to unfollow: {} by {}" , followingId , followerId);

		FollowerDTO followerDTO = followRepository.findByUserId(followerId);
		if (followerDTO != null) {
			List<String> followingIds = followerDTO.getFollowingId();
			if (followingIds.contains(followingId)) {
				followingIds.remove(followingId);
				followRepository.save(followerDTO);
				logger.info("{} unfollowed {}" , followerId , followingId);
			}
		}

		FollowerDTO followingDTO = followRepository.findByUserId(followingId);
		if (followingDTO != null) {
			List<String> followerIds = followingDTO.getFollowerId();
			if (followerIds.contains(followerId)) {
				followerIds.remove(followerId);
				followRepository.save(followingDTO);
				logger.info("{} removed from followers of {}" , followerId , followingId);
			}
		}
	}

	public FollowerDTO getUserConnections(String userId) {
		return followRepository.findByUserId(userId);
	}

	public List<String> getUserFollowersList(String userId) {
		FollowerDTO followerDTO = followRepository.findByUserId(userId);
		return (followerDTO != null) ? followerDTO.getFollowerId() : new ArrayList<>();
	}

	public List<String> getUserFollowingList(String userId){
		FollowerDTO followerDTO = followRepository.findByUserId(userId);
		return (followerDTO != null) ? followerDTO.getFollowingId() : new ArrayList<>();
	}
}
