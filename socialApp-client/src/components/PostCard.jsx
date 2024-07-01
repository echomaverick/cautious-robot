import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BiRepost } from "react-icons/bi";
import { AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { MdOutlineAddComment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import redditIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/reddit.png";
import youtubeIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/You-Tube-14.png";
import xIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/x.png";
import facebookIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/facebook.png";
import "../styles/post-card.css";

const PostCard = ({ id, title, content, postDate, userId }) => {
  const [expanded, setExpanded] = useState(false);
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [commentCount, setCommentCount] = useState(0); // State to track number of comments
  const [liked, setLiked] = useState(false); // State to track if post is liked
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/${userId}`);
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const userIdFromToken = getUserIdFromToken();
      if (!userIdFromToken) {
        console.error("User not authenticated or token invalid.");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/likes/${userIdFromToken}`);
        if (response.status === 200) {
          const likedPosts = response.data[0]?.postId || [];
          if (likedPosts.includes(id)) {
            setLiked(true);
          }
        }
      } catch (error) {
        console.error("Error fetching liked posts:", error.message);
      }
    };

    fetchLikedPosts();
  }, [id]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/posts/${id}`);
        if (response.status === 200) {
          const { commentsList } = response.data;
          setCommentsList(commentsList);
          setCommentCount(commentsList.length);
        }
      } catch (error) {
        console.error("Error fetching post details:", error.message);
      }
    };

    fetchPostDetails();
  }, [id]);

  const toggleComments = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const toggleNewCommentForm = (e) => {
    e.stopPropagation();
    setShowNewCommentForm(!showNewCommentForm);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

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

  const navigateToPost = () => {
    navigate(`/posts/${id}`);
  };

  const navigateToAddComment = async () => {
    const commenterId = getUserIdFromToken();
    if (!commenterId) {
      console.error("User not authenticated or token invalid.");
      return;
    }

    if (newComment.trim() === "") {
      console.error("Empty comment cannot be posted.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/posts/comments/create/${commenterId}/${id}`,
        {
          content: newComment,
        }
      );
      if (response.status === 200) {
        const {
          id: commentId,
          userId: commenterId,
          content: commentContent,
          commentDate,
        } = response.data;
        const newCommentObj = {
          id: commentId,
          userId: commenterId,
          content: commentContent,
          commentDate,
        };
        // Update local state of commentsList by adding new comment at the beginning
        setCommentsList([newCommentObj, ...commentsList]);
        setCommentCount(commentCount + 1);
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    const userIdFromToken = getUserIdFromToken();
    if (!userIdFromToken) {
      console.error("User not authenticated or token invalid.");
      return;
    }

    try {
      if (!liked) {
        await axios.post(`${apiUrl}/likes/post/${userIdFromToken}/${id}`);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  const handleShareToPlatform = (platform) => {
    const constructedShareUrl = `http://localhost:5173/posts/${id}`;
    setShareUrl(constructedShareUrl);
    setShowShareModal(true);
    setSelectedPlatform(platform);
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error("Error copying URL to clipboard:", error);
      });
  };

  const handleProfileLinkClick = (e) => {
    e.stopPropagation();
    const loggedInUserId = getUserIdFromToken();
    if (userId === loggedInUserId) {
      navigate("/profile");
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div onClick={handleProfileLinkClick}>
          <img
            src={user ? user.profileImage || defaultUserIcon : defaultUserIcon}
            alt="User Icon"
            className="user-icon"
          />
        </div>
        <div className="post-header-text" onClick={navigateToPost}>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-icons">
          <div className="icon-wrapper" onClick={toggleComments}>
            <AiOutlineComment className="icon" />
            <p className="comment-num">{commentCount}</p>
          </div>
          {liked ? (
            <IoMdHeart className="icon liked" onClick={toggleLike} />
          ) : (
            <IoMdHeartEmpty className="icon" onClick={toggleLike} />
          )}
          <BiRepost className="icon" />
          <AiOutlineShareAlt className="icon" onClick={handleShowShareModal} />
          {postDate && <div className="post-date">{formatDate(postDate)}</div>}
        </div>
        {expanded && (
          <div className="post-comments">
            <h3 className="comment-title">
              Comments{" "}
              <button
                className="add-comment-button"
                onClick={toggleNewCommentForm}
              >
                <MdOutlineAddComment /> Add
              </button>
            </h3>
            <ul className="comment-list">
              {commentsList.map((comment) => (
                <li key={comment.id} className="comment-item1">
                  <img
                    src={
                      user
                        ? user.profileImage || defaultUserIcon
                        : defaultUserIcon
                    }
                    alt="User Icon"
                    className="user-icon1"
                  />
                  <strong className="user-ide">@{comment.userId}</strong>
                  <p className="user-comment">{comment.content}</p>
                  <small className="small-timer">
                    {formatDate(comment.commentDate)}
                  </small>
                </li>
              ))}
            </ul>
            {showNewCommentForm && (
              <div className="new-comment-form">
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write your comment..."
                />
                <button
                  className="post-comment-button"
                  onClick={navigateToAddComment}
                >
                  <IoSend />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal show={showShareModal} onHide={handleCloseShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="share-icons">
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("youtube")}
            >
              <img className="youtube-icon" src={youtubeIcon} alt="YouTube" />
            </button>
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("reddit")}
            >
              <img className="reddit-icon" src={redditIcon} alt="Reddit" />
            </button>
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("x")}
            >
              <img className="x-icon" src={xIcon} alt="X" />
            </button>
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("facebook")}
            >
              <img
                className="facebook-icon"
                src={facebookIcon}
                alt="Facebook"
              />
            </button>
          </div>
          {shareUrl && (
            <div className="share-url-container">
              <input
                type="text"
                className="share-url-input"
                value={shareUrl}
                readOnly
              />
              <button className="copy-url-button" onClick={copyUrlToClipboard}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  postDate: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default PostCard;
