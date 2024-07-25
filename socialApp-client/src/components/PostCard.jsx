import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { MdOutlineAddComment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import redditIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/reddit.png";
import whatsapp from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/whatsapp.png";
import xIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/twitter.jpg";
import facebookIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/faceboook.png";
import "../styles/post-card.css";

const PostCard = ({
  id,
  title,
  content,
  postDate,
  postTime,
  userId,
  imageUrl,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
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

  // Fetches the user details based on the userId from the API.
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/${userId}`);
        if (response.status === 200) {
          setUser(response.data);
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, [userId]); // Re-run this effect when userId changes.

  // Fetches the list of posts liked by the current user.
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
          // Check if the current postId is in the list of liked posts.
          if (likedPosts.includes(id)) {
            setLiked(true);
          }
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            "Error fetching liked posts:",
            error.response.data.message
          );
        } else if (error.request) {
          // The request was made but no response was received
          if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again later.");
          } else {
            console.error("No response received. Please check your network.");
          }
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error fetching liked posts:", error.message);
        }
      }
    };

    fetchLikedPosts();
  }, [id]);

  // Fetches the like count for the current post.
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const likeResponse = await axios.get(`${apiUrl}/likes/post/${id}`);
        if (likeResponse.status === 200) {
          // Set the like count if the request is successful.
          setLikeCount(likeResponse.data);
        } else {
          console.error("Failed to fetch like count");
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Error fetching like count:",
            error.response.data.message
          );
        } else if (error.request) {
          if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again later.");
          } else {
            console.error("No response received. Please check your network.");
          }
        } else {
          console.error("Error fetching like count:", error.message);
        }
      }
    };

    fetchLikeCount();
  }, [id]);

  // Fetches details of the post, including comments.
  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts/${id}`);

      if (response.status === 200) {
        const { commentsList } = response.data;
        if (commentsList) {
          // Update comments list and count if the request is successful.
          setCommentsList(commentsList);
          setCommentCount(commentsList.length || 0);
        } else {
          setCommentsList([]);
          setCommentCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching post details:", error.message);
    }
  };

  // Fetches the list of posts saved by the current user.
  useEffect(() => {
    const fetchSavedPosts = async () => {
      const userIdFromToken = getUserIdFromToken();
      if (!userIdFromToken) {
        console.error("User not authenticated or token invalid.");
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}/save/posts/${userIdFromToken}`
        );
        if (response.status === 200) {
          const savedPostIds = response.data.postIds || [];
          // Check if the current postId is in the list of saved posts.
          if (savedPostIds.includes(id)) {
            setSaved(true);
          }
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error.message);
      }
    };

    fetchSavedPosts();
  }, [id]);

  useEffect(() => {
    setCopied(false);
  }, [shareUrl]);

  // Toggles the display of comments (expanded/collapsed state).
  const toggleComments = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Toggles the visibility of the new comment form.
  const toggleNewCommentForm = (e) => {
    e.stopPropagation();
    setShowNewCommentForm(!showNewCommentForm);
  };

  // Fetches the details of the post, including comments.
  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  // Updates the new comment state when the comment input changes.
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Retrieves the userId from the authentication token stored in localStorage.
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodes the token to get userId.
        return decodedToken.userId;
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return null;
      }
    }
    return null;
  };

  // Navigates to the specific post page.
  const navigateToPost = () => {
    navigate(`/posts/${id}`);
  };

  // Handles adding a new comment to the post.
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

    setLoading(true); // Start loader

    try {
      const response = await axios.post(
        `${apiUrl}/posts/comments/create/${commenterId}/${id}`,
        { content: newComment }
      );
      if (response.status === 200) {
        await fetchPostDetails(); // Re-fetch post details to update comments
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Handles toggling the like status of the post.
  const toggleLike = async (e) => {
    e.stopPropagation();
    const userIdFromToken = getUserIdFromToken();
    if (!userIdFromToken) {
      console.error("User not authenticated or token invalid.");
      return; // Returns early if the user is not authenticated.
    }

    try {
      if (!liked) {
        await axios.post(`${apiUrl}/likes/post/${userIdFromToken}/${id}`);
        setLiked(true);
      }
      const likeResponse = await axios.get(`${apiUrl}/likes/post/${id}`);
      if (likeResponse.status === 200) {
        setLikeCount(likeResponse.data);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  // Handles toggling the saved status of the post.
  const toggleSave = async (e) => {
    e.stopPropagation();
    const userIdFromToken = getUserIdFromToken();
    if (!userIdFromToken) {
      console.error("User not authenticated or token invalid.");
      return; // Returns early if the user is not authenticated.
    }

    try {
      if (!saved) {
        await axios.post(`${apiUrl}/save/posts/${userIdFromToken}`, [id]);
        setSaved(true);
      } else {
        await axios.delete(`${apiUrl}/save/posts/${userIdFromToken}/${id}`);
        setSaved(false);
      }
    } catch (error) {
      console.error("Error toggling save:", error.message);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  const handleShareToPlatform = (platform) => {
    const postUrl = `http://localhost:5173/posts/${id}`;
    const encodedUrl = encodeURIComponent(postUrl);
    const shareText = encodeURIComponent("Check out this post!");

    switch (platform) {
      case "twitter":
        // For Twitter (now X)
        setShareUrl(`https://twitter.com/intent/tweet?url=${encodedUrl}`);
        break;
      case "reddit":
        // For Reddit
        setShareUrl(
          `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareText}`
        );
        break;
      case "facebook":
        // For Facebook
        setShareUrl(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        );
        break;
      case "whatsapp":
        // For WhatsApp
        setShareUrl(`https://wa.me/?text=${shareText}%20${encodedUrl}`);
        break;
      default:
        console.error("Unsupported platform:", platform);
        return;
    }
    setShowShareModal(true);
    setSelectedPlatform(platform);
  };

  // Copies the post URL to the clipboard and updates the copied state.
  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

  // Formats the given date to a more readable format (e.g., "Jul 19, 2024").
  const formatDate = (postDate) => {
    const date = new Date(postDate);
    return format(date, "MMM dd, yyyy");
  };

  // Formats the given time to a "HH:MM" format.
  const formatTime = (postTime) => {
    if (!postTime) {
      return "N/A"; // Return a default value if postTime is undefined or null
    }

    const [timeString] = postTime.split(".");
    const [hours, minutes] = timeString.split(":");

    return `${hours}:${minutes}`;
  };

  // Checks if the given date is valid by attempting to parse it.
  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
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
          <div className="post-header-text" onClick={navigateToPost}>
            <h2>{username || "Unknown User"}</h2>
          </div>
        </div>
      </div>
      <div>
        <p className="post-content">{content}</p>
      </div>
      {imageUrl && (
        <div className="post-image">
          <img src={imageUrl} alt="Post Image" className="image" />
        </div>
      )}
      <div className="post-footer">
        <div className="footer-icons">
          <div className="icon-wrapper" onClick={toggleComments}>
            <AiOutlineComment className="icon" />
            <p className="comment-num">{commentCount}</p>
          </div>

          <div>
            {liked ? (
              <IoMdHeart className="icon liked" onClick={toggleLike} />
            ) : (
              <IoMdHeartEmpty className="icon" onClick={toggleLike} />
            )}
            <span className="like-count">{likeCount}</span>
          </div>
          {saved ? (
            <IoBookmark className="icon saved" onClick={toggleSave} />
          ) : (
            <IoBookmarkOutline className="icon" onClick={toggleSave} />
          )}
          <AiOutlineShareAlt className="icon" onClick={handleShowShareModal} />
          <div className="post-date">
            {formatDate(postDate)} &bull; {formatTime(postTime)}
          </div>
        </div>
        {expanded && (
          <div className="post-comments">
            <h3 className="comment-title">
              Comments{" "}
              <button
                className="add-comment-button"
                onClick={toggleNewCommentForm}
              >
                <MdOutlineAddComment />
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
                    {isValidDate(comment.commentDate)
                      ? `${formatDate(comment.commentDate)} at ${formatTime(
                          comment.commentTime
                        )}`
                      : "N/A"}
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
              onClick={() => handleShareToPlatform("whatsapp")}
            >
              <img className="youtube-icon" src={whatsapp} alt="Whatsapp" />
            </button>
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("reddit")}
            >
              <img className="reddit-icon" src={redditIcon} alt="Reddit" />
            </button>
            <button
              className="share-icon"
              onClick={() => handleShareToPlatform("twitter")}
            >
              <img className="x-icon" src={xIcon} alt="twitter" />
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
  postTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

export default PostCard;
