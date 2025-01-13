import React, { useState } from "react";
import axios from "axios";
import "../css/WinningSco.css";
import Modal from "./Modal";

// Configuration d'axios pour WinningSco
const api = axios.create({
  baseURL: "http://147.93.52.112:5054",
  headers: {
    "Content-Type": "application/json",
  },
});

function StudentGradePrediction() {
  const [formData, setFormData] = useState({
    sex: "",
    age: "",
    address: "",
    famsize: "",
    Pstatus: "",
    Medu: "",
    Fedu: "",
    Mjob: "",
    Fjob: "",
    reason: "",
    guardian: "",
    traveltime: "",
    studytime: "",
    failures: "",
    schoolsup: "",
    famsup: "",
    paid: "",
    activities: "",
    nursery: "",
    higher: "",
    internet: "",
    romantic: "",
    famrel: "",
    freetime: "",
    goout: "",
    Dalc: "",
    Walc: "",
    health: "",
    absences: "",
    G1: "",
    G2: "",
  });

  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const generateRandomValues = () => {
    const randomData = {
      sex: ["F", "M"][Math.floor(Math.random() * 2)],
      age: Math.floor(Math.random() * (22 - 15) + 15), // Entre 15 et 22 ans
      address: ["U", "R"][Math.floor(Math.random() * 2)],
      famsize: ["LE3", "GT3"][Math.floor(Math.random() * 2)],
      Pstatus: ["T", "A"][Math.floor(Math.random() * 2)],
      Medu: Math.floor(Math.random() * 5), // 0-4
      Fedu: Math.floor(Math.random() * 5), // 0-4
      Mjob: ["teacher", "health", "services", "at_home", "other"][
        Math.floor(Math.random() * 5)
      ],
      Fjob: ["teacher", "health", "services", "at_home", "other"][
        Math.floor(Math.random() * 5)
      ],
      reason: ["home", "reputation", "course", "other"][
        Math.floor(Math.random() * 4)
      ],
      guardian: ["mother", "father", "other"][Math.floor(Math.random() * 3)],
      traveltime: Math.floor(Math.random() * 4) + 1, // 1-4
      studytime: Math.floor(Math.random() * 4) + 1, // 1-4
      failures: Math.floor(Math.random() * 4), // 0-3
      schoolsup: ["yes", "no"][Math.floor(Math.random() * 2)],
      famsup: ["yes", "no"][Math.floor(Math.random() * 2)],
      paid: ["yes", "no"][Math.floor(Math.random() * 2)],
      activities: ["yes", "no"][Math.floor(Math.random() * 2)],
      nursery: ["yes", "no"][Math.floor(Math.random() * 2)],
      higher: ["yes", "no"][Math.floor(Math.random() * 2)],
      internet: ["yes", "no"][Math.floor(Math.random() * 2)],
      romantic: ["yes", "no"][Math.floor(Math.random() * 2)],
      famrel: Math.floor(Math.random() * 5) + 1, // 1-5
      freetime: Math.floor(Math.random() * 5) + 1, // 1-5
      goout: Math.floor(Math.random() * 5) + 1, // 1-5
      Dalc: Math.floor(Math.random() * 5) + 1, // 1-5
      Walc: Math.floor(Math.random() * 5) + 1, // 1-5
      health: Math.floor(Math.random() * 5) + 1, // 1-5
      absences: Math.floor(Math.random() * 93), // 0-93
      G1: Math.floor(Math.random() * 21), // 0-20
      G2: Math.floor(Math.random() * 21), // 0-20
    };

    setFormData(randomData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Liste des champs numériques
    const numericFields = [
      "age",
      "Medu",
      "Fedu",
      "traveltime",
      "studytime",
      "failures",
      "famrel",
      "freetime",
      "goout",
      "Dalc",
      "Walc",
      "health",
      "absences",
      "G1",
      "G2",
    ];

    // Conversion des valeurs numériques
    const newValue = numericFields.includes(name) ? Number(value) : value;

    setFormData({ ...formData, [name]: newValue });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowLoader(true);
    setIsModalOpen(true);

    try {
      // Ajouter un délai artificiel de 2 secondes
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.post("/predict-study-alcohol", formData);

      if (response.data.success) {
        setPrediction(response.data.predicted_grade);
      } else {
        setError(response.data.error || "Erreur de prédiction");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err.response || err);
      setError("Erreur lors de la communication avec le serveur.");
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  return (
    <div className="student-grade-prediction">
      <h2>Prédiction de la Note Finale (G3) de l'Étudiant</h2>
      <button
        type="button"
        onClick={generateRandomValues}
        className="random-button"
      >
        Générer des valeurs aléatoires
      </button>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Exemple pour le champ Sexe */}
        <div className="form-group">
          <label>Sexe:</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            title="Sélectionnez le sexe de l'étudiant"
          >
            <option value="">Sélectionnez le sexe</option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
          <small className="form-text">
            Indiquez le sexe de l'étudiant (F pour Femme, M pour Homme).
          </small>
        </div>

        {/* Âge */}
        <div className="form-group">
          <label>Âge:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="15"
            max="22"
            placeholder=" "
            title="Âge de l'étudiant (15 à 22 ans)"
          />
          <small className="form-text">
            Entrez l'âge de l'étudiant entre 15 et 22 ans.
          </small>
        </div>

        {/* Adresse */}
        <div className="form-group">
          <label>Adresse:</label>
          <select
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            title="Sélectionnez l'adresse de l'étudiant"
          >
            <option value="">Sélectionnez l'adresse</option>
            <option value="U">Urbain</option>
            <option value="R">Rural</option>
          </select>
          <small className="form-text">U pour Urbain, R pour Rural.</small>
        </div>

        {/* Taille de la famille */}
        <div className="form-group">
          <label>Taille de la famille:</label>
          <select
            name="famsize"
            value={formData.famsize}
            onChange={handleChange}
            required
            title="Sélectionnez la taille de la famille de l'étudiant"
          >
            <option value="">Sélectionnez la taille de la famille</option>
            <option value="LE3">≤ 3</option>
            <option value="GT3">> 3</option>
          </select>
          <small className="form-text">
            LE3 pour 3 ou moins, GT3 pour plus de 3.
          </small>
        </div>

        {/* Statut des parents */}
        <div className="form-group">
          <label>Statut des parents:</label>
          <select
            name="Pstatus"
            value={formData.Pstatus}
            onChange={handleChange}
            required
            title="Indiquez si les parents vivent ensemble ou séparément"
          >
            <option value="">Sélectionnez le statut des parents</option>
            <option value="T">Vit ensemble</option>
            <option value="A">Vit séparément</option>
          </select>
          <small className="form-text">
            T pour vit ensemble (Together), A pour vit séparément (Apart).
          </small>
        </div>

        {/* Niveau d'éducation de la mère */}
        <div className="form-group">
          <label>Niveau d'éducation de la mère:</label>
          <select
            name="Medu"
            value={formData.Medu}
            onChange={handleChange}
            required
            title="Sélectionnez le niveau d'éducation de la mère"
          >
            <option value="">Sélectionnez le niveau</option>
            <option value="0">Aucun</option>
            <option value="1">Lycée</option>
            <option value="2">Licence</option>
            <option value="3">Master</option>
            <option value="4">Doctorat</option>
          </select>
          <small className="form-text">
            0: Aucun, 1: Lycée, 2: Licence, 3: Master, 4: Doctorat.
          </small>
        </div>

        {/* Niveau d'éducation du père */}
        <div className="form-group">
          <label>Niveau d'éducation du père:</label>
          <select
            name="Fedu"
            value={formData.Fedu}
            onChange={handleChange}
            required
            title="Sélectionnez le niveau d'éducation du père"
          >
            <option value="">Sélectionnez le niveau</option>
            <option value="0">Aucun</option>
            <option value="1">Lycée</option>
            <option value="2">Licence</option>
            <option value="3">Master</option>
            <option value="4">Doctorat</option>
          </select>
          <small className="form-text">
            0: Aucun, 1: Lycée, 2: Licence, 3: Master, 4: Doctorat.
          </small>
        </div>

        {/* Gardien */}
        <div className="form-group">
          <label>Tuteur légal:</label>
          <select
            name="guardian"
            value={formData.guardian}
            onChange={handleChange}
            required
            title="Indiquez qui est le tuteur légal principal de l'étudiant"
          >
            <option value="">Sélectionnez le tuteur légal</option>
            <option value="mother">Mère</option>
            <option value="father">Père</option>
            <option value="other">Autre</option>
          </select>
          <small className="form-text">Mère, Père ou Autre.</small>
        </div>

        {/* Temps de trajet */}
        <div className="form-group">
          <label>Temps de trajet (en minutes):</label>
          <input
            type="number"
            name="traveltime"
            value={formData.traveltime}
            onChange={handleChange}
            required
            min="1"
            max="4"
            placeholder=" "
            title="Temps de trajet quotidien de l'étudiant en minutes (1: <15 min, 2: 15-30 min, 3: 30-60 min, 4: >60 min)"
          />
          <small className="form-text">
            1: &lt;15 min, 2: 15-30 min, 3: 30-60 min, 4: &gt;60 min.
          </small>
        </div>

        {/* Temps d'étude */}
        <div className="form-group">
          <label>Temps d'étude (en heures par semaine):</label>
          <input
            type="number"
            name="studytime"
            value={formData.studytime}
            onChange={handleChange}
            required
            min="1"
            max="4"
            placeholder=" "
            title="Nombre d'heures d'étude par semaine (1: <2 heures, 2: 2-5 heures, 3: 5-10 heures, 4: >10 heures)"
          />
          <small className="form-text">
            1: &lt;2 heures, 2: 2-5 heures, 3: 5-10 heures, 4: &gt;10 heures.
          </small>
        </div>

        {/* Échecs */}
        <div className="form-group">
          <label>Nombre d'échecs:</label>
          <input
            type="number"
            name="failures"
            value={formData.failures}
            onChange={handleChange}
            required
            min="0"
            max="3"
            placeholder=" "
            title="Nombre de fois que l'étudiant a échoué une matière (0 à 3)"
          />
          <small className="form-text">Entre 0 et 3 échecs.</small>
        </div>

        {/* Soutien scolaire */}
        <div className="form-group">
          <label>Soutien scolaire:</label>
          <select
            name="schoolsup"
            value={formData.schoolsup}
            onChange={handleChange}
            required
            title="Avez-vous un soutien scolaire?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Soutien familial */}
        <div className="form-group">
          <label>Soutien familial:</label>
          <select
            name="famsup"
            value={formData.famsup}
            onChange={handleChange}
            required
            title="Avez-vous un soutien familial?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Paiement des cours de soutien */}
        <div className="form-group">
          <label>Paiement des cours de soutien:</label>
          <select
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            required
            title="L'étudiant paie-t-il pour des cours de soutien?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Activités extra-scolaires */}
        <div className="form-group">
          <label>Activités extra-scolaires:</label>
          <select
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            required
            title="L'étudiant participe-t-il à des activités extra-scolaires?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Nursery */}
        <div className="form-group">
          <label>Nursery:</label>
          <select
            name="nursery"
            value={formData.nursery}
            onChange={handleChange}
            required
            title="L'étudiant a-t-il fréquenté une nursery?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Higher Education */}
        <div className="form-group">
          <label>Niveau d'éducation supérieur:</label>
          <select
            name="higher"
            value={formData.higher}
            onChange={handleChange}
            required
            title="L'étudiant cherche-t-il à obtenir un diplôme supérieur?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Internet */}
        <div className="form-group">
          <label>Internet:</label>
          <select
            name="internet"
            value={formData.internet}
            onChange={handleChange}
            required
            title="L'étudiant a-t-il accès à Internet?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Romantic */}
        <div className="form-group">
          <label>Romantique:</label>
          <select
            name="romantic"
            value={formData.romantic}
            onChange={handleChange}
            required
            title="L'étudiant est-il en couple romantique?"
          >
            <option value="">Sélectionnez</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
          <small className="form-text">Oui ou Non.</small>
        </div>

        {/* Relations familiales */}
        <div className="form-group">
          <label>Relations familiales:</label>
          <input
            type="number"
            name="famrel"
            value={formData.famrel}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="Qualité des relations familiales (1: Très faible, 5: Très élevée)"
          />
          <small className="form-text">
            Évaluez la qualité des relations familiales entre 1 (Très faible) et
            5 (Très élevée).
          </small>
        </div>

        {/* Temps libre */}
        <div className="form-group">
          <label>Temps libre:</label>
          <input
            type="number"
            name="freetime"
            value={formData.freetime}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="Temps libre disponible pour l'étudiant (1: Très peu, 5: Beaucoup)"
          />
          <small className="form-text">
            Évaluez le temps libre disponible entre 1 (Très peu) et 5
            (Beaucoup).
          </small>
        </div>

        {/* Sorties */}
        <div className="form-group">
          <label>Sorties:</label>
          <input
            type="number"
            name="goout"
            value={formData.goout}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="Fréquence des sorties (1: Rarement, 5: Très souvent)"
          />
          <small className="form-text">
            Fréquence des sorties entre 1 (Rarement) et 5 (Très souvent).
          </small>
        </div>

        {/* Consommation d'alcool en semaine */}
        <div className="form-group">
          <label>Consommation d'alcool en semaine (1-5):</label>
          <input
            type="number"
            name="Dalc"
            value={formData.Dalc}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="Fréquence de consommation d'alcool en semaine (1: Rarement, 5: Très souvent)"
          />
          <small className="form-text">1: Rarement, 5: Très souvent.</small>
        </div>

        {/* Consommation d'alcool le weekend */}
        <div className="form-group">
          <label>Consommation d'alcool le weekend (1-5):</label>
          <input
            type="number"
            name="Walc"
            value={formData.Walc}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="Fréquence de consommation d'alcool le weekend (1: Rarement, 5: Très souvent)"
          />
          <small className="form-text">1: Rarement, 5: Très souvent.</small>
        </div>

        {/* Santé */}
        <div className="form-group">
          <label>Santé:</label>
          <input
            type="number"
            name="health"
            value={formData.health}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder=" "
            title="État de santé général de l'étudiant (1: Très mauvais, 5: Excellent)"
          />
          <small className="form-text">1: Très mauvais, 5: Excellent.</small>
        </div>

        {/* Absences */}
        <div className="form-group">
          <label>Nombre d'absences:</label>
          <input
            type="number"
            name="absences"
            value={formData.absences}
            onChange={handleChange}
            required
            min="0"
            placeholder=" "
            title="Nombre total d'absences de l'étudiant"
          />
          <small className="form-text">
            Entrez le nombre total d'absences (0 et plus).
          </small>
        </div>

        {/* G1 */}
        <div className="form-group">
          <label>Note G1:</label>
          <input
            type="number"
            name="G1"
            value={formData.G1}
            onChange={handleChange}
            required
            min="0"
            max="20"
            placeholder=" "
            title="Première note (G1) de l'étudiant (entre 0 et 20)"
          />
          <small className="form-text">
            Entrez la première note obtenue (0 à 20).
          </small>
        </div>

        {/* G2 */}
        <div className="form-group">
          <label>Note G2:</label>
          <input
            type="number"
            name="G2"
            value={formData.G2}
            onChange={handleChange}
            required
            min="0"
            max="20"
            placeholder=" "
            title="Deuxième note (G2) de l'étudiant (entre 0 et 20)"
          />
          <small className="form-text">
            Entrez la deuxième note obtenue (0 à 20).
          </small>
        </div>

        {/* Bouton de soumission */}
        <button type="submit" disabled={loading}>
          {loading ? "Prédiction en cours..." : "Prédire"}
        </button>
      </form>

      {/* Modal pour afficher la prédiction */}
      <Modal
        isOpen={isModalOpen || showLoader}
        onClose={() => !showLoader && setIsModalOpen(false)}
      >
        {showLoader ? (
          <div className="loader-container">
            <img
              src="/winningsco.gif"
              alt="Prédiction en cours..."
              className="loader-gif"
            />
            <p>Analyse des résultats en cours...</p>
          </div>
        ) : (
          <div className="prediction-result">
            <h3>Résultat de la Prédiction :</h3>
            <p className="predicted-grade">
              Note Finale (G3) : {prediction}/20
            </p>
            <small className="prediction-scale">
              La note est évaluée sur une échelle de 0 à 20, comme les notes
              précédentes (G1 et G2).
            </small>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default StudentGradePrediction;
