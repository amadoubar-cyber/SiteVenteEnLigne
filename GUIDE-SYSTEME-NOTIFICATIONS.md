# 🔔 Guide - Système de Notifications

## ✅ **Système de Notifications Implémenté !**

Le système de notifications en temps réel est maintenant opérationnel. L'admin reçoit des notifications instantanées dès qu'un client passe une commande.

## 🚀 **Fonctionnalités Disponibles**

### **1. Notifications en Temps Réel**
- ✅ **Détection automatique** des nouvelles commandes
- ✅ **Notifications toast** qui apparaissent en haut à droite
- ✅ **Compteur de notifications** avec badge rouge
- ✅ **Panneau de notifications** accessible via l'icône cloche

### **2. Types de Notifications**
- 🔔 **Nouvelles commandes** : Notification immédiate avec détails du client et montant
- ℹ️ **Mises à jour de statut** : Changements de statut des commandes
- ✅ **Succès** : Actions réussies
- ⚠️ **Avertissements** : Problèmes mineurs
- ❌ **Erreurs** : Problèmes critiques

### **3. Interface Admin**
- **Icône cloche** dans le tableau de bord avec compteur
- **Panneau déroulant** avec toutes les notifications
- **Marquer comme lu** individuellement ou en masse
- **Supprimer** les notifications
- **Notifications persistantes** sauvegardées dans localStorage

## 🧪 **Test du Système**

### **1. Ouvrir le Test**
Ouvrez `test-notification-system.html` dans votre navigateur pour :
- ✅ Tester les notifications de nouvelles commandes
- ✅ Simuler plusieurs commandes
- ✅ Vérifier le compteur de notifications
- ✅ Tester les différents types de notifications

### **2. Test en Conditions Réelles**
1. **Ouvrez l'admin** : http://localhost:3000/admin
2. **Ouvrez le site** : http://localhost:3000 (dans un autre onglet)
3. **Passez une commande** sur le site
4. **Vérifiez** que la notification apparaît dans l'admin

## 🔧 **Configuration Technique**

### **Composants Créés**
- `NotificationToast.js` : Composant de notification toast
- `NotificationPanel.js` : Panneau de notifications avec compteur
- `useNotifications.js` : Hook pour gérer les notifications
- Intégration dans `Dashboard.js` : Détection des nouvelles commandes

### **Déclenchement des Notifications**
```javascript
// Dans localOrdersAPI.js
const notificationEvent = new CustomEvent('newOrderCreated', {
  detail: { order: newOrder }
});
window.dispatchEvent(notificationEvent);

// Dans Dashboard.js
window.addEventListener('newOrderCreated', handleNewOrder);
```

### **Stockage des Notifications**
- **localStorage** : `admin_notifications`
- **Persistance** : Les notifications sont sauvegardées
- **Limite** : 50 notifications maximum
- **Nettoyage** : Suppression automatique des anciennes

## 📱 **Utilisation**

### **Pour l'Admin**
1. **Ouvrir l'admin** : http://localhost:3000/admin
2. **Voir le compteur** : Badge rouge sur l'icône cloche
3. **Cliquer sur la cloche** : Ouvrir le panneau de notifications
4. **Marquer comme lu** : Cliquer sur une notification
5. **Supprimer** : Bouton X sur chaque notification

### **Pour les Clients**
1. **Passer une commande** normalement sur le site
2. **La notification** est automatiquement envoyée à l'admin
3. **Aucune action** requise du côté client

## 🔍 **Débogage**

### **Console du Navigateur (F12)**
Vérifiez ces logs :
```
📦 Commande créée localement: [ID]
Événement de nouvelle commande reçu: {order: {...}}
```

### **Vérifier les Notifications**
```javascript
// Dans la console
const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
console.log('Notifications:', notifications);
console.log('Non lues:', notifications.filter(n => !n.read).length);
```

### **Vérifier les Commandes**
```javascript
// Dans la console
const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
console.log('Commandes:', orders);
```

## 🚨 **Résolution des Problèmes**

### **Problème 1 : Pas de Notifications**
- ✅ Vérifiez que l'admin est ouvert
- ✅ Vérifiez la console pour les erreurs
- ✅ Testez avec `test-notification-system.html`

### **Problème 2 : Notifications en Double**
- ✅ Normal si plusieurs onglets admin ouverts
- ✅ Le système détecte les nouvelles commandes

### **Problème 3 : Compteur Incorrect**
- ✅ Actualisez la page admin
- ✅ Vérifiez localStorage dans la console

### **Problème 4 : Notifications Ne S'affichent Pas**
- ✅ Vérifiez que les composants sont importés
- ✅ Vérifiez la console pour les erreurs JavaScript

## 🎯 **Fonctionnalités Avancées**

### **Notifications Sonores** (Optionnel)
- Ajoutez un fichier `notification-sound.mp3` dans `/public/`
- Les notifications joueront automatiquement un son

### **Notifications Push** (Futur)
- Intégration possible avec Service Workers
- Notifications même quand l'admin n'est pas ouvert

### **Types de Notifications Personnalisés**
```javascript
// Ajouter un nouveau type
notificationSystem.addNotification({
  type: 'custom',
  title: 'Titre Personnalisé',
  message: 'Message personnalisé',
  customData: { /* données supplémentaires */ }
});
```

## ✅ **Résultat Attendu**

Après implémentation, l'admin doit :
- ✅ **Recevoir des notifications** dès qu'un client passe une commande
- ✅ **Voir le compteur** de notifications non lues
- ✅ **Pouvoir gérer** les notifications (marquer comme lu, supprimer)
- ✅ **Avoir des notifications persistantes** qui survivent au rechargement

## 🆘 **Support**

Si vous rencontrez des problèmes :
1. **Ouvrez** `test-notification-system.html` pour tester
2. **Vérifiez** la console du navigateur (F12)
3. **Testez** avec des commandes simples
4. **Vérifiez** que localStorage contient les données

**Le système de notifications est maintenant opérationnel !** 🎉
