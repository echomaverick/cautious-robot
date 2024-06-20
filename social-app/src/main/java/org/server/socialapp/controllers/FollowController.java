package org.server.socialapp.controllers;

import org.server.socialapp.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow/{followerId}/follow/{followingId}")
    public void followUser(@PathVariable String followerId, @PathVariable String followingId) {
        followService.followUser(followerId, followingId);
    }

    @DeleteMapping("/unfollow/{followerId}/unfollow/{followingId}")
    public void unfollowUser(@PathVariable String followerId, @PathVariable String followingId) {
        followService.unfollowUser(followerId, followingId);
    }
}
