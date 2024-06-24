import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/history.css";
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { TbPremiumRights } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { GiFeatheredWing } from "react-icons/gi";

const ChatHistory = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <div className={`history-div ${isOpen ? "open" : ""}`}>
        <div>
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
            <a href="/settings" className="history-link">
              <CiSettings className="icon" />
              <span>Settings</span>
            </a>
            <a className="history-link" onClick={handleLogout}>
              <CiLogout className="icon" />
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
