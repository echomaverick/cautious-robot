import React from "react";
import ChatHistory from "./ChatHistory";
import "../styles/home.css";
import Post from "./Post";
import PostList from "./PostList";

const Home = () => {
  return (
    <div className="home-container">
      <ChatHistory />
      <Post />
      <PostList />
    </div>
  );
};

export default Home;
