import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScript from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PostDetail from "./components/PostDetails";
import UserDetails from "./components/UserDetails";
import NotFound from "./components/NotFound";
import SavedPosts from "./components/SavedPosts";
import PremiumPage from "./components/PremiumPage";
import UserCard from "./components/MessageUserCard";

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginScript />} />

          <Route
            path="/home"
            element={
              isAuthenticated() ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/posts/:postId"
            element={
              isAuthenticated() ? (
                <PostDetail />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/users/:userId"
            element={
              isAuthenticated() ? (
                <UserDetails />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/bookmarks"
            element={
              isAuthenticated() ? (
                <SavedPosts />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/messages"
            element={
              isAuthenticated() ? (
                <UserCard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
