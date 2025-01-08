import React from "react";
import { Link } from "react-router-dom";
import "../css/BaseMod.css";

function BaseMod() {
  return (
    <div className="base-mod-container">
      <div className="moving-ball ball-1"></div>
      <div className="moving-ball ball-2"></div>
      <div className="moving-ball ball-3"></div>

      <div className="top-rectangles">
        <Link to="/PricePrediction" className="mod-rectangle">
          Prédiction de Prix
        </Link>
        <Link to="/WeatherPrediction" className="mod-rectangle">
          Prédiction Météo
        </Link>
      </div>
      <div className="bottom-rectangles">
        <Link to="/HeartAttackPrediction" className="mod-rectangle">
          Prédiction Cardiaque
        </Link>
        <Link to="/WinningSco" className="mod-rectangle">
          Prédiction Résultat étudiant
        </Link>
      </div>
    </div>
  );
}

export default BaseMod;
