import React, { useContext } from "react";
import { Col, Row, Image } from "react-bootstrap";
import profileImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";

const ProfileHeader = ({ followers, following, posts, profile }) => {
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
        <span className="me-4" style={{ fontSize: ".8em" }}>
          <strong>{followers}</strong> followers
        </span>
        <span className="me-4" style={{ fontSize: ".8em" }}>
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
