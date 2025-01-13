from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.tree import DecisionTreeClassifier
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://147.93.52.112", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

model = None
scaler = MinMaxScaler()

def load_data():
    try:
        logger.info("Chargement des fichiers de données...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Charger les données cardiaques
        heart_path = os.path.join(current_dir, 'heart.csv')
        heart_df = pd.read_csv(heart_path)
        
        # Charger les données de saturation en oxygène
        o2_path = os.path.join(current_dir, 'o2Saturation.csv')
        o2_df = pd.read_csv(o2_path, header=None, names=['o2_saturation'])
        
        # Ajuster la taille des données O2 à celle des données cardiaques
        o2_data = o2_df['o2_saturation'].iloc[:len(heart_df)]
        heart_df['o2_saturation'] = o2_data
        
        logger.info("Fichiers chargés avec succès")
        return heart_df
    
    except Exception as e:
        logger.error(f"Erreur lors du chargement des données : {str(e)}")
        raise

def init_model():
    try:
        global model, scaler
        logger.info("Initialisation du modèle...")
        
        df = load_data()
        
        features = [
            'age', 'sex', 'cp', 'trtbps', 'chol', 'fbs', 
            'restecg', 'thalachh', 'exng', 'oldpeak', 
            'slp', 'caa', 'thall', 'o2_saturation'
        ]

        X = df[features].copy()
        y = df['output']

        # Normalisation avec MinMaxScaler
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(X)

        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.3, random_state=42, stratify=y
        )

        # Configuration du modèle Decision Tree
        model = DecisionTreeClassifier(random_state=42)

        # Ajustement du modèle
        model.fit(X_train, y_train)

        return model

    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation du modèle : {str(e)}")
        raise

@app.route('/predict-heart', methods=['POST'])
def predict():
    try:
        data = request.json
        
        input_data = pd.DataFrame({
            'age': [float(data['age'])],
            'sex': [float(data['sex'])],
            'cp': [float(data['cp'])],
            'trtbps': [float(data['trtbps'])],
            'chol': [float(data['chol'])],
            'fbs': [float(data['fbs'])],
            'restecg': [float(data['restecg'])],
            'thalachh': [float(data['thalachh'])],
            'exng': [float(data['exng'])],
            'oldpeak': [float(data['oldpeak'])],
            'slp': [float(data['slp'])],
            'caa': [float(data['caa'])],
            'thall': [float(data['thall'])],
            'o2_saturation': [98.0]
        })
        
        scaled_input = scaler.transform(input_data)
        prediction = model.predict(scaled_input)[0]
        
        # Calculer la probabilité de la prédiction
        probability = model.predict_proba(scaled_input)[0][1]  # Probabilité pour la classe 1
        
        result = "Risque élevé de crise cardiaque" if prediction == 1 else "Risque faible de crise cardiaque"
        
        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'probability': float(probability),  # Convertir en float pour JSON
            'message': result
        })
    
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    try:
        logger.info("Démarrage de l'application...")
        model = init_model()
        logger.info("L'application est prête et en cours d'exécution.")
        app.run(host='0.0.0.0', port=8080)
    except Exception as e:
        logger.error(f"Erreur lors du démarrage : {str(e)}")
