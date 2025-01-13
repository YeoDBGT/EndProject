import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Modal from "./Modal";
import "../css/PredictionForm.css";

// Configuration d'axios
const api = axios.create({
  baseURL: "http://147.93.52.112:5050",
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
    year: "",
    transmission: "Automatic",
    mileage: "",
    fuelType: "Petrol",
    engineSize: "",
  });

  // États pour les options : marques, modèles, prédiction et gestion des erreurs
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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

    // Vérification des champs obligatoires avec messages en français
    if (!formData.brand) {
      setError("Veuillez sélectionner une marque");
      return;
    }

    if (!formData.model) {
      setError("Veuillez sélectionner un modèle");
      return;
    }

    if (!formData.year) {
      setError("Veuillez saisir l'année du véhicule");
      return;
    }

    if (!formData.transmission) {
      setError("Veuillez sélectionner le type de transmission");
      return;
    }

    if (!formData.mileage) {
      setError("Veuillez saisir le kilométrage");
      return;
    }

    if (!formData.fuelType) {
      setError("Veuillez sélectionner le type de carburant");
      return;
    }

    if (!formData.engineSize) {
      setError("Veuillez saisir la taille du moteur");
      return;
    }

    // Validation des valeurs numériques
    const year = parseInt(formData.year);
    const engineSize = parseFloat(formData.engineSize);
    const mileage = parseInt(formData.mileage);
    const currentYear = new Date().getFullYear();

    if (year < 2000 || year > currentYear) {
      setError(`L'année doit être comprise entre 2000 et ${currentYear}`);
      return;
    }

    if (engineSize < 0.1 || engineSize > 10.0) {
      setError(
        "La taille du moteur doit être comprise entre 0,1 et 10,0 litres"
      );
      return;
    }

    if (mileage < 0) {
      setError("Le kilométrage doit être un nombre positif");
      return;
    }

    setLoading(true);
    setError(null);
    setShowLoader(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.post("/predict", {
        ...formData,
        brand: formData.brand?.value,
        model: formData.model?.value,
      });

      if (response.data.success) {
        setPrediction(response.data);
        setShowLoader(false);
        setIsModalOpen(true);
      } else {
        setError(
          "Une erreur est survenue lors de l'estimation. Veuillez réessayer."
        );
      }
    } catch (err) {
      console.error("Erreur lors de la prédiction :", err);
      setError(
        err.response?.data?.error ||
          "Une erreur est survenue lors de l'estimation. Veuillez vérifier vos données."
      );
      setPrediction(null);
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  // Gestion des changements de champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      // Autorise uniquement les chiffres
      if (value === "" || /^\d{0,4}$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "mileage") {
      // Autorise uniquement les chiffres
      if (value === "" || /^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "engineSize") {
      // Autorise les chiffres, le point et la virgule
      if (value === "" || /^\d*[.,]?\d*$/.test(value)) {
        // Remplace la virgule par un point si nécessaire
        const normalizedValue = value.replace(",", ".");
        setFormData((prev) => ({
          ...prev,
          [name]: normalizedValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const currentYear = new Date().getFullYear();

  const generateRandomValues = async () => {
    try {
      // Utiliser les marques déjà chargées dans l'état brands
      if (brands.length === 0) {
        setError("Veuillez attendre le chargement des marques");
        return;
      }

      // Sélection aléatoire d'une marque
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];

      // Charger les modèles pour cette marque
      const response = await api.get(`/api/models/${randomBrand.value}`);

      if (!response.data.success || !response.data.models.length) {
        setError("Erreur lors du chargement des modèles");
        return;
      }

      // Sélection aléatoire d'un modèle parmi ceux disponibles
      const availableModels = response.data.models.map((model) => ({
        label: model,
        value: model,
      }));
      const randomModel =
        availableModels[Math.floor(Math.random() * availableModels.length)];

      // Génération des autres valeurs aléatoires
      const randomData = {
        brand: randomBrand,
        model: randomModel,
        year: Math.floor(
          Math.random() * (currentYear - 2000) + 2000
        ).toString(),
        transmission: ["Automatic", "Manual", "Semi-Auto"][
          Math.floor(Math.random() * 3)
        ],
        mileage: Math.floor(Math.random() * 150000).toString(),
        fuelType: ["Petrol", "Diesel", "Hybrid", "Electric"][
          Math.floor(Math.random() * 4)
        ],
        engineSize: (Math.random() * (5.0 - 1.0) + 1.0).toFixed(1),
      };

      setFormData(randomData);
      setError("");
    } catch (err) {
      console.error(
        "Erreur lors de la génération des valeurs aléatoires:",
        err
      );
      setError("Erreur lors de la génération des valeurs aléatoires");
    }
  };

  return (
    <div className="prediction-form">
      <h2>Estimation du prix de votre véhicule</h2>
      <button
        type="button"
        onClick={generateRandomValues}
        className="random-button"
      >
        Générer des valeurs aléatoires
      </button>

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
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Ex: 2020 (entre 2000 et 2024)"
            title="Veuillez entrer une année entre 2000 et 2024"
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
            type="text"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Ex: 50000 (en miles)"
            title="Veuillez entrer un nombre valide pour le kilométrage"
            required
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
          <label className="engine-size-label">Taille du moteur (L):</label>
          <input
            type="text"
            name="engineSize"
            value={formData.engineSize}
            onChange={handleChange}
            placeholder="Ex: 2.0 (entre 0.1 et 10.0)"
            title="Veuillez entrer une taille de moteur valide (entre 0.1 et 10.0 L)"
            required
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

      <Modal
        isOpen={isModalOpen || showLoader}
        onClose={() => !showLoader && setIsModalOpen(false)}
      >
        {showLoader ? (
          <div className="loader-container">
            <img src="/car.gif" alt="Chargement..." className="loader-gif" />
            <p>Calcul du prix en cours...</p>
          </div>
        ) : (
          prediction && (
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
          )
        )}
      </Modal>
    </div>
  );
};

export default PredictionForm;
