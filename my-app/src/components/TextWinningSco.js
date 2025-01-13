import React, { useEffect, useState } from "react";
import "../css/TextWinningSco.css";

const TextWinningSco = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const paragraphs = `Notre prédicteur de notes finales utilise l'intelligence artificielle pour estimer vos résultats scolaires.

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

Note : Cette prédiction est fournie à titre indicatif et ne remplace pas le travail personnel et l'engagement dans les études.`.split("\n\n");

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
    <div className="text-winning-container">
      <div className="text-content">
        {paragraphs.slice(0, visibleParagraphs).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextWinningSco;
