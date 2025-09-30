# 🛒 Bowoye Multi Services - Plateforme E-commerce

## 📋 Description

Plateforme e-commerce complète développée avec **React.js** (frontend) et **Node.js** (backend) pour la vente de matériaux de construction et produits électroniques en Guinée.

### 🌟 Fonctionnalités Principales

#### **🛒 Interface Client (Front-Office)**
- ✅ **Inscription/Connexion** - Interface unifiée style Facebook
- ✅ **Consultation des produits** - Carrousel d'images, filtres, recherche
- ✅ **Ajout au panier** - Gestion des quantités, persistance des données
- ✅ **Passage de commande** - Processus complet de commande
- ✅ **Historique des achats** - Suivi des commandes, détails
- ✅ **Système de commentaires** - Avis clients avec notes étoiles

#### **⚙️ Interface Admin (Back-Office)**
- ✅ **Gestion des produits** - CRUD complet, upload d'images, gestion stock
- ✅ **Gestion des utilisateurs** - Liste clients, gestion des rôles, blocage
- ✅ **Gestion des commandes** - Validation, suivi, historique complet
- ✅ **Gestion des paiements** - Suivi, rapports financiers
- ✅ **Tableaux de bord** - Statistiques, KPIs, graphiques
- ✅ **Gestion du stock** - Alertes, mouvements, contrôle
- ✅ **Modération des commentaires** - Gestion des avis clients

---

## 🛠️ Technologies Utilisées

### **Frontend**
- **React.js** - Framework JavaScript
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **React Query** - Gestion des données
- **Lucide React** - Icônes
- **LocalStorage** - Persistance des données

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données
- **JWT** - Authentification
- **CORS** - Sécurité
- **Multer** - Upload de fichiers

### **Déploiement**
- **Vercel** - Frontend (CDN global, HTTPS)
- **Render** - Backend (service web)
- **MongoDB Atlas** - Base de données cloud

---

## 📦 Installation

### **Prérequis**
- Node.js (v14 ou plus récent)
- npm ou yarn
- MongoDB (local ou Atlas)

### **Installation Locale**

```bash
# 1. Cloner le repository
git clone https://github.com/VOTRE-USERNAME/bowoye-multi-services.git
cd bowoye-multi-services

# 2. Installer les dépendances backend
cd server
npm install

# 3. Installer les dépendances frontend
cd ../client
npm install
```

### **Démarrage**

```bash
# Terminal 1 - Backend (port 3001)
cd server
npm start

# Terminal 2 - Frontend (port 3000)
cd client
npm start
```

### **URLs Locales**
- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:3001
- **API** : http://localhost:3001/api

---

## 🔑 Comptes de Test

### **👤 Comptes Clients**
```
Email : client@bowoye.gn
Mot de passe : password123

Email : mamadou@bowoye.gn
Mot de passe : password123
```

### **👑 Comptes Admin**
```
Email : amadou@bowoye.gn
Mot de passe : password123

Email : admin@koula.gn
Mot de passe : admin123

Email : superadmin@koula.gn
Mot de passe : superadmin123
```

---

## 🚀 Déploiement

### **Configuration**
Le projet est configuré pour être déployé sur :
- **Frontend** : Vercel (gratuit, CDN global)
- **Backend** : Render (gratuit, service web)
- **Base de données** : MongoDB Atlas (gratuit, 512MB)

### **URLs de Production**
```
🌐 Site principal : https://bowoye-frontend.vercel.app
🔧 API Backend : https://bowoye-backend.onrender.com/api
```

### **Instructions de Déploiement**
Voir le guide détaillé : `GUIDE_DEPLOIEMENT_VERCEL_RENDER.md`

---

## 📁 Structure du Projet

