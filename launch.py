import subprocess
import sys
import os
import logging
from threading import Thread
import time
import signal

# Configuration du logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Variable globale pour stocker les processus
processes = []

def run_service(command, service_name):
    try:
        logger.info(f"Démarrage du service {service_name}...")
        
        # Utilisation de subprocess.Popen avec shell=False pour une meilleure sécurité
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            shell=False
        )
        
        processes.append(process)
        
        # Lecture des logs en temps réel
        while True:
            output = process.stdout.readline()
            if output:
                logger.info(f"{service_name}: {output.strip()}")
            if process.poll() is not None:
                error_output = process.stderr.read()
                if error_output:
                    logger.error(f"{service_name} erreur: {error_output}")
                break
            
    except Exception as e:
        logger.error(f"Erreur lors du démarrage de {service_name}: {str(e)}")

def cleanup():
    logger.info("Nettoyage des processus...")
    for process in processes:
        try:
            process.terminate()
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
    logger.info("Tous les services ont été arrêtés.")

def signal_handler(signum, frame):
    logger.info("\nSignal d'arrêt reçu. Arrêt des services...")
    cleanup()
    sys.exit(0)

def main():
    # Gestion des signaux d'interruption
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Détermination du chemin absolu du répertoire racine
    root_dir = os.path.dirname(os.path.abspath(__file__))
    python_executable = sys.executable
    
    # Configuration des services
    services = [
        {
            'name': 'Cars Prediction',
            'command': [python_executable, os.path.join(root_dir, "cars", "api.py")],
            'port': 5050
        },
        {
            'name': 'Heart Attack Prediction',
            'command': [python_executable, os.path.join(root_dir, "hattack", "hattack.py")],
            'port': 8080
        },
        {
            'name': 'Weather Prediction',
            'command': [python_executable, os.path.join(root_dir, "weather", "weather.py")],
            'port': 5101
        },
        {
            'name': 'Student Grade Prediction',
            'command': [python_executable, os.path.join(root_dir, "winningsco", "WinningSco.py")],
            'port': 5054
        }
    ]

    try:
        logger.info("Démarrage de tous les services...")
        
        # Création et démarrage des threads
        threads = []
        for service in services:
            thread = Thread(
                target=run_service,
                args=(service['command'], service['name']),
                daemon=True
            )
            threads.append(thread)
            thread.start()
            time.sleep(2)  # Délai entre chaque démarrage

        logger.info("""
        Services en cours de démarrage:
        - Cars Prediction (Port 5050)
        - Heart Attack Prediction (Port 8080)
        - Weather Prediction (Port 5101)
        - Student Grade Prediction (Port 5054)
        
        Appuyez sur Ctrl+C pour arrêter tous les services.
        """)

        # Maintenir le programme en vie
        while True:
            if all(not thread.is_alive() for thread in threads):
                logger.error("Tous les services se sont arrêtés de manière inattendue.")
                break
            time.sleep(1)

    except KeyboardInterrupt:
        logger.info("\nInterruption détectée...")
    except Exception as e:
        logger.error(f"Erreur générale: {str(e)}")
    finally:
        cleanup()

if __name__ == "__main__":
    main()