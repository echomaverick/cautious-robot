import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { TbPremiumRights } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import { GiFeatheredWing } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import loaderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/mona-loading-dark-7701a7b97370.gif";
import "../styles/history.css";

const ChatHistory = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setMessage("");
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        let response;
        if (searchQuery.includes(" ")) {
          const [name, surname] = searchQuery.split(" ");
          response = await axios.get(
            `${apiUrl}/search/users?name=${name}&surname=${surname}`
          );
        } else {
          response = await axios.get(
            `${apiUrl}/search/users?username=${searchQuery}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (response.data.length === 0) {
          setMessage(
            `Didn't find anything for "${searchQuery}". Try another search.`
          );
        } else {
          setSearchResults(response.data);
        }
      }
    } catch (error) {
      console.error("Error searching users", error);
      setMessage("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchResults([]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProfileRedirect = (userId) => {
    if (userId === getUserIdFromToken()) {
      navigate("/profile");
    } else {
      navigate(`/users/${userId}`);
    }
  };

  return (
    <>
      <div className={`history-div ${isOpen ? "open" : ""}`}>
        <div className="history-div-2" style={{ height: "100vh" }}>
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
            <a className="history-link" onClick={handleShowModal}>
              <CiSearch className="icon" />
              <span>Search</span>
            </a>
            <a href="/bookmarks" className="history-link">
              <IoBookmarkOutline className="icon" />
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
            <a className="history-link" onClick={handleLogout}>
              <CiLogout className="icon" />
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </a>
          </div>
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Search Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="searchForm">
              <Form.Control
                type="text"
                placeholder="Enter username or name and surname"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
            {searchResults.length > 0 && (
              <ul className="user-lists">
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <a href="#" onClick={() => handleProfileRedirect(user.id)}>
                      {user.username}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {searchResults.length === 0 && !loading && <p>{message}</p>}
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <img
                    src={loaderImage}
                    style={{ width: 30, marginRight: 10 }}
                    alt="Loading..."
                  />{" "}
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ChatHistory;
