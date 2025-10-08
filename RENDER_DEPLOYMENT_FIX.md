# 🚀 Guide de Résolution du Déploiement Render - Bowoye Backend

## ❌ Problème Identifié

Votre déploiement sur Render a échoué. Voici les corrections apportées et les étapes à suivre.

## ✅ Corrections Apportées

### 1. **Configuration MongoDB (server/config/database.js)**
- ✅ Suppression des options Mongoose dépréciées (`useNewUrlParser`, `useUnifiedTopology`)
- ✅ Ajout de validation de l'URI MongoDB
- ✅ Meilleurs logs d'erreur pour le debugging

### 2. **Configuration du Serveur (server/index.js)**
- ✅ Validation des variables d'environnement en production
- ✅ Binding sur `0.0.0.0` pour accepter les connexions externes
- ✅ Logs améliorés pour le health check

### 3. **Configuration Render (render.yaml)**
- ✅ Utilisation de `npm ci --only=production` (plus rapide et fiable)
- ✅ Ajout de la région `frankfurt` (plus proche de l'Europe/Afrique)
- ✅ Configuration explicite de `NODE_ENV` dans startCommand
- ✅ Activation de l'auto-déploiement
- ✅ Configuration IP allowlist pour la base de données

## 📋 Étapes de Déploiement

### Étape 1: Vérification Locale (Optionnel mais Recommandé)

```bash
# Aller dans le dossier server
cd server

# Installer les dépendances
npm install

# Vérifier que le serveur démarre (avec une base de données locale ou de test)
npm start
```

### Étape 2: Commit et Push vers GitHub

```bash
# Retourner à la racine du projet
cd ..

# Ajouter les modifications
git add server/config/database.js server/index.js render.yaml

# Commiter les changements
git commit -m "Fix: Correction configuration Render - suppression options Mongoose dépréciées"

# Pusher vers GitHub
git push origin main
```

### Étape 3: Redéploiement sur Render

#### Option A: Déploiement Automatique (si configuré)
- Le push vers GitHub devrait déclencher automatiquement un nouveau déploiement
- Attendez 2-5 minutes
- Vérifiez les logs sur Render Dashboard

#### Option B: Déploiement Manuel
1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Sélectionnez votre service `bowoye-backend`
3. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
4. Surveillez les logs en temps réel

### Étape 4: Vérification des Variables d'Environnement

Sur Render Dashboard, vérifiez que ces variables sont bien configurées:

#### Variables Requises:
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `10000`
- ✅ `MONGODB_URI` = (lien depuis la base de données Render)
- ✅ `JWT_SECRET` = (généré automatiquement ou personnalisé)
- ✅ `CORS_ORIGIN` = `https://bowoye-frontend.vercel.app`
- ✅ `CLIENT_URL` = `https://bowoye-frontend.vercel.app`

#### Pour vérifier:
1. Allez sur votre service `bowoye-backend`
2. Cliquez sur **"Environment"** dans le menu latéral
3. Vérifiez que toutes les variables sont présentes
4. Si `MONGODB_URI` est vide, vérifiez que la base de données `bowoye-db` est bien créée

### Étape 5: Vérification de la Base de Données

1. Sur Render Dashboard, allez dans **"Databases"**
2. Vérifiez que `bowoye-db` existe et est **"Available"**
3. Si la base n'existe pas:
   - Cliquez sur **"New +"** → **"PostgreSQL"** (ou MongoDB si vous utilisez MongoDB Atlas)
   - Nom: `bowoye-db`
   - Plan: Free
   - Créez la base

### Étape 6: Vérification du Déploiement

Une fois le déploiement terminé, testez votre API:

```bash
# Remplacez YOUR_RENDER_URL par votre URL Render
curl https://YOUR_RENDER_URL.onrender.com/api/health
```

Réponse attendue:
```json
{
  "success": true,
  "message": "API Koula E-commerce fonctionne correctement",
  "timestamp": "2025-10-08T...",
  "environment": "production"
}
```

## 🔍 Diagnostic des Erreurs Courantes

### Erreur 1: "MONGODB_URI n'est pas défini"

**Solution:**
1. Vérifiez que la base de données `bowoye-db` existe
2. Dans les variables d'environnement du service, vérifiez que `MONGODB_URI` pointe vers `bowoye-db`
3. Re-déployez le service

### Erreur 2: "Application failed to respond"

**Causes possibles:**
- Le serveur ne démarre pas sur le port 10000
- Les dépendances npm ne s'installent pas correctement
- Erreur de connexion MongoDB

**Solution:**
1. Consultez les logs de build: **Logs** → **Build Logs**
2. Consultez les logs d'exécution: **Logs** → **Deploy Logs**
3. Recherchez les messages d'erreur rouges (❌)

### Erreur 3: "Build failed"

**Solution:**
1. Vérifiez que `server/package.json` existe
2. Vérifiez qu'il n'y a pas d'erreurs de syntaxe dans le code
3. Essayez de builder localement: `cd server && npm ci`

### Erreur 4: Connexion MongoDB timeout

**Solution:**
1. Vérifiez que `ipAllowList: []` est bien dans render.yaml (permet toutes les IPs)
2. Ou ajoutez manuellement les IPs de Render dans MongoDB Atlas (si vous utilisez Atlas)

## 📊 Surveillance du Déploiement

### Logs en Temps Réel
1. Allez sur Render Dashboard → `bowoye-backend`
2. Cliquez sur **"Logs"**
3. Vous devriez voir:
   ```
   Tentative de connexion à MongoDB...
   ✅ MongoDB connecté: ...
   📊 Base de données: bowoye_production
   🚀 Serveur Koula E-commerce démarré sur le port 10000
   📱 Environnement: production
   🌐 API disponible sur: http://localhost:10000/api
   ✅ Health check: http://localhost:10000/api/health
   ```

### Métriques
- **CPU Usage**: Devrait être < 50%
- **Memory**: Devrait être < 512MB
- **Response Time**: Devrait être < 1000ms

## 🆘 Support Supplémentaire

Si le problème persiste après ces corrections:

1. **Consultez les logs détaillés:**
   ```
   Render Dashboard → bowoye-backend → Logs → Deploy Logs
   ```

2. **Vérifiez les événements:**
   ```
   Render Dashboard → bowoye-backend → Events
   ```

3. **Testez localement:**
   ```bash
   cd server
   NODE_ENV=production PORT=10000 node index.js
   ```

4. **Variables d'environnement de test locale:**
   - Créez un fichier `.env` dans le dossier `server/`
   - Copiez le contenu de `server/.env.example`
   - Remplissez avec vos vraies valeurs

## 📝 Checklist Finale

Avant de valider le déploiement, vérifiez:

- [ ] Modifications committées et pushées sur GitHub
- [ ] Base de données `bowoye-db` créée et disponible
- [ ] Toutes les variables d'environnement configurées
- [ ] Build réussi (pas d'erreurs dans Build Logs)
- [ ] Serveur démarré (logs montrent "Serveur démarré")
- [ ] Health check répond: `/api/health` retourne 200
- [ ] API accessible depuis l'URL Render

## 🎯 Prochaines Étapes

Une fois le backend déployé avec succès:

1. **Mettez à jour le frontend** pour utiliser la nouvelle URL backend
2. **Testez toutes les fonctionnalités** (login, produits, commandes, etc.)
3. **Configurez les notifications email** (si nécessaire)
4. **Ajoutez un nom de domaine personnalisé** (optionnel)

---

**Date de création:** 8 octobre 2025  
**Version:** 1.0  
**Auteur:** Assistant de Déploiement

