import React, { useEffect, useState } from "react";
import "../css/TextWeatherPrediction.css";

const TextWeatherPrediction = () => {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fullText = `Notre prédicteur météorologique utilise l'intelligence artificielle pour prévoir la probabilité de pluie pour le lendemain.

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

Notre modèle est régulièrement mis à jour avec les dernières données météorologiques pour garantir des prédictions précises.`;

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
    if (isVisible) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div className="text-weather-container">
      <div className="text-content">
        {text.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextWeatherPrediction;
