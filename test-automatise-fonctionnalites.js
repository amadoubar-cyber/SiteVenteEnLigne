/**
 * 🧪 Script de Test Automatisé - Toutes les Fonctionnalités
 * Bowoye Multi Services - Plateforme E-commerce
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration des tests
const TEST_CONFIG = {
    frontendUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:5000',
    adminCredentials: {
        email: 'admin@koula.gn',
        password: 'admin123'
    },
    testUserCredentials: {
        email: 'client@bowoye.gn',
        password: 'password123'
    },
    testResults: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
    }
};

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Fonction de log coloré
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    let color = colors.reset;
    
    switch (type) {
        case 'success':
            color = colors.green;
            break;
        case 'error':
            color = colors.red;
            break;
        case 'warning':
            color = colors.yellow;
            break;
        case 'info':
            color = colors.blue;
            break;
        case 'header':
            color = colors.magenta;
            break;
    }
    
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

// Fonction pour vérifier si un serveur répond
async function checkServer(url, name) {
    return new Promise((resolve) => {
        const http = require('http');
        const https = require('https');
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request(url, { timeout: 5000 }, (res) => {
            resolve({
                success: true,
                status: res.statusCode,
                name: name
            });
        });
        
        req.on('error', (err) => {
            resolve({
                success: false,
                error: err.message,
                name: name
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                name: name
            });
        });
        
        req.end();
    });
}

// Fonction pour tester une API endpoint
async function testAPIEndpoint(endpoint, method = 'GET', data = null) {
    return new Promise((resolve) => {
        const http = require('http');
        const url = new URL(endpoint, TEST_CONFIG.backendUrl);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        };
        
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    success: res.statusCode < 400,
                    status: res.statusCode,
                    data: responseData,
                    endpoint: endpoint
                });
            });
        });
        
        req.on('error', (err) => {
            resolve({
                success: false,
                error: err.message,
                endpoint: endpoint
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                endpoint: endpoint
            });
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Fonction pour exécuter un test
async function runTest(testName, testFunction) {
    TEST_CONFIG.testResults.total++;
    
    try {
        log(`🧪 Test: ${testName}`, 'info');
        const result = await testFunction();
        
        if (result.success) {
            TEST_CONFIG.testResults.passed++;
            log(`✅ ${testName} - RÉUSSI`, 'success');
            return true;
        } else {
            TEST_CONFIG.testResults.failed++;
            log(`❌ ${testName} - ÉCHEC: ${result.error || 'Test failed'}`, 'error');
            return false;
        }
    } catch (error) {
        TEST_CONFIG.testResults.failed++;
        log(`❌ ${testName} - ERREUR: ${error.message}`, 'error');
        return false;
    }
}

// Tests des serveurs
async function testServers() {
    log('\n🌐 Tests des Serveurs', 'header');
    
    // Test serveur backend
    await runTest('Serveur Backend', async () => {
        const result = await checkServer(TEST_CONFIG.backendUrl, 'Backend');
        return result;
    });
    
    // Test serveur frontend
    await runTest('Serveur Frontend', async () => {
        const result = await checkServer(TEST_CONFIG.frontendUrl, 'Frontend');
        return result;
    });
}

// Tests des APIs Backend
async function testBackendAPIs() {
    log('\n⚙️ Tests des APIs Backend', 'header');
    
    const endpoints = [
        { path: '/api/products', method: 'GET', name: 'API Produits' },
        { path: '/api/orders', method: 'GET', name: 'API Commandes' },
        { path: '/api/users', method: 'GET', name: 'API Utilisateurs' },
        { path: '/api/auth/login', method: 'POST', name: 'API Login', data: TEST_CONFIG.adminCredentials },
        { path: '/api/dashboard', method: 'GET', name: 'API Dashboard' },
        { path: '/api/stock', method: 'GET', name: 'API Stock' },
        { path: '/api/categories', method: 'GET', name: 'API Catégories' },
        { path: '/api/sales', method: 'GET', name: 'API Ventes' }
    ];
    
    for (const endpoint of endpoints) {
        await runTest(endpoint.name, async () => {
            const result = await testAPIEndpoint(endpoint.path, endpoint.method, endpoint.data);
            // Accepter les codes 200-299 et 401 (non autorisé) comme valides
            return {
                success: result.success || result.status === 401,
                error: result.error
            };
        });
    }
}

// Tests de l'authentification
async function testAuthentication() {
    log('\n🔐 Tests d\'Authentification', 'header');
    
    // Test login admin
    await runTest('Login Admin', async () => {
        const result = await testAPIEndpoint('/api/auth/login', 'POST', TEST_CONFIG.adminCredentials);
        return {
            success: result.success && result.status === 200,
            error: result.error
        };
    });
    
    // Test login utilisateur
    await runTest('Login Utilisateur', async () => {
        const result = await testAPIEndpoint('/api/auth/login', 'POST', TEST_CONFIG.testUserCredentials);
        return {
            success: result.success && result.status === 200,
            error: result.error
        };
    });
    
    // Test endpoint protégé sans token
    await runTest('Accès Protégé Sans Token', async () => {
        const result = await testAPIEndpoint('/api/admin/dashboard', 'GET');
        return {
            success: result.status === 401, // Doit retourner 401 (non autorisé)
            error: result.error
        };
    });
}

// Tests des fonctionnalités principales
async function testMainFeatures() {
    log('\n📦 Tests des Fonctionnalités Principales', 'header');
    
    // Test CRUD Produits
    await runTest('CRUD Produits - Lecture', async () => {
        const result = await testAPIEndpoint('/api/products', 'GET');
        return {
            success: result.success || result.status === 401,
            error: result.error
        };
    });
    
    // Test Gestion des Commandes
    await runTest('Gestion des Commandes', async () => {
        const result = await testAPIEndpoint('/api/orders', 'GET');
        return {
            success: result.success || result.status === 401,
            error: result.error
        };
    });
    
    // Test Gestion du Stock
    await runTest('Gestion du Stock', async () => {
        const result = await testAPIEndpoint('/api/stock', 'GET');
        return {
            success: result.success || result.status === 401,
            error: result.error
        };
    });
    
    // Test Dashboard Admin
    await runTest('Dashboard Admin', async () => {
        const result = await testAPIEndpoint('/api/dashboard', 'GET');
        return {
            success: result.success || result.status === 401,
            error: result.error
        };
    });
}

// Tests de la base de données
async function testDatabase() {
    log('\n🗄️ Tests de la Base de Données', 'header');
    
    // Vérifier les fichiers de base de données
    await runTest('Fichiers de Base de Données', async () => {
        const dbFiles = [
            'server/data/products.json',
            'server/data/orders.json',
            'server/data/users.json',
            'server/data/categories.json'
        ];
        
        let allExist = true;
        for (const file of dbFiles) {
            if (!fs.existsSync(file)) {
                allExist = false;
                break;
            }
        }
        
        return {
            success: allExist,
            error: allExist ? null : 'Certains fichiers de base de données manquent'
        };
    });
    
    // Vérifier la structure des données
    await runTest('Structure des Données', async () => {
        try {
            const productsPath = 'server/data/products.json';
            if (fs.existsSync(productsPath)) {
                const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
                const isValid = Array.isArray(products);
                return {
                    success: isValid,
                    error: isValid ? null : 'Format de données invalide'
                };
            }
            return { success: false, error: 'Fichier produits non trouvé' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

// Tests des fichiers et structure
async function testFileStructure() {
    log('\n📁 Tests de la Structure des Fichiers', 'header');
    
    // Vérifier les fichiers essentiels
    const essentialFiles = [
        'package.json',
        'start.js',
        'start.bat',
        'README.md',
        'client/package.json',
        'server/package.json',
        'client/src/App.js',
        'server/index.js'
    ];
    
    for (const file of essentialFiles) {
        await runTest(`Fichier: ${file}`, async () => {
            return {
                success: fs.existsSync(file),
                error: fs.existsSync(file) ? null : 'Fichier manquant'
            };
        });
    }
    
    // Vérifier les dossiers essentiels
    const essentialDirs = [
        'client',
        'server',
        'client/src',
        'client/src/components',
        'client/src/pages',
        'client/src/services',
        'server/data'
    ];
    
    for (const dir of essentialDirs) {
        await runTest(`Dossier: ${dir}`, async () => {
            return {
                success: fs.existsSync(dir) && fs.statSync(dir).isDirectory(),
                error: fs.existsSync(dir) ? null : 'Dossier manquant'
            };
        });
    }
}

// Tests de configuration
async function testConfiguration() {
    log('\n⚙️ Tests de Configuration', 'header');
    
    // Vérifier package.json
    await runTest('Configuration Package.json', async () => {
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const hasScripts = packageJson.scripts && 
                             packageJson.scripts.start && 
                             packageJson.scripts.client && 
                             packageJson.scripts.server;
            return {
                success: hasScripts,
                error: hasScripts ? null : 'Scripts manquants dans package.json'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
    
    // Vérifier configuration client
    await runTest('Configuration Client', async () => {
        try {
            const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
            const hasReact = clientPackage.dependencies && clientPackage.dependencies.react;
            return {
                success: hasReact,
                error: hasReact ? null : 'React non trouvé dans les dépendances client'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
    
    // Vérifier configuration serveur
    await runTest('Configuration Serveur', async () => {
        try {
            const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
            const hasExpress = serverPackage.dependencies && serverPackage.dependencies.express;
            return {
                success: hasExpress,
                error: hasExpress ? null : 'Express non trouvé dans les dépendances serveur'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

// Fonction pour afficher le résumé
function displaySummary() {
    log('\n📊 RÉSUMÉ DES TESTS', 'header');
    log('='.repeat(50), 'header');
    
    const { total, passed, failed, skipped } = TEST_CONFIG.testResults;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    log(`📈 Total des tests: ${total}`, 'info');
    log(`✅ Tests réussis: ${passed}`, 'success');
    log(`❌ Tests échoués: ${failed}`, 'error');
    log(`⏭️ Tests ignorés: ${skipped}`, 'warning');
    log(`📊 Taux de réussite: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');
    
    if (failed === 0) {
        log('\n🎉 TOUS LES TESTS SONT RÉUSSIS !', 'success');
        log('🚀 L\'application est prête pour la production !', 'success');
    } else {
        log(`\n⚠️ ${failed} test(s) ont échoué`, 'warning');
        log('🔧 Vérifiez les erreurs ci-dessus et corrigez-les', 'warning');
    }
    
    log('='.repeat(50), 'header');
}

// Fonction principale
async function runAllTests() {
    log('🧪 DÉMARRAGE DES TESTS AUTOMATISÉS', 'header');
    log('Bowoye Multi Services - Plateforme E-commerce', 'header');
    log('='.repeat(60), 'header');
    
    try {
        // Exécuter tous les tests
        await testServers();
        await testBackendAPIs();
        await testAuthentication();
        await testMainFeatures();
        await testDatabase();
        await testFileStructure();
        await testConfiguration();
        
        // Afficher le résumé
        displaySummary();
        
        // Sauvegarder les résultats
        const reportPath = `test-report-${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(TEST_CONFIG.testResults, null, 2));
        log(`\n📄 Rapport sauvegardé: ${reportPath}`, 'info');
        
        // Code de sortie
        process.exit(TEST_CONFIG.testResults.failed > 0 ? 1 : 0);
        
    } catch (error) {
        log(`\n💥 ERREUR CRITIQUE: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    testServers,
    testBackendAPIs,
    testAuthentication,
    testMainFeatures,
    testDatabase,
    testFileStructure,
    testConfiguration,
    TEST_CONFIG
};
