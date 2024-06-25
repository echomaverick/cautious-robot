import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/post-card.css";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp"; // Import default user icon image
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineComment } from "react-icons/ai";
import { FaShareFromSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PostCard = ({ id, title, content, commentsList, postDate, userId }) => {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const toggleComments = (e) => {
    e.stopPropagation();
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

  const navigateToPost = () => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className="post-card" onClick={navigateToPost}>
      <div className="post-header">
        <Link to={`/users/${userId}`} onClick={(e) => e.stopPropagation()}>
          <img src={user ? user.profileImage || defaultUserIcon : defaultUserIcon} alt="User Icon" className="user-icon" />
        </Link>
        <div className="post-header-text">
          <h2>{title}</h2>
          <p>{content}</p>
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-icons">
          <IoMdHeartEmpty className="icon" onClick={(e) => e.stopPropagation()} />
          <AiOutlineComment className="icon" onClick={toggleComments} />
          <FaShareFromSquare className="icon" onClick={(e) => e.stopPropagation()} />
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
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  commentsList: PropTypes.array.isRequired,
  postDate: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired, // Add this line
};

export default PostCard;
