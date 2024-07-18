import React, { useState } from "react";
import axios from "axios";
import "../styles/post.css";

const PostForm = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handlePostTitleChange = (event) => {
    setPostTitle(event.target.value);
  };

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }

    const username = getUsernameFromToken(token);

    const postData = {
      title: postTitle,
      content: postContent,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/posts/create/${username}`,
        postData
      );

      if (response.status === 200) {
        alert("Post created successfully!");
        localStorage.removeItem("cachedPosts");
        window.location.reload();
      }

      setPostTitle("");
      setPostContent("");
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  const getUsernameFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.sub;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  const placeholderText = `What's on your mind, today ${getUsernameFromToken(
    localStorage.getItem("token")
  )} ?`;

  return (
    <div className="post-form">
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={postTitle}
          onChange={handlePostTitleChange}
          required
        />
        <textarea
          placeholder={placeholderText}
          value={postContent}
          onChange={handlePostContentChange}
          rows={4}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostForm;
