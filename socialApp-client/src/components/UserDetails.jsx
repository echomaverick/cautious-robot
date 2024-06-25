import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setError("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setError("Something went wrong. Please try again later.");
    }
  };

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    user && (
      <div>
        <h1>{user.name}</h1>
        <p>{user.surname}</p>
        <p>{user.title}</p>
        <p>{user.bio}</p>
        <div>
          <h3>Links:</h3>
          <ul>
            {user.links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default UserDetail;
