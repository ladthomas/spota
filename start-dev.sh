#!/bin/bash

echo " Démarrage de l'environnement de développement Spota"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo " Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Aller dans le répertoire backend et installer les dépendances si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances du backend..."
    cd backend && npm install && cd ..
fi

# Installer les dépendances du frontend si nécessaire
if [ ! -d "node_modules" ]; then
    echo " Installation des dépendances du frontend..."
    npm install
fi

echo ""
echo " Démarrage du backend..."
echo "Port backend: 5000"
echo "URL: http://localhost:5000"
echo ""

# Démarrer le backend en arrière-plan
cd backend && npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

echo " Démarrage de l'application Expo..."
echo "Port frontend: 8081 (par défaut)"
echo ""

# Retourner au répertoire racine et démarrer Expo
cd .. && npm start

# Arrêter le backend quand Expo s'arrête
trap "kill $BACKEND_PID" EXIT 