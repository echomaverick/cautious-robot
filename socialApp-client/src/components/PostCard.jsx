import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/post-card.css";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp"; // Import default user icon image
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { FaShareFromSquare } from "react-icons/fa6";

const PostCard = ({ title, content, commentsList, postDate }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleComments = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={defaultUserIcon} alt="User Icon" className="user-icon" />
        <div className="post-header-text">
          <h2>{title}</h2>
          <p>{content}</p>
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-icons">
          <FaRegHeart className="icon" />
          <AiOutlineComment className="icon" onClick={toggleComments} />
          <FaShareFromSquare className="icon" />
          {postDate && <div className="post-date">{formatDate(postDate)}</div>}
        </div>
        {expanded && (
          <div className="post-comments">
            <h3>Comments:</h3>
            <ul className="comment-list">
              {commentsList.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <strong>{comment.userId}</strong>: {comment.content}
                  <br />
                  <small>{formatDate(comment.commentDate)}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  commentsList: PropTypes.array.isRequired,
  postDate: PropTypes.string.isRequired,
};

export default PostCard;
