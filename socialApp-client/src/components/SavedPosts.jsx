import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../styles/saved-posts.css";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsDetails, setPostsDetails] = useState([]);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("User not authenticated or token invalid");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/save/posts/${userId}`);
        if (response.status === 200) {
          setSavedPosts(response.data.postIds);
        }
      } catch (error) {
        console.error("Error fetching saved posts: ", error.message);
      }
    };

    fetchSavedPosts();
  }, []);

  useEffect(() => {
    const fetchPostsDetails = async () => {
      try {
        const postsDetailsPromises = savedPosts.map(async (postId) => {
          const response = await axios.get(`${apiUrl}/posts/${postId}`);
          return response.data;
        });

        const postsDetails = await Promise.all(postsDetailsPromises);
        setPostsDetails(postsDetails);
      } catch (error) {
        console.error("Error fetching posts details: ", error.message);
      }
    };

    if (savedPosts.length > 0) {
      fetchPostsDetails();
    }
  }, [savedPosts]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.userId;
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return null;
      }
    }
    return null;
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div className="saved-posts">
      <button className="back-button" onClick={handleBackHome}>
        <IoIosArrowRoundBack className="back-icon" />
      </button>
      <h1 className="saved-posts-title">Saved Posts</h1>
      <div className="saved-posts-list">
        {postsDetails.map((post) => (
          <div key={post.id} className="posts-card">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPosts;
