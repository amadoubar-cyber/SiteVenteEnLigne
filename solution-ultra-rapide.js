/**
 * 🚨 SOLUTION ULTRA-RAPIDE - BOUTON DE MODIFICATION
 * 
 * Ce script ajoute immédiatement un bouton de modification fonctionnel
 */

console.log('🚨 SOLUTION ULTRA-RAPIDE - BOUTON DE MODIFICATION');
console.log('='.repeat(50));

// Fonction ultra-rapide pour ajouter le bouton
function ajouterBoutonMaintenant() {
  console.log('🔄 Ajout du bouton de modification...');
  
  // Créer le bouton
  const bouton = document.createElement('button');
  bouton.innerHTML = '✏️ Modifier';
  bouton.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 99999 !important;
    background: #16a34a !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 12px 20px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    font-family: Arial, sans-serif !important;
  `;
  
  // Ajouter l'événement de clic
  bouton.onclick = function() {
    console.log('🖱️ Bouton cliqué ! Activation du mode édition...');
    
    // Chercher tous les chiffres sur la page
    const elements = document.querySelectorAll('*');
    let modifications = 0;
    
    elements.forEach(element => {
      const texte = element.textContent?.trim();
      
      // Si c'est un chiffre simple (statistiques)
      if (texte && /^\d+$/.test(texte) && texte.length <= 10 && element.children.length === 0) {
        // Créer un input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = texte;
        input.style.cssText = `
          background: #f0f0f0 !important;
          border: 2px solid #16a34a !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          color: #333 !important;
          width: 80px !important;
        `;
        
        // Remplacer l'élément
        element.parentNode.replaceChild(input, element);
        modifications++;
      }
    });
    
    if (modifications > 0) {
      console.log(`✅ ${modifications} valeurs modifiées en champs d'édition`);
      
      // Changer le bouton
      bouton.innerHTML = '💾 Sauvegarder';
      bouton.style.background = '#16a34a';
      
      bouton.onclick = function() {
        console.log('💾 Sauvegarde des modifications...');
        
        // Collecter les nouvelles valeurs
        const inputs = document.querySelectorAll('input[type="number"]');
        const valeurs = [];
        
        inputs.forEach(input => {
          valeurs.push(input.value);
        });
        
        // Sauvegarder dans localStorage
        localStorage.setItem('modificationsTableauBord', JSON.stringify({
          valeurs: valeurs,
          date: new Date().toISOString()
        }));
        
        console.log('✅ Modifications sauvegardées:', valeurs);
        alert('✅ Modifications sauvegardées avec succès !');
        
        // Recharger la page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
      
    } else {
      console.log('❌ Aucune valeur à modifier trouvée');
      alert('❌ Aucune statistique à modifier trouvée');
    }
  };
  
  // Ajouter le bouton à la page
  document.body.appendChild(bouton);
  
  console.log('✅ Bouton de modification ajouté avec succès !');
  
  // Ajouter un message de confirmation
  const message = document.createElement('div');
  message.innerHTML = '✅ Bouton "Modifier" ajouté ! Cliquez dessus pour modifier les statistiques.';
  message.style.cssText = `
    position: fixed !important;
    top: 80px !important;
    right: 20px !important;
    background: #10b981 !important;
    color: white !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
    z-index: 99998 !important;
    font-weight: bold !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    font-family: Arial, sans-serif !important;
  `;
  
  document.body.appendChild(message);
  
  // Supprimer le message après 5 secondes
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 5000);
  
  return bouton;
}

// Fonction de vérification
function verifierBoutonAjoute() {
  const bouton = document.querySelector('button[style*="position: fixed"]');
  
  if (bouton) {
    console.log('✅ Bouton trouvé !');
    console.log('Texte:', bouton.textContent);
    console.log('Position:', bouton.style.position);
    console.log('Couleur:', bouton.style.background);
    return true;
  } else {
    console.log('❌ Bouton non trouvé');
    return false;
  }
}

// Exécuter immédiatement
console.log('🚀 Exécution immédiate...');
ajouterBoutonMaintenant();

// Vérifier après 2 secondes
setTimeout(() => {
  verifierBoutonAjoute();
}, 2000);

console.log('✨ Script exécuté ! Le bouton devrait être visible en haut à droite.');
