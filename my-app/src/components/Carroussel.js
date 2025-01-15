import React, { useState, useEffect } from "react";
import "../css/Carroussel.css";

const Carroussel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      title: "Intelligence Artificielle & Machine Learning",
      content: "Notre plateforme utilise des modèles d'apprentissage automatique avancés (Random Forest, XGBoost, etc.) pour fournir des prédictions précises dans divers domaines. Ces algorithmes sont entraînés sur des ensembles de données soigneusement sélectionnés et validés."
    },
    {
      title: "Analyse Prédictive Multi-domaines",
      content: "De la prévision météorologique à l'estimation immobilière, en passant par l'analyse de risques cardiaques et la prédiction de performances académiques, nos modèles s'adaptent à différents contextes tout en maintenant un haut niveau de précision."
    },
    {
      title: "Technologies & Architecture",
      content: "Développé avec React et une architecture moderne, notre système combine une interface utilisateur intuitive avec des API REST robustes. L'infrastructure backend est optimisée pour traiter rapidement les requêtes et fournir des résultats en temps réel."
    }
  ];

  useEffect(() => {
    let timer;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const getClassName = (index) => {
    const position = (index - currentIndex + slides.length) % slides.length;
    if (position === 0) return "card active";
    if (position === 1) return "card right";
    if (position === slides.length - 1) return "card left";
    return "card hidden";
  };

  return (
    <div className="carousel-container">
      <button className="nav-button prev" onClick={handlePrev}>
        <svg viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div className="carousel">
        {slides.map((slide, index) => (
          <div key={index} className={getClassName(index)}>
            <div className="card-content">
              <h2>{slide.title}</h2>
              <p>{slide.content}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="nav-button next" onClick={handleNext}>
        <svg viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  );
};

export default Carroussel;
