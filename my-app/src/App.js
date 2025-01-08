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
import BaseMod from "./components/BaseMod";
import StudentGradePrediction from "./components/WinningSco.js";
import TextPredictionForm from "./components/TextPredictionForm";
import TextWeatherPrediction from "./components/TextWeatherPrediction";
import TextWinningSco from "./components/TextWinningSco";
import TextHattack from "./components/TextHattack";

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
            <Route path="/" element={<BaseMod />} />
            <Route
              path="/PricePrediction"
              element={
                <>
                  <TextPredictionForm />
                  <PredictionForm />
                </>
              }
            />

            <Route
              path="/WeatherPrediction"
              element={
                <>
                  <TextWeatherPrediction />
                  <WeatherPrediction />
                </>
              }
            />
            <Route
              path="/HeartAttackPrediction"
              element={
                <>
                  <TextHattack />
                  <HeartAttackForm />
                </>
              }
            />
            <Route
              path="/WinningSco"
              element={
                <>
                  <TextWinningSco />
                  <StudentGradePrediction />
                </>
              }
            />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  );
}

export default App;
