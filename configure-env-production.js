/**
 * 🚀 Script de Configuration des Variables d'Environnement en Production
 * 
 * Ce script génère les commandes pour configurer automatiquement
 * les variables d'environnement sur Vercel et Render
 */

console.log('🔧 CONFIGURATION DES VARIABLES D\'ENVIRONNEMENT');
console.log('='.repeat(60));

// Variables pour Vercel (Frontend)
console.log('\n📱 VARIABLES VERCEL (Frontend):');
console.log('Aller sur: https://vercel.com/dashboard');
console.log('Projet: bowoye-frontend');
console.log('Settings → Environment Variables');
console.log('');

const vercelVars = {
  'REACT_APP_API_URL': 'https://bowoye-backend.onrender.com/api',
  'REACT_APP_ENVIRONMENT': 'production',
  'REACT_APP_SITE_NAME': 'Bowoye Multi Services',
  'REACT_APP_SITE_URL': 'https://bowoye-frontend.vercel.app'
};

Object.entries(vercelVars).forEach(([key, value]) => {
  console.log(`${key} = ${value}`);
});

// Variables pour Render (Backend)
console.log('\n🔧 VARIABLES RENDER (Backend):');
console.log('Aller sur: https://dashboard.render.com');
console.log('Service: bowoye-backend');
console.log('Environment');
console.log('');

const renderVars = {
  'NODE_ENV': 'production',
  'PORT': '10000',
  'CORS_ORIGIN': 'https://bowoye-frontend.vercel.app',
  'CLIENT_URL': 'https://bowoye-frontend.vercel.app',
  'MONGODB_URI': '[Votre URI MongoDB Atlas]',
  'JWT_SECRET': '[Généré automatiquement par Render]'
};

Object.entries(renderVars).forEach(([key, value]) => {
  console.log(`${key} = ${value}`);
});

// Commandes Vercel CLI (optionnel)
console.log('\n💻 COMMANDES VERCEL CLI (optionnel):');
console.log('npm install -g vercel');
console.log('vercel login');
console.log('vercel env add REACT_APP_API_URL');
console.log('vercel env add REACT_APP_ENVIRONMENT');
console.log('vercel env add REACT_APP_SITE_NAME');
console.log('vercel env add REACT_APP_SITE_URL');

// Instructions de redéploiement
console.log('\n🔄 REDÉPLOIEMENT:');
console.log('1. Après avoir ajouté les variables sur Vercel et Render');
console.log('2. Redéployer automatiquement ou manuellement');
console.log('3. Vercel: Push sur GitHub ou "Redeploy" manuel');
console.log('4. Render: "Manual Deploy" ou redémarrage automatique');

// Test de validation
console.log('\n🧪 TESTS DE VALIDATION:');
console.log('1. Vérifier que https://bowoye-backend.onrender.com/api/health répond');
console.log('2. Vérifier que https://bowoye-frontend.vercel.app se charge');
console.log('3. Tester la connexion frontend-backend');
console.log('4. Vérifier la console du navigateur (F12) - pas d\'erreurs CORS');

console.log('\n✅ CONFIGURATION TERMINÉE !');
console.log('Votre application sera maintenant fonctionnelle en production.');
