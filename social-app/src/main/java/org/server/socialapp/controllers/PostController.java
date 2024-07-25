package org.server.socialapp.controllers;

import org.server.socialapp.exceptions.InternalServerErrorException;
import org.server.socialapp.exceptions.NotFoundException;
import org.server.socialapp.models.Post;
import org.server.socialapp.services.ImageService;
import org.server.socialapp.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

	@Value("${bucketName}")
	private String bucketName;

	@Autowired
	private PostService postService;

	@Autowired
	private ImageService imageService;

	@PostMapping("/create/{username}")
	public ResponseEntity<String> create(
			@PathVariable String username ,
			@RequestParam("title") String title ,
			@RequestParam("content") String content ,
			@RequestParam(value = "file", required = false) MultipartFile file) {

		try {
			String imageUrl = null;
			if (file != null && !file.isEmpty()) {
				List<String> imageUrls = imageService.uploadImages(bucketName , List.of(file));
				if (!imageUrls.isEmpty()) {
					imageUrl = imageUrls.get(0);
				}
			}

			Post post = new Post(title , content);
			post.setImageUrl(imageUrl);

			postService.createPost(username , post);
			return ResponseEntity.ok("Post created successfully");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating post");
		}
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
	public ResponseEntity<Post> getPost(@PathVariable String postId) {
		try {
			Post post = postService.getPostById(postId);
			return ResponseEntity.ok(post);
		} catch (NotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		} catch (InternalServerErrorException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
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
