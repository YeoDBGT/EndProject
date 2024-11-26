from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
import os
import logging

# Configuration du logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialiser le modèle et les transformateurs
model = None
le = LabelEncoder()
imputer = SimpleImputer(strategy='mean')

def load_weather_data():
    try:
        logger.info("Chargement du fichier de données météo...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, 'weatherAUS.csv')
        
        df = pd.read_csv(file_path)
        logger.info("Fichier météo chargé avec succès")
        return df
    
    except Exception as e:
        logger.error(f"Erreur lors du chargement des données météo : {str(e)}")
        raise

def init_model():
    try:
        global model, le, imputer
        logger.info("Initialisation du modèle...")
        
        # Charger les données
        df = load_weather_data()

        # Sélectionner les caractéristiques essentielles
        features = [
            'MinTemp', 'MaxTemp', 'Rainfall',
            'Humidity9am', 'WindGustSpeed', 'RainToday'
        ]

        # Préparer les données
        X = df[features]
        y = df['RainTomorrow']

        # Encoder RainToday et RainTomorrow
        X['RainToday'] = le.fit_transform(X['RainToday'].fillna('No'))
        y = le.fit_transform(y.fillna('No'))

        # Imputer les valeurs manquantes
        X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

        # Diviser les données
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Créer et entraîner le modèle
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        accuracy = model.score(X_test, y_test)
        logger.info(f"Modèle entraîné avec une précision de : {accuracy:.2f}")

        return model

    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation du modèle : {str(e)}")
        raise

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        logger.info(f"Données reçues pour prédiction : {data}")
        
        # Créer un dictionnaire avec les données reçues
        prediction_data = {
            'MinTemp': float(data['MinTemp']),
            'MaxTemp': float(data['MaxTemp']),
            'Rainfall': float(data['Rainfall']),
            'Humidity9am': float(data['Humidity9am']),
            'WindGustSpeed': float(data['WindGustSpeed']),
            'RainToday': data['RainToday']
        }
        
        # Préparer les données pour la prédiction
        input_data = pd.DataFrame([prediction_data])
        input_data['RainToday'] = le.transform(input_data['RainToday'].fillna('No'))
        input_data = pd.DataFrame(imputer.transform(input_data), columns=input_data.columns)
        
        # Faire la prédiction
        prediction = model.predict(input_data)
        probability = model.predict_proba(input_data)[0][1]
        
        # Préparer la réponse
        result = "Il pleuvra demain" if prediction[0] == 1 else "Il ne pleuvra pas demain"
        
        logger.info(f"Prédiction effectuée : {result} (probabilité : {probability:.2f})")
        
        return jsonify({
            'success': True,
            'prediction': result,
            'probability': f"{probability:.2f}"
        })
    
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    try:
        logger.info("Démarrage de l'application...")
        model = init_model()
        logger.info("L'application est prête et en cours d'exécution.")
        app.run(debug=True, port=5101)
    except Exception as e:
        logger.error(f"Erreur lors du démarrage : {str(e)}")
