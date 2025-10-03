const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 CONFIGURATION GMAIL RAPIDE - BOWOYE MULTI SERVICES');
console.log('====================================================\n');

console.log('📋 ÉTAPES AVANT DE CONTINUER :');
console.log('1. Allez sur https://myaccount.google.com');
console.log('2. Sécurité → Vérification en 2 étapes → Activer');
console.log('3. Mots de passe d\'application → Générer nouveau');
console.log('4. Copiez le mot de passe (16 caractères)\n');

rl.question('Votre mot de passe d\'application Gmail: ', (password) => {
  if (!password || password.length < 10) {
    console.log('❌ Mot de passe trop court. Veuillez entrer votre mot de passe d\'application complet.');
    rl.close();
    return;
  }

  // Lire le fichier actuel
  const emailServicePath = 'server/services/emailService.js';
  let content = fs.readFileSync(emailServicePath, 'utf8');
  
  // Remplacer le mot de passe
  content = content.replace(
    "pass: 'votre_mot_de_passe_application_ici'",
    `pass: '${password}'`
  );
  
  // Sauvegarder
  fs.writeFileSync(emailServicePath, content);
  
  console.log('\n✅ Configuration sauvegardée !');
  console.log('📁 Fichier modifié: server/services/emailService.js');
  console.log('\n🚀 Démarrage du serveur...');
  
  // Démarrer le serveur
  const { spawn } = require('child_process');
  const server = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  server.on('error', (err) => {
    console.error('❌ Erreur serveur:', err);
  });
  
  console.log('\n📧 PRÊT POUR LES EMAILS !');
  console.log('Testez maintenant en créant un compte sur votre site.');
  
  rl.close();
});
