import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { TbPremiumRights } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { GiFeatheredWing } from "react-icons/gi";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../styles/history.css";

const ChatHistory = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  // Function to get username from token
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Function to handle updating profile
  const handleUpdateProfile = async () => {
    const username = getUsernameFromToken();
    if (!username) {
      console.error("Username not found in token.");
      return;
    }

    const updateData = {
      bio: bio,
      title: title,
      links: links,
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "bio") {
      setBio(value);
    } else if (name === "title") {
      setTitle(value);
    }
  };

  const handleLinksChange = (event) => {
    const linksArray = event.target.value.split(",").map((link) => link.trim());
    setLinks(linksArray);
  };

  return (
    <>
      <div className={`history-div ${isOpen ? "open" : ""}`}>
        <div className="history-div-2" style={{height: "100vh"}}>
          <a
            className="history_chat_name"
            style={{ fontSize: 30, marginTop: 25 }}
            href="/home"
          >
            <GiFeatheredWing style={{ color: "black" }} />
          </a>
          <div className="history-links">
            <a href="/home" className="history-link">
              <GoHome className="icon" />
              <span>Home</span>
            </a>
            <a href="/profile" className="history-link">
              <IoPersonCircleOutline className="icon" />
              <span>Profile</span>
            </a>
            <a href="/bookmarks" className="history-link">
              <CiSaveDown1 className="icon" />
              <span>Bookmarks</span>
            </a>
            <a href="/messages" className="history-link">
              <AiOutlineMessage className="icon" />
              <span>Messages</span>
            </a>
            <a href="/premium" className="history-link">
              <TbPremiumRights className="icon" />
              <span>Premium</span>
            </a>
            <a className="history-link">
              <CiSettings className="icon" onClick={handleShowModal} />
              <span>Settings</span>
            </a>
            <a className="history-link" onClick={handleLogout}>
              <CiLogout className="icon" />
              <span>Logout</span>
            </a>
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
                    value={bio}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formLinks">
                  <Form.Label>Links (comma separated)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="links"
                    value={links.join(", ")}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
