import React, { useEffect, useState } from "react";
import "../css/TextHattack.css";

const TextHattack = () => {
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fullText = `Notre système d'évaluation des risques cardiaques utilise l'intelligence artificielle pour estimer la probabilité d'une crise cardiaque.

Comment ça marche ?

1. Renseignez vos données médicales :
   - Informations personnelles (âge, sexe)
   - Symptômes (type de douleur thoracique)
   - Mesures vitales (pression artérielle, fréquence cardiaque)
   - Résultats d'examens (ECG, cholestérol, glycémie)
   - Autres facteurs de risque

2. Notre algorithme analyse ces données en les comparant à une vaste base de cas cliniques
3. Vous recevez une évaluation personnalisée de votre risque cardiovasculaire

Vous pouvez utiliser le bouton "Générer des valeurs aléatoires" pour tester différents profils de patients.

IMPORTANT : Cette évaluation est fournie à titre informatif uniquement et ne remplace en aucun cas une consultation médicale professionnelle. En cas de symptômes inquiétants, consultez immédiatement un médecin.`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".text-heart-container");
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
    <div className="text-heart-container">
      <div className="text-content">
        {text.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextHattack;
