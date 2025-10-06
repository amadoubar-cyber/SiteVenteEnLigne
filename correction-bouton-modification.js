/**
 * 🔧 SCRIPT DE CORRECTION - BOUTON DE MODIFICATION TABLEAU DE BORD
 * 
 * Ce script force l'affichage du bouton de modification et corrige les problèmes de visibilité
 */

console.log('🔧 CORRECTION DU BOUTON DE MODIFICATION');
console.log('='.repeat(50));

// Fonction pour forcer l'affichage du bouton
function forcerAffichageBouton() {
  console.log('\n📋 Étape 1: Vérification de la présence du bouton');
  
  // Chercher le bouton de modification
  let boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  
  if (!boutonModifier) {
    console.log('❌ Bouton de modification non trouvé, création d\'un bouton temporaire...');
    
    // Créer un bouton de modification temporaire
    const header = document.querySelector('.max-w-7xl.mx-auto.px-4');
    if (header) {
      const boutonContainer = header.querySelector('.flex.justify-between.items-start .flex.items-center.space-x-3');
      
      if (boutonContainer) {
        // Créer le bouton
        const nouveauBouton = document.createElement('button');
        nouveauBouton.innerHTML = `
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Modifier
        `;
        nouveauBouton.className = 'flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm';
        nouveauBouton.style.zIndex = '9999';
        nouveauBouton.style.position = 'relative';
        
        // Ajouter l'événement de clic
        nouveauBouton.addEventListener('click', function() {
          activerModeEdition();
        });
        
        // Insérer le bouton au début du container
        boutonContainer.insertBefore(nouveauBouton, boutonContainer.firstChild);
        
        console.log('✅ Bouton de modification temporaire créé');
        return nouveauBouton;
      }
    }
  } else {
    console.log('✅ Bouton de modification trouvé');
    return boutonModifier;
  }
  
  return null;
}

// Fonction pour activer le mode édition
function activerModeEdition() {
  console.log('\n📋 Étape 2: Activation du mode édition');
  
  // Chercher les cartes de statistiques
  const cartes = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm.border.p-6');
  
  if (cartes.length >= 4) {
    console.log(`✅ ${cartes.length} cartes trouvées`);
    
    // Modifier chaque carte pour permettre l'édition
    cartes.forEach((carte, index) => {
      const valeurElement = carte.querySelector('.text-2xl.font-bold.text-gray-900');
      
      if (valeurElement) {
        const valeurActuelle = valeurElement.textContent.trim();
        
        // Créer un input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = valeurActuelle.replace(/[^\d]/g, ''); // Extraire seulement les chiffres
        input.className = 'text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-20';
        input.style.fontSize = '1.5rem';
        input.style.fontWeight = 'bold';
        
        // Remplacer l'élément
        valeurElement.parentNode.replaceChild(input, valeurElement);
        
        console.log(`✅ Carte ${index + 1} modifiée: ${valeurActuelle} -> input`);
      }
    });
    
    // Changer le bouton en boutons de sauvegarde/annulation
    changerBoutons();
    
  } else {
    console.log('❌ Cartes de statistiques non trouvées');
  }
}

// Fonction pour changer les boutons
function changerBoutons() {
  console.log('\n📋 Étape 3: Changement des boutons');
  
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  
  if (boutonModifier) {
    // Créer les nouveaux boutons
    const containerBoutons = document.createElement('div');
    containerBoutons.className = 'flex items-center space-x-2';
    
    // Bouton Sauvegarder
    const boutonSauvegarder = document.createElement('button');
    boutonSauvegarder.innerHTML = `
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
      </svg>
      Sauvegarder
    `;
    boutonSauvegarder.className = 'flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm';
    
    // Bouton Annuler
    const boutonAnnuler = document.createElement('button');
    boutonAnnuler.innerHTML = `
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      Annuler
    `;
    boutonAnnuler.className = 'flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm';
    
    // Ajouter les événements
    boutonSauvegarder.addEventListener('click', sauvegarderModifications);
    boutonAnnuler.addEventListener('click', annulerModifications);
    
    // Ajouter les boutons au container
    containerBoutons.appendChild(boutonSauvegarder);
    containerBoutons.appendChild(boutonAnnuler);
    
    // Remplacer le bouton original
    boutonModifier.parentNode.replaceChild(containerBoutons, boutonModifier);
    
    console.log('✅ Boutons de sauvegarde et annulation créés');
  }
}

// Fonction pour sauvegarder les modifications
function sauvegarderModifications() {
  console.log('\n📋 Étape 4: Sauvegarde des modifications');
  
  const inputs = document.querySelectorAll('input[type="number"]');
  const modifications = {};
  
  inputs.forEach((input, index) => {
    const labels = ['totalOrders', 'totalRevenue', 'totalUsers', 'totalProducts'];
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
  
  // Recharger la page pour voir les changements
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Fonction pour annuler les modifications
function annulerModifications() {
  console.log('\n📋 Étape 5: Annulation des modifications');
  
  // Recharger la page pour annuler
  window.location.reload();
}

// Fonction principale de correction
function corrigerBoutonModification() {
  console.log('\n🚀 DÉMARRAGE DE LA CORRECTION...');
  
  try {
    // Étape 1: Forcer l'affichage du bouton
    const bouton = forcerAffichageBouton();
    
    if (bouton) {
      console.log('\n✅ CORRECTION TERMINÉE AVEC SUCCÈS !');
      console.log('Le bouton de modification est maintenant visible et fonctionnel.');
      console.log('Cliquez sur "Modifier" pour commencer à éditer les statistiques.');
    } else {
      console.log('\n❌ ÉCHEC DE LA CORRECTION');
      console.log('Impossible de créer le bouton de modification.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

// Fonction de vérification rapide
function verifierBouton() {
  console.log('\n🔍 VÉRIFICATION RAPIDE');
  
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  const cartes = document.querySelectorAll('.bg-white.rounded-lg.shadow-sm.border.p-6');
  
  console.log('Éléments trouvés:');
  console.log(`- Bouton Modifier: ${boutonModifier ? '✅' : '❌'}`);
  console.log(`- Cartes de statistiques: ${cartes.length} (attendu: 4)`);
  
  if (boutonModifier) {
    console.log('✅ Le bouton de modification est présent !');
    console.log('Cliquez dessus pour commencer à modifier les statistiques.');
  } else {
    console.log('❌ Le bouton de modification n\'est pas visible.');
    console.log('Exécutez: corrigerBoutonModification() pour le créer.');
  }
}

// Instructions d'utilisation
console.log('\n📖 INSTRUCTIONS D\'UTILISATION:');
console.log('1. Exécutez: corrigerBoutonModification() pour créer le bouton');
console.log('2. Exécutez: verifierBouton() pour vérifier la présence');
console.log('3. Le bouton "Modifier" apparaîtra en haut à droite du tableau de bord');

// Exécuter automatiquement la vérification
setTimeout(() => {
  verifierBouton();
}, 1000);

console.log('\n✨ Script de correction chargé ! Utilisez corrigerBoutonModification() pour commencer.');
