package org.server.socialapp.controllers;

import org.server.socialapp.models.Comments;
import org.server.socialapp.services.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts/comments")
public class CommentsController {

	@Autowired
	private CommentsService commentsService;

	@PostMapping("/create/{userId}/{postId}")
	public Comments create(@PathVariable String userId , @PathVariable String postId , @RequestBody Comments comments) {
		System.out.println("Comments created for postId: " + postId + " by user: " + userId);
		return commentsService.createComment(userId , postId , comments);
	}
}