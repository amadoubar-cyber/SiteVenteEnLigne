# 🚀 Guide de Déploiement - Vercel + Render

## 📋 Vue d'Ensemble

Ce guide vous explique comment déployer votre plateforme e-commerce Bowoye Multi Services :
- **Frontend (React)** → **Vercel**
- **Backend (Node.js)** → **Render**
- **Base de données** → **MongoDB Atlas**

---

## 🎯 **ÉTAPES DE DÉPLOIEMENT**

### **Phase 1 : Préparation**
### **Phase 2 : Déploiement Backend (Render)**
### **Phase 3 : Déploiement Frontend (Vercel)**
### **Phase 4 : Configuration et Tests**

---

## 📦 **PHASE 1 : PRÉPARATION**

### **1.1 Créer les Comptes**
```
✅ Vercel : https://vercel.com
   - Compte gratuit disponible
   - Déploiement automatique depuis GitHub

✅ Render : https://render.com
   - Compte gratuit disponible
   - Base de données MongoDB incluse

✅ MongoDB Atlas : https://cloud.mongodb.com
   - Base de données cloud gratuite
   - 512MB de stockage gratuit
```

### **1.2 Préparer le Code**
```bash
# Vérifier que le code est prêt
cd client
npm run build  # Test de build

cd ../server
npm test       # Test du backend
```

### **1.3 Variables d'Environnement**
```
Backend (Render) :
- NODE_ENV=production
- PORT=10000
- MONGODB_URI=mongodb+srv://...
- JWT_SECRET=your-secret-key
- CORS_ORIGIN=https://bowoye-frontend.vercel.app

Frontend (Vercel) :
- REACT_APP_API_URL=https://bowoye-backend.onrender.com/api
- REACT_APP_ENVIRONMENT=production
```

---

## 🖥️ **PHASE 2 : DÉPLOIEMENT BACKEND (RENDER)**

### **2.1 Créer le Service sur Render**

1. **Connecter GitHub**
   ```
   ✅ Aller sur https://render.com
   ✅ Se connecter avec GitHub
   ✅ Autoriser l'accès au repository
   ```

2. **Créer un nouveau Web Service**
   ```
   ✅ Cliquer sur "New +" → "Web Service"
   ✅ Sélectionner votre repository
   ✅ Configurer :
      - Name: bowoye-backend
      - Environment: Node
      - Build Command: cd server && npm install
      - Start Command: cd server && node index.js
      - Plan: Free
   ```

3. **Configurer les Variables d'Environnement**
   ```
   ✅ Dans "Environment Variables" :
      NODE_ENV = production
      PORT = 10000
      MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/bowoye_production
      JWT_SECRET = votre-clé-secrète-très-longue-et-complexe
      CORS_ORIGIN = https://bowoye-frontend.vercel.app
   ```

### **2.2 Créer la Base de Données**

1. **Créer un MongoDB Atlas**
   ```
   ✅ Aller sur https://cloud.mongodb.com
   ✅ Créer un cluster gratuit
   ✅ Configurer l'accès réseau (0.0.0.0/0)
   ✅ Créer un utilisateur de base de données
   ✅ Récupérer la chaîne de connexion
   ```

2. **Configurer sur Render**
   ```
   ✅ Ajouter la variable MONGODB_URI
   ✅ Utiliser la chaîne de connexion Atlas
   ```

### **2.3 Déployer le Backend**
```
✅ Cliquer sur "Create Web Service"
✅ Attendre le déploiement (5-10 minutes)
✅ Vérifier les logs de déploiement
✅ Tester l'endpoint : https://bowoye-backend.onrender.com/api/health
```

---

## 🌐 **PHASE 3 : DÉPLOIEMENT FRONTEND (VERCEL)**

### **3.1 Créer le Projet sur Vercel**

1. **Connecter GitHub**
   ```
   ✅ Aller sur https://vercel.com
   ✅ Se connecter avec GitHub
   ✅ Autoriser l'accès au repository
   ```

2. **Importer le Projet**
   ```
   ✅ Cliquer sur "New Project"
   ✅ Sélectionner votre repository
   ✅ Configurer :
      - Framework Preset: Create React App
      - Root Directory: client
      - Build Command: npm run build
      - Output Directory: build
   ```

### **3.2 Configurer les Variables d'Environnement**
```
✅ Dans "Environment Variables" :
   REACT_APP_API_URL = https://bowoye-backend.onrender.com/api
   REACT_APP_ENVIRONMENT = production
   REACT_APP_VERSION = 1.0.0
```

### **3.3 Déployer le Frontend**
```
✅ Cliquer sur "Deploy"
✅ Attendre le déploiement (2-5 minutes)
✅ Vérifier les logs de déploiement
✅ Tester le site : https://bowoye-frontend.vercel.app
```

---

## ⚙️ **PHASE 4 : CONFIGURATION ET TESTS**

### **4.1 Configuration CORS**
```
✅ Vérifier que CORS_ORIGIN pointe vers votre domaine Vercel
✅ Tester les requêtes API depuis le frontend
```

