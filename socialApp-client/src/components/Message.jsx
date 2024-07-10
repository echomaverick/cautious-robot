import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/user-cards.css";

const MessageComponent = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const ws = useRef(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;

  useEffect(() => {
    // WebSocket setup
    ws.current = new WebSocket(`${wsBaseUrl}/${senderId}/${receiverId}`);
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      ws.current.close();
    };
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      message: messageInput.trim(),
    };

    ws.current.send(JSON.stringify(messageData));

    axios
      .post(`${apiUrl}/message/${senderId}/${receiverId}`, messageData)
      .then((response) => {
        console.log("Message sent:", response.data);
        setMessages((prevMessages) => [...prevMessages, response.data]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    setMessageInput("");
  };

  return (
    <div className="message-component">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-item ${
              msg.sender_id === senderId ? "sent" : "received"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageComponent;
