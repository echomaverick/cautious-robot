package org.server.socialapp.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document
public class Post {

	@Id
	private String id;
	private String title;
	private String userId;
	private String content;
	private List<Comments> commentsList = new ArrayList<>();
	private String username;

	public Post(String id , String title , String content , String username) {
		this.id = UUID.randomUUID().toString();
		this.title = title;
		this.content = content;
		this.username = username;
		this.userId = userId;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getContent() {
		return content;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<Comments> getCommentsList() {
		return commentsList;
	}

	public void setCommentsList(List<Comments> commentsList) {
		this.commentsList = commentsList;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}
