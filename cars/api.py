from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import os
import logging

# Configurer le logger
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
                "http://endprojectdevia.xyz",
                "http://www.endprojectdevia.xyz"
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    },
    supports_credentials=True,
)
app.config['CORS_HEADERS'] = 'Content-Type'

# Fonction pour charger et fusionner les données
def load_and_merge_data():
    try:
        logger.info("Chargement des fichiers de données...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        files = {
            'audi.csv': 'Audi',
            'bmw.csv': 'BMW',
            'merc.csv': 'Mercedes',
            'toyota.csv': 'Toyota',
            'skoda.csv': 'Skoda',
            'hyundi.csv': 'Hyundai',
            'ford.csv': 'Ford',
            'focus.csv': 'Ford',
            'cclass.csv': 'Mercedes',
        }

        dfs = []
        required_columns = ['model', 'year', 'price', 'transmission', 'mileage', 'fuelType', 'engineSize']

        for file, brand in files.items():
            file_path = os.path.join(current_dir, file)
            try:
                df = pd.read_csv(file_path)
                missing_columns = [col for col in required_columns if col not in df.columns]
                if missing_columns:
                    logger.warning(f"Colonnes manquantes dans {file}: {missing_columns}")
                df['brand'] = brand
                dfs.append(df)
                logger.info(f"Fichier chargé avec succès : {file}")
            except FileNotFoundError:
                logger.warning(f"Fichier non trouvé : {file}, ignoré.")
                continue

        if not dfs:
            raise ValueError("Aucun fichier CSV n'a pu être chargé.")

        combined_df = pd.concat(dfs, ignore_index=True)
        logger.info("Données combinées avec succès.")
        return combined_df

    except Exception as e:
        logger.error(f"Erreur lors du chargement des données : {str(e)}")
        raise

