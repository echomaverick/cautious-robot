import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

import "../styles/premium.css";

const PremiumPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        return Date.now() < expirationTime;
      } catch (error) {
        console.error("Error decoding token: ", error.message);
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="premium-page">
      <div className="background">
        <button className="back-button" onClick={handleBackHome}>
          <IoIosArrowRoundBack className="back-icon" />
        </button>
        <h1 className="-plan-title" style={{ top: 10 }}>
          Choose the best plan for you
        </h1>
        <div className="container">
          <div className="panel pricing-table">
            <div className="pricing-plan">
              <img
                src="https://s28.postimg.cc/ju5bnc3x9/plane.png"
                alt=""
                className="pricing-img"
              />
              <h2 className="pricing-header">Pro</h2>
              <ul className="pricing-features">
                <li className="pricing-features-item">Never sleeps</li>
                <li className="pricing-features-item">
                  Multiple workers for more powerful apps
                </li>
              </ul>
              <span className="pricing-price">$150</span>
              <a href="#/" className="pricing-button is-featured">
                Free trial
              </a>
            </div>

            <div className="pricing-plan">
              <img
                src="https://s21.postimg.cc/tpm0cge4n/space-ship.png"
                alt=""
                className="pricing-img"
              />
              <h2 className="pricing-header">Enterprise</h2>
              <ul className="pricing-features">
                <li className="pricing-features-item">Dedicated</li>
                <li className="pricing-features-item">
                  Simple horizontal scalability
                </li>
              </ul>
              <span className="pricing-price">$400</span>
              <a href="#/" className="pricing-button">
                Free trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
