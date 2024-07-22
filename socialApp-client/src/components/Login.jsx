import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/logo.png";
import "../styles/login.css";

const LoginScript = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const expirationTime = decodedToken.exp * 1000;

          if (Date.now() > expirationTime) {
            localStorage.removeItem("token");
            console.log("Token expired, user logged out");
          } else {
            navigate("/home");
          }
        } catch (error) {
          console.error("Error decoding token:", error.message);
        }
      }
    };

    checkTokenExpiration();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
      <div className="screen">
        <div className="half-screen">
          <img src={image} alt="" className="hello-image" />
        </div>
        <div className="container-sign">
          {error && <p className="error-message">{error}</p>}

          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            id="username"
            required
          />

          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            id="password"
            required
          />

          <button
            style={{
              backgroundColor: "#04aa6d",
              color: "white",
              padding: "16px 20px",
              margin: "8px 0",
              border: "none",
              cursor: "pointer",
              width: "100%",
              opacity: "0.9",
              borderRadius: "20px",
            }}
            type="submit"
          >
            Login
          </button>
          <p className="signup">
            Don't have an account? <a href="/register">Sign up</a>.
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginScript;
