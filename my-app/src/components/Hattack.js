import React, { useState } from "react";
import axios from "axios";
import "../css/Hattack.css";
import Modal from "./Modal";

const api = axios.create({
  baseURL: "https://endprojectdevia.xyz",
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

  const generateRandomValues = () => {
    const randomData = {
      age: Math.floor(Math.random() * (85 - 25) + 25), // Entre 25 et 85 ans
      sex: Math.floor(Math.random() * 2), // 0 ou 1
      cp: Math.floor(Math.random() * 4), // 0-3
      trtbps: Math.floor(Math.random() * (200 - 90) + 90), // Entre 90 et 200
      chol: Math.floor(Math.random() * (600 - 100) + 100), // Entre 100 et 600
      fbs: Math.floor(Math.random() * 2), // 0 ou 1
      restecg: Math.floor(Math.random() * 3), // 0-2
      thalachh: Math.floor(Math.random() * (220 - 70) + 70), // Entre 70 et 220
      exng: Math.floor(Math.random() * 2), // 0 ou 1
      oldpeak: Number((Math.random() * 6.2).toFixed(1)), // Entre 0.0 et 6.2
      slp: Math.floor(Math.random() * 3), // 0-2
      caa: Math.floor(Math.random() * 5), // 0-4
      thall: Math.floor(Math.random() * 4), // 0-3
    };

    setFormData(randomData);
  };

  return (
    <div className="heart-attack-form">
      <h2>Prédiction de Crise Cardiaque</h2>
      <button
        type="button"
        onClick={generateRandomValues}
        className="random-button"
      >
        Générer des valeurs aléatoires
      </button>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Âge:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="25"
            max="85"
            title="Âge du patient (entre 25 et 85 ans)"
          />
          <small className="form-text">
            Entrez votre âge (entre 25 et 85 ans).
          </small>
        </div>

        <div className="form-group">
          <label>Sexe:</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            title="Genre du patient"
          >
            <option value="1">Homme</option>
            <option value="0">Femme</option>
          </select>
          <small className="form-text">Sélectionnez votre genre.</small>
        </div>

        <div className="form-group">
          <label>Type de douleur thoracique:</label>
          <select
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            title="Type de douleur ressentie dans la poitrine"
          >
            <option value="0">Angine typique</option>
            <option value="1">Angine atypique</option>
            <option value="2">Douleur non-angineuse</option>
            <option value="3">Asymptomatique</option>
          </select>
          <small className="form-text">
            L'angine est une douleur thoracique causée par une diminution de
            l'apport en oxygène au cœur.
          </small>
        </div>

        <div className="form-group">
          <label>Pression artérielle au repos (mm Hg):</label>
          <input
            type="number"
            name="trtbps"
            value={formData.trtbps}
            onChange={handleChange}
            required
            min="90"
            max="200"
            title="Pression artérielle mesurée au repos"
          />
          <small className="form-text">
            Valeur normale : entre 90 et 120. Au-delà de 140, on parle
            d'hypertension.
          </small>
        </div>

        <div className="form-group">
          <label>Cholestérol (mg/dl):</label>
          <input
            type="number"
            name="chol"
            value={formData.chol}
            onChange={handleChange}
            required
            min="100"
            max="600"
            title="Taux de cholestérol sanguin"
          />
          <small className="form-text">
            Taux normal : moins de 200. Entre 200 et 239 : limite haute. Au-delà
            de 240 : élevé.
          </small>
        </div>

        <div className="form-group">
          <label>Glycémie à jeun &gt; 120 mg/dl:</label>
          <select
            name="fbs"
            value={formData.fbs}
            onChange={handleChange}
            title="Niveau de sucre dans le sang à jeun"
          >
            <option value="0">Non</option>
            <option value="1">Oui</option>
          </select>
          <small className="form-text">
            Indique si votre glycémie à jeun est supérieure à 120 mg/dl. Une
            valeur élevée peut indiquer un diabète.
          </small>
        </div>

        <div className="form-group">
          <label>Résultats ECG au repos:</label>
          <select
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
            title="Résultats de l'électrocardiogramme au repos"
          >
            <option value="0">Normal</option>
            <option value="1">Anomalie ST-T</option>
            <option value="2">Hypertrophie probable/définitive</option>
          </select>
          <small className="form-text">
            L'ECG est un test qui enregistre l'activité électrique du cœur. Les
            anomalies ST-T peuvent indiquer des problèmes de circulation
            sanguine.
          </small>
        </div>

        <div className="form-group">
          <label>Fréquence cardiaque maximale:</label>
          <input
            type="number"
            name="thalachh"
            value={formData.thalachh}
            onChange={handleChange}
            required
            min="70"
            max="220"
            title="Fréquence cardiaque maximale atteinte"
          />
          <small className="form-text">
            La fréquence maximale théorique est de 220 moins votre âge. Une
            valeur normale se situe entre 120 et 200.
          </small>
        </div>

        <div className="form-group">
          <label>Angine induite par l'exercice:</label>
          <select
            name="exng"
            value={formData.exng}
            onChange={handleChange}
            title="Présence de douleur thoracique pendant l'effort"
          >
            <option value="0">Non</option>
            <option value="1">Oui</option>
          </select>
          <small className="form-text">
            Indique si vous ressentez une douleur thoracique (angine) pendant
            l'effort physique.
          </small>
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
            min="0"
            max="6.2"
            title="Dépression du segment ST sur l'ECG"
          />
          <small className="form-text">
            Mesure de la dépression du segment ST sur l'ECG pendant l'effort.
            Une valeur élevée peut indiquer une ischémie cardiaque.
          </small>
        </div>

        <div className="form-group">
          <label>Pente du segment ST:</label>
          <select
            name="slp"
            value={formData.slp}
            onChange={handleChange}
            title="Pente du segment ST pendant l'exercice"
          >
            <option value="0">Ascendante</option>
            <option value="1">Plate</option>
            <option value="2">Descendante</option>
          </select>
          <small className="form-text">
            La pente du segment ST sur l'ECG pendant l'effort. Une pente
            descendante est généralement considérée comme plus préoccupante.
          </small>
        </div>

        <div className="form-group">
          <label>Nombre de vaisseaux majeurs:</label>
          <select
            name="caa"
            value={formData.caa}
            onChange={handleChange}
            title="Nombre de vaisseaux sanguins majeurs colorés par fluoroscopie"
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <small className="form-text">
            Nombre de vaisseaux coronaires majeurs présentant un rétrécissement
            significatif (Inférieur à 50%). Plus le nombre est élevé, plus le risque est
            important.
          </small>
        </div>

        <div className="form-group">
          <label>Thalassémie:</label>
          <select
            name="thall"
            value={formData.thall}
            onChange={handleChange}
            title="Résultat du test de thalassémie"
          >
            <option value="0">Normal</option>
            <option value="1">Défaut fixe</option>
            <option value="2">Défaut réversible</option>
            <option value="3">Défaut réversible</option>
          </select>
          <small className="form-text">
            Résultat de la scintigraphie cardiaque. Un défaut réversible indique
            une zone du cœur qui manque d'oxygène pendant l'effort mais récupère
            au repos.
          </small>
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