### **4.2 Tests de Fonctionnalités**
```
✅ Connexion/Inscription
✅ Navigation des produits
✅ Ajout au panier
✅ Processus de commande
✅ Interface admin
✅ Gestion des commentaires
```

### **4.3 Optimisations**
```
✅ Activer HTTPS (automatique sur Vercel/Render)
✅ Configurer les domaines personnalisés
✅ Optimiser les images
✅ Activer la compression
```

---

## 🔧 **CONFIGURATION DÉTAILLÉE**

### **Backend (Render) - Configuration Complète**

```yaml
# render.yaml
services:
  - type: web
    name: bowoye-backend
    env: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && node index.js
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        fromDatabase:
          name: bowoye-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://bowoye-frontend.vercel.app
```

### **Frontend (Vercel) - Configuration Complète**

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

---

## 📊 **MONITORING ET MAINTENANCE**

### **Vercel Analytics**
```
✅ Activer Vercel Analytics
✅ Surveiller les performances
✅ Analyser les erreurs
```

### **Render Monitoring**
```
✅ Surveiller les logs
✅ Vérifier la santé du service
✅ Monitorer l'utilisation des ressources
```

### **MongoDB Atlas Monitoring**
```
✅ Surveiller la base de données
✅ Vérifier les performances
✅ Gérer les sauvegardes
```

---

## 🚨 **RÉSOLUTION DE PROBLÈMES**

### **Problèmes Courants**

#### **Backend ne démarre pas**
```
❌ Vérifier les logs Render
❌ Vérifier les variables d'environnement
❌ Vérifier la connexion MongoDB
❌ Vérifier le port (10000 pour Render)
```

#### **Frontend ne se connecte pas à l'API**
```
❌ Vérifier REACT_APP_API_URL
❌ Vérifier CORS_ORIGIN
❌ Vérifier la santé du backend
```

#### **Base de données inaccessible**
```
❌ Vérifier MONGODB_URI
❌ Vérifier les accès réseau Atlas
❌ Vérifier les credentials
```

### **Logs et Debugging**
```
✅ Vercel : Dashboard → Functions → Logs
✅ Render : Dashboard → Service → Logs
✅ MongoDB : Atlas → Monitoring → Logs
```

---

## 💰 **COÛTS ET LIMITES**

### **Plan Gratuit**

#### **Vercel**
- ✅ 100GB de bande passante/mois
- ✅ Déploiements illimités
- ✅ HTTPS automatique
- ✅ CDN global

#### **Render**
- ✅ 750 heures/mois
- ✅ 512MB RAM
- ✅ Endormissement après 15min d'inactivité
- ✅ Base de données MongoDB incluse

#### **MongoDB Atlas**
- ✅ 512MB de stockage
- ✅ Cluster M0 (gratuit)
- ✅ Sauvegardes automatiques

### **Limites du Plan Gratuit**
```
⚠️ Render : Endormissement après inactivité (réveil en 30s)
⚠️ Vercel : 100GB/mois (suffisant pour la plupart des sites)
⚠️ MongoDB : 512MB (suffisant pour commencer)
```

---

## 🎯 **CHECKLIST DE DÉPLOIEMENT**

### **Avant le Déploiement**
- [ ] Code testé localement
- [ ] Variables d'environnement préparées
- [ ] Base de données MongoDB Atlas créée
- [ ] Comptes Vercel et Render créés

### **Déploiement Backend**
- [ ] Service Render créé
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] Déploiement réussi
- [ ] Endpoint /api/health fonctionnel

### **Déploiement Frontend**
- [ ] Projet Vercel créé
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Déploiement réussi
- [ ] Site accessible

### **Tests Finaux**
- [ ] Connexion frontend-backend
- [ ] Fonctionnalités principales
- [ ] Interface admin
- [ ] Système de commentaires
- [ ] Performance acceptable

---

## 🎉 **APRÈS LE DÉPLOIEMENT**

### **URLs de Production**
```
🌐 Site principal : https://bowoye-frontend.vercel.app
🔧 API Backend : https://bowoye-backend.onrender.com/api
📊 Dashboard Vercel : https://vercel.com/dashboard
⚙️ Dashboard Render : https://dashboard.render.com
```

### **Prochaines Étapes**
```
✅ Configurer un domaine personnalisé
✅ Activer les analytics
✅ Configurer les sauvegardes
✅ Planifier la maintenance
✅ Former l'équipe à l'utilisation
```

---

## 📞 **SUPPORT**

### **Documentation**
- 📚 Vercel Docs : https://vercel.com/docs
- 📚 Render Docs : https://render.com/docs
- 📚 MongoDB Atlas Docs : https://docs.atlas.mongodb.com

### **Support Technique**
- 🔧 Vercel Support : Via dashboard
- 🔧 Render Support : Via dashboard
- 🔧 MongoDB Support : Via atlas

---

**🚀 Votre plateforme e-commerce sera bientôt en ligne !**

*Guide de Déploiement Vercel + Render - Bowoye Multi Services*
*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*
