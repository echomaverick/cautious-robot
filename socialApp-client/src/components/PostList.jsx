import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "./PostCard";
import loaderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/mona-loading-dark-7701a7b97370.gif";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        return Date.now() < expirationTime;
      } catch (error) {
        console.error("Error decoding token: ", error.message);
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts/all`);

      const postsWithDates = response.data.filter(
        (post) => typeof post.postDate === "string"
      );
      const postsWithoutDates = response.data.filter(
        (post) => !post.postDate || typeof post.postDate !== "string"
      );

      postsWithDates.sort(
        (a, b) => new Date(b.postDate) - new Date(a.postDate)
      );

      const sortedPosts = [...postsWithDates, ...postsWithoutDates];

      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-loader">
        <img src={loaderImage} alt="Loading..." style={{ width: 30 }} />
        <p className="loader-txt">One moment, please...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="no-posts-message"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <p>No more posts.</p>
      </div>
    );
  }

  return (
    <div className="post-list" style={{marginBottom: 15}}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          commentsList={post.commentsList}
          postDate={post.postDate}
          postTime={post.postTime}
          userId={post.userId}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
};

export default PostList;
