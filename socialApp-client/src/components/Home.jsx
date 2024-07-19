import React, { useEffect } from "react";
import ChatHistory from "./ChatHistory";
import Post from "./Post";
import PostList from "./PostList";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="main-content">
        <ChatHistory />
        <Post />
        <PostList />
      </div>
    </div>
  );
};

export default Home;
