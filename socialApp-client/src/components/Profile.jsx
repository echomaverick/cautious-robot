import React from "react";
import ChatHistory from "./ChatHistory";
import "../styles/profile.css";
import ProfileHeader from "./ProfileHeader";
import TabsSection from "./TabsSection";
import StoryHighlights from "./StoryHighlights";
import { PROFILE_DATA } from "/home/samuel/Documents/GitHub/cautious-robot/socialApp-client/data.js";
import { createContext } from "react";
import { Container } from "react-bootstrap";

export const ProfileContext = createContext(PROFILE_DATA);

const Profile = () => {
  return (
    <ProfileContext.Provider value={PROFILE_DATA}>
      <div className="profile-layout">
        <div className="menu">
          <ChatHistory />
        </div>
        <div className="main-content">
          <Container style={{ border: "none", marginTop: "-50px" }}>
            <ProfileHeader />
            <StoryHighlights />
            <TabsSection />
          </Container>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
