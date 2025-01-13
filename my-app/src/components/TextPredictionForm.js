import React, { useEffect, useState } from "react";
import "../css/TextPredictionForm.css";

const TextPredictionForm = () => {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fullText = `Notre estimateur de prix de voitures d'occasion utilise l'intelligence artificielle pour vous fournir une estimation précise.

Comment ça marche ?

1. Sélectionnez la marque et le modèle de votre véhicule
2. Renseignez les caractéristiques : année, kilométrage, transmission...
3. Notre algorithme analyse ces données et les compare à notre base de données
4. Vous recevez instantanément une estimation en Livres Sterling et en Euros

Vous pouvez également utiliser le bouton "Générer des valeurs aléatoires" pour tester l'estimateur avec différentes configurations.

Notre modèle est régulièrement mis à jour pour garantir des estimations fiables et actuelles.`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".text-prediction-container");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isVisible) {
      interval = setInterval(() => {
        setText((prev) => {
          if (prev.length < fullText.length) {
            return fullText.slice(0, prev.length + 1);
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 10); // Vitesse de l'animation
    }

    return () => clearInterval(interval);
  }, [isVisible, fullText]);

  return (
    <div className="text-prediction-container">
      <div className="text-content">
        {text.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextPredictionForm;
