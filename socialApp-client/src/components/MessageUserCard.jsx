import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageComponent from "../components/Message";
import "../styles/user-cards.css";

const UserCard = ({ user }) => {
  const [showMessageComponent, setShowMessageComponent] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("No token found or userId not present.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}/followers`
        );
        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [user]);

  const fetchUserDetails = async (followerId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${followerId}`
      );
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleMessageClick = (followerId) => {
    setReceiverId(followerId);
    fetchUserDetails(followerId);
    setShowMessageComponent(true);
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

  return (
    <div style={{ marginTop: 10 }}>
      <h4>Followers</h4>
      <div className="user-card">
        {user?.username && <h3>{user.username}</h3>}
        {user?.email && <p>Email: {user.email}</p>}
        {followers.length > 0 && (
          <div className="followers-list">
            <ul>
              {followers.map((follower) => (
                <li key={follower}>
                  <button
                    className="sheno"
                    onClick={() => handleMessageClick(follower)}
                  >
                    {follower} Message
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showMessageComponent && receiverId && selectedUser && (
          <div className="message-container">
            <MessageComponent
              senderId={getUserIdFromToken()}
              receiverId={receiverId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
