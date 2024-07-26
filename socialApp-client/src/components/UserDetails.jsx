import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Col, Row, Image } from "react-bootstrap";
import ChatHistory from "./ChatHistory";
import Button from "react-bootstrap/Button";
import profileImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import "../styles/user-details.css";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
    fetchUserDetails();
    checkIfFollowing();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${userId}`);
      if (response.status === 200) {
        setUser(response.data);
        fetchUserFollowers();
        fetchUserFollowing();
      } else {
        setError("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setError("Something went wrong. Please try again later.");
    }
  };

  const fetchUserFollowers = async () => {
    if (userId) {
      try {
        const response = await axios.get(`${apiUrl}/users/${userId}/followers`);
        if (response.status === 200) {
          const followersCount = response.data.length;
          setFollowersCount(followersCount);
        } else {
          console.error("Failed to fetch followers count");
        }
      } catch (error) {
        console.error("Error fetching followers:", error.message);
      }
    }
  };

  const fetchUserFollowing = async () => {
    if (userId) {
      try {
        const response = await axios.get(`${apiUrl}/users/${userId}/following`);
        if (response.status === 200) {
          const followingCount = response.data.length;
          setFollowingCount(followingCount);
        } else {
          console.error("Failed to fetch following count");
        }
      } catch (error) {
        console.error("Error fetching following:", error.message);
      }
    }
  };

  const checkIfFollowing = async () => {
    const loggedInUserId = getUserIdFromToken();
    if (loggedInUserId && userId) {
      try {
        const response = await axios.get(
          `${apiUrl}/users/${loggedInUserId}/following`
        );
        if (response.status === 200) {
          const isFollowing = response.data.includes(userId);
          setIsFollowing(isFollowing);
        } else {
          console.error("Failed to check following status");
        }
      } catch (error) {
        console.error("Error checking following status:", error.message);
      }
    }
  };

  const handleFollowToggle = async () => {
    const loggedInUserId = getUserIdFromToken();
    if (loggedInUserId && userId) {
      try {
        const apiEndpoint = isFollowing
          ? `${apiUrl}/users/${loggedInUserId}/unfollow/${userId}`
          : `${apiUrl}/users/follow/${loggedInUserId}/follow/${userId}`;

        const response = await axios.post(apiEndpoint);
        if (response.status === 200) {
          setIsFollowing(!isFollowing);
          fetchUserFollowers();
        } else {
          console.error("Failed to update follow status");
        }
      } catch (error) {
        console.error("Error updating follow status:", error.message);
      }
    }
  };

  const getServiceName = (url) => {
    const trustedDomains = [
      "github.com",
      "instagram.com",
      "twitter.com",
      "youtube.com",
      "linkedin.com",
      "facebook.com",
      "reddit.com",
    ];

    if (!url.startsWith("https://")) {
      return "Not allowed";
    }

    const domain = new URL(url).hostname;
    const matchedDomain = trustedDomains.find((domain) => url.includes(domain));
    return matchedDomain || "Unknown";
  };

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <ChatHistory />
      {user && (
        <Row className="p-5 again">
          <Col md={4} className="again-again">
            <Image
              src={profileImage}
              style={{
                width: "100px",
                position: "relative",
                marginTop: 20,
                borderRadius: "100%",
              }}
              className="userimg"
            />
          </Col>
          <Col md={7} className="colo">
            <div className="butt-style">
              <span className="usernam-p">{user.username}</span>
              <Button
                className={`light me-1 butt-edit ${
                  isFollowing ? "following" : "follow"
                }`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <br />
            <br />
            <div className="followfollowers">
              <span className="me-4" style={{ fontSize: 12 }}>
                <strong>1</strong> posts
              </span>
              <span className="me-4" style={{ fontSize: 12 }}>
                <strong>{followersCount}</strong> followers
              </span>
              <span className="me-4" style={{ fontSize: 12 }}>
                <strong>{followingCount}</strong> following
              </span>
            </div>
            <br />
            <br />
            <div>
              <p style={{ fontWeight: "bold" }} className="use-title">
                {user.title}
              </p>
              <p className="user-bio">{user.bio}</p>
              <div className="use-links">
                {user.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: "10px" }}
                  >
                    {getServiceName(link)}
                  </a>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default UserDetail;
