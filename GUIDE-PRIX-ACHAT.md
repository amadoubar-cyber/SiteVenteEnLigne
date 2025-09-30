# 📊 Guide du Prix d'Achat - Koula E-commerce

## 🎯 Vue d'ensemble

Le système de gestion des prix d'achat a été ajouté à l'interface d'administration des produits. Cette fonctionnalité permet de :

- ✅ Saisir le prix d'achat de chaque produit
- 📊 Calculer automatiquement la marge bénéficiaire
- 📈 Afficher les statistiques de rentabilité
- 💰 Optimiser la stratégie de pricing

## 🔧 Fonctionnalités ajoutées

### 1. **Champ Prix d'Achat**
- Nouveau champ obligatoire dans le formulaire d'ajout/modification
- Validation côté client et serveur
- Stockage dans la base de données MongoDB

### 2. **Calculs Automatiques**
- **Marge unitaire** : Prix de vente - Prix d'achat
- **Marge en pourcentage** : (Marge unitaire / Prix d'achat) × 100
- **Calcul en temps réel** dans l'interface

### 3. **Affichage Amélioré**
- Nouvelle colonne "Prix d'achat" dans le tableau
- Nouvelle colonne "Marge" avec détails visuels
- Indicateurs colorés pour la rentabilité

## 📱 Interface Utilisateur

### Formulaire d'Ajout/Modification
```
┌─────────────────────────────────────────┐
│ Nom du produit *                        │
├─────────────────────────────────────────┤
│ Description *                           │
├─────────────────────────────────────────┤
│ Prix de vente (FG) * │ Prix d'achat (FG) * │ Stock * │
├─────────────────────────────────────────┤
│ [Calcul automatique de la marge]        │
│ Marge unitaire: 50,000 FG               │
│ Marge en %: 50%                         │
└─────────────────────────────────────────┘
```

### Tableau des Produits
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Produit     │ Catégorie   │ Prix vente  │ Prix achat  │ Marge       │ Stock       │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ iPhone 14   │ Électronique│ 1,500,000 FG│ 1,000,000 FG│ 500,000 FG  │ 5           │
│             │             │             │             │ (50%)       │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## 🛠️ Modifications Techniques

### Backend (Serveur)

#### 1. **Modèle Product** (`server/models/Product.js`)
```javascript
purchasePrice: {
  type: Number,
  required: [true, 'Le prix d\'achat est requis'],
  min: [0, 'Le prix d\'achat ne peut pas être négatif']
}
```

#### 2. **Méthodes Virtuelles Ajoutées**
```javascript
// Calcul de la marge bénéficiaire
profitMargin: function() {
  if (this.purchasePrice && this.price) {
    return Math.round(((this.price - this.purchasePrice) / this.purchasePrice) * 100 * 10) / 10;
  }
  return 0;
}

// Calcul du profit unitaire
unitProfit: function() {
  if (this.purchasePrice && this.price) {
    return this.price - this.purchasePrice;
  }
  return 0;
}
```

#### 3. **Validation** (`server/routes/products.js`)
```javascript
body('purchasePrice')
  .isFloat({ min: 0 })
  .withMessage('Le prix d\'achat doit être un nombre positif')
```

### Frontend (Client)

#### 1. **État du Composant**
```javascript
const [newProduct, setNewProduct] = useState({
  name: '',
  description: '',
  price: '',
  purchasePrice: '', // ← NOUVEAU CHAMP
  category: '',
  stock: '',
  images: []
});
```

#### 2. **Calcul de Marge en Temps Réel**
```javascript
{newProduct.price && newProduct.purchasePrice && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <h4 className="text-sm font-medium text-green-800 mb-2">Calcul de la marge</h4>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-green-700">Marge unitaire:</span>
        <span className="ml-2 font-medium text-green-800">
          {formatPrice(parseFloat(newProduct.price) - parseFloat(newProduct.purchasePrice))}
        </span>
      </div>
      <div>
        <span className="text-green-700">Marge en %:</span>
        <span className="ml-2 font-medium text-green-800">
          {Math.round(((parseFloat(newProduct.price) - parseFloat(newProduct.purchasePrice)) / parseFloat(newProduct.purchasePrice)) * 100)}%
        </span>
      </div>
    </div>
  </div>
)}
```

## 📊 Exemples d'Utilisation

### Exemple 1 : Produit Électronique
```
Produit: iPhone 14
Prix d'achat: 1,000,000 FG
Prix de vente: 1,500,000 FG
Marge unitaire: 500,000 FG
Marge en %: 50%
```

### Exemple 2 : Matériau de Construction
```
Produit: Ciment 50kg
Prix d'achat: 45,000 FG
Prix de vente: 60,000 FG
Marge unitaire: 15,000 FG
Marge en %: 33.3%
```

## 🧪 Tests et Validation

### Script de Test
Utilisez le fichier `TEST-PRIX-ACHAT.js` pour tester les fonctionnalités :

```javascript
// Dans la console du navigateur
testAddProductWithPurchasePrice()  // Ajouter un produit de test
testMarginCalculations()           // Tester les calculs
showProductsSummary()              // Voir le résumé
cleanTestData()                    // Nettoyer les tests
```

### Validation des Données
- ✅ Prix d'achat requis
- ✅ Valeur numérique positive
- ✅ Calcul automatique de la marge
- ✅ Sauvegarde en localStorage
- ✅ Persistance en base de données

## 🚀 Déploiement

### Étapes de Déploiement
1. **Backend** : Redémarrer le serveur Node.js
2. **Base de données** : Les nouveaux champs sont automatiquement ajoutés
3. **Frontend** : Recharger l'application React
4. **Test** : Vérifier l'interface d'administration

### Migration des Données Existantes
Les produits existants sans prix d'achat afficheront "-" dans la colonne marge.
Pour les mettre à jour :
1. Éditer chaque produit
2. Ajouter le prix d'achat
3. Sauvegarder

## 📈 Avantages Business

### 1. **Visibilité Financière**
- Connaissance précise de la rentabilité par produit
- Identification des produits les plus/moins rentables
- Optimisation des prix de vente

### 2. **Gestion des Stocks**
- Calcul du coût de stock
- Évaluation de la valeur du stock
- Optimisation des achats

### 3. **Reporting**
- Statistiques de marge par catégorie
- Analyse de rentabilité
- Aide à la décision pricing

## 🔧 Maintenance

### Surveillance
- Vérifier régulièrement la cohérence des prix
- S'assurer que tous les produits ont un prix d'achat
- Contrôler les marges anormalement élevées/basses

### Optimisations Futures
- [ ] Import/Export des prix d'achat via CSV
- [ ] Historique des prix d'achat
- [ ] Alertes de marge faible
- [ ] Rapports de rentabilité automatisés

---

## 📞 Support

Pour toute question ou problème :
1. Consultez ce guide
2. Utilisez les scripts de test
3. Vérifiez les logs de la console
4. Contactez l'équipe de développement

**Développé avec ❤️ par l'équipe Koula**
