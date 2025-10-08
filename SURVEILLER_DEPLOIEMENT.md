# 👀 Comment Surveiller Votre Déploiement Render

## 🌐 ÉTAPE 1: Accéder au Dashboard Render

1. **Ouvrez votre navigateur** (Chrome, Firefox, Edge, etc.)

2. **Allez sur:** https://dashboard.render.com

3. **Connectez-vous** avec vos identifiants Render

---

## 📱 ÉTAPE 2: Trouver Votre Service

Une fois connecté, vous verrez la liste de vos services.

**Cherchez:** `bowoye-backend`

### Ce que vous allez voir:

```
┌─────────────────────────────────────────┐
│ 🟢 bowoye-backend                      │  ← C'est votre service
│ Web Service                             │
│ Status: Live / Deploying / Failed      │  ← Le statut actuel
│ Last updated: il y a X minutes         │
└─────────────────────────────────────────┘
```

### Les 3 Statuts Possibles:

| Statut | Couleur | Signification |
|--------|---------|---------------|
| **🟢 Live** | Vert | ✅ Tout marche, service en ligne |
| **🟡 Deploying** | Jaune | ⏳ Déploiement en cours (2-5 min) |
| **🔴 Failed** | Rouge | ❌ Erreur - besoin de vérifier les logs |

---

## 🔍 ÉTAPE 3: Voir Les Logs en Temps Réel

**1. Cliquez sur** `bowoye-backend`

**2. Dans le menu de gauche, cliquez sur** `Logs`

**3. Vous verrez un écran avec 3 onglets:**
   - **Deploy Logs** - Les logs du déploiement en cours
   - **Build Logs** - Les logs de l'installation des dépendances
   - **Service Logs** - Les logs du serveur qui tourne

---

## ✅ Ce Que Vous Devriez Voir (Déploiement Réussi)

### Dans "Build Logs":
```
==> Cloning from https://github.com/votre-username/...
==> Checking out commit 779bf04...
==> Running build command: cd server && npm ci --only=production
npm WARN deprecated ...
added 150 packages in 45s
==> Build successful! ✅
```

### Dans "Deploy Logs":
```
==> Deploying...
==> Starting service with 'cd server && NODE_ENV=production node index.js'
Tentative de connexion à MongoDB...
✅ MongoDB connecté: cluster0.xxxxx.mongodb.net
📊 Base de données: bowoye_production
🚀 Serveur Koula E-commerce démarré sur le port 10000
📱 Environnement: production
🌐 API disponible sur: http://localhost:10000/api
✅ Health check: http://localhost:10000/api/health
==> Your service is live at https://bowoye-backend.onrender.com 🎉
```

---

## ❌ Ce Que Vous Pourriez Voir (Si Erreur)

### Erreur 1: MongoDB Non Connecté
```
❌ Erreur de connexion à MongoDB: MONGODB_URI n'est pas défini
```

**SOLUTION:**
1. Allez dans **Environment** (menu de gauche)
2. Vérifiez que `MONGODB_URI` existe
3. Si vide, cliquez sur **Database** → sélectionnez `bowoye-db`

---

### Erreur 2: Port Non Disponible
```
Error: listen EADDRINUSE: address already in use :::10000
```

**SOLUTION:**
- Cliquez sur **Manual Deploy** → **Clear build cache & deploy**

---

### Erreur 3: Dépendances Manquantes
```
Error: Cannot find module 'express'
```

**SOLUTION:**
1. Vérifiez que `server/package.json` est bien sur GitHub
2. Cliquez sur **Manual Deploy** → **Deploy latest commit**

---

## 🧪 ÉTAPE 4: Tester Votre API

### Test 1: Health Check (Le Plus Important)

**Dans votre navigateur, allez sur:**
```
https://bowoye-backend.onrender.com/api/health
```

**Vous devriez voir:**
```json
{
  "success": true,
  "message": "API Koula E-commerce fonctionne correctement",
  "timestamp": "2025-10-08T12:34:56.789Z",
  "environment": "production"
}
```

✅ **Si vous voyez ça → SUCCÈS TOTAL !**

---

### Test 2: Endpoint Produits

**Dans votre navigateur:**
```
https://bowoye-backend.onrender.com/api/products
```

**Vous devriez voir:**
```json
{
  "success": true,
  "data": [...],
  "message": "Produits récupérés avec succès"
}
```

---

### Test 3: Avec PowerShell/Terminal (Optionnel)

```powershell
# Test Health Check
curl https://bowoye-backend.onrender.com/api/health

# Test Produits
curl https://bowoye-backend.onrender.com/api/products
```

---

## ⏱️ TIMELINE DU DÉPLOIEMENT

| Temps | Étape | Ce Qui Se Passe |
|-------|-------|-----------------|
| **0:00** | Push GitHub | Vous avez poussé le code |
| **0:10** | Render détecte | Render voit le nouveau commit |
| **0:20** | Clone | Render télécharge le code |
| **0:30-2:00** | Build | Installation des dépendances |
| **2:00-2:30** | Deploy | Démarrage du serveur |
| **2:30-3:00** | Health Check | Render vérifie /api/health |
| **3:00** | ✅ Live | Service en ligne ! |

**Temps total moyen:** 3-5 minutes

---

## 🔔 Notifications Email

Render vous enverra automatiquement un email:

### ✅ Si Succès:
```
Subject: Deploy succeeded for bowoye-backend
Your deploy completed successfully!
View Service: [Lien]
```

### ❌ Si Échec:
```
Subject: Deploy failed for bowoye-backend
We encountered an error during the deploy process
View Logs: [Lien]
```

---

## 📞 Actions Rapides

### Si le Déploiement Échoue ENCORE:

1. **Copiez les logs d'erreur** (tout le texte rouge)
2. **Vérifiez les variables d'environnement:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb://...` (doit être rempli)
   - `JWT_SECRET` = (généré automatiquement)

3. **Vérifiez que la base de données existe:**
   - Dashboard → Databases → `bowoye-db` doit être "Available"

4. **Essayez un redéploiement manuel:**
   - Dashboard → bowoye-backend → Manual Deploy → Deploy latest commit

---

## ✅ CHECKLIST FINALE

Avant de confirmer que tout marche:

- [ ] Dashboard montre **🟢 Live** en vert
- [ ] Les logs montrent "✅ MongoDB connecté"
- [ ] Les logs montrent "🚀 Serveur démarré sur le port 10000"
- [ ] `https://bowoye-backend.onrender.com/api/health` retourne 200 OK
- [ ] Pas d'erreur rouge dans les logs
- [ ] Email de succès reçu (si notifications activées)

---

## 🎯 PROCHAINES ÉTAPES (Après Succès)

1. **Mettez à jour votre frontend** pour utiliser la nouvelle URL:
   ```
   https://bowoye-backend.onrender.com
   ```

2. **Testez toutes les fonctionnalités:**
   - Connexion
   - Création de produit
   - Commandes
   - Etc.

3. **Configurez un nom de domaine personnalisé** (optionnel)
   - Dashboard → bowoye-backend → Settings → Custom Domain

---

## 🆘 BESOIN D'AIDE?

Si vous voyez des erreurs, prenez une capture d'écran de:
1. Le statut du service (🟢/🟡/🔴)
2. Les logs (les 20 dernières lignes)
3. Les variables d'environnement

Et je pourrai vous aider à diagnostiquer le problème !

---

**Date de création:** 8 octobre 2025  
**Objectif:** Surveillance du déploiement Render  
**Temps estimé:** 5-7 minutes

