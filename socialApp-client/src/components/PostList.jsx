import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const CACHE_DURATION = 1800000;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedPosts = getCachedPosts();
    if (cachedPosts) {
      setPosts(cachedPosts);
      const lastCacheTime = localStorage.getItem("lastCacheTime");
      const isCacheValid =
        lastCacheTime && Date.now() - parseInt(lastCacheTime) < CACHE_DURATION;

      if (!isCacheValid) {
        fetchPosts();
      }
    } else {
      fetchPosts();
    }
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
      cachePosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setError("Something went wrong. Please try again later.");
    }
  };

  const cachePosts = (postsToCache) => {
    localStorage.setItem("cachedPosts", JSON.stringify(postsToCache));
    localStorage.setItem("lastCacheTime", Date.now().toString());
  };

  const getCachedPosts = () => {
    const cachedPosts = localStorage.getItem("cachedPosts");
    return cachedPosts ? JSON.parse(cachedPosts) : null;
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          commentsList={post.commentsList}
          postDate={post.postDate}
          userId={post.userId}
        />
      ))}
    </div>
  );
};

export default PostList;
