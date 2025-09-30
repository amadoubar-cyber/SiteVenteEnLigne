#!/usr/bin/env node

/**
 * 🚀 Script de Démarrage Bowoye Multi Services
 * Démarre automatiquement le serveur et le client
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de Bowoye Multi Services...');
console.log('=========================================');
console.log('');

// Vérifier si les dossiers existent
const serverPath = path.join(__dirname, 'server');
const clientPath = path.join(__dirname, 'client');

if (!require('fs').existsSync(serverPath)) {
    console.error('❌ Dossier server non trouvé');
    process.exit(1);
}

if (!require('fs').existsSync(clientPath)) {
    console.error('❌ Dossier client non trouvé');
    process.exit(1);
}

// Démarrer le serveur backend
console.log('📡 Démarrage du serveur backend...');
const server = spawn('npm', ['start'], {
    cwd: serverPath,
    stdio: 'inherit',
    shell: true
});

server.on('error', (error) => {
    console.error('❌ Erreur serveur:', error);
});

// Attendre un peu puis démarrer le client
setTimeout(() => {
    console.log('🌐 Démarrage du client frontend...');
    const client = spawn('npm', ['start'], {
        cwd: clientPath,
        stdio: 'inherit',
        shell: true
    });

    client.on('error', (error) => {
        console.error('❌ Erreur client:', error);
    });

    console.log('');
    console.log('✅ Serveurs démarrés !');
    console.log('📍 Backend: http://localhost:5000');
    console.log('📍 Frontend: http://localhost:3000');
    console.log('');
    console.log('🔧 Admin: admin@koula.gn / admin123');
    console.log('👤 Client: client@bowoye.gn / password123');
    console.log('');

}, 3000);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt des serveurs...');
    server.kill();
    process.exit(0);
});
