import React, { useState } from "react";
import axios from "axios";
import "../css/WeatherPrediction.css";
import Modal from "./Modal";

const api = axios.create({
  baseURL: "https://endprojectdevia.xyz/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function WeatherPrediction() {
  const [prediction, setPrediction] = useState("");
  const [probability, setProbability] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    temperature_min: "10",
    temperature_max: "20",
    pluie: "0",
    humidite: "70",
    vent: "30",
    pluie_aujourdhui: "Non",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowLoader(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const apiData = {
        MinTemp: formData.temperature_min,
        MaxTemp: formData.temperature_max,
        Rainfall: formData.pluie,
        Humidity9am: formData.humidite,
        WindGustSpeed: formData.vent,
        RainToday: formData.pluie_aujourdhui === "Oui" ? "Yes" : "No",
        Evaporation: "5",
        Sunshine: "8",
        WindSpeed9am: "15",
        WindSpeed3pm: "20",
        Humidity3pm: "60",
        Pressure9am: "1015",
        Pressure3pm: "1010",
        Cloud9am: "5",
        Cloud3pm: "5",
        Temp9am: "15",
        Temp3pm: "19",
      };

      const response = await api.post("predict", apiData);

      if (response.data.success) {
        setPrediction(response.data.prediction);
        setProbability(response.data.probability);
        setError("");
        setShowLoader(false);
        setIsModalOpen(true);
      } else {
        setError("Erreur lors de la prédiction");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const generateRandomValues = () => {
    const randomData = {
      temperature_min: (Math.random() * (20 - -5) + -5).toFixed(1), // Entre -5°C et 20°C
      temperature_max: (Math.random() * (35 - 15) + 15).toFixed(1), // Entre 15°C et 35°C
      pluie: (Math.random() * 50).toFixed(1), // Entre 0 et 50mm
      humidite: Math.floor(Math.random() * (95 - 40) + 40), // Entre 40% et 95%
      vent: Math.floor(Math.random() * (100 - 5) + 5), // Entre 5 et 100 km/h
      pluie_aujourdhui: Math.random() > 0.5 ? "Oui" : "Non",
    };

    // Vérifier que la température max est supérieure à la température min
    if (
      parseFloat(randomData.temperature_max) <=
      parseFloat(randomData.temperature_min)
    ) {
      randomData.temperature_max = (
        parseFloat(randomData.temperature_min) + 5
      ).toFixed(1);
    }

    setFormData(randomData);
    setError("");
  };

  return (
    <div className="meteo-prediction">
      <h2>Prédiction Météo</h2>
      <button
        type="button"
        onClick={generateRandomValues}
        className="random-button"
      >
        Générer des valeurs aléatoires
      </button>
      {error && <div className="message-erreur">{error}</div>}

      <form onSubmit={handleSubmit} className="formulaire-meteo">
        <div className="grille-formulaire">
          <div className="groupe-form">
            <label>Température minimale (°C):</label>
            <input
              type="number"
              name="temperature_min"
              value={formData.temperature_min}
              onChange={handleChange}
              step="0.1"
            />
          </div>

          <div className="groupe-form">
            <label>Température maximale (°C):</label>
            <input
              type="number"
              name="temperature_max"
              value={formData.temperature_max}
              onChange={handleChange}
              step="0.1"
            />
          </div>

          <div className="groupe-form">
            <label>Pluie (mm):</label>
            <input
              type="number"
              name="pluie"
              value={formData.pluie}
              onChange={handleChange}
              step="0.1"
            />
          </div>

          <div className="groupe-form">
            <label>Humidité (%):</label>
            <input
              type="number"
              name="humidite"
              value={formData.humidite}
              onChange={handleChange}
              step="1"
            />
          </div>

          <div className="groupe-form">
            <label>Vitesse du vent (km/h):</label>
            <input
              type="number"
              name="vent"
              value={formData.vent}
              onChange={handleChange}
              step="1"
            />
          </div>

          <div className="groupe-form">
            <label>Pluie aujourd'hui:</label>
            <select
              name="pluie_aujourdhui"
              value={formData.pluie_aujourdhui}
              onChange={handleChange}
            >
              <option value="Non">Non</option>
              <option value="Oui">Oui</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`bouton-predire ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Calcul en cours..." : "Prédire"}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen || showLoader}
        onClose={() => !showLoader && setIsModalOpen(false)}
      >
        {showLoader ? (
          <div className="loader-container">
            <img
              src="/weather.gif"
              alt="Chargement..."
              className="loader-gif"
            />
            <p>Analyse météorologique en cours...</p>
          </div>
        ) : (
          <div className="resultat-prediction">
            <h3>Résultat :</h3>
            <p className="prediction">{prediction}</p>
            <p className="probabilite">Probabilité de pluie : {probability}%</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WeatherPrediction;
