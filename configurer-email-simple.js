const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 CONFIGURATION EMAIL SIMPLE - BOWOYE MULTI SERVICES');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('🎯 Pour que les codes arrivent sur votre email :');
console.log('');

async function configurerEmail() {
  console.log('📋 ÉTAPE 1 : Créer un mot de passe d\'application Gmail');
  console.log('');
  console.log('1. Allez sur : https://myaccount.google.com/security');
  console.log('2. Activez la "Vérification en 2 étapes" si pas fait');
  console.log('3. Allez dans "Mots de passe d\'application"');
  console.log('4. Créez un mot de passe pour "Mail"');
  console.log('5. Copiez le mot de passe généré (16 caractères)');
  console.log('');

  const email = await question('📧 Votre email Gmail (ex: votreemail@gmail.com): ');
  const password = await question('🔑 Mot de passe d\'application Gmail (16 caractères): ');

  console.log('');
  console.log('🔧 Configuration générée :');
  console.log('═══════════════════════════════════════════════════════════');
  
  const config = {
    user: email,
    pass: password
  };

  console.log(`Email: ${config.user}`);
  console.log(`Mot de passe: ${config.pass.substring(0, 4)}****${config.pass.substring(12)}`);
  console.log('');

  // Mettre à jour le service email
  const fs = require('fs');
  const path = require('path');
  
  const emailServicePath = path.join(__dirname, 'server', 'services', 'emailService.js');
  
  let emailServiceContent = fs.readFileSync(emailServicePath, 'utf8');
  
  // Remplacer la configuration
  emailServiceContent = emailServiceContent.replace(
    /user: 'amadoubowoye@gmail.com'/g,
    `user: '${config.user}'`
  );
  
  emailServiceContent = emailServiceContent.replace(
    /pass: 'votre_mot_de_passe_application_ici'/g,
    `pass: '${config.pass}'`
  );
  
  fs.writeFileSync(emailServicePath, emailServiceContent);
  
  console.log('✅ Configuration sauvegardée dans server/services/emailService.js');
  console.log('');
  console.log('🚀 MAINTENANT :');
  console.log('1. Redémarrez le serveur backend');
  console.log('2. Testez l\'inscription');
  console.log('3. Le code arrivera sur votre email !');
  console.log('');
  
  rl.close();
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

configurerEmail().catch(console.error);
