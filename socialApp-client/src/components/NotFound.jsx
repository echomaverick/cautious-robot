import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Page Not Found</h2>
      <button
        className="back-home"
        onClick={handleBackHome}
        style={{
          backgroundColor: "lightgrey",
          color: "black",
          border: "none",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "11px",
          transition: "background-color 0.3s ease",
          marginTop: "20px",
          width: 150,
        }}
      >
        Go back Home
      </button>
    </div>
  );
};

export default NotFound;
