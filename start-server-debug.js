/**
 * 🔧 Script de Démarrage et Diagnostic du Serveur
 * Bowoye Multi Services - Diagnostic des Problèmes
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 DIAGNOSTIC DU SERVEUR');
console.log('========================');
console.log('');

// 1. Vérifier la structure du serveur
function checkServerStructure() {
    console.log('📁 Vérification de la structure du serveur...');
    
    const serverDir = path.join(__dirname, 'server');
    
    if (!fs.existsSync(serverDir)) {
        console.log('❌ Dossier server non trouvé');
        return false;
    }
    console.log('✅ Dossier server trouvé');
    
    // Vérifier les fichiers essentiels
    const essentialFiles = [
        'package.json',
        'index.js',
        '.env'
    ];
    
    for (const file of essentialFiles) {
        const filePath = path.join(serverDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${file} trouvé`);
        } else {
            console.log(`❌ ${file} manquant`);
        }
    }
    
    return true;
}

// 2. Vérifier les dépendances
function checkDependencies() {
    console.log('📦 Vérification des dépendances...');
    
    const packageJsonPath = path.join(__dirname, 'server', 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        console.log('❌ package.json non trouvé');
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log('✅ package.json valide');
        
        // Vérifier les dépendances critiques
        const criticalDeps = ['express', 'cors', 'helmet'];
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        for (const dep of criticalDeps) {
            if (deps[dep]) {
                console.log(`✅ ${dep} installé`);
            } else {
                console.log(`❌ ${dep} manquant`);
            }
        }
        
        return true;
    } catch (error) {
        console.log('❌ Erreur de lecture package.json:', error.message);
        return false;
    }
}

// 3. Vérifier la configuration
function checkConfiguration() {
    console.log('⚙️ Vérification de la configuration...');
    
    const envPath = path.join(__dirname, 'server', '.env');
    
    if (fs.existsSync(envPath)) {
        console.log('✅ Fichier .env trouvé');
        
        try {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            
            console.log(`✅ ${lines.length} variables d'environnement trouvées`);
            
            // Vérifier les variables importantes
            const importantVars = ['PORT', 'NODE_ENV'];
            for (const varName of importantVars) {
                if (envContent.includes(varName)) {
                    console.log(`✅ ${varName} configuré`);
                } else {
                    console.log(`⚠️ ${varName} non configuré`);
                }
            }
            
        } catch (error) {
            console.log('❌ Erreur de lecture .env:', error.message);
        }
    } else {
        console.log('⚠️ Fichier .env non trouvé');
    }
    
    return true;
}

// 4. Créer un serveur minimal pour test
function createMinimalServer() {
    console.log('🚀 Création d\'un serveur minimal pour test...');
    
    const serverCode = `
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Serveur fonctionnel', 
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.get('/api/products', (req, res) => {
    res.json({
        products: [
            {
                _id: 'prod-1',
                name: 'Test Product',
                price: 1000,
                stock: 10
            }
        ]
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({
        success: true,
        message: 'Login test réussi',
        user: {
            _id: 'user-1',
            email: req.body.email,
            role: 'user'
        }
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(\`🚀 Serveur de test démarré sur le port \${PORT}\`);
    console.log(\`🌐 API disponible sur: http://localhost:\${PORT}/api\`);
    console.log(\`🧪 Test: http://localhost:\${PORT}/api/test\`);
});

module.exports = app;
`;

    const serverPath = path.join(__dirname, 'server', 'test-server.js');
    fs.writeFileSync(serverPath, serverCode);
    console.log('✅ Serveur de test créé: server/test-server.js');
    
    return serverPath;
}

// 5. Fonction principale
function runDiagnostic() {
    console.log('🔍 DIAGNOSTIC COMPLET DU SERVEUR');
    console.log('==================================');
    console.log('');
    
    const results = {
        structure: checkServerStructure(),
        dependencies: checkDependencies(),
        configuration: checkConfiguration()
    };
    
    console.log('');
    console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
    console.log('========================');
    console.log('');
    
    if (results.structure && results.dependencies && results.configuration) {
        console.log('✅ Serveur prêt pour le démarrage');
        console.log('');
        console.log('🚀 DÉMARRAGE RECOMMANDÉ:');
        console.log('1. cd server');
        console.log('2. npm install (si nécessaire)');
        console.log('3. node index.js');
        console.log('');
        console.log('🧪 OU SERVEUR DE TEST:');
        console.log('1. cd server');
        console.log('2. node test-server.js');
        
        // Créer le serveur de test
        createMinimalServer();
        
    } else {
        console.log('❌ Problèmes détectés, correction nécessaire');
        console.log('');
        console.log('🔧 ACTIONS REQUISES:');
        
        if (!results.structure) {
            console.log('- Vérifier la structure des fichiers');
        }
        if (!results.dependencies) {
            console.log('- Installer les dépendances: npm install');
        }
        if (!results.configuration) {
            console.log('- Configurer le fichier .env');
        }
    }
    
    console.log('');
    console.log('🎯 PROCHAINES ÉTAPES:');
    console.log('1. Corriger les problèmes identifiés');
    console.log('2. Démarrer le serveur');
    console.log('3. Tester l\'API: http://localhost:3001/api/test');
    console.log('4. Tester l\'authentification: http://localhost:3001/api/auth/login');
    console.log('');
}

// Exécuter le diagnostic
if (require.main === module) {
    runDiagnostic();
}

module.exports = {
    checkServerStructure,
    checkDependencies,
    checkConfiguration,
    createMinimalServer,
    runDiagnostic
};
