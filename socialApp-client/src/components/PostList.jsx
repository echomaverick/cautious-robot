import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts/all");

      const postsWithDates = response.data.filter((post) => post.postDate);
      const postsWithoutDates = response.data.filter((post) => !post.postDate);

      postsWithDates.sort(
        (a, b) => new Date(b.postDate) - new Date(a.postDate)
      );

      const sortedPosts = [...postsWithDates, ...postsWithoutDates];

      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          content={post.content}
          commentsList={post.commentsList}
          postDate={post.postDate}
        />
      ))}
    </div>
  );
};

export default PostList;