# Endpoint pour récupérer les marques disponibles
@app.route('/api/brands', methods=['GET'])
@cross_origin(origin="http://localhost:3000", methods=['GET'])
def get_brands():
    try:
        logger.info("Récupération des marques disponibles...")
        
        # Charger les données déjà fusionnées
        global df_clean
        if df_clean is None:
            logger.error("Les données nettoyées ne sont pas disponibles.")
            return jsonify({'success': False, 'error': 'Les données ne sont pas prêtes.'}), 500
        
        # Extraire les marques uniques
        unique_brands = df_clean['brand'].dropna().unique().tolist()
        logger.info(f"Marques disponibles : {unique_brands}")
        
        return jsonify({'success': True, 'brands': unique_brands})

    except Exception as e:
        logger.error(f"Erreur dans /api/brands : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
    
# Endpoint pour récupérer les modèles associés à une marque
@app.route('/api/models/<brand>', methods=['GET'])
@cross_origin(origin="http://localhost:3000", methods=['GET'])
def get_models(brand):
    try:
        logger.info(f"Récupération des modèles pour la marque : {brand}")

        # Vérifier si le DataFrame est chargé
        global df_clean
        if df_clean is None:
            logger.error("Les données nettoyées ne sont pas disponibles.")
            return jsonify({'success': False, 'error': 'Les données ne sont pas prêtes.'}), 500

        # Filtrer les modèles pour la marque donnée
        filtered_models = df_clean[df_clean['brand'].str.lower() == brand.lower()]['model'].dropna().unique().tolist()
        if not filtered_models:
            logger.warning(f"Aucun modèle trouvé pour la marque : {brand}")
            return jsonify({'success': False, 'models': []})

        logger.info(f"Modèles disponibles pour {brand} : {filtered_models}")
        return jsonify({'success': True, 'models': filtered_models})

    except Exception as e:
        logger.error(f"Erreur dans /api/models/{brand} : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
        
# Fonction pour nettoyer les données
def clean_data(df):
    try:
        logger.info("Nettoyage des données...")
        df = df.copy()
        df['price'] = df['price'].astype(str).str.replace('£', '').str.replace(',', '').str.replace(' ', '')
        df['price'] = pd.to_numeric(df['price'], errors='coerce')

        for col in ['year', 'mileage', 'engineSize']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        df.columns = df.columns.str.lower().str.strip()

        column_mapping = {
            'fueltype': 'fuelType',
            'fuel type': 'fuelType',
            'fuel_type': 'fuelType',
            'enginesize': 'engineSize',
            'engine size': 'engineSize',
            'engine_size': 'engineSize',
        }
        df = df.rename(columns=column_mapping)

        essential_columns = ['price', 'year', 'mileage', 'engineSize', 'transmission', 'fuelType']
        df = df.dropna(subset=essential_columns)
        df = df.drop_duplicates()

        df = df[df['price'] > 100]
        df = df[df['year'] >= 2000]
        df = df[df['mileage'] >= 0]

        logger.info("Données nettoyées avec succès.")
        return df

    except Exception as e:
        logger.error(f"Erreur lors du nettoyage des données : {str(e)}")
        raise

# Fonction pour enrichir les données
def enrich_data(df):
    logger.info("Enrichissement des données en cours...")
    # Ajouter des modèles manquants pour chaque marque
    additional_models = {
        'BMW': ['Serie 3', 'Serie 5', 'Serie 7'],
        'Audi': ['A3', 'A4', 'A6'],
        'Mercedes': ['C Class', 'E Class', 'S Class'],
    }

    for brand, models in additional_models.items():
        for model_name in models:
            if not ((df['brand'] == brand) & (df['model'] == model_name)).any():
                # Ajouter une ligne fictive avec des valeurs moyennes
                avg_values = df[df['brand'] == brand].mean(numeric_only=True)
                new_row = {
                    'brand': brand,
                    'model': model_name,
                    'year': int(avg_values.get('year', 2020)),
                    'price': avg_values.get('price', 30000),
                    'transmission': df[df['brand'] == brand]['transmission'].mode()[0],
                    'mileage': int(avg_values.get('mileage', 5000)),
                    'fuelType': df[df['brand'] == brand]['fuelType'].mode()[0],
                    'engineSize': avg_values.get('engineSize', 2.0),
                }
                df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    logger.info("Enrichissement des données terminé.")
    return df

# Fonction pour préparer les données
def prepare_features(df):
    try:
        logger.info("Préparation des données pour l'entraînement...")
        features = ['brand', 'model', 'year', 'transmission', 'mileage', 'fuelType', 'engineSize']
        target = 'price'

        X = df[features].copy()
        y = df[target].copy()

        # Colonnes catégoriques
        categorical_columns = ['brand', 'model', 'transmission', 'fuelType']
        category_values = {}
        le_dict = {}

        for col in categorical_columns:
            category_values[col] = list(X[col].unique())
            category_values[col].append("unknown")
            le = LabelEncoder()
            le.fit(category_values[col])
            X[col] = le.transform(X[col].astype(str))
            le_dict[col] = le

        # Colonnes numériques
        numeric_columns = ['year', 'mileage', 'engineSize']
        scaler = StandardScaler()
        X[numeric_columns] = scaler.fit_transform(X[numeric_columns])

        logger.info("Données préparées avec succès.")
        return X, y, le_dict, scaler, category_values

    except Exception as e:
        logger.error(f"Erreur lors de la préparation des données : {str(e)}")
        raise

# Fonction pour entraîner le modèle
def train_model(X, y):
    try:
        logger.info("Entraînement du modèle avec recherche d'hyperparamètres...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        param_grid = {
            'n_estimators': [50, 100, 200],
            'max_depth': [None, 10, 20, 30],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
        }

        rf = RandomForestRegressor(random_state=42)
        search = RandomizedSearchCV(estimator=rf, param_distributions=param_grid, n_iter=10, cv=3, n_jobs=-1, random_state=42)
        search.fit(X_train, y_train)

        best_model = search.best_estimator_
        y_pred = best_model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        logger.info(f"Modèle optimisé avec succès. Meilleurs paramètres : {search.best_params_}")
        logger.info(f"MSE: {mse:.2f}, R²: {r2:.2f}")
        return best_model, (X_train, X_test, y_train, y_test)

    except Exception as e:
        logger.error(f"Erreur lors de l'entraînement du modèle : {str(e)}")
        raise

# Fonction pour prédire le prix
def predict_price(model, le_dict, scaler, category_values, brand, model_name, year, transmission, mileage, fuelType, engineSize):
    try:
        logger.info("Prédiction du prix en cours...")
        new_data = pd.DataFrame({
            'brand': [brand],
            'model': [model_name],
            'year': [year],
            'transmission': [transmission],
            'mileage': [mileage],
            'fuelType': [fuelType],
            'engineSize': [engineSize],
        })

        warnings = []
        for col, le in le_dict.items():
            if col in new_data:
                # Si la valeur n'est pas connue
                if new_data[col][0] not in category_values[col]:
                    warnings.append(f"Valeur inconnue pour {col}: {new_data[col][0]} remplacée par 'unknown'")
                    new_data[col] = "unknown"
                new_data[col] = le.transform(new_data[col].astype(str))

        if warnings:
            logger.warning("Avertissements lors de la prédiction : " + ", ".join(warnings))

        # Transformation des colonnes numériques
        numeric_columns = ['year', 'mileage', 'engineSize']
        new_data[numeric_columns] = scaler.transform(new_data[numeric_columns])

        predicted_price = model.predict(new_data)
        logger.info("Prédiction terminée avec succès.")
        return predicted_price[0]

    except Exception as e:
        logger.error(f"Erreur lors de la prédiction : {str(e)}")
        raise

# Endpoint pour la prédiction d'un seul prix
@app.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin(origin="http://localhost:3000", methods=['POST', 'OPTIONS'])
def predict_endpoint():
    if request.method == 'OPTIONS':
        response = app.response_class(status=204)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response

    try:
        data = request.json
        logger.info("Données reçues pour prédiction : %s", data)

        if not data:
            return jsonify({'success': False, 'error': 'Aucune donnée reçue'}), 400

        required_fields = ['brand', 'model', 'year', 'transmission', 'mileage', 'fuelType', 'engineSize']
        for field in required_fields:
            if field not in data:
                logger.error(f"Champ manquant : {field}")
                return jsonify({'success': False, 'error': f"Champ manquant : {field}"}), 400

        predicted_price = predict_price(
            model, le_dict, scaler, category_values,
            brand=data['brand'],
            model_name=data['model'],
            year=data['year'],
            transmission=data['transmission'],
            mileage=data['mileage'],
            fuelType=data['fuelType'],
            engineSize=data['engineSize'],
        )

        predicted_price_euros = predicted_price * 1.201
        logger.info("Prédiction réussie. Prix estimé : %s", predicted_price)
        return jsonify({
            'success': True,
            'predicted_price': round(predicted_price, 2),
            'predicted_price_euros': round(predicted_price_euros, 2),
        })

    except Exception as e:
        logger.error(f"Erreur dans /predict : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 400

# Chargement des données et initialisation
if __name__ == "__main__":
    try:
        global model, le_dict, scaler, category_values, df_clean

        logger.info("Initialisation de l'application...")
        df = load_and_merge_data()
        df_clean = clean_data(df)
        df_clean = enrich_data(df_clean)  # Enrichir les données avec des modèles manquants
        X, y, le_dict, scaler, category_values = prepare_features(df_clean)
        model, _ = train_model(X, y)

        logger.info("L'application est prête et en cours d'exécution.")
        app.run(host='127.0.0.1', port=5050)

    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation : {str(e)}")