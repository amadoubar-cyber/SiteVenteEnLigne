# 🔧 CONFIGURATION EMAIL SIMPLE

## 🎯 OBJECTIF
Configurer l'envoi d'emails réels aux clients qui s'inscrivent

## 📋 ÉTAPES SIMPLES

### 1️⃣ CONFIGURER GMAIL

#### **Étape 1 : Activer la vérification 2FA**
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur "Sécurité"
3. Activez "Vérification en 2 étapes"

#### **Étape 2 : Générer un mot de passe d'application**
1. Dans "Sécurité", trouvez "Mots de passe d'application"
2. Cliquez sur "Mots de passe d'application"
3. Sélectionnez "Mail" et "Autre (nom personnalisé)"
4. Tapez "Bowoye Multi Services"
5. **COPIEZ le mot de passe généré** (16 caractères)

#### **Étape 3 : Configurer le fichier**
1. Ouvrez le fichier : `server/config/email.js`
2. Remplacez `VOTRE_MOT_DE_PASSE_APPLICATION_GMAIL` par le mot de passe copié
3. Sauvegardez le fichier

### 2️⃣ DÉMARRER LE SERVEUR

```bash
# Dans le terminal
node server/index.js
```

### 3️⃣ TESTER

1. Allez sur la page d'inscription
2. Remplissez avec votre vraie adresse email
3. Cliquez sur "Créer mon compte"
4. Vérifiez votre boîte email !

## ✅ RÉSULTAT

**Vous recevrez un email professionnel avec :**
- ✅ Votre nom
- ✅ Code de vérification
- ✅ Instructions claires
- ✅ Design BMS

## 🔧 EXEMPLE DE CONFIGURATION

```javascript
// Dans server/config/email.js
gmail: {
  service: 'gmail',
  auth: {
    user: 'amadoubowoye@gmail.com',
    pass: 'abcd efgh ijkl mnop' // Votre mot de passe d'application
  }
}
```

## ❌ PROBLÈMES COURANTS

### **Erreur "Authentication failed"**
- Vérifiez que vous utilisez le mot de passe d'application (pas votre mot de passe normal)
- Assurez-vous que la vérification 2FA est activée

### **Email non reçu**
- Vérifiez le dossier spam
- Vérifiez l'adresse email
- Regardez les logs du serveur

## 📞 SUPPORT

**En cas de problème :**
- Email : amadoubowoye@gmail.com
- Téléphone : +224 626 99 13 18
