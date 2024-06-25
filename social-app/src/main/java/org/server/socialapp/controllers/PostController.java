package org.server.socialapp.controllers;

import org.server.socialapp.models.Post;
import org.server.socialapp.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

	@GetMapping("/list/{userId}")
	public List<Post> listUserPosts(@PathVariable String userId) {
		return postService.getUserPosts(userId);
	}

	@GetMapping("/all")
	public List<Post> getAllPosts() {
		return postService.getAllDBPosts();
	}
	@GetMapping("/{postId}")
	public Post getPost(@PathVariable String postId) {
		return postService.getPostById(postId);
	}
}
