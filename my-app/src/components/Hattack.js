import React, { useState } from "react";
import axios from "axios";
import "../css/Hattack.css";
import Modal from "./Modal";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

const HeartAttackForm = () => {
  const [formData, setFormData] = useState({
    age: "45",
    sex: "1",
    cp: "1",
    trtbps: "135",
    chol: "220",
    fbs: "0",
    restecg: "1",
    thalachh: "140",
    exng: "0",
    oldpeak: "1.2",
    slp: "1",
    caa: "1",
    thall: "2",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowLoader(true);
    setIsModalOpen(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.post("/predict-heart", formData);
      if (response.data.success) {
        setPrediction({
          result: response.data.prediction,
          probability: response.data.probability,
          message: response.data.message,
        });
      }
    } catch (err) {
      setError("Erreur lors de la prédiction. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="heart-attack-form">
      <h2>Prédiction de Risque Cardiaque</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Âge:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Sexe:</label>
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option value="1">Homme</option>
            <option value="0">Femme</option>
          </select>
        </div>

        <div className="form-group">
          <label>Type de douleur thoracique:</label>
          <select name="cp" value={formData.cp} onChange={handleChange}>
            <option value="0">Angine typique</option>
            <option value="1">Angine atypique</option>
            <option value="2">Douleur non-angineuse</option>
            <option value="3">Asymptomatique</option>
          </select>
        </div>

        <div className="form-group">
          <label>Pression artérielle au repos (mm Hg):</label>
          <input
            type="number"
            name="trtbps"
            value={formData.trtbps}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cholestérol (mg/dl):</label>
          <input
            type="number"
            name="chol"
            value={formData.chol}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Glycémie à jeun > 120 mg/dl:</label>
          <select name="fbs" value={formData.fbs} onChange={handleChange}>
            <option value="0">Non</option>
            <option value="1">Oui</option>
          </select>
        </div>

        <div className="form-group">
          <label>Résultats ECG au repos:</label>
          <select
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
          >
            <option value="0">Normal</option>
            <option value="1">Anomalie ST-T</option>
            <option value="2">Hypertrophie probable/définitive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fréquence cardiaque maximale:</label>
          <input
            type="number"
            name="thalachh"
            value={formData.thalachh}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Angine induite par l'exercice:</label>
          <select name="exng" value={formData.exng} onChange={handleChange}>
            <option value="0">Non</option>
            <option value="1">Oui</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dépression ST induite par l'exercice:</label>
          <input
            type="number"
            name="oldpeak"
            step="0.1"
            value={formData.oldpeak}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Pente du segment ST:</label>
          <select name="slp" value={formData.slp} onChange={handleChange}>
            <option value="0">Ascendante</option>
            <option value="1">Plate</option>
            <option value="2">Descendante</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nombre de vaisseaux majeurs:</label>
          <select name="caa" value={formData.caa} onChange={handleChange}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="form-group">
          <label>Thalassémie:</label>
          <select name="thall" value={formData.thall} onChange={handleChange}>
            <option value="0">Normal</option>
            <option value="1">Défaut fixe</option>
            <option value="2">Défaut réversible</option>
            <option value="3">Défaut réversible</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Analyse en cours..." : "Analyser le risque"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <Modal
        isOpen={isModalOpen || showLoader}
        onClose={() => !showLoader && setIsModalOpen(false)}
      >
        {showLoader ? (
          <div className="loader-container">
            <img
              src="/heart.gif"
              alt="Analyse en cours..."
              className="loader-gif"
            />
            <p>Analyse des risques en cours...</p>
          </div>
        ) : (
          prediction && (
            <div className="prediction-results">
              <h3>Résultats de l'analyse</h3>
              <div className="risk-container">
                <div className="risk-item">
                  <span className="label">Recommandation :</span>
                  <span className="value">
                    {prediction.result === 1
                      ? "Une consultation médicale est fortement recommandée pour évaluer votre santé cardiovasculaire."
                      : "Continuez à maintenir une bonne hygiène de vie et à suivre vos contrôles médicaux réguliers."}
                  </span>
                </div>
                <div className="risk-item">
                  <span className="label">Note importante :</span>
                  <span className="value">
                    Cette analyse est uniquement indicative et ne remplace en
                    aucun cas l'avis d'un professionnel de santé.
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default HeartAttackForm;
