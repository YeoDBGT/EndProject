import React, { useEffect, useState } from "react";
import "../css/TextWeatherPrediction.css";

const TextWeatherPrediction = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const paragraphs = `Notre prédicteur météorologique utilise l'intelligence artificielle pour prévoir la probabilité de pluie pour le lendemain.

Comment ça marche ?

1. Entrez les données météorologiques actuelles :
   - Températures minimales et maximales
   - Quantité de pluie
   - Taux d'humidité
   - Vitesse du vent
   - Présence de pluie aujourd'hui

2. Notre algorithme analyse ces paramètres et les compare avec notre base de données historique
3. Vous recevez instantanément une prédiction pour le lendemain avec la probabilité de pluie

Vous pouvez utiliser le bouton "Générer des valeurs aléatoires" pour tester le prédicteur avec différentes conditions météorologiques.

Notre modèle est régulièrement mis à jour avec les dernières données météorologiques pour garantir des prédictions précises.`.split("\n\n");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".text-weather-container");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isVisible) {
      interval = setInterval(() => {
        setVisibleParagraphs((prev) => {
          if (prev < paragraphs.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 500); // Interval ajusté pour une apparition par paragraphe
    }

    return () => clearInterval(interval);
  }, [isVisible, paragraphs.length]);

  return (
    <div className="text-weather-container">
      <div className="text-content">
        {paragraphs.slice(0, visibleParagraphs).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextWeatherPrediction;
