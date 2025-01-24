import os
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import logging

# Configuration du logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration sécurisée de CORS
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://147.93.52.112",
                "http://endprojectdevia.xyz"
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    },
    supports_credentials=True,
)
app.config['CORS_HEADERS'] = 'Content-Type'

# Chemins des fichiers
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, 'models')
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, 'best_model.pkl')
le_dict_path = os.path.join(model_dir, 'le_dict.pkl')
scaler_path = os.path.join(model_dir, 'scaler.pkl')

def load_and_merge_data():
    portuguese_path = os.path.join(current_dir, 'Portuguese.csv')
    maths_path = os.path.join(current_dir, 'Maths.csv')
    
    # Correction du séparateur à la virgule
    portuguese_df = pd.read_csv(portuguese_path, sep=',', index_col=0)
    maths_df = pd.read_csv(maths_path, sep=',', index_col=0)
    
    combined_df = pd.concat([portuguese_df, maths_df], ignore_index=True)
    logger.info("Données fusionnées avec succès.")
    logger.info(f"Colonnes disponibles: {combined_df.columns.tolist()}")
    return combined_df

def clean_data(df):
    # Suppression des lignes avec des valeurs manquantes
    df = df.dropna()
    
    # Conversion des colonnes numériques
    numeric_columns = ['age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures',
                       'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health',
                       'absences', 'G1', 'G2', 'G3']
    df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric)
    
    logger.info("Données nettoyées.")
    return df

def enrich_data(df):
    # Ajout d'une colonne moyenne d'alcool consommé
    df['AvgAlc'] = (df['Dalc'] + df['Walc']) / 2
    logger.info("Données enrichies avec AvgAlc.")
    return df

def prepare_features(df):
    features = ['sex', 'age', 'address', 'famsize', 'Pstatus', 'Medu', 'Fedu',
               'Mjob', 'Fjob', 'reason', 'guardian', 'traveltime', 'studytime',
               'failures', 'schoolsup', 'famsup', 'paid', 'activities',
               'nursery', 'higher', 'internet', 'romantic', 'famrel', 'freetime',
               'goout', 'Dalc', 'Walc', 'health', 'absences', 'G1', 'G2', 'AvgAlc']
    target = 'G3'
    
    X = df[features].copy()
    y = df[target].copy()
    
    # Encodage des variables catégorielles
    le_dict = {}
    for col in X.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        le_dict[col] = le
    
    # Normalisation des variables numériques
    scaler = StandardScaler()
    numeric_cols = ['age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures',
                    'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health',
                    'absences', 'G1', 'G2', 'AvgAlc']
    X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
    
    logger.info("Caractéristiques préparées.")
    logger.info(f"Colonnes utilisées pour l'entraînement : {X.columns.tolist()}")
    return X, y, le_dict, scaler

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, 
                                                        test_size=0.2, 
                                                        random_state=42)
    
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True, False]
    }
    
    rf = RandomForestRegressor(random_state=42)
    rf_random = RandomizedSearchCV(estimator=rf, 
                                   param_distributions=param_grid, 
                                   n_iter=100, 
                                   cv=3, 
                                   verbose=2, 
                                   random_state=42, 
                                   n_jobs=-1)
    
    rf_random.fit(X_train, y_train)
    best_model = rf_random.best_estimator_
    
    y_pred = best_model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    logger.info(f"MSE: {mse:.2f}, R²: {r2:.2f}")
    
    # Sauvegarder le modèle et les objets de transformation
    joblib.dump(best_model, model_path)
    joblib.dump(le_dict, le_dict_path)
    joblib.dump(scaler, scaler_path)
    
    logger.info("Modèle et objets de transformation sauvegardés.")
    return best_model

def load_model():
    try:
        model = joblib.load(model_path)
        le_dict = joblib.load(le_dict_path)
        scaler = joblib.load(scaler_path)
        logger.info("Modèle et objets de transformation chargés.")
        return model, le_dict, scaler
    except Exception as e:
        logger.error(f"Erreur lors du chargement du modèle : {e}")
        return None, None, None

# Entraînement du modèle si non existant
if not os.path.exists(model_path) or not os.path.exists(le_dict_path) or not os.path.exists(scaler_path):
    logger.info("Entraînement du modèle car aucun modèle sauvegardé n'a été trouvé.")
    df = load_and_merge_data()
    df_clean = clean_data(df)
    df_enriched = enrich_data(df_clean)
    X, y, le_dict, scaler = prepare_features(df_enriched)
    model = train_model(X, y)
else:
    model, le_dict, scaler = load_model()

def preprocess_input(data):
    try:
        input_df = pd.DataFrame([data])
        
        # Liste des colonnes numériques
        numeric_cols = ['age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures',
                        'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health',
                        'absences', 'G1', 'G2', 'AvgAlc']
        
        # Conversion des colonnes numériques en types appropriés
        for col in numeric_cols:
            if col in input_df.columns:
                input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
        
        # Gestion des valeurs manquantes après conversion
        if input_df[numeric_cols].isnull().values.any():
            logger.error("Certains champs numériques contiennent des valeurs invalides.")
            return None
        
        # Encodage des variables catégorielles
        categorical_cols = [col for col in input_df.select_dtypes(include=['object']).columns if col in le_dict]
        for col in categorical_cols:
            le = le_dict[col]
            input_df[col] = le.transform(input_df[col])
        
        # Normalisation des variables numériques
        input_df[numeric_cols] = scaler.transform(input_df[numeric_cols])
        
        return input_df
    except Exception as e:
        logger.error(f"Erreur lors du prétraitement des données d'entrée : {e}")
        return None

@app.route('/predict-study-alcohol', methods=['POST'])
def predict_study_alcohol():
    try:
        data = request.json
        logger.info(f"Données reçues pour prédiction : {data}")
        
        # Calcul de AvgAlc si non fourni
        if 'Dalc' in data and 'Walc' in data:
            data['AvgAlc'] = (float(data['Dalc']) + float(data['Walc'])) / 2
        else:
            data['AvgAlc'] = 0  # Valeur par défaut ou gérer autrement
        
        input_processed = preprocess_input(data)
        if input_processed is None:
            return jsonify({'success': False, 'error': 'Erreur lors du prétraitement des données.'}), 400
        
        prediction = model.predict(input_processed)
        predicted_grade = round(prediction[0], 2)
        
        logger.info(f"Prédiction réussie : {predicted_grade}")
        
        return jsonify({
            'success': True,
            'predicted_grade': predicted_grade
        })
    
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction : {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5054)
