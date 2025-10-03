# 📧 GUIDE DE CONFIGURATION EMAIL

## 🎯 OBJECTIF
Configurer l'envoi d'emails réels aux clients qui s'inscrivent

## 🔧 ÉTAPES DE CONFIGURATION

### 1️⃣ CONFIGURER GMAIL (Recommandé)

#### **Option A : Mot de passe d'application Gmail**
1. **Activez la vérification en 2 étapes** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans Paramètres Google → Sécurité
   - Mot de passe d'application → Générez un nouveau
   - Copiez ce mot de passe

3. **Configurez les variables d'environnement** :
```bash
# Dans server/.env
EMAIL_USER=amadoubowoye@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_gmail
```

#### **Option B : Autre service email**
```bash
# Pour Outlook
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe

# Pour Yahoo
EMAIL_USER=votre-email@yahoo.com
EMAIL_PASSWORD=votre-mot-de-passe
```

### 2️⃣ DÉMARRER LE SERVEUR

```bash
cd server
npm install nodemailer
node index.js
```

### 3️⃣ TESTER L'ENVOI

1. **Allez sur la page d'inscription**
2. **Remplissez le formulaire** avec un vrai email
3. **Cliquez sur "Créer mon compte"**
4. **Vérifiez votre boîte email** !

## ✅ RÉSULTAT ATTENDU

**L'email contiendra :**
- ✅ Nom du client
- ✅ Code de vérification
- ✅ Instructions claires
- ✅ Design professionnel
- ✅ Informations de contact BMS

## 🔧 DÉPANNAGE

### **Erreur "Authentication failed"**
- Vérifiez le mot de passe d'application
- Assurez-vous que la vérification 2FA est activée

### **Erreur "Connection refused"**
- Vérifiez votre connexion internet
- Vérifiez que le serveur est démarré

### **Email non reçu**
- Vérifiez le dossier spam
- Vérifiez l'adresse email
- Vérifiez les logs du serveur

## 🚀 EN PRODUCTION

**Pour un volume important d'emails, utilisez :**
- **SendGrid** (recommandé)
- **Mailgun**
- **Amazon SES**

## 📞 SUPPORT

**En cas de problème :**
- Email : amadoubowoye@gmail.com
- Téléphone : +224 626 99 13 18
