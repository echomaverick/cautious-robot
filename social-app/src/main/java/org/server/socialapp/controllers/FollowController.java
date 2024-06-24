package org.server.socialapp.controllers;

import org.server.socialapp.models.FollowerDTO;
import org.server.socialapp.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class FollowController {

	@Autowired
	private FollowService followService;

	@PostMapping("/follow/{followerId}/follow/{followingId}")
	public void followUser(@PathVariable String followerId , @PathVariable String followingId) {
		followService.followUser(followerId , followingId);
	}

	@DeleteMapping("/unfollow/{followerId}/unfollow/{followingId}")
	public void unfollowUser(@PathVariable String followerId , @PathVariable String followingId) {
		followService.unfollowUser(followerId , followingId);
	}

	@GetMapping("/list/{userId}")
	public FollowerDTO getUserConnections(@PathVariable String userId) {
		return followService.getUserConnections(userId);
	}

	@GetMapping("/{userId}/followers")
	public List<String> getFollowers(@PathVariable String userId) {
		return followService.getUserFollowersList(userId);
	}

	@GetMapping("/{userId}/following")
	public List<String> getFollowing(@PathVariable String userId) {
		return followService.getUserFollowingList(userId);
	}
}
