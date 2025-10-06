/**
 * 🚨 CORRECTION IMMÉDIATE - BOUTON DE MODIFICATION MANQUANT
 * 
 * Ce script force l'affichage du bouton de modification en l'injectant directement dans le DOM
 */

console.log('🚨 CORRECTION IMMÉDIATE - BOUTON DE MODIFICATION');
console.log('='.repeat(50));

// Fonction pour injecter le bouton de modification
function injecterBoutonModification() {
  console.log('\n📋 Étape 1: Injection du bouton de modification');
  
  // Chercher le titre "Tableau de bord"
  const titre = document.querySelector('h1');
  if (!titre) {
    console.log('❌ Titre "Tableau de bord" non trouvé');
    return false;
  }
  
  console.log('✅ Titre trouvé:', titre.textContent);
  
  // Chercher le conteneur parent
  const conteneurParent = titre.closest('.max-w-7xl') || titre.parentElement;
  
  if (!conteneurParent) {
    console.log('❌ Conteneur parent non trouvé');
    return false;
  }
  
  // Créer le bouton de modification
  const boutonModifier = document.createElement('button');
  boutonModifier.innerHTML = `
    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
    </svg>
    Modifier
  `;
  
  boutonModifier.className = 'flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium';
  boutonModifier.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background-color: #16a34a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    font-weight: 500;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  // Ajouter l'événement de clic
  boutonModifier.addEventListener('click', function() {
    console.log('🖱️ Bouton de modification cliqué !');
    activerModeEdition();
  });
  
  // Ajouter le bouton au body
  document.body.appendChild(boutonModifier);
  
  console.log('✅ Bouton de modification injecté avec succès !');
  return boutonModifier;
}

// Fonction pour activer le mode édition
function activerModeEdition() {
  console.log('\n📋 Étape 2: Activation du mode édition');
  
  // Chercher les cartes de statistiques
  const cartes = document.querySelectorAll('.bg-white, [class*="bg-white"]');
  let cartesModifiees = 0;
  
  cartes.forEach((carte, index) => {
    // Chercher les éléments avec des chiffres (statistiques)
    const elementsAvecChiffres = carte.querySelectorAll('*');
    
    elementsAvecChiffres.forEach(element => {
      const texte = element.textContent?.trim();
      
      // Vérifier si c'est une statistique (contient des chiffres)
      if (texte && /^\d+$/.test(texte) && texte.length <= 10) {
        // Créer un input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = texte;
        input.style.cssText = `
          background-color: #f9fafb;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
          width: 80px;
        `;
        
        // Remplacer l'élément
        element.parentNode.replaceChild(input, element);
        cartesModifiees++;
        
        console.log(`✅ Statistique ${cartesModifiees} modifiée: ${texte} -> input`);
      }
    });
  });
  
  if (cartesModifiees > 0) {
    console.log(`✅ ${cartesModifiees} statistiques modifiées en champs d'édition`);
    
    // Changer le bouton en boutons de sauvegarde/annulation
    changerBoutons();
  } else {
    console.log('❌ Aucune statistique trouvée à modifier');
  }
}

// Fonction pour changer les boutons
function changerBoutons() {
  console.log('\n📋 Étape 3: Changement des boutons');
  
  const boutonModifier = document.querySelector('button[style*="position: fixed"]');
  
  if (boutonModifier) {
    // Créer le conteneur des nouveaux boutons
    const conteneurBoutons = document.createElement('div');
    conteneurBoutons.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      gap: 8px;
    `;
    
    // Bouton Sauvegarder
    const boutonSauvegarder = document.createElement('button');
    boutonSauvegarder.innerHTML = `
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
      </svg>
      Sauvegarder
    `;
    boutonSauvegarder.style.cssText = `
      background-color: #16a34a;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-weight: 500;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    // Bouton Annuler
    const boutonAnnuler = document.createElement('button');
    boutonAnnuler.innerHTML = `
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      Annuler
    `;
    boutonAnnuler.style.cssText = `
      background-color: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-weight: 500;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    // Ajouter les événements
    boutonSauvegarder.addEventListener('click', sauvegarderModifications);
    boutonAnnuler.addEventListener('click', annulerModifications);
    
    // Ajouter les boutons au conteneur
    conteneurBoutons.appendChild(boutonSauvegarder);
    conteneurBoutons.appendChild(boutonAnnuler);
    
    // Remplacer le bouton original
    boutonModifier.parentNode.replaceChild(conteneurBoutons, boutonModifier);
    
    console.log('✅ Boutons de sauvegarde et annulation créés');
  }
}

// Fonction pour sauvegarder les modifications
function sauvegarderModifications() {
  console.log('\n📋 Étape 4: Sauvegarde des modifications');
  
  const inputs = document.querySelectorAll('input[type="number"]');
  const modifications = {};
  
  inputs.forEach((input, index) => {
    const labels = ['totalUsers', 'totalProducts', 'totalOrders', 'totalRevenue'];
    if (labels[index]) {
      modifications[labels[index]] = parseFloat(input.value) || 0;
    }
  });
  
  // Sauvegarder dans localStorage
  const dashboardData = {
    ...modifications,
    lastModified: new Date().toISOString()
  };
  
  localStorage.setItem('adminDashboardData', JSON.stringify(dashboardData));
  
  console.log('✅ Modifications sauvegardées:', dashboardData);
  
  // Afficher un message de succès
  alert('✅ Modifications sauvegardées avec succès !');
  
  // Recharger la page après 2 secondes
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Fonction pour annuler les modifications
function annulerModifications() {
  console.log('\n📋 Étape 5: Annulation des modifications');
  
  // Recharger la page pour annuler
  window.location.reload();
}

// Fonction principale de correction immédiate
function correctionImmediate() {
  console.log('\n🚀 DÉMARRAGE DE LA CORRECTION IMMÉDIATE...');
  
  try {
    // Étape 1: Injecter le bouton
    const bouton = injecterBoutonModification();
    
    if (bouton) {
      console.log('\n✅ CORRECTION IMMÉDIATE TERMINÉE !');
      console.log('Le bouton "Modifier" est maintenant visible en haut à droite de l\'écran.');
      console.log('Cliquez dessus pour commencer à modifier les statistiques.');
      
      // Ajouter un message visuel
      const message = document.createElement('div');
      message.innerHTML = '✅ Bouton de modification ajouté ! Cliquez dessus pour modifier les statistiques.';
      message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `;
      document.body.appendChild(message);
      
      // Supprimer le message après 5 secondes
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 5000);
      
    } else {
      console.log('\n❌ ÉCHEC DE LA CORRECTION IMMÉDIATE');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction immédiate:', error);
  }
}

// Fonction de vérification
function verifierBouton() {
  console.log('\n🔍 VÉRIFICATION DU BOUTON');
  
  const bouton = document.querySelector('button[style*="position: fixed"]');
  
  if (bouton) {
    console.log('✅ Bouton de modification trouvé !');
    console.log('Position:', bouton.style.position);
    console.log('Couleur:', bouton.style.backgroundColor);
    console.log('Texte:', bouton.textContent);
  } else {
    console.log('❌ Bouton de modification non trouvé');
  }
}

// Instructions
console.log('\n📖 INSTRUCTIONS:');
console.log('1. correctionImmediate() - Injecte le bouton immédiatement');
console.log('2. verifierBouton() - Vérifie la présence du bouton');
console.log('3. Le bouton apparaîtra en haut à droite de l\'écran');

// Exécuter automatiquement la correction
setTimeout(() => {
  correctionImmediate();
}, 1000);

console.log('\n✨ Script de correction immédiate chargé !');
