import React, { useState, useEffect } from "react";
import "../css/Carroussel.css";

const Carroussel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const cards = [
    {
      title: "À propos de moi",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      title: "Mon projet",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: "Mes compétences",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      title: "Mes objectifs",
      content:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  useEffect(() => {
    let timer;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  const getClassName = (index) => {
    const position = (index - currentIndex + cards.length) % cards.length;
    if (position === 0) return "card active";
    if (position === 1) return "card right";
    if (position === cards.length - 1) return "card left";
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
        {cards.map((card, index) => (
          <div key={index} className={getClassName(index)}>
            <div className="card-content">
              <h2>{card.title}</h2>
              <p>{card.content}</p>
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
