#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 CONFIGURATION EMAIL - BOWOYE MULTI SERVICES');
console.log('================================================\n');

console.log('📧 Choisissez votre service email :');
console.log('1. Gmail (recommandé)');
console.log('2. Outlook');
console.log('3. Yahoo');
console.log('4. Autre (SMTP personnalisé)\n');

rl.question('Votre choix (1-4): ', (choice) => {
  switch(choice) {
    case '1':
      setupGmail();
      break;
    case '2':
      setupOutlook();
      break;
    case '3':
      setupYahoo();
      break;
    case '4':
      setupCustom();
      break;
    default:
      console.log('❌ Choix invalide');
      rl.close();
  }
});

function setupGmail() {
  console.log('\n📧 CONFIGURATION GMAIL');
  console.log('======================');
  console.log('⚠️  IMPORTANT: Vous devez d\'abord :');
  console.log('   1. Activer la vérification en 2 étapes sur Gmail');
  console.log('   2. Générer un mot de passe d\'application');
  console.log('   3. Utiliser ce mot de passe d\'application (PAS votre mot de passe normal)\n');
  
  rl.question('Votre email Gmail: ', (email) => {
    rl.question('Mot de passe d\'application Gmail: ', (password) => {
      updateEmailConfig('gmail', {
        service: 'gmail',
        auth: {
          user: email,
          pass: password
        }
      });
    });
  });
}

function setupOutlook() {
  console.log('\n📧 CONFIGURATION OUTLOOK');
  console.log('========================');
  
  rl.question('Votre email Outlook: ', (email) => {
    rl.question('Mot de passe Outlook: ', (password) => {
      updateEmailConfig('gmail', {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: email,
          pass: password
        }
      });
    });
  });
}

function setupYahoo() {
  console.log('\n📧 CONFIGURATION YAHOO');
  console.log('======================');
  
  rl.question('Votre email Yahoo: ', (email) => {
    rl.question('Mot de passe Yahoo: ', (password) => {
      updateEmailConfig('gmail', {
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false,
        auth: {
          user: email,
          pass: password
        }
      });
    });
  });
}

function setupCustom() {
  console.log('\n📧 CONFIGURATION SMTP PERSONNALISÉ');
  console.log('==================================');
  
  rl.question('Host SMTP: ', (host) => {
    rl.question('Port (587 pour TLS, 465 pour SSL): ', (port) => {
      rl.question('Email: ', (email) => {
        rl.question('Mot de passe: ', (password) => {
          updateEmailConfig('gmail', {
            host: host,
            port: parseInt(port),
            secure: port === '465',
            auth: {
              user: email,
              pass: password
            }
          });
        });
      });
    });
  });
}

function updateEmailConfig(key, config) {
  const configPath = path.join(__dirname, 'server', 'config', 'email.js');
  
  const configContent = `// Configuration email pour Bowoye Multi Services
module.exports = {
  // Configuration principale
  gmail: ${JSON.stringify(config, null, 4)}
};`;

  fs.writeFileSync(configPath, configContent);
  
  console.log('\n✅ Configuration sauvegardée !');
  console.log('📁 Fichier: server/config/email.js');
  console.log('\n🚀 Vous pouvez maintenant démarrer le serveur :');
  console.log('   node server/index.js');
  console.log('\n📧 Pour tester, allez sur la page d\'inscription et créez un compte !');
  
  rl.close();
}
