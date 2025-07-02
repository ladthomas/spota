# 🎯 Spota - Découverte d'Événements Parisiens

Spota est une application mobile moderne développée avec React Native et Expo qui permet aux utilisateurs de découvrir et organiser les événements parisiens en temps réel.

## 📱 Fonctionnalités

### Frontend (React Native + Expo)

- **🏠 Accueil** : Dashboard avec événements du jour et météo parisienne
- **🔍 Découverte** : Exploration d'événements avec filtres avancés et recherche
- **🗺️ Carte** : Géolocalisation et carte interactive des événements
- **❤️ Favoris** : Sauvegarde et organisation des événements préférés
- **👤 Profil** : Gestion du compte utilisateur et préférences

### Backend (Node.js + Express)

- **🔐 Authentification JWT** : Système d'inscription, connexion et gestion de profil
- **💾 Base de données SQLite** : Stockage sécurisé des utilisateurs et favoris
- **🛡️ Sécurité** : Rate limiting, CORS, validation des données et protection OWASP
- **📊 Tests** : Suite complète de 60 tests unitaires et d'intégration
- **🌐 API Paris** : Intégration avec l'API officielle des événements parisiens

## 🏗️ Architecture

```
Spota/
├── 📱 Frontend (React Native + Expo)
│   ├── app/                    # Pages et navigation
│   ├── components/             # Composants réutilisables  
│   ├── services/              # API et configuration
│   └── hooks/                 # Hooks personnalisés
│
├── 🔧 Backend (Node.js + Express)
│   ├── controllers/           # Logique métier
│   ├── models/               # Modèles de données
│   ├── routes/               # Points d'API
│   ├── middleware/           # Authentification & sécurité
│   ├── test/                # Tests unitaires (60 tests)
│   └── config/              # Configuration base de données
│
└── 📄 Documentation
    ├── spota-api-documentation.yaml
    └── database_diagram_spota.dbml
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI
- Simulateur iOS/Android ou Expo Go

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Spota
```

### 2. Installation des dépendances

**Frontend :**

```bash
npm install
```

**Backend :**

```bash
cd backend
npm install
```

### 3. Configuration

**Backend - Variables d'environnement :**

```bash
cd backend
cp config.env.example .env
```

Éditer le fichier `.env` :

```env
# Base de données
DB_PATH=./database.sqlite

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Serveur
PORT=5000
NODE_ENV=development
```

**Frontend - Configuration API :**

```bash
# Mettre à jour l'IP dans services/config.ts
npm run update-ip
```

### 4. Démarrage

**Option 1 : Script automatique (recommandé)**

```bash
# Depuis la racine du projet
chmod +x start-dev.sh
./start-dev.sh
```

**Option 2 : Démarrage manuel**

Terminal 1 - Backend :

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend :

```bash
# Depuis la racine du projet
npx expo start
```

**Pour le frontend uniquement :**

```bash
npm start                    # Démarrer Expo
npm run start:clear          # Démarrer avec cache vidé
npm run start:tunnel         # Démarrer avec tunnel public
```

### 5. Accès à l'application

- **Mobile** : Scanner le QR code avec Expo Go
- **Simulateur iOS** : Appuyer sur `i`
- **Émulateur Android** : Appuyer sur `a`
- **Web** : Appuyer sur `w`

## 🔧 Scripts Disponibles

### Frontend

```bash
npm start              # Démarrer Expo
npm run reset-project  # Réinitialiser le projet
npm run update-ip      # Mettre à jour l'IP locale
```

### Backend

```bash
npm start              # Démarrer en production
npm run dev           # Démarrer en développement
npm test              # Lancer les tests (60 tests)
npm run test:coverage # Tests avec couverture
npm run migrate       # Migrations base de données
```

## 📊 Tests

Le backend inclut une suite complète de 60 tests :

```bash
cd backend
npm test
```

**Types de tests :**

- Tests unitaires (Controllers, Models, Utils)
- Tests middleware (Authentification JWT)
- Tests d'intégration (Routes API)
- Tests de performance

## 🔗 API Endpoints

### Authentification

```
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
GET  /api/auth/me         # Profil utilisateur
PUT  /api/auth/profile    # Mise à jour profil
DELETE /api/auth/delete-account # Suppression compte
```

### Utilitaires

```
GET /health               # État du serveur
```

## 🛡️ Sécurité

- **JWT** : Authentification par tokens
- **Bcrypt** : Hachage des mots de passe
- **Helmet** : Headers de sécurité
- **Rate Limiting** : Protection contre le spam
- **CORS** : Configuration cross-origin
- **Validation** : Sanitisation des données

## 📚 Technologies

### Frontend

- React Native 0.74+
- Expo SDK 51+
- Expo Router (navigation)
- TypeScript
- Async Storage

### Backend  

- Node.js 18+
- Express.js 4+
- SQLite3
- JWT + Bcrypt
- Jest (testing)

## 🗃️ Base de Données

Structure SQLite avec 7 tables :

- `users` : Comptes utilisateurs
- `favorites` : Événements favoris
- `user_sessions` : Sessions actives
- `events_cache` : Cache des événements
- `user_preferences` : Préférences utilisateur
- `notifications` : Système de notifications
- `audit_logs` : Logs d'audit

## 📖 Documentation API

Documentation complète disponible dans :

- `spota-api-documentation.yaml` (OpenAPI 3.0)
- Schéma base de données : `database_diagram_spota.dbml`

## 🤝 Développement

### Structure des commits

```
feat: nouvelle fonctionnalité
fix: correction de bug  
docs: mise à jour documentation
test: ajout/modification tests
refactor: refactoring code
```

### Lancement en mode développement

```bash
# Backend avec hot reload
cd backend && npm run dev

# Frontend avec live reload
npx expo start --clear
```

## 📱 Compatibilité

- **iOS** : 13.0+
- **Android** : API 21+ (Android 5.0)
- **Web** : Navigateurs modernes

## 🎯 Roadmap

- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Partage d'événements
- [ ] Système de recommandations
- [ ] Mode sombre

## 🐛 Problèmes Connus

- Géolocalisation nécessite permissions sur device réel
- Hot reload parfois instable sur certains simulateurs

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour découvrir Paris autrement**
