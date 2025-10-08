/**
 * Script de vérification du déploiement
 * Vérifie que tous les fichiers et configurations sont prêts pour Render
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration de déploiement Render...\n');

const checks = [];

// Vérification 1: Fichiers essentiels
console.log('📁 Vérification des fichiers essentiels...');
const essentialFiles = [
  'render.yaml',
  'server/package.json',
  'server/index.js',
  'server/config/database.js'
];

essentialFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `Fichier ${file}`,
    status: exists,
    message: exists ? '✅ Présent' : '❌ Manquant'
  });
});

// Vérification 2: Structure server/package.json
console.log('\n📦 Vérification des dépendances...');
try {
  const packageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv', 'jsonwebtoken'];
  
  requiredDeps.forEach(dep => {
    const hasIt = packageJson.dependencies && packageJson.dependencies[dep];
    checks.push({
      name: `Dépendance ${dep}`,
      status: !!hasIt,
      message: hasIt ? `✅ v${hasIt}` : '❌ Manquante'
    });
  });
} catch (error) {
  checks.push({
    name: 'Lecture package.json',
    status: false,
    message: `❌ Erreur: ${error.message}`
  });
}

// Vérification 3: Configuration render.yaml
console.log('\n⚙️  Vérification de render.yaml...');
try {
  const renderConfig = fs.readFileSync('render.yaml', 'utf8');
  
  const renderChecks = [
    { key: 'buildCommand', pattern: /buildCommand:.*npm/, desc: 'Build command défini' },
    { key: 'startCommand', pattern: /startCommand:.*node index\.js/, desc: 'Start command défini' },
    { key: 'healthCheckPath', pattern: /healthCheckPath:.*\/api\/health/, desc: 'Health check configuré' },
    { key: 'MONGODB_URI', pattern: /MONGODB_URI/, desc: 'MongoDB URI configuré' },
    { key: 'JWT_SECRET', pattern: /JWT_SECRET/, desc: 'JWT Secret configuré' }
  ];

  renderChecks.forEach(check => {
    const found = check.pattern.test(renderConfig);
    checks.push({
      name: check.desc,
      status: found,
      message: found ? '✅ OK' : '❌ Manquant'
    });
  });
} catch (error) {
  checks.push({
    name: 'Lecture render.yaml',
    status: false,
    message: `❌ Erreur: ${error.message}`
  });
}

// Vérification 4: Code server/index.js
console.log('\n🖥️  Vérification du serveur...');
try {
  const serverCode = fs.readFileSync('server/index.js', 'utf8');
  
  const serverChecks = [
    { pattern: /app\.get\(['"]\/api\/health['"]/, desc: 'Endpoint /api/health' },
    { pattern: /process\.env\.PORT/, desc: 'Configuration du PORT' },
    { pattern: /cors\(/, desc: 'CORS configuré' },
    { pattern: /app\.listen\(/, desc: 'Serveur listen configuré' }
  ];

  serverChecks.forEach(check => {
    const found = check.pattern.test(serverCode);
    checks.push({
      name: check.desc,
      status: found,
      message: found ? '✅ Présent' : '❌ Manquant'
    });
  });
} catch (error) {
  checks.push({
    name: 'Lecture index.js',
    status: false,
    message: `❌ Erreur: ${error.message}`
  });
}

// Vérification 5: Configuration database
console.log('\n🗄️  Vérification de la base de données...');
try {
  const dbCode = fs.readFileSync('server/config/database.js', 'utf8');
  
  const hasDeprecatedOptions = /useNewUrlParser|useUnifiedTopology/.test(dbCode);
  checks.push({
    name: 'Pas d\'options Mongoose dépréciées',
    status: !hasDeprecatedOptions,
    message: hasDeprecatedOptions ? '❌ Options dépréciées trouvées' : '✅ Configuration moderne'
  });

  const hasValidation = /process\.env\.MONGODB_URI/.test(dbCode);
  checks.push({
    name: 'Validation MONGODB_URI',
    status: hasValidation,
    message: hasValidation ? '✅ Validation présente' : '⚠️  Validation manquante'
  });
} catch (error) {
  checks.push({
    name: 'Lecture database.js',
    status: false,
    message: `❌ Erreur: ${error.message}`
  });
}

// Affichage des résultats
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSULTATS DE LA VÉRIFICATION');
console.log('='.repeat(60) + '\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

checks.forEach(check => {
  console.log(`${check.message} - ${check.name}`);
  if (check.status) passCount++;
  else if (check.message.includes('⚠️')) warnCount++;
  else failCount++;
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Réussi: ${passCount}`);
console.log(`⚠️  Avertissements: ${warnCount}`);
console.log(`❌ Échoués: ${failCount}`);
console.log('='.repeat(60));

// Recommandations
console.log('\n💡 RECOMMANDATIONS:\n');

if (failCount === 0 && warnCount === 0) {
  console.log('✅ Tout est prêt pour le déploiement!');
  console.log('\n📤 Prochaines étapes:');
  console.log('   1. git add .');
  console.log('   2. git commit -m "Fix: Configuration Render corrigée"');
  console.log('   3. git push origin main');
  console.log('   4. Surveillez les logs sur Render Dashboard');
} else {
  if (failCount > 0) {
    console.log('❌ Il y a des problèmes critiques à corriger avant le déploiement.');
    console.log('   Veuillez consulter les messages d\'erreur ci-dessus.');
  }
  if (warnCount > 0) {
    console.log('⚠️  Il y a des avertissements. Le déploiement peut fonctionner,');
    console.log('   mais il est recommandé de les corriger.');
  }
}

console.log('\n📖 Pour plus d\'aide, consultez: RENDER_DEPLOYMENT_FIX.md\n');

// Code de sortie
process.exit(failCount > 0 ? 1 : 0);

