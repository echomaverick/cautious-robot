package org.server.socialapp.controllers;

import org.server.socialapp.models.User;
import org.server.socialapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public User register(@RequestBody User user) {
		System.out.println("User registering: " + user.getUsername());
		return userService.createUser(user);
	}

	@GetMapping("/info/{username}")
	public User getUserInfo(@PathVariable String username) {
		System.out.println("User getting information: " + username);
		return userService.getUserInfo(username);
	}
	@GetMapping("/{userId}")
	public User getUserInfoById(@PathVariable String userId) {
		System.out.println("User getting information: " + userId);
		return userService.getUserInfoById(userId);
	}
}
