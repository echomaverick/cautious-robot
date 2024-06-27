import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatHistory from "./ChatHistory";
import Post from "./Post";
import PostList from "./PostList";
import placeholderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/placeholder-news.jpg"
import "../styles/home.css";

const Home = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=tesla&from=2024-05-27&sortBy=publishedAt&apiKey=6a2c8c65277a4bb397fe4fb8f571aa3c"
        );
        setNews(response.data.articles.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const extractFirstSentence = (description) => {
    if (!description) return "";
    const firstSentence = description.split(".")[0] + ".";
    return firstSentence.length > 100 ? firstSentence.slice(0, 100) + "..." : firstSentence;
  };

  return (
    <div className="home-container">
      <div className="main-content">
        <ChatHistory />
        <Post />
        <PostList />
      </div>
      {/* <div className="news-section">
        <h2>News Section</h2>
        {news.map((article, index) => (
          <div key={index} className="news-card">
            <img
              src={article.urlToImage || placeholderImage}
              alt={article.title}
              className="card-image"
            />
            <div className="card-content">
              <h3>{article.title}</h3>
              <p>{extractFirstSentence(article.description)}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Home;
