import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/history.css";
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { TbPremiumRights } from "react-icons/tb";
import Button from "react-bootstrap/Button";

const ChatHistory = () => {
  return (
    <div className="history-div">
      <div>
        <h1
          className="history_chat_name"
          style={{ fontSize: 30, marginTop: 25 }}
        >
          TateGram
        </h1>
        <div className="history-links">
          <a href="/home" className="history-link">
            <GoHome /> Home
          </a>
          <a href="/profile" className="history-link">
            <IoPersonCircleOutline /> Profile
          </a>
          <a href="/bookmarks" className="history-link">
            <CiSaveDown1 /> Bookmarks
          </a>
          <a href="/messages" className="history-link">
            <AiOutlineMessage /> Messages
          </a>
          <a href="/premium" className="history-link">
            <TbPremiumRights /> Premium
          </a>
        </div>
      </div>
      <Button
        style={{
          padding: 10,
          borderRadius: 20,
          position: "fixed",
          bottom: "50px",
          transform: "translateX(-50%)",
          zIndex: "1000",
          width: "150px",
          backgroundColor: "white",
          border: "none",
          color: "black",
        }}
        href="/settings"
      >
        Settings
      </Button>
    </div>
  );
};

export default ChatHistory;
