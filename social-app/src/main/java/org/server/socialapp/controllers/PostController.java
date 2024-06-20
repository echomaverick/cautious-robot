package org.server.socialapp.controllers;

import org.server.socialapp.models.Post;
import org.server.socialapp.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

	@Autowired
	private PostService postService;

	@PostMapping("/create/{username}")
	public Post create(@PathVariable String username , @RequestBody Post post) {
		System.out.println("Post creating for username: " + username);
		return postService.createPost(username , post);
	}
}
