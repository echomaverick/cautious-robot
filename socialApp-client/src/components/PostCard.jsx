// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import "../styles/post-card.css";
// import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp"; // Import default user icon image
// import { IoMdHeartEmpty } from "react-icons/io";
// import { AiOutlineComment } from "react-icons/ai";
// import { FaShareSquare } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const PostCard = ({
//   id,
//   title,
//   content,
//   commentsList: initialCommentsList,
//   postDate,
//   userId,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [showNewCommentForm, setShowNewCommentForm] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [user, setUser] = useState(null);
//   const [commentsList, setCommentsList] = useState(initialCommentsList);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/users/${userId}`
//         );
//         if (response.status === 200) {
//           setUser(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error.message);
//       }
//     };
//     fetchUserDetails();
//   }, [userId]);

//   const toggleComments = (e) => {
//     e.stopPropagation();
//     setExpanded(!expanded);
//   };

//   const toggleNewCommentForm = (e) => {
//     e.stopPropagation();
//     setShowNewCommentForm(!showNewCommentForm);
//   };

//   const handleCommentChange = (e) => {
//     setNewComment(e.target.value);
//   };

//   const getUserIdFromToken = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         return decodedToken.userId;
//       } catch (error) {
//         console.error("Error decoding token:", error.message);
//         return null;
//       }
//     }
//     return null;
//   };

//   const navigateToPost = () => {
//     navigate(`/posts/${id}`);
//   };

//   const navigateToAddComment = async () => {
//     const commenterId = getUserIdFromToken();
//     if (!commenterId) {
//       console.error("User not authenticated or token invalid.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:8080/api/posts/comments/create/${commenterId}/${id}`,
//         {
//           content: newComment,
//         }
//       );
//       if (response.status === 201) {
//         const {
//           id: commentId,
//           userId: commenterId,
//           content: commentContent,
//           commentDate,
//         } = response.data;
//         const newCommentObj = {
//           id: commentId,
//           userId: commenterId,
//           content: commentContent,
//           commentDate,
//         };
//         setCommentsList([newCommentObj, ...commentsList]);
//         setNewComment("");
//         setShowNewCommentForm(false);
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error.message);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     };
//     return new Date(dateString).toLocaleString("en-US", options);
//   };

//   return (
//     <div className="post-card">
//       <div className="post-header">
//         <Link to={`/users/${userId}`} onClick={(e) => e.stopPropagation()}>
//           <img
//             src={user ? user.profileImage || defaultUserIcon : defaultUserIcon}
//             alt="User Icon"
//             className="user-icon"
//           />
//         </Link>
//         <div className="post-header-text" onClick={navigateToPost}>
//           <h2>{title}</h2>
//         </div>
//       </div>
//       <div className="post-footer">
//         <div className="footer-icons">
//           <IoMdHeartEmpty
//             className="icon"
//             onClick={(e) => e.stopPropagation()}
//           />
//           <AiOutlineComment className="icon" onClick={toggleComments} />
//           <FaShareSquare
//             className="icon"
//             onClick={(e) => e.stopPropagation()}
//           />
//           {postDate && <div className="post-date">{formatDate(postDate)}</div>}
//         </div>
//         {expanded && (
//           <div className="post-comments">
//             <h3>Comments:</h3>
//             <ul className="comment-list">
//               {commentsList.map((comment) => (
//                 <li key={comment.id} className="comment-item">
//                   <strong>{comment.userId}</strong>: {comment.content}
//                   <br />
//                   <small>{formatDate(comment.commentDate)}</small>
//                 </li>
//               ))}
//             </ul>
//             {showNewCommentForm ? (
//               <div className="new-comment-form">
//                 <textarea
//                   value={newComment}
//                   onChange={handleCommentChange}
//                   placeholder="Write your comment..."
//                   rows={4}
//                   cols={50}
//                 />
//                 <button
//                   className="add-comment-button"
//                   onClick={navigateToAddComment}
//                 >
//                   Post Comment
//                 </button>
//               </div>
//             ) : (
//               <button
//                 className="add-comment-button"
//                 onClick={toggleNewCommentForm}
//               >
//                 Add Comment
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// PostCard.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   content: PropTypes.string.isRequired,
//   commentsList: PropTypes.array.isRequired,
//   postDate: PropTypes.string.isRequired,
//   userId: PropTypes.string.isRequired,
// };

// export default PostCard;













































import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/post-card.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultUserIcon from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp"; // Import default user icon image
import { IoMdHeartEmpty } from "react-icons/io";
import { BiRepost } from "react-icons/bi";
import { AiOutlineComment } from "react-icons/ai";
import { AiOutlineShareAlt } from "react-icons/ai";

const PostCard = ({
  id,
  title,
  content,
  commentsList: initialCommentsList,
  postDate,
  userId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [commentsList, setCommentsList] = useState(initialCommentsList);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
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
    // Update commentsList state with initialCommentsList when it changes
    setCommentsList(initialCommentsList);
  }, [initialCommentsList]);

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

    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/comments/create/${commenterId}/${id}`,
        {
          content: newComment,
        }
      );
      if (response.status === 201) {
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
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
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

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/users/${userId}`} onClick={(e) => e.stopPropagation()}>
          <img
            src={user ? user.profileImage || defaultUserIcon : defaultUserIcon}
            alt="User Icon"
            className="user-icon"
          />
        </Link>
        <div className="post-header-text" onClick={navigateToPost}>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="post-footer">
        <div className="footer-icons">
        <AiOutlineComment className="icon" onClick={toggleComments} />
          <IoMdHeartEmpty
            className="icon"
            onClick={(e) => e.stopPropagation()}
          />
          <BiRepost className="icon" />
          <AiOutlineShareAlt
            className="icon"
            onClick={(e) => e.stopPropagation()}
          />
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
            {showNewCommentForm ? (
              <div className="new-comment-form">
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write your comment..."
                  rows={4}
                  cols={50}
                />
                <button
                  className="add-comment-button"
                  onClick={navigateToAddComment}
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <button
                className="add-comment-button"
                onClick={toggleNewCommentForm}
              >
                Add Comment
              </button>
            )}
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
  userId: PropTypes.string.isRequired,
};

export default PostCard;
