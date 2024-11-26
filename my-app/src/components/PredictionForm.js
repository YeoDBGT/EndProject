import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

// Configuration d'axios
const api = axios.create({
  baseURL: "http://localhost:5050",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const PredictionForm = () => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    brand: null,
    model: null,
    year: 2020,
    transmission: "Automatic",
    mileage: 50000,
    fuelType: "Petrol",
    engineSize: 2.0,
  });

  // États pour les options : marques, modèles, prédiction et gestion des erreurs
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les marques au montage
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/api/brands");
        if (response.data.success) {
          setBrands(
            response.data.brands.map((brand) => ({
              label: brand,
              value: brand,
            }))
          );
        } else {
          setError("Erreur lors du chargement des marques.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des marques :", err);
        setError("Erreur lors du chargement des marques.");
      }
    };

    fetchBrands();
  }, []);

  // Charger les modèles lorsque la marque change
  useEffect(() => {
    if (!formData.brand) {
      setModels([]); // Réinitialiser les modèles si aucune marque n'est sélectionnée
      return;
    }

    const fetchModels = async () => {
      try {
        const response = await api.get(`/api/models/${formData.brand.value}`);
        if (response.data.success) {
          setModels(
            response.data.models.map((model) => ({
              label: model,
              value: model,
            }))
          );
        } else {
          setError("Erreur lors du chargement des modèles.");
          setModels([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des modèles :", err);
        setError("Erreur lors du chargement des modèles.");
        setModels([]);
      }
    };

    fetchModels();
  }, [formData.brand]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Réinitialiser les erreurs

    try {
      const response = await api.post("/predict", {
        ...formData,
        brand: formData.brand?.value,
        model: formData.model?.value,
      });

      if (response.data.success) {
        setPrediction(response.data);
      } else {
        setError(
          "Erreur lors de la prédiction. Veuillez vérifier vos données."
        );
      }
    } catch (err) {
      console.error("Erreur lors de la prédiction :", err);
      setError(
        err.response?.data?.error ||
          "Une erreur est survenue lors de la prédiction. Veuillez vérifier vos données."
      );
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des changements de champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "year" || name === "mileage") {
      processedValue = parseInt(value) || 0;
    } else if (name === "engineSize") {
      processedValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div className="prediction-form">
      <h2>Estimation du prix de votre véhicule</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Marque:</label>
          <Select
            options={brands}
            value={formData.brand}
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                brand: selectedOption,
                model: null, // Réinitialiser le modèle lorsqu'une nouvelle marque est choisie
              }))
            }
            placeholder="Sélectionnez une marque"
            isClearable
          />
        </div>

        <div className="form-group">
          <label>Modèle:</label>
          <Select
            options={models}
            value={formData.model}
            onChange={(selectedOption) =>
              setFormData((prev) => ({ ...prev, model: selectedOption }))
            }
            placeholder="Sélectionnez un modèle"
            isClearable
            isDisabled={!formData.brand} // Désactiver si aucune marque n'est sélectionnée
          />
        </div>

        <div className="form-group">
          <label>Année:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div className="form-group">
          <label>Transmission:</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez une transmission</option>
            <option value="Automatic">Automatique</option>
            <option value="Manual">Manuelle</option>
            <option value="Semi-Auto">Semi-automatique</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kilométrage:</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            min="0"
            required
            placeholder="En miles"
          />
        </div>

        <div className="form-group">
          <label>Type de carburant:</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un carburant</option>
            <option value="Petrol">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybride</option>
            <option value="Electric">Électrique</option>
          </select>
        </div>

        <div className="form-group">
          <label>Taille du moteur (L):</label>
          <input
            type="number"
            name="engineSize"
            step="0.1"
            value={formData.engineSize}
            onChange={handleChange}
            min="0.1"
            max="10.0"
            required
            placeholder="Ex: 2.0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Calcul en cours..." : "Estimer le prix"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {prediction && (
        <div className="prediction-results">
          <h3>Estimation du prix</h3>
          <div className="price-container">
            <div className="price-item">
              <span className="label">Prix en Livres (£):</span>
              <span className="value">
                £
                {prediction.predicted_price.toLocaleString("fr-FR", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="price-item">
              <span className="label">Prix en Euros (€):</span>
              <span className="value">
                €
                {prediction.predicted_price_euros.toLocaleString("fr-FR", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
