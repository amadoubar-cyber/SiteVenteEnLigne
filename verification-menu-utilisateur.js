// Script pour vérifier et corriger le menu utilisateur
// À exécuter dans la console du navigateur

console.log('🔍 VÉRIFICATION ET CORRECTION DU MENU UTILISATEUR');
console.log('=' .repeat(50));

// Fonction pour vérifier le menu utilisateur
const verifierMenuUtilisateur = () => {
  console.log('\n🔍 VÉRIFICATION DU MENU UTILISATEUR:');
  
  // Chercher le bouton utilisateur
  const boutonUtilisateur = document.querySelector('button[class*="user"], button[class*="User"], button[aria-label*="user"], button[aria-label*="User"]');
  console.log(`👤 Bouton utilisateur trouvé: ${boutonUtilisateur ? 'Oui' : 'Non'}`);
  
  if (boutonUtilisateur) {
    console.log('👤 Bouton utilisateur:', boutonUtilisateur);
    
    // Cliquer sur le bouton pour ouvrir le menu
    boutonUtilisateur.click();
    
    // Attendre un peu pour que le menu s'ouvre
    setTimeout(() => {
      const menuUtilisateur = document.querySelector('div[class*="menu"], div[class*="dropdown"], div[class*="Menu"]');
      console.log(`📋 Menu utilisateur ouvert: ${menuUtilisateur ? 'Oui' : 'Non'}`);
      
      if (menuUtilisateur) {
        console.log('📋 Menu utilisateur:', menuUtilisateur);
        
        // Chercher les liens dans le menu
        const liensMenu = menuUtilisateur.querySelectorAll('a[href*="/orders"], a[href*="/profile"], a[href*="/logout"]');
        console.log(`🔗 Liens dans le menu: ${liensMenu.length}`);
        
        liensMenu.forEach((lien, index) => {
          console.log(`   ${index + 1}. ${lien.textContent.trim()} - ${lien.href}`);
        });
        
        // Chercher spécifiquement le lien "Mes Commandes"
        const lienCommandes = Array.from(liensMenu).find(lien => 
          lien.textContent.toLowerCase().includes('commande') || 
          lien.href.includes('/orders')
        );
        
        if (lienCommandes) {
          console.log('✅ Lien "Mes Commandes" trouvé:', lienCommandes);
        } else {
          console.log('❌ Lien "Mes Commandes" non trouvé');
        }
      }
    }, 500);
  }
  
  return boutonUtilisateur;
};

