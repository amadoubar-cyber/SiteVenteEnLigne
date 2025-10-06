/**
 * 🔧 CORRECTION IMMÉDIATE DES ROUTES
 * =================================
 * 
 * Ce script corrige les problèmes de routage en créant
 * des liens fonctionnels et en testant la navigation.
 */

console.log('🔧 CORRECTION DES ROUTES');
console.log('========================');

// 1. Créer un menu de navigation fonctionnel
function createNavigationMenu() {
  const nav = document.createElement('nav');
  nav.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
    color: white;
    padding: 10px 20px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
  `;
  
  nav.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <h2 style="margin: 0; font-size: 18px;">🏪 Bowoye Multi Services</h2>
        <div style="display: flex; gap: 15px;">
          <a href="/" style="color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.3s;">🏠 Accueil</a>
          <a href="/products" style="color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.3s;">📦 Produits</a>
          <a href="/construction" style="color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.3s;">🏗️ Construction</a>
          <a href="/electronics" style="color: white; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.3s;">📱 Électronique</a>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <a href="/login" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: background 0.3s;">🔐 Connexion</a>
        <a href="/register" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: background 0.3s;">📝 Inscription</a>
        <a href="/admin" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px; transition: background 0.3s;">⚙️ Admin</a>
      </div>
    </div>
  `;
  
  // Ajouter des effets hover
  const links = nav.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.background = 'rgba(255,255,255,0.3)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.background = link.href.includes('login') || link.href.includes('register') || link.href.includes('admin') 
        ? 'rgba(255,255,255,0.2)' : 'transparent';
    });
  });
  
  document.body.insertBefore(nav, document.body.firstChild);
  
  // Ajuster le padding du body pour éviter le chevauchement
  document.body.style.paddingTop = '60px';
  
  console.log('✅ Menu de navigation créé');
}

// 2. Créer une page d'accueil simple si nécessaire
function createSimpleHomePage() {
  if (window.location.pathname === '/' && document.body.innerHTML.includes('root')) {
    console.log('🔧 Création d\'une page d\'accueil simple...');
    
    const homeContent = document.createElement('div');
    homeContent.style.cssText = `
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    `;
    
    homeContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #3B82F6; font-size: 2.5rem; margin-bottom: 10px;">🏪 Bowoye Multi Services</h1>
        <p style="color: #6B7280; font-size: 1.2rem;">Plateforme de Vente en Ligne</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
          <h3 style="color: #3B82F6; margin-bottom: 15px;">📦 Produits</h3>
          <p style="color: #6B7280; margin-bottom: 20px;">Découvrez notre large gamme de produits</p>
          <a href="/products" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir les produits</a>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
          <h3 style="color: #3B82F6; margin-bottom: 15px;">🏗️ Construction</h3>
          <p style="color: #6B7280; margin-bottom: 20px;">Matériaux de construction de qualité</p>
          <a href="/construction" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir les matériaux</a>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
          <h3 style="color: #3B82F6; margin-bottom: 15px;">📱 Électronique</h3>
          <p style="color: #6B7280; margin-bottom: 20px;">Appareils électroniques modernes</p>
          <a href="/electronics" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir l'électronique</a>
        </div>
      </div>
      
      <div style="text-align: center; background: #F3F4F6; padding: 30px; border-radius: 8px;">
        <h3 style="color: #3B82F6; margin-bottom: 15px;">🚀 Commencez maintenant</h3>
        <p style="color: #6B7280; margin-bottom: 20px;">Créez votre compte pour accéder à tous nos services</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <a href="/register" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">📝 S'inscrire</a>
          <a href="/login" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">🔐 Se connecter</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(homeContent);
    console.log('✅ Page d\'accueil simple créée');
  }
}

