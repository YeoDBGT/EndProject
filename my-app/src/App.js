import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PredictionForm from "./components/PredictionForm";
import Header from "./components/Header";
import Banner from "./components/Banner";
import "./App.css";
import "./css/transitions.css"; // Fichier CSS pour les animations

function App() {
  const location = useLocation(); // Permet de détecter la route actuelle

  return (
    <div className="App">
      <Header />
      <Banner />

      {/* Gestion des transitions entre les routes */}
      <TransitionGroup>
        <CSSTransition
          key={location.key} // Identifie chaque route par une clé unique
          classNames="fade" // Utilise les classes CSS pour les animations
          timeout={300} // Durée des animations
        >
          <Routes location={location}>
            {/* Page d'accueil */}
            <Route
              path="/"
              element={
                <h1 className="home-page">Bienvenue sur la page d'accueil !</h1>
              }
            />
            {/* Page de prédiction */}
            <Route path="/PricePrediction" element={<PredictionForm />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
