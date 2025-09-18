# 📦 Guide d'Import des Produits - Koula

## 🎯 Méthodes pour Ajouter vos Produits

### **Méthode 1: Interface d'Administration (Recommandée)**

1. **Accéder au panneau admin :**
   - Allez sur `http://localhost:3000/admin`
   - Connectez-vous avec : `admin@koula.gn` / `admin123`

2. **Ajouter un produit :**
   - Cliquez sur "Gestion des Produits"
   - Cliquez sur "Ajouter un Produit"
   - Remplissez le formulaire avec vos données

### **Méthode 2: Import en Masse (Script)**

1. **Modifier le script d'import :**
   ```bash
   # Éditez le fichier server/scripts/importProducts.js
   # Modifiez le tableau sampleProducts avec vos produits
   ```

2. **Exécuter l'import :**
   ```bash
   cd server
   node scripts/importProducts.js
   ```

### **Méthode 3: Import depuis CSV**

1. **Créer un fichier CSV :**
   ```bash
   cd server
   node scripts/importFromCSV.js
   # Cela crée un fichier products.csv d'exemple
   ```

2. **Modifier le fichier CSV :**
   - Ouvrez `server/products.csv`
   - Ajoutez vos produits avec les colonnes :
     - `name` : Nom du produit
     - `description` : Description
     - `price` : Prix en GNF
     - `originalPrice` : Prix original (optionnel)
     - `stock` : Quantité en stock
     - `category` : Catégorie
     - `image1`, `image2` : URLs des images
     - `featured` : true/false (produit vedette)
     - `discountPercentage` : Pourcentage de réduction
     - `spec1`, `spec2`, `spec3` : Spécifications (format "Clé: Valeur")

3. **Importer depuis CSV :**
   ```bash
   node scripts/importFromCSV.js
   ```

## 📋 Structure des Données

### **Informations Obligatoires :**
- **Nom** : Nom du produit
- **Description** : Description détaillée
- **Prix** : Prix en GNF (sans espaces)
- **Stock** : Quantité disponible
- **Catégorie** : Catégorie du produit

### **Informations Optionnelles :**
- **Prix Original** : Pour afficher une réduction
- **Images** : URLs des images (max 5)
- **Spécifications** : Caractéristiques techniques
- **Produit Vedette** : Mise en avant sur la page d'accueil
- **Pourcentage de Réduction** : Pourcentage de remise

## 🖼️ Images des Produits

### **Recommandations :**
- **Format** : JPG, PNG, WebP
- **Taille** : 500x500px minimum
- **Qualité** : Haute résolution
- **Fond** : Blanc ou neutre
- **Nombre** : 1-5 images par produit

### **Services d'Images Recommandés :**
- **Unsplash** : `https://images.unsplash.com/photo-XXXXX?w=500`
- **Pexels** : `https://images.pexels.com/photos/XXXXX/`
- **Vos propres images** : Uploadez sur un service cloud

## 📊 Exemple de Fichier CSV

```csv
name,description,price,originalPrice,stock,category,image1,image2,featured,discountPercentage,spec1,spec2,spec3
Smartphone Samsung Galaxy A54,Smartphone Android avec écran 6.4 pouces,450000,500000,25,Électronique,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500,true,10,Écran: 6.4 pouces,Stockage: 128GB,RAM: 6GB
Ordinateur Portable HP Pavilion,Laptop HP Pavilion 15 pouces,1200000,1350000,8,Informatique,https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500,,true,11,Processeur: Intel i5,RAM: 8GB,Stockage: 512GB SSD
```

## 🔧 Commandes Utiles

### **Vérifier les produits importés :**
```bash
# Se connecter à MongoDB
mongo
use koula
db.products.find().pretty()
```

### **Supprimer tous les produits :**
```bash
cd server
node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');
mongoose.connect('mongodb://localhost:27017/koula').then(() => {
  return Product.deleteMany({});
}).then(() => {
  console.log('Tous les produits supprimés');
  process.exit();
});
"
```

### **Compter les produits :**
```bash
cd server
node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');
mongoose.connect('mongodb://localhost:27017/koula').then(() => {
  return Product.countDocuments();
}).then(count => {
  console.log('Nombre de produits:', count);
  process.exit();
});
"
```

## 🚀 Étapes Recommandées

1. **Préparez vos données** dans un fichier Excel/CSV
2. **Testez avec quelques produits** via l'interface admin
3. **Importez en masse** avec le script CSV
4. **Vérifiez** sur le site que tout s'affiche correctement
5. **Ajustez** les prix, descriptions, images si nécessaire

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le serveur est démarré
2. Vérifiez la connexion à MongoDB
3. Consultez les logs dans la console
4. Vérifiez le format de vos données

---

**Bon import ! 🎉**