```
bowoye-multi-services/
├── client/                 # Frontend React
│   ├── public/            # Fichiers publics
│   ├── src/               # Code source React
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React
│   │   ├── services/      # Services API
│   │   ├── utils/         # Utilitaires
│   │   └── styles/        # Styles CSS
│   ├── package.json       # Dépendances frontend
│   └── ...
├── server/                 # Backend Node.js
│   ├── routes/            # Routes API
│   ├── models/            # Modèles de données
│   ├── middleware/        # Middleware Express
│   ├── uploads/           # Fichiers uploadés
│   ├── package.json       # Dépendances backend
│   └── index.js           # Point d'entrée serveur
├── vercel.json            # Configuration Vercel
├── render.yaml            # Configuration Render
├── deploy.sh              # Script de déploiement (Linux/Mac)
├── deploy.ps1             # Script PowerShell (Windows)
├── .gitignore             # Fichiers à ignorer par Git
└── README.md              # Documentation
```

---

## 🎯 Fonctionnalités Détaillées

### **🛒 E-commerce**
- Catalogue de produits avec images
- Filtres par catégorie (Construction/Électronique)
- Recherche de produits
- Panier d'achat persistant
- Processus de commande complet
- Gestion des stocks et alertes

### **👥 Gestion des Utilisateurs**
- Inscription/Connexion sécurisée
- Profils utilisateurs
- Gestion des rôles (Client/Admin)
- Système de permissions
- Historique des commandes

### **📊 Administration**
- Tableaux de bord avec statistiques
- Gestion complète des produits
- Suivi des commandes en temps réel
- Rapports financiers
- Modération des commentaires

### **💬 Système de Commentaires**
- Avis clients avec notes étoiles
- Réponses aux commentaires
- Modération admin
- Système de likes/dislikes
- Statistiques des avis

---

## 🔧 Configuration

### **Variables d'Environnement**

#### **Backend**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bowoye_production
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://bowoye-frontend.vercel.app
```

#### **Frontend**
```bash
REACT_APP_API_URL=https://bowoye-backend.onrender.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

---

## 📚 Documentation

### **Guides Disponibles**
- 📖 `GUIDE_DEPLOIEMENT_VERCEL_RENDER.md` - Déploiement complet
- 📖 `GUIDE_GITHUB_DEPLOIEMENT.md` - Envoi sur GitHub
- 📖 `EXEMPLES_MODIFICATIONS_POST_DEPLOIEMENT.md` - Modifications possibles
- 📖 `env-template.md` - Template des variables d'environnement

### **Tests**
- 🧪 `verification-finale-complete.html` - Test complet
- 🧪 `test-systeme-commentaires.html` - Test des commentaires
- 🧪 `test-interface-client-complete.html` - Test interface client
- 🧪 `test-interface-admin-complete.html` - Test interface admin

---

## 🎨 Captures d'Écran

### **Interface Client**
- Page d'accueil avec carrousel d'images
- Catalogue de produits avec filtres
- Panier d'achat et processus de commande
- Profil utilisateur et historique

### **Interface Admin**
- Tableau de bord avec statistiques
- Gestion des produits et stock
- Suivi des commandes
- Modération des commentaires

---

## 🚀 Fonctionnalités Futures

### **Améliorations Prévues**
- 📱 Application mobile native
- 💳 Intégration paiements mobiles (Orange Money, MTN)
- 🤖 Chatbot intelligent
- 📊 Analytics avancés
- 🌐 Support multilingue
- 🔔 Notifications push

---

## 🤝 Contribution

### **Comment Contribuer**
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos modifications
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

## 📞 Support

### **Contact**
- 📧 Email : support@bowoye.gn
- 📞 Téléphone : +224 XXX XX XX XX
- 🌐 Site web : https://bowoye-frontend.vercel.app

### **Documentation**
- 📚 Vercel : https://vercel.com/docs
- 📚 Render : https://render.com/docs
- 📚 MongoDB Atlas : https://docs.atlas.mongodb.com

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **React.js** - Framework frontend
- **Node.js** - Runtime backend
- **Tailwind CSS** - Framework CSS
- **Vercel** - Hébergement frontend
- **Render** - Hébergement backend
- **MongoDB Atlas** - Base de données cloud

---

**🛒 Bowoye Multi Services** - Votre plateforme e-commerce complète en Guinée

*Développé avec ❤️ pour l'Afrique*