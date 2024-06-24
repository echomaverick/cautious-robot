import React, { useContext } from "react";
import { Col, Row, Image } from "react-bootstrap";
import profileImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ followers, following, posts, profile }) => {
  const navigate = useNavigate();
  if (!profile) {
    return <div style={{ marginTop: 150 }}>Loading profile...</div>;
  }

  const { username, title, bio, links } = profile;

  const getServiceName = (url) => {
    if (url.includes("github.com")) {
      return "GitHub";
    } else if (url.includes("instagram.com")) {
      return "Instagram";
    } else {
      return "Unknown";
    }
  };

  const handleFollowersClick = () => {
    const userId = getUserIdFromToken();
    navigate(`http://localhost:8080/api/users/${userId}/followers`);
  };

  const handleFollowingClick = () => {
    const userId = getUserIdFromToken();
    navigate(`http://localhost:8080/api/users/${userId}/following`);
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
    <Row className="p-5">
      <Col md={3} className="d-flex align-items-center justify-content-center">
        <Image
          src={profileImage}
          roundedCircle
          style={{ width: "150px", marginTop: 13 }}
        />
      </Col>
      <Col md={9}>
        <span className="me-4" style={{ fontSize: "20px" }}>
          {username}
        </span>

        <br />
        <br />
        <span className="me-4" style={{ fontSize: ".8em" }}>
          <strong>1</strong> posts
        </span>
        <span
          className="me-4"
          style={{ fontSize: ".8em" }}
          onClick={handleFollowersClick}
        >
          <strong>{followers}</strong> followers
        </span>
        <span
          className="me-4"
          style={{ fontSize: ".8em" }}
          onClick={handleFollowingClick}
        >
          <strong>{following}</strong> following
        </span>
        <br />
        <br />
        <p style={{ margin: 0, fontWeight: "bold" }}>{title}</p>
        <p style={{ margin: 0 }}>{bio}</p>
        <div>
          {links.map((link, index) => (
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
      </Col>
    </Row>
  );
};

export default ProfileHeader;
