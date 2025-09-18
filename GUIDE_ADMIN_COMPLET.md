# 🎯 Guide Complet - Interface Admin

## 📋 **Comment accéder à l'interface admin**

### 1. **Connexion en tant qu'admin**
- Allez sur la page de connexion : `/login`
- Utilisez les identifiants admin :
  - **Email :** `admin@koula.gn`
  - **Mot de passe :** `admin123`

### 2. **Accès à l'interface admin**
- Une fois connecté, vous verrez un badge "ADMIN" à côté de votre nom
- Cliquez sur "🔧 Administration" dans le menu utilisateur
- Vous accédez à l'interface admin avec sidebar dédiée

## 🏠 **Tableau de bord (Dashboard)**

### **Statistiques principales :**
- **Commandes** : Nombre total de commandes
- **Chiffre d'affaires** : Revenus totaux en FCFA
- **Produits** : Nombre de produits en stock
- **Panier moyen** : Valeur moyenne des commandes

### **Sections détaillées :**
- **Commandes récentes** : Liste des dernières commandes avec statuts
- **Produits récents** : Aperçu des derniers produits ajoutés
- **Actions rapides** : Liens vers toutes les sections admin

## 📦 **Gestion des Produits**

### **Accès :** Sidebar → "Produits" ou `/admin/products`

### **Fonctionnalités :**
- **Créer un produit** : Bouton "Nouveau Produit"
- **Modifier un produit** : Icône ✏️ sur chaque produit
- **Supprimer un produit** : Icône 🗑️ sur chaque produit
- **Rechercher** : Barre de recherche par nom
- **Filtrer** : Par type (Construction/Électronique)
- **Vue** : Grille ou liste

### **Formulaire de création/modification :**
- **Nom du produit** (obligatoire)
- **Type de produit** : Construction ou Électronique
- **Prix** en FCFA (obligatoire)
- **Stock** (obligatoire)
- **Remise** en pourcentage
- **Catégorie** (optionnel)
- **Description** (optionnel)
- **Images** : Upload jusqu'à 5 images
- **Produit vedette** : Case à cocher

### **Upload d'images :**
- **Glisser-déposer** ou clic pour sélectionner
- **Formats acceptés** : JPG, PNG, GIF, WebP
- **Taille maximale** : 5MB par image
- **Maximum** : 5 images par produit
- **Aperçu** : Visualisation immédiate
- **Actions** : Voir, supprimer les images

## 🛒 **Gestion des Commandes**

### **Accès :** Sidebar → "Commandes" ou `/admin/orders`

### **Fonctionnalités :**
- **Voir toutes les commandes** : Tableau complet
- **Filtrer par statut** : En attente, Confirmée, Expédiée, Livrée, Annulée
- **Modifier le statut** : Menu déroulant sur chaque commande
- **Détails de la commande** : Client, total, date, articles
- **Pagination** : Navigation entre les pages

### **Statuts disponibles :**
- **En attente** : Commande reçue, en attente de confirmation
- **Confirmée** : Commande validée par l'admin
- **En cours** : Commande en préparation
- **Expédiée** : Commande envoyée au client
- **Livrée** : Commande livrée avec succès
- **Annulée** : Commande annulée

## 👥 **Gestion des Utilisateurs**

### **Accès :** Sidebar → "Utilisateurs" ou `/admin/users`

### **Fonctionnalités :**
- **Voir tous les utilisateurs** : Tableau complet
- **Rechercher** : Par nom ou email
- **Filtrer par rôle** : Utilisateur ou Administrateur
- **Informations détaillées** : Nom, email, téléphone, rôle, statut
- **Actions** : Gérer les permissions, modifier les comptes

### **Informations affichées :**
- **Nom complet** et ID utilisateur
- **Contact** : Email et téléphone
- **Rôle** : Utilisateur ou Administrateur
- **Statut** : Actif ou Inactif
- **Date d'inscription**

## 🏷️ **Gestion des Catégories**

### **Accès :** Sidebar → "Catégories" ou `/admin/categories`

### **Fonctionnalités :**
- **Créer une catégorie** : Bouton "Ajouter une catégorie"
- **Modifier une catégorie** : Icône ✏️ sur chaque catégorie
- **Supprimer une catégorie** : Icône 🗑️ sur chaque catégorie
- **Vue en grille** : Affichage visuel des catégories

### **Formulaire de création/modification :**
- **Nom de la catégorie** (obligatoire)
- **Description** (optionnel)
- **Image** : URL de l'image (optionnel)
- **Statut** : Active ou Inactive

## 🖼️ **Galerie d'Images**

### **Accès :** Sidebar → "Galerie d'Images" ou `/admin/images`

### **Fonctionnalités :**
- **Upload multiple** : Jusqu'à 10 images à la fois
- **Glisser-déposer** ou clic pour sélectionner
- **Recherche** : Par nom de fichier
- **Vue** : Grille ou liste
- **Suppression** : Individuelle ou en lot
- **Sélection multiple** : Checkbox sur chaque image

### **Formats acceptés :**
- **Types** : JPG, PNG, GIF, WebP
- **Taille maximale** : 5MB par image
- **Stockage** : Dossier `/server/uploads/`

## 🔧 **Test et Débogage**

### **Page de test :** `/admin/test`

### **Fonctionnalités de test :**
- **Informations de connexion** : Vérifier le statut admin
- **Créer un admin de test** : Bouton pour créer un admin
- **Informations du token** : Détails de l'authentification
- **Comptes de test** : Liste des identifiants disponibles

## 🚨 **Résolution des problèmes**

### **Si vous ne voyez pas l'interface admin :**

1. **Vérifiez la connexion :**
   - Êtes-vous connecté avec un compte admin ?
   - Le badge "ADMIN" apparaît-il à côté de votre nom ?

2. **Vérifiez les identifiants :**
   - Email : `admin@koula.gn`
   - Mot de passe : `admin123`

3. **Vérifiez la console :**
   - Ouvrez F12 → Console
   - Y a-t-il des erreurs JavaScript ?

4. **Testez la page de test :**
   - Allez sur `/admin/test`
   - Vérifiez les informations affichées

### **Si les fonctionnalités ne marchent pas :**

1. **Vérifiez le serveur :**
   - Le serveur backend est-il démarré ?
   - Les API sont-elles accessibles ?

2. **Vérifiez les permissions :**
   - Votre compte a-t-il le rôle "admin" ?
   - Le token d'authentification est-il valide ?

## 📱 **Interface responsive**

- **Desktop** : Sidebar fixe avec navigation complète
- **Mobile** : Menu hamburger avec navigation repliable
- **Tablette** : Interface adaptative

## 🎨 **Design et navigation**

- **Couleur admin** : Bleu pour différencier de l'interface utilisateur
- **Sidebar** : Navigation permanente avec icônes
- **Header** : Informations utilisateur et déconnexion
- **Retour au site** : Lien pour revenir à l'interface normale

---

## 🚀 **Démarrage rapide**

1. **Connectez-vous** avec `admin@koula.gn` / `admin123`
2. **Cliquez** sur "🔧 Administration"
3. **Explorez** les différentes sections via la sidebar
4. **Testez** les fonctionnalités de création, modification, suppression
5. **Utilisez** la page de test si nécessaire

L'interface admin est maintenant **complètement fonctionnelle** ! 🎉
