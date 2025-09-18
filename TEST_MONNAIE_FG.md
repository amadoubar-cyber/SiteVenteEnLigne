# 💰 Test - Monnaie Franc Guinéen (FG)

## ✅ **Monnaie changée de FCFA à FG !**

### **🔄 Changements effectués :**
- ✅ **Fonction formatCurrency** : Retourne maintenant "XXX FG"
- ✅ **Reçus** : Tous les montants affichés en FG
- ✅ **Liste des dettes** : Montants en FG
- ✅ **Formulaires** : Placeholders et labels en FG
- ✅ **Composants** : Tous les composants mis à jour

## 🧪 **Test de la nouvelle monnaie :**

### **1. Rechargez la page**
- `F5` ou `Ctrl + F5`

### **2. Testez la création d'une dette**
1. **Allez dans "Gestion des Dettes"**
2. **Cliquez sur "Vente à Crédit"**
3. **Remplissez le formulaire** :
   - Nom : "Test Client"
   - Produit : "Test Produit"
   - Prix unitaire : 10000
4. **Vérifiez** :
   - ✅ Placeholder : "Prix unitaire (FG)"
   - ✅ Calcul automatique : "10,000 FG"
   - ✅ Résumé : "Montant total : 10,000 FG"

### **3. Testez la fenêtre de confirmation**
1. **Cliquez sur "Enregistrer la Vente à Crédit"**
2. **Vérifiez le message** :
   - ✅ "Montant: 10,000 FG"
   - ✅ Tous les montants en FG

### **4. Testez la liste des dettes**
1. **Vérifiez la colonne "MONTANTS"** :
   - ✅ "Total: 625,000 FG"
   - ✅ "Payé: 300,000 FG"
   - ✅ "Restant: 325,000 FG"

### **5. Testez le reçu**
1. **Cliquez sur "Reçu"** pour une dette
2. **Vérifiez le reçu** :
   - ✅ "Prix unitaire: 25,000 FG"
   - ✅ "Montant total: 625,000 FG"
   - ✅ "Montant payé: 300,000 FG"
   - ✅ "Montant restant: 325,000 FG"
   - ✅ Historique des paiements en FG

### **6. Testez les paiements**
1. **Cliquez sur "Payer"** pour une dette
2. **Vérifiez le modal** :
   - ✅ "Montant restant: XXX FG"
   - ✅ Validation en FG

## 📊 **Vérifications dans tous les composants :**

### **Gestion des Dettes :**
- ✅ Liste des dettes
- ✅ Formulaire de création
- ✅ Modal de paiement
- ✅ Reçus

### **Gestion des Ventes :**
- ✅ Formulaire de vente
- ✅ Liste des ventes
- ✅ Statistiques

### **Contrôle de Stock :**
- ✅ Statistiques de vente
- ✅ Montants de profit
- ✅ Valeurs des stocks

### **Gestion des Produits :**
- ✅ Prix des produits
- ✅ Valeurs des stocks

## 🎯 **Format de la monnaie :**

### **Avant (FCFA) :**
- Format : "625,000 FCFA"
- Devise : Franc CFA
- Code : XOF

### **Maintenant (FG) :**
- Format : "625,000 FG"
- Devise : Franc Guinéen
- Code : GNF (implicite)

## 🔧 **Fonction formatCurrency :**

```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FG';
};
```

**Exemples :**
- 1000 → "1,000 FG"
- 25000 → "25,000 FG"
- 625000 → "625,000 FG"

## 📋 **Test complet :**

1. **Créez une dette** : 50,000 FG
2. **Effectuez un paiement** : 25,000 FG
3. **Générez un reçu** : Vérifiez tous les montants en FG
4. **Vérifiez la liste** : Montants mis à jour en FG
5. **Testez l'impression** : Reçu en FG

---
*Monnaie Franc Guinéen (FG) implémentée partout !* 💰