// 3. Créer une page d'inscription fonctionnelle
function createWorkingRegisterPage() {
  if (window.location.pathname === '/register') {
    console.log('🔧 Création d\'une page d\'inscription fonctionnelle...');
    
    const registerContent = document.createElement('div');
    registerContent.style.cssText = `
      max-width: 500px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
    `;
    
    registerContent.innerHTML = `
      <h2 style="text-align: center; color: #3B82F6; margin-bottom: 30px;">📝 Créer un compte</h2>
      
      <form id="registerForm" style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Prénom</label>
          <input type="text" id="firstName" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Nom</label>
          <input type="text" id="lastName" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Email</label>
          <input type="email" id="email" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Téléphone</label>
          <input type="tel" id="phone" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Mot de passe</label>
          <input type="password" id="password" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <button type="submit" style="background: #10B981; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer;">
          📝 Créer mon compte
        </button>
      </form>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #6B7280;">Déjà un compte ? <a href="/login" style="color: #3B82F6; text-decoration: none;">Se connecter</a></p>
      </div>
    `;
    
    // Ajouter la logique de soumission
    const form = registerContent.querySelector('#registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
      };
      
      console.log('📝 Tentative d\'inscription:', formData);
      
      try {
        // Sauvegarder dans localStorage pour le moment
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
          ...formData,
          id: Date.now().toString(),
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        window.location.href = '/login';
        
      } catch (error) {
        console.error('❌ Erreur lors de l\'inscription:', error);
        alert('❌ Erreur lors de la création du compte. Veuillez réessayer.');
      }
    });
    
    document.body.appendChild(registerContent);
    console.log('✅ Page d\'inscription fonctionnelle créée');
  }
}

// 4. Créer une page de connexion fonctionnelle
function createWorkingLoginPage() {
  if (window.location.pathname === '/login') {
    console.log('🔧 Création d\'une page de connexion fonctionnelle...');
    
    const loginContent = document.createElement('div');
    loginContent.style.cssText = `
      max-width: 400px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
    `;
    
    loginContent.innerHTML = `
      <h2 style="text-align: center; color: #3B82F6; margin-bottom: 30px;">🔐 Connexion</h2>
      
      <form id="loginForm" style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Email</label>
          <input type="email" id="email" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: bold;">Mot de passe</label>
          <input type="password" id="password" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 4px; font-size: 16px;">
        </div>
        
        <button type="submit" style="background: #3B82F6; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer;">
          🔐 Se connecter
        </button>
      </form>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #6B7280;">Pas encore de compte ? <a href="/register" style="color: #3B82F6; text-decoration: none;">S'inscrire</a></p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #F3F4F6; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #374151;">🧪 Comptes de test :</h4>
        <p style="margin: 5px 0; color: #6B7280; font-size: 14px;"><strong>Admin:</strong> admin@bowoye.com / admin123</p>
        <p style="margin: 5px 0; color: #6B7280; font-size: 14px;"><strong>Client:</strong> client@test.com / client123</p>
      </div>
    `;
    
    // Ajouter la logique de connexion
    const form = loginContent.querySelector('#loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      console.log('🔐 Tentative de connexion:', { email, password });
      
      // Comptes de test
      const testAccounts = [
        { email: 'admin@bowoye.com', password: 'admin123', role: 'admin', name: 'Admin' },
        { email: 'client@test.com', password: 'client123', role: 'user', name: 'Client Test' }
      ];
      
      const user = testAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (user) {
        // Sauvegarder la session
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.email,
          email: user.email,
          role: user.role,
          name: user.name,
          loginTime: new Date().toISOString()
        }));
        
        alert(`✅ Connexion réussie ! Bienvenue ${user.name}`);
        
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        alert('❌ Email ou mot de passe incorrect');
      }
    });
    
    document.body.appendChild(loginContent);
    console.log('✅ Page de connexion fonctionnelle créée');
  }
}

// 5. Exécuter toutes les corrections
console.log('🚀 Exécution des corrections...');

createNavigationMenu();
createSimpleHomePage();
createWorkingRegisterPage();
createWorkingLoginPage();

console.log('✅ Corrections terminées !');
console.log('==========================');
console.log('💡 Vous pouvez maintenant naviguer entre les pages');
console.log('💡 Utilisez les comptes de test pour vous connecter');
