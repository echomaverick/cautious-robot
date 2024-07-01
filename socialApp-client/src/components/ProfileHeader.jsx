import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import profileImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/depositphotos_137014128-stock-illustration-user-profile-icon.webp";
import "../styles/profile-header.css";

const ProfileHeader = ({ followers, following, posts, profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [linksInput, setLinksInput] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setBioInput(profile.bio);
      setTitleInput(profile.title);
      setLinksInput(profile.links);
    }
  }, [profile]);

  const handleShowModal = () => {
    setBioInput(profile.bio);
    setTitleInput(profile.title);
    setLinksInput(profile.links);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowPostModal = () => {
    fetchUserPosts();
    setShowPostModal(true);
  };
  const handleClosePostModal = () => setShowPostModal(false);

  // Function to handle updating profile
  const handleUpdateProfile = async () => {
    const username = getUsernameFromToken();
    if (!username) {
      console.error("Username not found in token.");
      return;
    }

    const updateData = {
      bio: bioInput,
      title: titleInput,
      links: linksInput,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/update/${username}`,
        updateData
      );
      if (response.status === 200) {
        console.log("Profile updated successfully.");
        handleCloseModal();
      } else {
        console.error("Failed to update profile.");
        setError("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setError("Error updating profile. Please try again later.");
    }
  };

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

  const fetchUserPosts = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("User ID not found in token.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/list/${userId}`
      );
      if (response.status === 200) {
        setUserPosts(response.data);
      } else {
        console.error("Failed to fetch posts.");
        setError("Failed to fetch posts.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setError("Error fetching posts. Please try again later.");
    }
  };

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.sub;
      } catch (error) {
        console.error("Error decoding token:", error.message);
        return null;
      }
    }
    return null;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "bio") {
      setBioInput(value);
    } else if (name === "title") {
      setTitleInput(value);
    }
  };

  const handleLinksChange = (event) => {
    const linksArray = event.target.value.split(",").map((link) => link.trim());
    setLinksInput(linksArray);
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

  if (!profile) {
    return <div style={{ marginTop: 150 }}>Loading profile...</div>;
  }

  return (
    <Row className="p-5 test">
      <Col md={4} className="test-again">
        <Image
          src={profileImage}
          style={{
            width: "100px",
            position: "relative",
            marginTop: 20,
            borderRadius: "100%",
          }}
          className="useri"
        />
      </Col>
      <Col md={7} className="colol">
        <span className="username-p">{username}</span>
        <div className="buttons-style">
          <Button className="light me-1 button-edit" onClick={handleShowModal}>
            Edit
          </Button>
          <Button
            variant="light me-2 button-posts"
            onClick={handleShowPostModal}
          >
            Posts
          </Button>
          <Button variant="light me-2 button-settings">
            <CiSettings />
          </Button>
        </div>
        <br />
        <br />
        <div className="following-followers">
          <span className="me-4" style={{ fontSize: 12 }}>
            <strong>1</strong> posts
          </span>
          <span
            className="me-4"
            onClick={handleFollowersClick}
            style={{ fontSize: 12 }}
          >
            <strong>{followers}</strong> followers
          </span>
          <span
            className="me-4"
            onClick={handleFollowingClick}
            style={{ fontSize: 12 }}
          >
            <strong>{following}</strong> following
          </span>
        </div>
        <br />
        <br />
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }} className="user-title">
            {title}
          </p>
          <p style={{ margin: 0 }} className="user-bio">
            {bio}
          </p>
          <div className="user-links">
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
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update your profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                name="bio"
                value={bioInput}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={titleInput}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLinks">
              <Form.Label>Links (comma separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="links"
                value={linksInput.join(", ")}
                onChange={handleLinksChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleUpdateProfile}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showPostModal} onHide={handleClosePostModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Posts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userPosts.length > 0 ? (
              <ul>
                {userPosts.map((post) => (
                  <li key={post.id}>{post.content}</li>
                ))}
              </ul>
            ) : (
              <p>No posts available</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePostModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
