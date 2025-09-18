# 🚀 Guide de Démarrage Rapide - Koula E-commerce

## 📋 Prérequis
- Node.js installé
- Navigateur web moderne

## 🎯 Démarrage Rapide

### Option 1 : Démarrage Automatique (Recommandé)
```bash
# Windows
start-app.bat

# Linux/Mac
./start-app.sh
```

### Option 2 : Démarrage Manuel
```bash
# Terminal 1 - Client React
cd client
npm start

# Terminal 2 - Serveur Node.js
cd server
npm start
```

## 🔐 Comptes de Test Disponibles

### 👤 Comptes Clients
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `client@koula.gn` | `password123` | Client |
| `marie@koula.gn` | `password123` | Client |

### 👑 Compte Administrateur
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@koula.gn` | `admin123` | Administrateur |

## 🌐 URLs d'Accès

### 🏠 Site Principal
- **URL :** http://localhost:3000
- **Fonctionnalités :** Navigation, produits, panier, commandes

### 🔧 Interface Admin
- **URL :** http://localhost:3000/admin
- **Redirection automatique :** Vers la connexion ou l'admin selon l'état

### 🔑 Connexion Admin
- **URL :** http://localhost:3000/admin-login
- **Interface :** Page de connexion dédiée

### 📊 Comptes de Test
- **URL :** http://localhost:3000/test-accounts
- **Fonctionnalités :** Voir tous les comptes disponibles

## 🛠️ Fonctionnalités Principales

### 🛍️ Gestion des Produits
- ✅ Création, modification, suppression
- ✅ Upload d'images
- ✅ Galerie d'images en grand
- ✅ Statuts (Publié/Brouillon, Vedette)
- ✅ Persistance des données

### 📦 Gestion des Commandes
- ✅ Création de commandes
- ✅ Gestion des articles
- ✅ Calcul automatique des totaux
- ✅ Mise à jour automatique du stock

### 📈 Gestion du Stock
- ✅ Mouvements d'entrée/sortie
- ✅ Statistiques avancées
- ✅ Historique par produit
- ✅ Mise à jour automatique

### 👥 Gestion des Utilisateurs
- ✅ Connexion/Déconnexion
- ✅ Inscription
- ✅ Profils utilisateurs
- ✅ Authentification sécurisée

## 🧪 Test de Persistance

### Page de Test
- **URL :** http://localhost:3000/test-persistence.html
- **Fonctionnalités :** Tester la sauvegarde des données

### Vérification des Données
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Application" ou "Storage"
3. Vérifier la section "Local Storage"
4. Les clés suivantes doivent être présentes :
   - `adminProducts` : Produits
   - `orders` : Commandes
   - `stockMovements` : Mouvements de stock
   - `token` : Token d'authentification
   - `user` : Données utilisateur

## 🔧 Résolution de Problèmes

### ❌ Problème : Les produits disparaissent après actualisation
**Solution :** Vérifier que `localStorage` contient la clé `adminProducts`

### ❌ Problème : Impossible de se connecter
**Solution :** Utiliser les comptes de test fournis

### ❌ Problème : Images ne s'affichent pas
**Solution :** Vérifier que les images de test sont dans `client/public/`

### ❌ Problème : Serveur ne démarre pas
**Solution :** Vérifier que le port 3001 est libre

## 📱 Navigation

### 🏠 Page d'Accueil
- Navigation principale
- Produits en vedette
- Liens vers les sections

### 🛍️ Produits
- Liste des produits
- Filtres et recherche
- Détails des produits

### 🛒 Panier
- Articles sélectionnés
- Calcul des totaux
- Processus de commande

### 👤 Profil
- Informations utilisateur
- Historique des commandes
- Paramètres

### 🔧 Admin
- Gestion des produits
- Gestion des commandes
- Gestion du stock
- Statistiques

## 🎨 Personnalisation

### 🎨 Couleurs
- Bleu principal : `#3B82F6`
- Vert succès : `#10B981`
- Rouge erreur : `#EF4444`
- Gris neutre : `#6B7280`

### 📱 Responsive
- Mobile-first design
- Breakpoints : 640px, 768px, 1024px
- Navigation adaptative

## 📞 Support

### 🐛 Signaler un Bug
1. Décrire le problème
2. Indiquer les étapes pour le reproduire
3. Inclure les messages d'erreur

### 💡 Suggestion d'Amélioration
1. Décrire la fonctionnalité souhaitée
2. Expliquer l'utilité
3. Proposer une implémentation

## 🎉 Félicitations !

Vous avez maintenant accès à une application e-commerce complète avec :
- ✅ Interface utilisateur moderne
- ✅ Gestion administrative complète
- ✅ Système d'authentification
- ✅ Persistance des données
- ✅ Gestion du stock
- ✅ Système de commandes

**Bon développement ! 🚀**
