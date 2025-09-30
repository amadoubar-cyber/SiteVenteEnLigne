/**
 * Script pour ajouter manuellement le bouton de réinitialisation
 * 
 * Ce script ajoute directement le bouton dans la page du tableau de bord
 */

console.log('🔧 Ajout manuel du bouton de réinitialisation...');

// Fonction pour réinitialiser les données
function resetData() {
  if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données de test ?\n\nCette action supprimera:\n- Toutes les données localStorage\n- Toutes les données sessionStorage\n- Tous les cookies')) {
    console.log('🧹 Réinitialisation en cours...');
    
    // Supprimer localStorage
    localStorage.clear();
    console.log('✅ localStorage supprimé');
    
    // Supprimer sessionStorage
    sessionStorage.clear();
    console.log('✅ sessionStorage supprimé');
    
    // Supprimer les cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    console.log('✅ Cookies supprimés');
    
    // Recharger la page
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }
}

// Fonction pour ajouter le bouton
function addResetButton() {
  // Chercher le header du tableau de bord
  const header = document.querySelector('h1');
  if (!header) {
    console.log('❌ Header du tableau de bord non trouvé');
    return;
  }
  
  // Vérifier si le bouton existe déjà
  if (document.getElementById('manual-reset-button')) {
    console.log('✅ Bouton déjà présent');
    return;
  }
  
  // Créer le bouton
  const button = document.createElement('button');
  button.id = 'manual-reset-button';
  button.innerHTML = '🗑️ Réinitialiser les données';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc2626;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
  `;
  
  // Ajouter l'événement click
  button.addEventListener('click', resetData);
  
  // Ajouter l'effet hover
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#b91c1c';
  });
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#dc2626';
  });
  
  // Ajouter le bouton au body
  document.body.appendChild(button);
  console.log('✅ Bouton de réinitialisation ajouté manuellement');
}

// Attendre que la page soit chargée
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addResetButton);
} else {
  addResetButton();
}

console.log('🎉 Script de bouton manuel prêt !');
