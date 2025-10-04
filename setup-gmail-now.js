const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURATION GMAIL IMMÉDIATE');
console.log('═══════════════════════════════════════');
console.log('');

console.log('📋 ÉTAPES OBLIGATOIRES :');
console.log('');
console.log('1️⃣ Allez sur : https://myaccount.google.com/security');
console.log('2️⃣ Activez "Vérification en 2 étapes" (si pas fait)');
console.log('3️⃣ Allez dans "Mots de passe d\'application"');
console.log('4️⃣ Créez un mot de passe pour "Mail"');
console.log('5️⃣ Copiez le mot de passe (16 caractères)');
console.log('');

console.log('🔑 EXEMPLE :');
console.log('   Mot de passe généré : abcd efgh ijkl mnop');
console.log('   Utilisez : abcd efgh ijkl mnop (avec espaces)');
console.log('   OU : abcdefghijklmnop (sans espaces)');
console.log('');

console.log('📁 FICHIER À MODIFIER :');
console.log('   server/services/emailService.js');
console.log('   Ligne 11 : pass: \'votre_mot_de_passe_application_ici\'');
console.log('');

console.log('⚠️ IMPORTANT :');
console.log('   - Utilisez le mot de passe d\'APPLICATION (pas votre mot de passe Gmail)');
console.log('   - 16 caractères généré par Google');
console.log('   - Pour l\'email : amadoubowoye@gmail.com');
console.log('');

console.log('🚀 Après configuration :');
console.log('   1. Sauvegardez le fichier');
console.log('   2. Redémarrez le serveur');
console.log('   3. Testez l\'inscription');
console.log('   4. Vérifiez votre email !');
console.log('');

// Afficher le contenu actuel
const emailServicePath = path.join(__dirname, 'server', 'services', 'emailService.js');
if (fs.existsSync(emailServicePath)) {
  console.log('📄 CONTENU ACTUEL (ligne 11) :');
  const content = fs.readFileSync(emailServicePath, 'utf8');
  const lines = content.split('\n');
  console.log('   ' + lines[10]);
  console.log('');
}
