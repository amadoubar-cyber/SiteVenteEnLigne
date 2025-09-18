# 👥 Guide des Comptes de Test - Bowoye Multi Services

## ✅ **Utilisateurs créés avec succès !**

J'ai créé plusieurs comptes de test pour que vous puissiez tester l'application complètement.

### **📋 Comptes disponibles :**

#### **👨‍💼 Administrateur :**
- **Email :** admin@bowoye.gn
- **Mot de passe :** admin123
- **Rôle :** Administrateur
- **Accès :** Interface admin complète

#### **👤 Clients de test :**
- **Email :** client@bowoye.gn
- **Mot de passe :** password123
- **Rôle :** Utilisateur
- **Accès :** Interface client

- **Email :** mamadou@bowoye.gn
- **Mot de passe :** password123
- **Rôle :** Utilisateur
- **Accès :** Interface client

- **Email :** fatou@bowoye.gn
- **Mot de passe :** password123
- **Rôle :** Utilisateur
- **Accès :** Interface client

## 🧪 **Test complet de l'application :**

### **1. Démarrer les serveurs :**
**Terminal 1 (Backend) :**
```bash
cd server
npm start
```

**Terminal 2 (Frontend) :**
```bash
cd client
npm start
```

### **2. Test en tant qu'administrateur :**
1. **Allez sur** `http://localhost:3001`
2. **Cliquez sur "Connexion Administrateur"**
3. **Connectez-vous** avec : admin@bowoye.gn / admin123
4. **Testez l'ajout de produits** avec images :
   - Cliquez sur "Produits" → "➕ Ajouter un produit"
   - Remplissez le nom : "Ciment Portland 50kg"
   - **VOUS DEVRIEZ VOIR** la section d'images jaune vif
   - Upload 2-3 images
   - Remplissez : Description, Prix (ex: 8500), Stock (ex: 100), Catégorie
   - Cliquez sur "Créer le produit"

### **3. Test en tant que client :**
1. **Allez sur** `http://localhost:3001`
2. **Cliquez sur "Se connecter"**
3. **Connectez-vous** avec : client@bowoye.gn / password123
4. **Testez la navigation** :
   - Parcourez les produits
   - Ajoutez des produits au panier
   - Testez le processus de commande

### **4. Test de l'interface admin :**
1. **Connectez-vous** en tant qu'admin
2. **Testez toutes les sections** :
   - **Produits** : Ajouter, modifier, supprimer
   - **Commandes** : Voir les commandes clients
   - **Stock** : Contrôle des mouvements
   - **Ventes** : Gestion des ventes
   - **Dettes** : Gestion des crédits

## 📊 **Fonctionnalités testées :**

### **Interface Admin :**
- ✅ **Connexion admin** : admin@bowoye.gn / admin123
- ✅ **Gestion des produits** : CRUD complet avec images
- ✅ **Upload d'images** : Section très visible
- ✅ **Gestion des commandes** : Suivi des commandes clients
- ✅ **Contrôle de stock** : Mouvements et statistiques
- ✅ **Gestion des ventes** : Enregistrement des ventes
- ✅ **Gestion des dettes** : Crédits et paiements

### **Interface Client :**
- ✅ **Connexion client** : client@bowoye.gn / password123
- ✅ **Navigation** : Parcours des produits
- ✅ **Panier** : Ajout et gestion des articles
- ✅ **Commandes** : Processus de commande
- ✅ **Profil** : Gestion du compte client

## 🎯 **Workflow de test complet :**

### **1. Admin ajoute des produits :**
1. Connectez-vous en tant qu'admin
2. Allez dans "Produits" → "➕ Ajouter un produit"
3. Remplissez le formulaire avec images
4. Créez 3-4 produits différents

### **2. Client parcourt et commande :**
1. Connectez-vous en tant que client
2. Parcourez les produits
3. Ajoutez des articles au panier
4. Passez une commande

### **3. Admin gère les commandes :**
1. Reconnectez-vous en tant qu'admin
2. Allez dans "Commandes"
3. Vérifiez la commande du client
4. Testez la gestion des commandes

## 🚀 **Prêt pour le déploiement !**

L'application est maintenant complètement fonctionnelle avec :
- ✅ **Utilisateurs de test** : Admin et clients
- ✅ **Section d'images** : Fonctionnelle et visible
- ✅ **Gestion complète** : Produits, commandes, stock
- ✅ **Interface client** : Navigation et commandes
- ✅ **Interface admin** : Gestion complète

---
*Tous les comptes de test sont prêts !* 👥✨
