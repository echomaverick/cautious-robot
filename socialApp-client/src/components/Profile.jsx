import React, { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import "../styles/profile.css";
import ProfileHeader from "./ProfileHeader";
import { createContext } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
export const ProfileContext = createContext(null);

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const username = getUsernameFromToken();
      if (username) {
        const profileResponse = await axios.get(
          `http://localhost:8080/api/users/info/${username}`
        );
        if (profileResponse.status === 200) {
          setProfileData(profileResponse.data);
        } else {
          console.error("Failed to fetch profile data");
        }
      } else {
        console.error("Token not found in localStorage or invalid");
      }

      const userId = getUserIdFromToken();
      if (userId) {
        const followersFollowingResponse = await axios.get(
          `http://localhost:8080/api/users/list/${userId}`
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
          `http://localhost:8080/api/posts/list/${userId}`
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
      console.error("Error fetching data:", error);
    }
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

  return (
    <ProfileContext.Provider value={profileData}>
      <div className="profile-layout">
        <div className="menu">
          <ChatHistory />
        </div>
        <div className="main-content">
          <Container style={{ border: "none", marginTop: "-50px" }}>
            {profileData ? (
              <ProfileHeader
                followers={followersCount}
                following={followingCount}
                posts={postsCount}
                profile={profileData}
              />
            ) : (
              <div>Loading profile...</div>
            )}
          </Container>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
