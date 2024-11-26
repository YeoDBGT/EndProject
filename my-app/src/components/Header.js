import React from "react";
import { Link } from "react-router-dom"; // Import Link pour la navigation dynamique
import "../css/Header.css";

const Header = () => {
  return (
    <>
      <header className="header">
        {/* Logo redirige vers l'accueil */}
        <div className="logo">
          <Link to="/" className="logo-link">
            Logo
          </Link>
        </div>

        {/* Espace vide entre le logo et les boutons */}
        <div className="spacer"></div>

        {/* Boutons */}
        <div className="buttons">
          {/* Bouton 1 redirige dynamiquement sur /PricePrediction */}
          <Link to="/PricePrediction" className="header-button">
            Bouton 1
          </Link>
          <Link to="/WeatherPrediction" className="header-button">
            Bouton 2
          </Link>
          <button className="header-button">Bouton 3</button>
        </div>

        {/* Espace vide à droite */}
        <div className="end-space"></div>
      </header>
      <div className="space1"></div>
    </>
  );
};

export default Header;
