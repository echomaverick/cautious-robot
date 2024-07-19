package org.server.socialapp.services;

import org.server.socialapp.exceptions.BadRequestException;
import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.exceptions.NotFoundException;
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
		try {
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
		} catch (Exception e) {
			logger.error("Error following user: {} by {}. Error: {}" , followingId , followerId , e.getMessage() , e);
			throw new InternalServerErrorException("An error occurred while following the user");
		}
	}

	public void unfollowUser(String followerId , String followingId) {
		try {
			logger.info("Attempting to unfollow: {} by {}" , followingId , followerId);

			FollowerDTO followerDTO = followRepository.findByUserId(followerId);
			if (followerDTO != null) {
				List<String> followingIds = followerDTO.getFollowingId();
				if (followingIds.contains(followingId)) {
					followingIds.remove(followingId);
					followRepository.save(followerDTO);
					logger.info("{} unfollowed {}" , followerId , followingId);
				} else {
					throw new BadRequestException("User " + followerId + " is not following " + followingId);
				}
			} else {
				throw new NotFoundException("Follower user not found: " + followerId);
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
		} catch (BadRequestException | NotFoundException e) {
			logger.warn("Error in unfollowing user: {} by {}. Error: {}" , followingId , followerId , e.getMessage() , e);
			throw e;
		} catch (Exception e) {
			logger.error("Unexpected error while unfollowing user: {} by {}. Error: {}" , followingId , followerId , e.getMessage() , e);
			throw new InternalServerErrorException("An unexpected error occurred while unfollowing the user");
		}
	}

	public FollowerDTO getUserConnections(String userId) {
		try {
			return followRepository.findByUserId(userId);
		} catch (Exception e) {
			logger.error("Error fetching connections for user: {}. Error: {}" , userId , e.getMessage() , e);
			throw new InternalServerErrorException("An error occurred while fetching user connections");
		}
	}

	public List<String> getUserFollowersList(String userId) {
		try {
			FollowerDTO followerDTO = followRepository.findByUserId(userId);
			return (followerDTO != null) ? followerDTO.getFollowerId() : new ArrayList<>();
		} catch (Exception e) {
			logger.error("Error fetching followers list for user: {}. Error: {}" , userId , e.getMessage() , e);
			throw new InternalServerErrorException("An error occurred while fetching user followers");
		}
	}

	public List<String> getUserFollowingList(String userId) {
		try {
			FollowerDTO followerDTO = followRepository.findByUserId(userId);
			return (followerDTO != null) ? followerDTO.getFollowingId() : new ArrayList<>();
		} catch (Exception e) {
			logger.error("Error fetching following list for user: {}. Error: {}" , userId , e.getMessage() , e);
			throw new InternalServerErrorException("An error occurred while fetching user following");
		}
	}
}
