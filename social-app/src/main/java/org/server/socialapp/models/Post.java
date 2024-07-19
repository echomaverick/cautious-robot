package org.server.socialapp.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
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
	private List<String> likes = new ArrayList<>();
    private String postDate;
	private String postTime;

	public Post(String title , String content) {
		this.id = UUID.randomUUID().toString();
		this.title = title;
		this.content = content;
		this.postDate = LocalDate.now().toString();
		this.postTime = LocalTime.now().toString();
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

	public String getPostDate() {
		return postDate;
	}

	public void setPostDate(String postDate) {
		this.postDate = postDate;
	}

	public String getPostTime() {
		return postTime;
	}
	public void setPostTime(String postTime) {
		this.postTime = postTime;
	}

	public List<String> getLikes(){
		return likes;
	}
	public void setLikes(List<String> likes){
		this.likes = likes;
	}
}
