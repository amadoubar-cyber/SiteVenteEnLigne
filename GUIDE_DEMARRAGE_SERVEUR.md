# 🚀 GUIDE - Démarrer le Serveur pour Activation des Emails

## 🔍 **Problème Identifié :**

L'erreur `net::ERR_CONNECTION_REFUSED` sur `localhost:3001` indique que le serveur backend n'est pas démarré.

## ✅ **Solution Étapes par Étapes :**

### **Étape 1 : Ouvrir un Terminal**
1. Ouvrez l'**Invite de commandes** (CMD) ou **PowerShell**
2. Naviguez vers votre projet :
   ```cmd
   cd C:\Users\user\Desktop\DIALLO\Mon_projet_vente_en_ligne
   ```

### **Étape 2 : Démarrer le Serveur Backend**
```cmd
cd server
npm start
```

**Ou alternativement :**
```cmd
cd server
node index.js
```

### **Étape 3 : Vérifier le Démarrage**
Vous devriez voir dans la console :
```
🚀 Serveur Koula E-commerce démarré sur le port 3001
📱 Environnement: development
🌐 API disponible sur: http://localhost:3001/api
```

### **Étape 4 : Tester l'API**
Ouvrez votre navigateur et allez sur :
```
http://localhost:3001/api/health
```

Vous devriez voir une réponse JSON avec `"success": true`.

## 🧪 **Test du Système Email :**

### **Prérequis :**
- ✅ Serveur backend démarré sur port 3001
- ✅ Client React démarré sur port 3000

### **Test Inscription :**
1. Allez sur `http://localhost:3000`
2. Cliquez **"Créer un compte"**
3. Remplissez le formulaire avec votre **vrai email**
4. Cliquez **"Créer votre compte"**
5. **Vérifiez votre email** pour recevoir le code OTP
6. Saisissez le code dans le modal de vérification

## 📧 **Configuration Email Validée :**

- ✅ **Service :** Gmail
- ✅ **Expéditeur :** amadoubarkere4@gmail.com
- ✅ **Authentification :** Mot de passe d'application configuré
- ✅ **Template :** Email HTML professionnel avec code OTP

## 🚨 **Dépannage Rapide :**

### **Erreur : Port déjà utilisé**
```cmd
netstat -an | findstr :3001
```
Si quelque chose utilise le port 3001, arrêtez le processus ou changez le port.

### **Erreur : Module non trouvé**
```cmd
cd server
npm install
npm start
```

### **Erreur : MongoDB**
Si MongoDB n'est pas démarré, le serveur essaiera de se connecter à MongoDB Atlas (cloud).

---

**Une fois le serveur démarré sur le port 3001, le système de vérification email fonctionnera parfaitement !** 🎉
