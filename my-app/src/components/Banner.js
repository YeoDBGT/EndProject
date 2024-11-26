import React from "react";
import "../css/Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      {/* Ciel avec cycle jour/nuit */}
      <div className="sky">
        <div className="sun"></div>
        <div className="moon"></div>
      </div>

      {/* Désert */}
      <div className="desert">
        {/* Cactus */}
        <img src="/cactus.png" alt="Cactus" className="cactus cactus-1" />
        <img src="/cactus.png" alt="Cactus" className="cactus cactus-2" />
        <img src="/cactus.png" alt="Cactus" className="cactus cactus-3" />

        {/* Robot */}
        <img src="/robot.gif" alt="Walking Robot" className="robot" />
      </div>
    </div>
  );
};

export default Banner;
