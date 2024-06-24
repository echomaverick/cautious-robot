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
import ComingSoon from "./components/ComingSoon";
import Profile from "./components/Profile";

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
          <Route path="*" element={<ComingSoon />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
