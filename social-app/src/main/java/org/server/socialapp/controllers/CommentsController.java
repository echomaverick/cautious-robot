package org.server.socialapp.controllers;

import org.server.socialapp.models.Comments;
import org.server.socialapp.services.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/comments")
public class CommentsController {

	@Autowired
	private CommentsService commentsService;

	@PostMapping("/create/{username}/{postId}")
	public Comments create(@PathVariable String username , @PathVariable String postId , @RequestBody Comments comments) {
		System.out.println("Comments created for postId: " + postId + " by user: " + username);
		return commentsService.createComment(username , postId , comments);
	}
}