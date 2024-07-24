package org.server.socialapp.controllers;

import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.exceptions.NotFoundException;
import org.server.socialapp.models.Post;
import org.server.socialapp.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

	@Autowired
	private PostService postService;

	@PostMapping("/create/{username}")
	public String create(@PathVariable String username , @RequestBody Post post) throws Exception {
		System.out.println("Post creating for username: " + username);
		postService.createPost(username , post);
		return "Post created successfully";
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

	@DeleteMapping("/{postId}")
	public ResponseEntity<String> deletePost(@PathVariable String postId) {
		try {
			postService.deletePost(postId);
			return ResponseEntity.ok("Post deleted successfully");
		} catch (NotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
		} catch (InternalServerErrorException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
		}
	}
}
