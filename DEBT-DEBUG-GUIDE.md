# 🔍 Guide de Débogage - Gestion des Dettes

## 🚨 Problème Identifié
Les statistiques affichent des valeurs incorrectes :
- **Total Dettes** : 1 (au lieu de 3)
- **Montant Total** : 2,400 FG (au lieu de 900,000 FG)
- **Montant Payé** : NaN FG
- **Montant Restant** : NaN FG
- **En Retard** : 0 (au lieu de 1)

## 🔧 Corrections Appliquées

### **1. Logs de Débogage Ajoutés**
```javascript
// Dans loadDebtsData
console.log('Loading debts data...');
console.log('Saved debts from localStorage:', savedDebts);
console.log('Parsed debts:', parsedDebts);
console.log('Test debts created and saved:', testDebts);
console.log('Dettes chargées et définies:', debtsData);

// Dans calculateStats
console.log('Calculating stats for debts:', debtsData);
console.log('Calculated stats:', { totalDebts, totalAmount, paidAmount, remainingAmount, overdueCount });
console.log('Setting stats:', newStats);
```

### **2. Protection contre les Valeurs Undefined**
```javascript
const totalAmount = debtsData.reduce((sum, debt) => sum + (debt.totalPrice || 0), 0);
const paidAmount = debtsData.reduce((sum, debt) => sum + (debt.paidAmount || 0), 0);
const remainingAmount = debtsData.reduce((sum, debt) => sum + (debt.remainingAmount || 0), 0);
```

## 🚀 Comment Déboguer

### **1. Ouvrir la Console du Navigateur**
1. **F12** ou **Clic droit** → "Inspecter"
2. Aller dans l'onglet **"Console"**
3. Recharger la page de gestion des dettes

### **2. Vérifier les Logs**
Vous devriez voir dans la console :
```
Loading debts data...
Saved debts from localStorage: [données ou null]
Parsed debts: [array de dettes]
Dettes chargées et définies: [array de dettes]
Calculating stats for debts: [array de dettes]
Calculated stats: { totalDebts: 3, totalAmount: 900000, ... }
Setting stats: { summary: { ... }, ... }
```

### **3. Vérifier localStorage**
Dans la console, tapez :
```javascript
console.log('localStorage debts:', localStorage.getItem('debts'));
```

## 🔍 Diagnostics Possibles

### **Cas 1 : Données Corrompues dans localStorage**
**Symptômes** : `Saved debts from localStorage` montre des données incorrectes
**Solution** : Vider localStorage et recréer les données
```javascript
localStorage.removeItem('debts');
// Recharger la page
```

### **Cas 2 : Problème de Parsing JSON**
**Symptômes** : `Parsed debts` montre `null` ou erreur
**Solution** : Vérifier le format JSON dans localStorage

### **Cas 3 : Données Incomplètes**
**Symptômes** : `Calculated stats` montre des valeurs incorrectes
**Solution** : Vérifier que chaque dette a `totalPrice`, `paidAmount`, `remainingAmount`

### **Cas 4 : Problème de Timing**
**Symptômes** : `Dettes chargées et définies` montre un array vide
**Solution** : Vérifier que `setDebts` est appelé avant `calculateStats`

## 🎯 Valeurs Attendues

### **Données de Test Correctes**
```javascript
[
  {
    id: 1,
    customerName: 'Mamadou Diallo',
    totalPrice: 150000,
    paidAmount: 50000,
    remainingAmount: 100000,
    status: 'pending'
  },
  {
    id: 2,
    customerName: 'Fatoumata Camara',
    totalPrice: 250000,
    paidAmount: 100000,
    remainingAmount: 150000,
    status: 'overdue'
  },
  {
    id: 3,
    customerName: 'Ibrahima Bah',
    totalPrice: 500000,
    paidAmount: 200000,
    remainingAmount: 300000,
    status: 'pending'
  }
]
```

### **Statistiques Attendues**
```javascript
{
  totalDebts: 3,
  totalAmount: 900000,
  paidAmount: 350000,
  remainingAmount: 550000,
  overdueCount: 1
}
```

## 🛠️ Actions de Débogage

### **1. Vider et Recréer les Données**
```javascript
// Dans la console du navigateur
localStorage.removeItem('debts');
location.reload();
```

### **2. Vérifier l'État du Composant**
```javascript
// Dans la console du navigateur (si React DevTools installé)
// Ou ajouter temporairement :
console.log('Current debts state:', debts);
console.log('Current stats state:', stats);
```

### **3. Forcer le Rechargement des Données**
```javascript
// Dans la console du navigateur
loadDebtsData();
```

## 📊 Résultat Attendu

Après correction, vous devriez voir :
- **Total Dettes** : 3
- **Montant Total** : 900,000 FG
- **Montant Payé** : 350,000 FG (39% payé)
- **Montant Restant** : 550,000 FG (61% en attente)
- **En Retard** : 1

## 🎉 Prochaines Étapes

1. **Ouvrir la console** et vérifier les logs
2. **Identifier le problème** selon les symptômes
3. **Appliquer la solution** correspondante
4. **Vérifier** que les statistiques s'affichent correctement

Les logs de débogage vous aideront à identifier exactement où le problème se situe ! 🔍
