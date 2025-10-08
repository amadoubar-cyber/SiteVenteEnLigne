/**
 * Script de vérification complète du projet Bowoye
 * Vérifie tous les aspects du projet avant déploiement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VÉRIFICATION COMPLÈTE DU PROJET BOWOYE\n');
console.log('='.repeat(60));

const checks = [];
let criticalErrors = 0;
let warnings = 0;

// ===== SECTION 1: FICHIERS ESSENTIELS =====
console.log('\n📁 SECTION 1: VÉRIFICATION DES FICHIERS ESSENTIELS\n');

const essentialFiles = [
  // Backend
  { path: 'server/package.json', type: 'Backend', critical: true },
  { path: 'server/index.js', type: 'Backend', critical: true },
  { path: 'server/config/database.js', type: 'Backend', critical: true },
  { path: 'render.yaml', type: 'Deployment', critical: true },
  
  // Frontend
  { path: 'client/package.json', type: 'Frontend', critical: true },
  { path: 'client/src/App.js', type: 'Frontend', critical: true },
  { path: 'client/src/services/api.js', type: 'Frontend', critical: true },
  { path: 'client/src/config/env.js', type: 'Frontend', critical: true },
];

essentialFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  if (exists) {
    console.log(`✅ ${file.type}: ${file.path}`);
    checks.push({ section: 'Fichiers', name: file.path, status: true });
  } else {
    console.log(`❌ ${file.type}: ${file.path} - MANQUANT`);
    checks.push({ section: 'Fichiers', name: file.path, status: false });
    if (file.critical) criticalErrors++;
  }
});

// ===== SECTION 2: CONFIGURATION BACKEND =====
console.log('\n🖥️  SECTION 2: CONFIGURATION BACKEND\n');

try {
  // Vérifier server/package.json
  const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  
  const requiredDeps = {
    'express': 'Framework web',
    'mongoose': 'Base de données MongoDB',
    'cors': 'Cross-Origin Resource Sharing',
    'dotenv': 'Variables d\'environnement',
    'jsonwebtoken': 'Authentification JWT',
    'bcryptjs': 'Hash des mots de passe'
  };
  
  Object.entries(requiredDeps).forEach(([dep, description]) => {
    if (serverPackage.dependencies && serverPackage.dependencies[dep]) {
      console.log(`✅ ${dep}: ${serverPackage.dependencies[dep]} - ${description}`);
      checks.push({ section: 'Backend Deps', name: dep, status: true });
    } else {
      console.log(`❌ ${dep}: MANQUANT - ${description}`);
      checks.push({ section: 'Backend Deps', name: dep, status: false });
      criticalErrors++;
    }
  });
  
  // Vérifier les scripts
  console.log('\n📜 Scripts Backend:');
  if (serverPackage.scripts) {
    console.log(`   start: ${serverPackage.scripts.start || 'NON DÉFINI'}`);
    if (!serverPackage.scripts.start) warnings++;
  }
  
} catch (error) {
  console.log('❌ Erreur lecture server/package.json:', error.message);
  criticalErrors++;
}

// ===== SECTION 3: CONFIGURATION FRONTEND =====
console.log('\n💻 SECTION 3: CONFIGURATION FRONTEND\n');

try {
  const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  
  const requiredClientDeps = {
    'react': 'Framework React',
    'react-router-dom': 'Routing',
    'axios': 'Requêtes HTTP'
  };
  
  Object.entries(requiredClientDeps).forEach(([dep, description]) => {
    if (clientPackage.dependencies && clientPackage.dependencies[dep]) {
      console.log(`✅ ${dep}: ${clientPackage.dependencies[dep]} - ${description}`);
      checks.push({ section: 'Frontend Deps', name: dep, status: true });
    } else {
      console.log(`❌ ${dep}: MANQUANT - ${description}`);
      checks.push({ section: 'Frontend Deps', name: dep, status: false });
      criticalErrors++;
    }
  });
  
} catch (error) {
  console.log('❌ Erreur lecture client/package.json:', error.message);
  criticalErrors++;
}

// ===== SECTION 4: CONFIGURATION API =====
console.log('\n🔗 SECTION 4: CONFIGURATION DES URLs API\n');

try {
  // Vérifier client/src/config/env.js
  const envConfig = fs.readFileSync('client/src/config/env.js', 'utf8');
  
  // Vérifier les URLs
  if (envConfig.includes('bowoye-backend-5nd0.onrender.com')) {
    console.log('✅ URL Backend Render: bowoye-backend-5nd0.onrender.com');
    checks.push({ section: 'API URLs', name: 'Backend URL', status: true });
  } else if (envConfig.includes('bowoye-backend.onrender.com')) {
    console.log('⚠️  Ancienne URL Backend trouvée (devrait être bowoye-backend-5nd0)');
    warnings++;
  } else {
    console.log('❌ URL Backend Render non trouvée');
    criticalErrors++;
  }
  
  // Vérifier client/src/services/api.js
  const apiFile = fs.readFileSync('client/src/services/api.js', 'utf8');
  
  if (apiFile.includes('localhost:3001') || apiFile.includes('localhost:5000')) {
    console.log('✅ Configuration locale présente pour développement');
  }
  
  if (apiFile.includes('bowoye-backend-5nd0.onrender.com')) {
    console.log('✅ Configuration production présente');
  }
  
} catch (error) {
  console.log('❌ Erreur vérification configuration API:', error.message);
  criticalErrors++;
}

// ===== SECTION 5: MODÈLES DE DONNÉES =====
console.log('\n📊 SECTION 5: MODÈLES DE DONNÉES (MODELS)\n');

const models = [
  'server/models/User.js',
  'server/models/Product.js',
  'server/models/Order.js',
  'server/models/Category.js'
];

models.forEach(model => {
  const exists = fs.existsSync(model);
  const modelName = path.basename(model, '.js');
  if (exists) {
    console.log(`✅ Modèle ${modelName} existe`);
    checks.push({ section: 'Models', name: modelName, status: true });
  } else {
    console.log(`⚠️  Modèle ${modelName} manquant`);
    warnings++;
  }
});

// ===== SECTION 6: ROUTES API =====
console.log('\n🛣️  SECTION 6: ROUTES API\n');

const routes = [
  'server/routes/auth.js',
  'server/routes/products.js',
  'server/routes/orders.js',
  'server/routes/categories.js'
];

routes.forEach(route => {
  const exists = fs.existsSync(route);
  const routeName = path.basename(route, '.js');
  if (exists) {
    console.log(`✅ Route ${routeName} existe`);
    checks.push({ section: 'Routes', name: routeName, status: true });
  } else {
    console.log(`⚠️  Route ${routeName} manquante`);
    warnings++;
  }
});

// ===== SECTION 7: VÉRIFICATION RENDER.YAML =====
console.log('\n☁️  SECTION 7: CONFIGURATION RENDER\n');

try {
  const renderConfig = fs.readFileSync('render.yaml', 'utf8');
  
  const renderChecks = [
    { key: 'bowoye-backend-5nd0', desc: 'URL backend correcte' },
    { key: 'NODE_ENV', desc: 'Variable NODE_ENV' },
    { key: 'MONGODB_URI', desc: 'Variable MONGODB_URI' },
    { key: 'JWT_SECRET', desc: 'Variable JWT_SECRET' },
    { key: 'healthCheckPath', desc: 'Health check configuré' },
    { key: 'npm ci', desc: 'Commande build optimisée' }
  ];
  
  renderChecks.forEach(check => {
    if (renderConfig.includes(check.key)) {
      console.log(`✅ ${check.desc}`);
      checks.push({ section: 'Render', name: check.desc, status: true });
    } else {
      console.log(`❌ ${check.desc} - MANQUANT`);
      checks.push({ section: 'Render', name: check.desc, status: false });
      if (check.key === 'MONGODB_URI' || check.key === 'JWT_SECRET') {
        criticalErrors++;
      } else {
        warnings++;
      }
    }
  });
  
} catch (error) {
  console.log('❌ Erreur lecture render.yaml:', error.message);
  criticalErrors++;
}

// ===== SECTION 8: SÉCURITÉ =====
console.log('\n🔒 SECTION 8: SÉCURITÉ\n');

try {
  const serverIndex = fs.readFileSync('server/index.js', 'utf8');
  
  const securityChecks = [
    { pattern: /helmet\(/g, name: 'Helmet (sécurité headers)' },
    { pattern: /cors\(/g, name: 'CORS configuré' },
    { pattern: /rateLimit/g, name: 'Rate limiting' },
    { pattern: /trust proxy/g, name: 'Trust proxy (Render)' },
    { pattern: /express\.json\(\{.*limit/g, name: 'Limite taille requêtes' }
  ];
  
  securityChecks.forEach(check => {
    if (check.pattern.test(serverIndex)) {
      console.log(`✅ ${check.name}`);
      checks.push({ section: 'Sécurité', name: check.name, status: true });
    } else {
      console.log(`⚠️  ${check.name} - Non trouvé`);
      warnings++;
    }
  });
  
} catch (error) {
  console.log('❌ Erreur vérification sécurité:', error.message);
}

// ===== SECTION 9: IMAGES ET ASSETS =====
console.log('\n🖼️  SECTION 9: CONFIGURATION IMAGES\n');

try {
  const imageUtils = fs.readFileSync('client/src/utils/imageUtils.js', 'utf8');
  
  if (imageUtils.includes('bowoye-backend-5nd0.onrender.com')) {
    console.log('✅ URLs images configurées pour production');
  } else {
    console.log('⚠️  URLs images peut-être non configurées pour production');
    warnings++;
  }
  
  if (imageUtils.includes('localhost:3001')) {
    console.log('✅ URLs images configurées pour développement local');
  }
  
} catch (error) {
  console.log('⚠️  Fichier imageUtils.js non trouvé');
  warnings++;
}

// ===== SECTION 10: GIT ET DÉPLOIEMENT =====
console.log('\n📦 SECTION 10: GIT ET DÉPLOIEMENT\n');

// Vérifier .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('node_modules')) {
    console.log('✅ node_modules ignoré dans git');
  } else {
    console.log('⚠️  node_modules devrait être dans .gitignore');
    warnings++;
  }
  if (gitignore.includes('.env')) {
    console.log('✅ .env ignoré dans git (sécurité)');
  } else {
    console.log('⚠️  .env devrait être dans .gitignore');
    warnings++;
  }
} else {
  console.log('⚠️  Fichier .gitignore manquant');
  warnings++;
}

// ===== RÉSUMÉ FINAL =====
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
console.log('='.repeat(60) + '\n');

const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status).length;
const failedChecks = checks.filter(c => !c.status).length;

console.log(`Total de vérifications: ${totalChecks}`);
console.log(`✅ Réussies: ${passedChecks}`);
console.log(`❌ Échouées: ${failedChecks}`);
console.log(`⚠️  Avertissements: ${warnings}`);
console.log(`🔴 Erreurs critiques: ${criticalErrors}`);

const successRate = ((passedChecks / totalChecks) * 100).toFixed(1);
console.log(`\n📈 Taux de réussite: ${successRate}%`);

// ===== RECOMMANDATIONS =====
console.log('\n' + '='.repeat(60));
console.log('💡 RECOMMANDATIONS');
console.log('='.repeat(60) + '\n');

if (criticalErrors === 0 && warnings === 0) {
  console.log('🎉 EXCELLENT ! Votre projet est prêt pour le déploiement !');
  console.log('\n📤 Prochaines étapes:');
  console.log('   1. git add .');
  console.log('   2. git commit -m "Ready for production deployment"');
  console.log('   3. git push origin main');
  console.log('   4. Surveillez les logs Render et Vercel');
} else if (criticalErrors === 0) {
  console.log('✅ Bon ! Le projet peut être déployé.');
  console.log(`⚠️  Cependant, ${warnings} avertissement(s) à considérer.`);
  console.log('\n📤 Vous pouvez déployer, mais vérifiez les avertissements ci-dessus.');
} else {
  console.log(`❌ ATTENTION ! ${criticalErrors} erreur(s) critique(s) trouvée(s).`);
  console.log('\n🛠️  Corrigez les erreurs critiques avant de déployer:');
  checks.filter(c => !c.status).forEach(c => {
    console.log(`   - ${c.section}: ${c.name}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('Vérification terminée !');
console.log('='.repeat(60) + '\n');

// Code de sortie
process.exit(criticalErrors > 0 ? 1 : 0);

