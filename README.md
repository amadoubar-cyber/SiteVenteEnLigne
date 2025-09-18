# 🛒 Koula E-commerce

Plateforme de vente en ligne moderne développée avec React et Node.js.

## 🚀 Démarrage Rapide

### Option 1: Démarrage Automatique (Recommandé)

1. **Double-cliquez sur `start.bat`** pour démarrer automatiquement tous les services
2. Attendez que les services se lancent
3. Ouvrez votre navigateur sur `http://localhost:3000`

### Option 2: Démarrage Manuel

1. **Installer les dépendances :**
   ```bash
   npm run install-all
   ```

2. **Démarrer le serveur :**
   ```bash
   npm run server
   ```

3. **Dans un autre terminal, démarrer le client :**
   ```bash
   npm run client
   ```

### Option 3: Démarrage avec le script Node.js

```bash
node start.js
```

## 📁 Structure du Projet

```
koula-ecommerce/
├── client/          # Application React (Frontend)
├── server/          # API Node.js (Backend)
├── start.js         # Script de démarrage unifié
├── start.bat        # Script de démarrage Windows
└── package.json     # Configuration du projet
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `server/` avec :

```env
MONGODB_URI=mongodb://localhost:27017/koula_ecommerce
JWT_SECRET=koula_secret_key_2024
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 📱 URLs d'accès

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Documentation API :** http://localhost:5000/api/docs

## 🛠️ Technologies Utilisées

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

## 📦 Scripts Disponibles

- `npm run dev` - Démarre le serveur et le client en parallèle
- `npm run server` - Démarre uniquement le serveur
- `npm run client` - Démarre uniquement le client
- `npm run build` - Compile l'application pour la production
- `npm run install-all` - Installe toutes les dépendances

## 🚨 Résolution de Problèmes

### Erreur "Cannot find module"
```bash
npm run install-all
```

### Erreur de port déjà utilisé
- Vérifiez qu'aucun autre service n'utilise les ports 3000 ou 5000
- Redémarrez votre ordinateur si nécessaire

### Erreur de base de données
- Assurez-vous que MongoDB est installé et démarré
- Vérifiez la configuration dans le fichier `.env`

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Développé avec ❤️ par l'équipe Koula**