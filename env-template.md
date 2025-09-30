# 🔧 Template des Variables d'Environnement

## 📋 Configuration pour le Déploiement

### **Backend (Render) - Variables d'Environnement**

```bash
# Environnement
NODE_ENV=production

# Port (Render utilise le port 10000 par défaut)
PORT=10000

# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bowoye_production?retryWrites=true&w=majority

# Clé secrète JWT (générer une clé longue et complexe)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-complex

# CORS - URL de votre frontend Vercel
CORS_ORIGIN=https://bowoye-frontend.vercel.app

# Optionnel - Configuration email (pour les notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **Frontend (Vercel) - Variables d'Environnement**

```bash
# URL de l'API backend (votre service Render)
REACT_APP_API_URL=https://bowoye-backend.onrender.com/api

# Environnement
REACT_APP_ENVIRONMENT=production

# Version de l'application
REACT_APP_VERSION=1.0.0

# Optionnel - Configuration Google Analytics
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX

# Optionnel - Configuration Facebook Pixel
REACT_APP_FB_PIXEL_ID=123456789012345
```

---

## 🗄️ **Configuration MongoDB Atlas**

### **Étapes pour créer MongoDB Atlas :**

1. **Créer un compte** sur https://cloud.mongodb.com
2. **Créer un cluster** (choisir le plan gratuit M0)
3. **Configurer l'accès réseau** :
   - Ajouter l'IP 0.0.0.0/0 (accès depuis partout)
4. **Créer un utilisateur de base de données** :
   - Username : `bowoye_admin`
   - Password : `votre-mot-de-passe-securise`
5. **Récupérer la chaîne de connexion** :
   ```
   mongodb+srv://bowoye_admin:votre-mot-de-passe@cluster0.xxxxx.mongodb.net/bowoye_production?retryWrites=true&w=majority
   ```

---

## 🔑 **Génération de Clés Secrètes**

### **JWT Secret (pour l'authentification)**
```bash
# Générer une clé JWT sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Exemple de clé JWT :**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

---

## 📝 **Instructions de Configuration**

### **Sur Render (Backend) :**

1. Aller dans votre service Render
2. Cliquer sur "Environment"
3. Ajouter chaque variable une par une :

```
Variable: NODE_ENV
Value: production

Variable: PORT
Value: 10000

Variable: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/bowoye_production

Variable: JWT_SECRET
Value: votre-clé-jwt-très-longue-et-complexe

Variable: CORS_ORIGIN
Value: https://bowoye-frontend.vercel.app
```

### **Sur Vercel (Frontend) :**

1. Aller dans votre projet Vercel
2. Cliquer sur "Settings" → "Environment Variables"
3. Ajouter chaque variable :

```
Variable: REACT_APP_API_URL
Value: https://bowoye-backend.onrender.com/api

Variable: REACT_APP_ENVIRONMENT
Value: production

Variable: REACT_APP_VERSION
Value: 1.0.0
```

---

## ⚠️ **Sécurité**

### **Variables Sensibles :**
- ✅ `JWT_SECRET` : Garder secret et complexe
- ✅ `MONGODB_URI` : Contient le mot de passe de la DB
- ✅ `EMAIL_PASS` : Mot de passe de l'email

### **Variables Publiques :**
- ✅ `REACT_APP_*` : Accessibles côté client
- ✅ `NODE_ENV` : Environnement de déploiement
- ✅ `PORT` : Port du serveur

---

## 🧪 **Test des Variables**

### **Vérifier le Backend :**
```bash
# Tester l'endpoint de santé
curl https://bowoye-backend.onrender.com/api/health

# Réponse attendue :
{"status":"OK","message":"Server is running","timestamp":"2024-01-01T12:00:00.000Z"}
```

### **Vérifier le Frontend :**
```bash
# Vérifier que les variables sont chargées
# Ouvrir la console du navigateur et taper :
console.log(process.env.REACT_APP_API_URL)
// Devrait afficher : https://bowoye-backend.onrender.com/api
```

---

## 🔧 **Dépannage**

### **Erreurs Courantes :**

#### **Backend ne démarre pas :**
```
❌ Vérifier MONGODB_URI
❌ Vérifier JWT_SECRET
❌ Vérifier le port (10000)
```

#### **Frontend ne se connecte pas :**
```
❌ Vérifier REACT_APP_API_URL
❌ Vérifier CORS_ORIGIN
❌ Vérifier que le backend est accessible
```

#### **Erreurs de base de données :**
```
❌ Vérifier les credentials MongoDB
❌ Vérifier l'accès réseau Atlas
❌ Vérifier la chaîne de connexion
```

---

*Template des Variables d'Environnement - Bowoye Multi Services*
*Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}*
