import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      if (response.status === 200) {
        setUser(response.data);
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
      const followersFollowingResponse = await axios.get(
        `http://localhost:8080/api/users/list/${userId}`
      );
      if (followersFollowingResponse.status === 200) {
        const { followerId, followingId } = followersFollowingResponse.data;
        const followersCount = followerId.length;
        const followingCount = followingId.length;
        setFollowersCount(followersCount);
        setFollowingCount(followingCount);
      } else {
        console.error("Failed to fetch followers and following counts");
      }
    }
  };

  const getServiceName = (url) => {
    if (url.includes("github.com")) {
      return "GitHub";
    } else if (url.includes("instagram.com")) {
      return "Instagram";
    } else {
      return "Unknown";
    }
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
              <Button className="light me-1 butt-edit"> Follow</Button>
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
              <p
                style={{ margin: 0, fontWeight: "bold" }}
                className="use-title"
              >
                {user.title}
              </p>
              <p style={{ margin: 0 }} className="user-bio">
                {user.bio}
              </p>
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
