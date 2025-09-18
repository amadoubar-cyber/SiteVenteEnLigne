const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

console.log('🚀 Démarrage de Koula E-commerce...\n');

// Fonction pour vérifier si un port est libre
function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Fonction pour lancer un processus
function startProcess(command, args, cwd, name) {
  console.log(`📦 Démarrage de ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    shell: true,
    stdio: 'inherit'
  });

  process.on('error', (err) => {
    console.error(`❌ Erreur lors du démarrage de ${name}:`, err.message);
  });

  process.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} s'est arrêté avec le code ${code}`);
    }
  });

  return process;
}

// Fonction pour attendre qu'un port soit libre
async function waitForPort(port, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await isPortFree(port)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
}

// Fonction principale
async function startApplication() {
  try {
    // Vérifier que les ports sont libres
    console.log('🔍 Vérification des ports...');
    
    if (!(await isPortFree(5000))) {
      console.log('⚠️  Le port 5000 est occupé, arrêt des processus existants...');
      // Attendre que le port se libère
      await waitForPort(5000);
    }
    
    if (!(await isPortFree(3000))) {
      console.log('⚠️  Le port 3000 est occupé, arrêt des processus existants...');
      // Attendre que le port se libère
      await waitForPort(3000);
    }

    // Démarrer le serveur
    const serverProcess = startProcess('npm', ['run', 'dev'], path.join(__dirname, 'server'), 'Serveur Backend');

    // Attendre que le serveur démarre
    console.log('⏳ Attente du démarrage du serveur...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Démarrer le client
    const clientProcess = startProcess('npm', ['start'], path.join(__dirname, 'client'), 'Client Frontend');
    
    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt des processus...');
      serverProcess.kill();
      clientProcess.kill();
      process.exit(0);
    });

    console.log('✅ Les processus sont en cours de démarrage...');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5000');
    console.log('\n💡 Appuyez sur Ctrl+C pour arrêter les services');

  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error.message);
    process.exit(1);
  }
}

// Démarrer l'application
startApplication();
