import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PredictionForm from "./components/PredictionForm";
import Header from "./components/Header";
import Banner from "./components/Banner";
import "./App.css";
import "./css/transitions.css"; // Fichier CSS pour les animations
import WeatherPrediction from "./components/WeatherPrediction";
import Carroussel from "./components/Carroussel";
import Footer from "./components/Footer";
import HeartAttackForm from "./components/Hattack";
function App() {
  const location = useLocation(); // Permet de détecter la route actuelle

  return (
    <div className="App">
      <Header />
      <Banner />
      <Carroussel />

      {/* Gestion des transitions entre les routes */}
      <TransitionGroup>
        <CSSTransition
          key={location.key} // Identifie chaque route par une clé unique
          classNames="fade" // Utilise les classes CSS pour les animations
          timeout={300} // Durée des animations
        >
          <Routes location={location}>
            {/* Page d'accueil */}
            {/* Page de prédiction */}
            <Route path="/PricePrediction" element={<PredictionForm />} />
            <Route path="/WeatherPrediction" element={<WeatherPrediction />} />
            <Route
              path="/HeartAttackPrediction"
              element={<HeartAttackForm />}
            />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  );
}

export default App;
