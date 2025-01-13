import React, { useEffect, useState } from "react";
import "../css/TextHattack.css";

const TextHattack = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const paragraphs = `Notre système d'évaluation des risques cardiaques utilise l'intelligence artificielle pour estimer la probabilité d'une crise cardiaque.

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

IMPORTANT : Cette évaluation est fournie à titre informatif uniquement et ne remplace en aucun cas une consultation médicale professionnelle. En cas de symptômes inquiétants, consultez immédiatement un médecin.`.split("\n\n");

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
    <div className="text-heart-container">
      <div className="text-content">
        {paragraphs.slice(0, visibleParagraphs).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default TextHattack;
