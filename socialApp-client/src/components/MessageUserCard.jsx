import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageComponent from "../components/Message";
import { MdMessage } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../styles/user-cards.css";

const UserCard = ({ user }) => {
  const [showMessageComponent, setShowMessageComponent] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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
    const fetchFollowers = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No token found or userId not present.");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/users/list/${userId}`);
        const followerIds = response.data?.followerId || [];

        if (followerIds.length > 0) {
          const followersData = await Promise.all(
            followerIds.map(async (followerId) => {
              const followerResponse = await axios.get(
                `${apiUrl}/users/${followerId}`
              );
              return followerResponse.data;
            })
          );
          setFollowers(followersData);
        } else {
          setFollowers([]);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [user]);

  const handleMessageClick = (follower) => {
    if (showMessageComponent && receiverId === follower.id) {
      setShowMessageComponent(false);
      setReceiverId(null);
      setSelectedUser(null);
    } else {
      setReceiverId(follower.id);
      setSelectedUser(follower);
      setShowMessageComponent(true);
    }
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

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div className="user-card">
        <h4>
          {" "}
          <IoIosArrowRoundBack
            className="back-icon1"
            onClick={handleBackHome}
            style={{
              backgroundColor: "lightgrey",
              borderRadius: "50%",
              width: 30,
              height: 30,
              gap: 20,
              transition: "background-color 0.3s ease",
              marginRight: 10,
            }}
          />
          Followers
        </h4>
        {user?.username && <h3>{user.username}</h3>}
        {user?.email && <p>Email: {user.email}</p>}
        {followers.length > 0 ? (
          <div className="followers-list">
            <ul>
              {followers.map((follower) => (
                <li key={follower.id}>
                  {follower.username}
                  <button
                    className="sheno"
                    onClick={() => handleMessageClick(follower)}
                  >
                    <MdMessage />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No followers yet. Follow people to start chatting!</p>
        )}
      </div>
      <div
        className={`message-container ${showMessageComponent ? "open" : ""}`}
      >
        {showMessageComponent && receiverId && selectedUser && (
          <MessageComponent
            senderId={getUserIdFromToken()}
            receiverId={receiverId}
          />
        )}
      </div>
    </div>
  );
};

export default UserCard;
