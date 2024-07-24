import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { MdOutlineAddComment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import ChatHistory from "./ChatHistory";
import Modal from "react-bootstrap/Modal";
import loaderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/mona-loading-dark-7701a7b97370.gif";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import redditIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/reddit.png";
import whatsapp from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/whatsapp.png";
import xIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/twitter.jpg";
import facebookIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/faceboook.png";
import "../styles/post-details.css";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
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
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

  useEffect(() => {
    // Function to fetch the details of a specific post, including comments, like count, and whether the user has liked the post.
    const fetchPostDetails = async () => {
      try {
        setIsLoading(true); // Set loading state to true while fetching data.

        // Fetch post details based on the postId from the URL parameters.
        const postResponse = await axios.get(`${apiUrl}/posts/${postId}`);

        if (postResponse.status === 200) {
          const postData = postResponse.data;
          setPost(postData);

          // Set comments list and count from the fetched post data.
          const { commentsList } = postData;
          if (commentsList) {
            setCommentsList(commentsList);
            setCommentCount(commentsList.length);
          } else {
            setCommentsList([]);
            setCommentCount(0);
          }
        } else {
          setError("Failed to fetch post details");
        }

        // Fetch the like count for the post.
        const likeResponse = await axios.get(`${apiUrl}/likes/post/${postId}`);
        if (likeResponse.status === 200) {
          setLikeCount(likeResponse.data);
          console.log("Response data is coming: ", likeResponse);
        } else {
          console.error("Failed to fetch like count");
        }

        // Check if the current user has liked this post.
        const userIdFromToken = getUserIdFromToken();
        if (userIdFromToken) {
          const likedPostsResponse = await axios.get(
            `${apiUrl}/likes/${userIdFromToken}`
          );
          if (likedPostsResponse.status === 200) {
            const likedPosts = likedPostsResponse.data[0]?.postId || [];
            if (likedPosts.includes(postId)) {
              setLiked(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post details:", error.message);
        setError("Something went wrong. Please try again later.");
      } finally {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    fetchPostDetails();
  }, [apiUrl, postId]);

  // Retrieves the user ID from the JWT token stored in local storage.
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

  // Handles posting a new comment by the authenticated user.
  const navigateToAddComment = async () => {
    const commenterId = getUserIdFromToken();
    if (!commenterId) {
      console.error("User not authenticated or token invalid.");
      return;
    }

    // Prevent posting empty comments.
    if (newComment.trim() === "") {
      console.error("Empty comment cannot be posted.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/posts/comments/create/${commenterId}/${postId}`,
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
        // Update comments list and count.
        setCommentsList([newCommentObj, ...commentsList]);
        setCommentCount(commentCount + 1);
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  // Toggles the saved state of a post (save or unsave).
  const toggleSave = async (e) => {
    e.stopPropagation();
    const userIdFromToken = getUserIdFromToken();
    if (!userIdFromToken) {
      console.error("User not authenticated or token invalid.");
      return;
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

  // Toggles the like state of a post (like or unlike).
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

      // Update the like count after liking/unliking.
      const likeResponse = await axios.get(`${apiUrl}/likes/post/${postId}`);
      if (likeResponse.status === 200) {
        setLikeCount(likeResponse.data);
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  // Copies the post URL to the clipboard and updates the copied state.
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

  // Toggles the visibility of the new comment form.
  const toggleNewCommentForm = (e) => {
    e.stopPropagation();
    setShowNewCommentForm(!showNewCommentForm);
  };

  // Handles changes in the new comment input field.
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Shows and hides the modal for additional functionalities.
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Shows and hides the share modal for sharing the post.
  const handleShowShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  // Handles sharing the post to a selected platform and updates the share URL.
  const handleShareToPlatform = (platform) => {
    const postUrl = `http://localhost:5173/posts/${postId}`;
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
  // Checks if the given date is valid by attempting to parse it.
  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  // Formats the given post date to a more readable format (e.g., "Jul 19, 2024").
  const formatDate = (postDate) => {
    const date = new Date(postDate);
    return format(date, "MMM dd, yyyy");
  };

  // Formats the given post time to a "HH:MM" format.
  const formatTime = (postTime) => {
    const [timeString] = postTime.split(".");
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Error message display when there is an error.
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // Loader display while data is being fetched.
  if (isLoading) {
    return (
      <div
        className="loader"
        style={{
          marginTop: 10,
        }}
      >
        <img src={loaderImage} alt="Loading..." style={{ width: 30 }} />
      </div>
    );
  }

  return (
    <div>
      <ChatHistory />
      <div className="p-card">
        <div className="p-header">
          <div>
            <img
              src={
                user ? user.profileImage || defaultUserIcon : defaultUserIcon
              }
              alt="User Icon"
              className="user-icon"
            />
          </div>
          <div className="post-header-text">
            <h2>{post.title}</h2>
          </div>
        </div>
        <div className="post-footer">
          <div className="footer-icons">
            <div className="icon-wrapper">
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
            <AiOutlineShareAlt
              className="icon"
              onClick={handleShowShareModal}
            />
            <div className="post-date">
              {formatDate(post.postDate)} &bull; {formatTime(post.postTime)}
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
                        ? formatDate(comment.commentDate)
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
                <button
                  className="copy-url-button"
                  onClick={copyUrlToClipboard}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default PostDetail;
