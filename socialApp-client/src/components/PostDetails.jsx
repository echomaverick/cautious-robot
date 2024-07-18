import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import youtubeIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/You-Tube-14.png";
import xIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/x.png";
import facebookIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/facebook.png";
import "../styles/post-details.css";

const CACHE_DURATION = 30 * 60 * 1000;

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

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${apiUrl}/posts/${postId}`);
        console.log("Post details response:", response.data);

        if (response.status === 200) {
          const postData = response.data;
          setPost(postData);

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

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const formatDate = (postDate) => {
    const date = new Date(postDate);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (postTime) => {
    const [timeString] = postTime.split(".");
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
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
        setCommentsList([newCommentObj, ...commentsList]);
        setCommentCount(commentCount + 1);
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

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

  const toggleNewCommentForm = (e) => {
    e.stopPropagation();
    setShowNewCommentForm(!showNewCommentForm);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
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

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (isLoading) {
    return (
      <div
        className="loader"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 190,
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
            {liked ? (
              <IoMdHeart className="icon liked" onClick={toggleLike} />
            ) : (
              <IoMdHeartEmpty className="icon" onClick={toggleLike} />
            )}
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
