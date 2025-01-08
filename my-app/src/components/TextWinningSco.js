import React, { useEffect, useState } from "react";
import "../css/TextWinningSco.css";

const TextWinningSco = () => {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fullText = `Notre prédicteur de notes finales utilise l'intelligence artificielle pour estimer vos résultats scolaires.

Comment ça marche ?

1. Renseignez vos informations personnelles et scolaires :
   - Données démographiques (âge, sexe, lieu de résidence)
   - Environnement familial et éducatif
   - Habitudes d'étude et de vie
   - Notes précédentes (G1 et G2)

2. Notre algorithme analyse ces facteurs et leur impact sur la réussite scolaire
3. Vous recevez une estimation de votre note finale (G3) sur 20

Vous pouvez utiliser le bouton "Générer des valeurs aléatoires" pour tester différents profils d'étudiants.

Notre modèle est basé sur une analyse approfondie des parcours scolaires et des facteurs de réussite académique.

Note : Cette prédiction est fournie à titre indicatif et ne remplace pas le travail personnel et l'engagement dans les études.`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".text-winning-container");
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
    <div className="text-winning-container">
      <div className="text-content">
        {text.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextWinningSco;
