import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">
            End Project
          </Link>
        </div>

        <div className="spacer"></div>

        <div className="buttons">
          <Link
            to="/PricePrediction"
            className={`header-button ${
              location.pathname === "/PricePrediction" ? "active" : ""
            }`}
          >
            Cars Predictions
          </Link>
          <Link
            to="/WeatherPrediction"
            className={`header-button ${
              location.pathname === "/WeatherPrediction" ? "active" : ""
            }`}
          >
            Weather Prediction
          </Link>
          <Link
            to="/HeartAttackPrediction"
            className={`header-button ${
              location.pathname === "/HeartAttackPrediction" ? "active" : ""
            }`}
          >
            Heart Attack Prediction
          </Link>
          <Link
            to="/WinningSco"
            className={`header-button ${
              location.pathname === "/WinningSco" ? "active" : ""
            }`}
          >
            Student Grade Prediction
          </Link>
        </div>

        <div className="end-space"></div>
      </header>
      <div className="space1"></div>
    </>
  );
};

export default Header;
