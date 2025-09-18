# 🧪 Test Rapide - Koula E-commerce

## 🚀 Démarrage Express

### Option 1 : Script PowerShell (Recommandé)
```powershell
.\start-app.ps1
```

### Option 2 : Script Batch
```cmd
start-app.bat
```

### Option 3 : Manuel
```cmd
# Terminal 1
cd client
npm start

# Terminal 2  
cd server
npm start
```

## 🔐 Connexion Test

### 1. Ouvrir l'application
- **URL :** http://localhost:3000
- **Attendre :** Que l'application se charge complètement

### 2. Se connecter
- **Cliquer :** "Client" dans le menu
- **Email :** `client@koula.gn`
- **Mot de passe :** `password123`
- **Cliquer :** "Se connecter"

## 🛍️ Test des Produits

### 1. Vérifier la page d'accueil
- **Vérifier :** Que des produits s'affichent
- **Si vide :** Aller à l'interface admin pour créer des produits

### 2. Naviguer vers Électronique
- **Cliquer :** "Électronique" dans le menu
- **Vérifier :** Que les produits électroniques s'affichent
- **Si vide :** Créer des produits dans l'admin

### 3. Naviguer vers Construction
- **Cliquer :** "Construction" dans le menu
- **Vérifier :** Que les produits de construction s'affichent

## 🔧 Test de l'Interface Admin

### 1. Accéder à l'admin
- **URL :** http://localhost:3000/admin
- **Redirection :** Vers la page de connexion admin

### 2. Se connecter en admin
- **Email :** `admin@koula.gn`
- **Mot de passe :** `admin123`

### 3. Créer des produits
- **Aller :** Section "Produits"
- **Cliquer :** "Ajouter un produit"
- **Remplir :** Les champs obligatoires
- **Cocher :** "Publié immédiatement"
- **Sauvegarder :** Le produit

### 4. Vérifier la persistance
- **Actualiser :** La page (F5)
- **Vérifier :** Que le produit est toujours là

## 🧪 Test de Persistance

### 1. Ouvrir la page de test
- **URL :** http://localhost:3000/test-persistence.html
- **Cliquer :** "Vérifier localStorage"
- **Vérifier :** Que les données sont présentes

### 2. Tester les produits
- **Cliquer :** "Ajouter un produit de test"
- **Cliquer :** "Charger les produits"
- **Vérifier :** Que le produit apparaît

## 🔍 Vérification des Données

### 1. Ouvrir les outils de développement
- **Appuyer :** F12
- **Aller :** Onglet "Application" ou "Storage"
- **Cliquer :** "Local Storage" → "http://localhost:3000"

### 2. Vérifier les clés
- **adminProducts :** Liste des produits
- **token :** Token d'authentification
- **user :** Données utilisateur

## ❌ Résolution de Problèmes

### Problème : Aucun produit visible
**Solution :**
1. Aller dans l'interface admin
2. Créer des produits
3. Cocher "Publié immédiatement"
4. Sauvegarder

### Problème : Impossible de se connecter
**Solution :**
1. Utiliser les comptes de test fournis
2. Vérifier l'orthographe des identifiants
3. Aller sur http://localhost:3000/test-accounts

### Problème : Images ne s'affichent pas
**Solution :**
1. Vérifier que les images de test sont dans `client/public/`
2. Utiliser les images de test fournies

### Problème : Données disparaissent
**Solution :**
1. Vérifier que `localStorage` contient les données
2. Ne pas vider le cache du navigateur

## ✅ Checklist de Test

- [ ] Application démarre sans erreur
- [ ] Connexion client fonctionne
- [ ] Connexion admin fonctionne
- [ ] Produits s'affichent côté client
- [ ] Produits persistent après actualisation
- [ ] Interface admin fonctionne
- [ ] Création de produits fonctionne
- [ ] Images s'affichent correctement
- [ ] Filtres et recherche fonctionnent
- [ ] Panier fonctionne

## 🎉 Succès !

Si tous les tests passent, l'application fonctionne correctement !

**Prochaines étapes :**
1. Créer plus de produits
2. Tester les commandes
3. Tester la gestion du stock
4. Personnaliser l'interface
