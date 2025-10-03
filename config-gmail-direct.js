const fs = require('fs');
const path = require('path');

console.log('📧 CONFIGURATION GMAIL DIRECTE');
console.log('═══════════════════════════════════════');
console.log('');

// Configuration par défaut
const config = {
  user: 'amadoubowoye@gmail.com',
  pass: 'VOTRE_MOT_DE_PASSE_APPLICATION_ICI'
};

console.log('🔧 REMPLACEZ LE MOT DE PASSE DANS LE FICHIER :');
console.log('');

const emailServicePath = path.join(__dirname, 'server', 'services', 'emailService.js');

if (fs.existsSync(emailServicePath)) {
  let content = fs.readFileSync(emailServicePath, 'utf8');
  
  console.log('📁 Fichier trouvé: server/services/emailService.js');
  console.log('');
  console.log('🔑 LIGNE À MODIFIER :');
  console.log('   pass: \'VOTRE_MOT_DE_PASSE_APPLICATION_ICI\'');
  console.log('');
  console.log('✅ REMPLACEZ PAR VOTRE MOT DE PASSE D\'APPLICATION GMAIL');
  console.log('');
  console.log('📋 ÉTAPES :');
  console.log('1. Allez sur: https://myaccount.google.com/security');
  console.log('2. Activez "Vérification en 2 étapes"');
  console.log('3. Créez un "Mot de passe d\'application" pour Mail');
  console.log('4. Copiez le mot de passe (16 caractères)');
  console.log('5. Remplacez dans server/services/emailService.js');
  console.log('6. Redémarrez le serveur');
  console.log('');
  console.log('🚀 Ensuite, les codes arriveront sur votre email !');
} else {
  console.log('❌ Fichier emailService.js non trouvé');
}
