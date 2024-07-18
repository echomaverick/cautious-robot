import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../assets/ri.gif";
import "../styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/users/register`, formData);
      if (response.status === 200) {
        alert("User registered successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div id="main">
      <div className="screen">
        <div className="half-screen">
          <img src={image} alt="" className="hello-image" />
        </div>
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="container-sign">
            <p className="fill">
              Please fill in this form to create an account.
            </p>
            <hr />

            {error && <p className="error-message">{error}</p>}

            <label htmlFor="name">
              <b>Name</b>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="username">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            <hr />
            <p>
              By creating an account you agree to our
              <Link to="/terms"> Terms & Privacy</Link>.
            </p>

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
              Register
            </button>
            <p className="signin">
              Already have an account? <Link to="/login">Sign in</Link>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