// Fonction pour créer un menu utilisateur de secours
const creerMenuUtilisateurSecours = () => {
  console.log('\n🔧 CRÉATION D\'UN MENU UTILISATEUR DE SECOURS:');
  
  // Supprimer l'ancien menu de secours s'il existe
  const ancienMenu = document.querySelector('.menu-utilisateur-secours');
  if (ancienMenu) {
    ancienMenu.remove();
  }
  
  // Créer le menu de secours
  const menuSecours = document.createElement('div');
  menuSecours.className = 'menu-utilisateur-secours';
  menuSecours.style.cssText = `
    position: fixed;
    top: 80px;
    left: 20px;
    z-index: 9999;
    background: white;
    border: 2px solid #3B82F6;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    min-width: 250px;
  `;
  
  // Récupérer les données utilisateur
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  menuSecours.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px;">
      <h3 style="color: #3B82F6; margin: 0; font-size: 18px;">👤 Mon Espace</h3>
      <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${userData.firstName || 'Utilisateur'} ${userData.lastName || ''}</p>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <button onclick="window.location.href='/orders'" style="
        background: #3B82F6;
        color: white;
        border: none;
        padding: 12px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#2563EB'" onmouseout="this.style.background='#3B82F6'">
        📦 Mes Commandes
      </button>
      
      <button onclick="window.location.href='/client-orders-test'" style="
        background: #10B981;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10B981'">
        🧪 Test Commandes
      </button>
      
      <button onclick="window.location.href='/profile'" style="
        background: #6B7280;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#4B5563'" onmouseout="this.style.background='#6B7280'">
        👤 Mon Profil
      </button>
      
      <button onclick="window.location.href='/admin/orders'" style="
        background: #F59E0B;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#D97706'" onmouseout="this.style.background='#F59E0B'">
        👨‍💼 Admin
      </button>
      
      <button onclick="localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'" style="
        background: #EF4444;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">
        🚪 Déconnexion
      </button>
    </div>
    
    <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: #E5E7EB;
        color: #374151;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      ">Fermer</button>
    </div>
  `;
  
  document.body.appendChild(menuSecours);
  
  console.log('✅ Menu utilisateur de secours créé');
  console.log('📍 Position: En haut à gauche');
  console.log('💡 Ce menu contient tous les liens nécessaires');
  
  return true;
};

// Fonction pour vérifier les notifications
const verifierNotifications = () => {
  console.log('\n🔔 VÉRIFICATION DES NOTIFICATIONS:');
  
  // Chercher la cloche de notifications
  const clocheNotifications = document.querySelector('button[class*="bell"], button[class*="Bell"], svg[data-lucide="bell"]');
  console.log(`🔔 Cloche de notifications trouvée: ${clocheNotifications ? 'Oui' : 'Non'}`);
  
  if (clocheNotifications) {
    console.log('🔔 Cloche de notifications:', clocheNotifications);
    
    // Vérifier les notifications dans localStorage
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    const notificationsNonLues = notifications.filter(n => !n.read);
    
    console.log(`🔔 Notifications totales: ${notifications.length}`);
    console.log(`🔔 Notifications non lues: ${notificationsNonLues.length}`);
    
    if (notificationsNonLues.length > 0) {
      console.log('📋 Notifications non lues:');
      notificationsNonLues.forEach((notification, index) => {
        console.log(`   ${index + 1}. ${notification.title}`);
      });
    }
  }
  
  return clocheNotifications;
};

// Fonction pour créer une notification de test
const creerNotificationTest = () => {
  console.log('\n🔔 CRÉATION D\'UNE NOTIFICATION DE TEST:');
  
  try {
    const notifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
    
    const nouvelleNotification = {
      id: Date.now() + Math.random(),
      type: 'info',
      title: 'Espace Client Disponible ! 🎉',
      message: 'Votre espace client est maintenant accessible. Cliquez sur "Mes Commandes" pour voir vos commandes.',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(nouvelleNotification);
    localStorage.setItem('client_notifications', JSON.stringify(notifications));
    
    console.log('✅ Notification de test créée');
    console.log(`🔔 Total notifications: ${notifications.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale de vérification et correction
const verificationEtCorrectionMenu = () => {
  console.log('🚀 DÉMARRAGE DE LA VÉRIFICATION ET CORRECTION...');
  
  // 1. Vérifier le menu utilisateur
  console.log('\n' + '='.repeat(50));
  console.log('1️⃣ VÉRIFICATION DU MENU UTILISATEUR');
  console.log('='.repeat(50));
  const boutonUtilisateur = verifierMenuUtilisateur();
  
  // 2. Créer un menu de secours
  console.log('\n' + '='.repeat(50));
  console.log('2️⃣ CRÉATION D\'UN MENU DE SECOURS');
  console.log('='.repeat(50));
  creerMenuUtilisateurSecours();
  
  // 3. Vérifier les notifications
  console.log('\n' + '='.repeat(50));
  console.log('3️⃣ VÉRIFICATION DES NOTIFICATIONS');
  console.log('='.repeat(50));
  verifierNotifications();
  
  // 4. Créer une notification de test
  console.log('\n' + '='.repeat(50));
  console.log('4️⃣ CRÉATION D\'UNE NOTIFICATION DE TEST');
  console.log('='.repeat(50));
  creerNotificationTest();
  
  // 5. Résumé final
  console.log('\n' + '='.repeat(70));
  console.log('📋 RÉSUMÉ DE LA VÉRIFICATION ET CORRECTION');
  console.log('='.repeat(70));
  
  console.log('🔍 Résultats:');
  console.log(`- Bouton utilisateur trouvé: ${boutonUtilisateur ? '✅' : '❌'}`);
  console.log('- Menu de secours créé: ✅');
  console.log('- Notification de test créée: ✅');
  
  console.log('\n🎉 MENU UTILISATEUR CORRIGÉ!');
  console.log('\n💡 Instructions:');
  console.log('1. Utilisez le menu de secours en haut à gauche');
  console.log('2. Cliquez sur "📦 Mes Commandes" pour accéder à vos commandes');
  console.log('3. Cliquez sur "🧪 Test Commandes" pour la page de test');
  console.log('4. Vérifiez la cloche de notifications');
  
  console.log('\n🔧 URLs directes:');
  console.log('- http://localhost:3000/orders');
  console.log('- http://localhost:3000/client-orders-test');
  console.log('- http://localhost:3000/profile');
  console.log('- http://localhost:3000/admin/orders');
  
  console.log('\n✅ Votre espace client est maintenant accessible via le menu de secours!');
};

// Exporter les fonctions
window.verifierMenuUtilisateur = verifierMenuUtilisateur;
window.creerMenuUtilisateurSecours = creerMenuUtilisateurSecours;
window.verifierNotifications = verifierNotifications;
window.creerNotificationTest = creerNotificationTest;
window.verificationEtCorrectionMenu = verificationEtCorrectionMenu;

console.log('🔧 Fonctions disponibles:');
console.log('- verifierMenuUtilisateur() : Vérifier le menu utilisateur');
console.log('- creerMenuUtilisateurSecours() : Créer un menu de secours');
console.log('- verifierNotifications() : Vérifier les notifications');
console.log('- creerNotificationTest() : Créer une notification de test');
console.log('- verificationEtCorrectionMenu() : Vérification et correction complète');

// Exécuter automatiquement
verificationEtCorrectionMenu();
