import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatHistory from "./ChatHistory";
import Post from "./Post";
import PostList from "./PostList";
import placeholderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/placeholder-news.jpg";
import "../styles/home.css";

const Home = () => {
  const [news, setNews] = useState([]);

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
