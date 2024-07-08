import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const MessageComponent = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // WebSocket setup
    ws.current = new WebSocket(
      `ws://localhost:5130/ws/chat/${senderId}/${receiverId}`
    );
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");

    // WebSocket message handler
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsTyping(false); // Assuming you don't need typing indicator from WebSocket
    };

    return () => {
      ws.current.close();
    };
  }, [senderId, receiverId]);

  // Function to send a message
  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const messageData = {
      sender_id: senderId,
      receiver_id: receiverId,
      message: messageInput.trim(),
    };

    // Sending message via WebSocket
    ws.current.send(JSON.stringify(messageData));

    // Posting message to API
    axios
      .post(
        `http://localhost:8080/api/message/${senderId}/${receiverId}`,
        messageData
      )
      .then((response) => {
        console.log("Message sent:", response.data);
        // Optionally, update UI with sent message if needed
        setMessages((prevMessages) => [...prevMessages, response.data]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    setMessageInput("");
  };

  return (
    <div>
      <div>
        {/* Render messages */}
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender_id}: </strong>
            {msg.message}
          </div>
        ))}
        {/* Typing indicator */}
        {isTyping && (
          <div>
            <em>{receiverId} is typing...</em>
          </div>
        )}
      </div>
      {/* Message input and send button */}
      <div>
        <input
          type="text"
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
