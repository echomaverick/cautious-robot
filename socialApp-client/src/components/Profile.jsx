import React, { useEffect, useState } from "react";
import axios from "axios";
import { createContext } from "react";
import { Container } from "react-bootstrap";
import ChatHistory from "./ChatHistory";
import ProfileHeader from "./ProfileHeader";
import loaderImage from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/src/assets/mona-loading-dark-7701a7b97370.gif";
import "../styles/profile.css";

export const ProfileContext = createContext(null);

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    fetchData();

    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      const profileDataCached = getCachedProfileData();
      if (profileDataCached) {
        setProfileData(profileDataCached);
      } else {
        const username = getUsernameFromToken();
        if (username) {
          const profileResponse = await axios.get(
            `${apiUrl}/users/info/${username}`
          );
          if (profileResponse.status === 200) {
            setProfileData(profileResponse.data);
            cacheProfileData(profileResponse.data);
          } else {
            console.error("Failed to fetch profile data");
          }
        } else {
          console.error("Token not found in localStorage or invalid");
        }
      }
      const userId = getUserIdFromToken();
      if (userId) {
        const followersFollowingResponse = await axios.get(
          `${apiUrl}/users/list/${userId}`
        );
        if (followersFollowingResponse.status === 200) {
          const { followerId, followingId } = followersFollowingResponse.data;
          const followersCount = followerId.length;
          const followingCount = followingId.length;
          setFollowersCount(followersCount);
          setFollowingCount(followingCount);
        } else {
          console.error("Failed to fetch followers and following counts");
        }
        const userPostsResponse = await axios.get(
          `${apiUrl}/posts/list/${userId}`
        );
        if (userPostsResponse.status === 200) {
          setPostsCount(userPostsResponse.data.length);
        } else {
          console.error("Failed to fetch user posts");
        }
      } else {
        console.error("Token not found in localStorage or invalid");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Something went wrong. Please try again later.");
    }
  };

  const cacheProfileData = (data) => {
    localStorage.setItem("cachedProfileData", JSON.stringify(data));
  };

  const getCachedProfileData = () => {
    const cachedProfileData = localStorage.getItem("cachedProfileData");
    return cachedProfileData ? JSON.parse(cachedProfileData) : null;
  };

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

  if (isLoading) {
    return (
      <div
        className="loader"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 900,
        }}
      >
        <img
          src={loaderImage}
          alt="Loading..."
          style={{
            width: 30,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <p
          className="loader-text"
          style={{
            fontSize: 12,
            position: "fixed",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          One moment, please...
        </p>
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={profileData}>
      <div className="profile-layout">
        <div className="menu">
          <ChatHistory />
        </div>
        <div className="main-content">
          <Container>
            {profileData ? (
              <ProfileHeader
                followers={followersCount}
                following={followingCount}
                posts={postsCount}
                profile={profileData}
              />
            ) : (
              <div className="profile-error">{error}</div>
            )}
          </Container>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
