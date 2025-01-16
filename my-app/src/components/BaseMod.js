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
        <Link to="/carsprice" className="mod-rectangle">
          Prédiction de Prix
        </Link>
        <Link to="/weather" className="mod-rectangle">
          Prédiction Météo
        </Link>
      </div>
      <div className="bottom-rectangles">
        <Link to="/heartattack" className="mod-rectangle">
          Prédiction Cardiaque
        </Link>
        <Link to="/student" className="mod-rectangle">
          Prédiction Résultat étudiant
        </Link>
      </div>
    </div>
  );
}

export default BaseMod;
