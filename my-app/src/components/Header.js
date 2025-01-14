import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/" className="logo-link">
            End Project
          </Link>
        </div>

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

        <div className="theme-switch-wrapper">
          <div className="theme-switch">
            <input
              type="checkbox"
              id="theme-toggle"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label htmlFor="theme-toggle" className="theme-label">
              <FaSun className="sun-icon" />
              <FaMoon className="moon-icon" />
              <span className="switch-handle"></span>
            </label>
          </div>
        </div>
      </header>
      <div className="space1"></div>
    </>
  );
};

export default Header;
