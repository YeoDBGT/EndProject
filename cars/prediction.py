import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import os

def load_and_merge_data():
    try:
        # Obtenir le chemin du répertoire courant
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Liste des fichiers à charger
        files = {
            'audi.csv': 'Audi',
            'bmw.csv': 'BMW',
            'merc.csv': 'Mercedes',
            'toyota.csv': 'Toyota',
            'skoda.csv': 'Skoda',
            'hyundi.csv': 'Hyundai',
            'ford.csv': 'Ford',
            'focus.csv': 'Ford',
            'cclass.csv': 'Mercedes'
        }
        
        dfs = []
        for file, brand in files.items():
            file_path = os.path.join(current_dir, file)
            try:
                df = pd.read_csv(file_path)
                df['brand'] = brand
                dfs.append(df)
                print(f"Fichier chargé avec succès: {file}")
            except FileNotFoundError:
                print(f"Attention: {file} non trouvé, ignoré.")
                continue
            
        if not dfs:
            raise ValueError("Aucun fichier CSV n'a pu être chargé.")
            
        combined_df = pd.concat(dfs, ignore_index=True)
        print(f"Nombre total de lignes chargées: {len(combined_df)}")
        return combined_df
    
    except Exception as e:
        print(f"Erreur lors du chargement des données: {str(e)}")
        raise

def clean_data(df):
    try:
        # Copie pour éviter les modifications sur l'original
        df = df.copy()
        
        # Nettoyer la colonne price
        df['price'] = df['price'].astype(str).str.replace('£', '').str.replace(',', '').str.replace(' ', '')
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        
        # Convertir et nettoyer les colonnes numériques
        for col in ['year', 'mileage', 'engineSize']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Standardiser les noms de colonnes
        df.columns = df.columns.str.lower().str.strip()
        
        # Renommer les colonnes si nécessaire
        column_mapping = {
            'fueltype': 'fueltype',
            'fuel type': 'fueltype',
            'fuel_type': 'fueltype',
            'enginesize': 'enginesize',
            'engine size': 'enginesize',
            'engine_size': 'enginesize'
        }
        df = df.rename(columns=column_mapping)
        
        # Supprimer les lignes avec des valeurs manquantes dans les colonnes essentielles
        essential_columns = ['price', 'year', 'mileage', 'enginesize', 'transmission', 'fueltype']
        df = df.dropna(subset=essential_columns)
        
        # Supprimer les doublons
        df = df.drop_duplicates()
        
        # Supprimer les valeurs aberrantes
        df = df[df['price'] > 100]  # Prix minimum raisonnable
        df = df[df['year'] >= 2000]  # Année minimum raisonnable
        df = df[df['mileage'] >= 0]  # Kilométrage positif
        
        print(f"Nombre de lignes après nettoyage: {len(df)}")
        return df
    
    except Exception as e:
        print(f"Erreur lors du nettoyage des données: {str(e)}")
        raise

def prepare_features(df):
    try:
        features = ['brand', 'model', 'year', 'transmission', 'mileage', 'fueltype', 'enginesize']
        target = 'price'
        
        missing_columns = [col for col in features + [target] if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Colonnes manquantes: {missing_columns}")
        
        X = df[features].copy()
        y = df[target].copy()
        
        # Stocker les valeurs uniques pour chaque catégorie
        categorical_columns = ['brand', 'model', 'transmission', 'fueltype']
        category_values = {}
        le_dict = {}
        
        for col in categorical_columns:
            # Stocker les valeurs uniques
            category_values[col] = list(X[col].unique())
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            le_dict[col] = le
        
        numeric_columns = ['year', 'mileage', 'enginesize']
        scaler = StandardScaler()
        X[numeric_columns] = scaler.fit_transform(X[numeric_columns])
        
        return X, y, le_dict, scaler, category_values
    
    except Exception as e:
        print(f"Erreur lors de la préparation des features: {str(e)}")
        raise

def train_model(X, y):
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Évaluation du modèle
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Erreur quadratique moyenne (MSE): {mse:.2f}")
        print(f"Coefficient de détermination (R²): {r2:.2f}")
        
        return model, (X_train, X_test, y_train, y_test)
    
    except Exception as e:
        print(f"Erreur lors de l'entraînement du modèle: {str(e)}")
        raise

def predict_price(model, le_dict, scaler, category_values, brand, model_name, year, 
                 transmission, mileage, fuel_type, engine_size):
    try:
        # Vérifier si les valeurs catégorielles existent dans nos données
        if brand not in category_values['brand']:
            print(f"Attention: La marque '{brand}' n'est pas dans nos données d'entraînement.")
            brand = category_values['brand'][0]
            print(f"Utilisation de la marque '{brand}' à la place.")
            
        if model_name not in category_values['model']:
            print(f"Attention: Le modèle '{model_name}' n'est pas dans nos données d'entraînement.")
            model_name = category_values['model'][0]
            print(f"Utilisation du modèle '{model_name}' à la place.")
            
        if transmission not in category_values['transmission']:
            print(f"Attention: La transmission '{transmission}' n'est pas dans nos données d'entraînement.")
            transmission = category_values['transmission'][0]
            print(f"Utilisation de la transmission '{transmission}' à la place.")
            
        if fuel_type not in category_values['fueltype']:
            print(f"Attention: Le type de carburant '{fuel_type}' n'est pas dans nos données d'entraînement.")
            fuel_type = category_values['fueltype'][0]
            print(f"Utilisation du type de carburant '{fuel_type}' à la place.")

        # Créer un DataFrame avec les nouvelles données
        new_data = pd.DataFrame({
            'brand': [brand],
            'model': [model_name],
            'year': [year],
            'transmission': [transmission],
            'mileage': [mileage],
            'fueltype': [fuel_type],
            'enginesize': [engine_size]
        })
        
        # Encoder les variables catégorielles
        for col, le in le_dict.items():
            new_data[col] = le.transform(new_data[col].astype(str))
        
        # Normaliser les features numériques
        numeric_columns = ['year', 'mileage', 'enginesize']
        new_data[numeric_columns] = scaler.transform(new_data[numeric_columns])
        
        # Faire la prédiction
        predicted_price = model.predict(new_data)
        return predicted_price[0]
    
    except Exception as e:
        print(f"Erreur lors de la prédiction: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        print("Chargement des données...")
        df = load_and_merge_data()
        
        print("\nNettoyage des données...")
        df_clean = clean_data(df)
        
        print("\nPréparation des features...")
        X, y, le_dict, scaler, category_values = prepare_features(df_clean)
        
        print("\nEntraînement du modèle...")
        model, (X_train, X_test, y_train, y_test) = train_model(X, y)
        
        print("\nTest de prédiction...")
        available_brand = category_values['brand'][0]
        available_model = category_values['model'][0]
        
        # Exemple de prédiction avec le premier modèle disponible
        predicted_price = predict_price(
            model,
            le_dict,
            scaler,
            category_values,
            brand=available_brand,
            model_name=available_model,
            year=2018,
            transmission="Automatic",
            mileage=30000,
            fuel_type="Diesel",
            engine_size=2.0
        )
        
        # Conversion du prix en euros (taux hypothétique de £1 = €1.15)
        predicted_price_euros = predicted_price * 1.15
        
        print(f"\nPrix prédit pour {available_brand} {available_model} (2018) en euros: €{predicted_price_euros:,.2f}")
        
    except Exception as e:
        print(f"Erreur lors de l'exécution du programme: {str(e)}")