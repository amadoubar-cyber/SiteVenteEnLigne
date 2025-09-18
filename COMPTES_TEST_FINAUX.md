# 🔐 Comptes de Test Finaux - Bowoye Multi Services

## ✅ **Tous les comptes de test ont été créés !**

### **👥 Comptes Disponibles :**

#### **1. Client (Utilisateur normal) :**
- **Email :** client@koula.gn
- **Mot de passe :** password123
- **Rôle :** Utilisateur standard
- **Accès :** Interface client, commandes, profil

#### **2. Administrateur :**
- **Email :** admin@koula.gn
- **Mot de passe :** admin123
- **Rôle :** Administrateur
- **Accès :** Interface admin complète

#### **3. Super Administrateur :**
- **Email :** superadmin@koula.gn
- **Mot de passe :** superadmin123
- **Rôle :** Super Administrateur
- **Accès :** Toutes les fonctionnalités

## 🚀 **Instructions de Démarrage :**

### **1. Démarrer le Backend :**
```bash
cd server
npm run dev
```
**Attendez :** `🚀 Serveur Koula E-commerce démarré sur le port 3001`

### **2. Démarrer le Frontend :**
```bash
cd client
npm start
```
**Attendez :** `Compiled successfully!`

## 🧪 **Tests de Connexion :**

### **Test Client :**
1. Allez sur http://localhost:3000
2. Cliquez sur "Se connecter"
3. Utilisez : **client@koula.gn** / **password123**
4. ✅ Vous devriez accéder à l'interface client

### **Test Admin :**
1. Allez sur http://localhost:3000
2. Cliquez sur "Connexion Administrateur"
3. Utilisez : **admin@koula.gn** / **admin123**
4. ✅ Vous devriez accéder à l'interface admin

### **Test Super Admin :**
1. Allez sur http://localhost:3000
2. Cliquez sur "Connexion Administrateur"
3. Utilisez : **superadmin@koula.gn** / **superadmin123**
4. ✅ Vous devriez accéder à l'interface admin

## 🎯 **Fonctionnalités à Tester :**

### **En tant que Client :**
- ✅ Parcourir les produits
- ✅ Ajouter au panier
- ✅ Passer commande
- ✅ Voir l'historique des commandes

### **En tant qu'Admin :**
- ✅ Gérer les produits (ajouter, modifier, supprimer)
- ✅ **Upload d'images** (section jaune vif visible)
- ✅ Gérer les commandes
- ✅ Gérer les utilisateurs
- ✅ Contrôle de stock
- ✅ Gestion des ventes
- ✅ Gestion des dettes

## 🔧 **En cas de problème :**

1. **Vérifiez que les deux serveurs sont démarrés**
2. **Vérifiez les ports :** Frontend (3000), Backend (3001)
3. **Rafraîchissez la page** (Ctrl + F5)
4. **Vérifiez la console** pour les erreurs

## 📱 **URLs de Test :**

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001/api
- **Connexion Client :** http://localhost:3000 → "Se connecter"
- **Connexion Admin :** http://localhost:3000 → "Connexion Administrateur"

---
*Tous les comptes de test sont maintenant prêts !* 🎉
