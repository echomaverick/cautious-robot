import React from "react";
import ChatHistory from "./ChatHistory";
import Post from "./Post";
import PostList from "./PostList";
import "../styles/home.css";

const Home = () => {
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
