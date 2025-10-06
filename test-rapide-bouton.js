/**
 * 🚀 SCRIPT DE TEST RAPIDE - BOUTON DE MODIFICATION
 * 
 * Ce script teste rapidement la présence et la fonctionnalité du bouton de modification
 */

console.log('🚀 TEST RAPIDE - BOUTON DE MODIFICATION');
console.log('='.repeat(40));

// Test 1: Vérifier la présence du bouton
function testPresenceBouton() {
  console.log('\n📋 Test 1: Présence du bouton');
  
  // Chercher le bouton dans le header
  const boutonHeader = document.querySelector('.flex.items-center.space-x-3 button[class*="bg-green-600"]');
  
  // Chercher le bouton flottant
  const boutonFlottant = document.querySelector('.fixed.top-4.right-4 button[class*="bg-green-600"]');
  
  if (boutonHeader) {
    console.log('✅ Bouton trouvé dans le header');
    return boutonHeader;
  } else if (boutonFlottant) {
    console.log('✅ Bouton flottant trouvé');
    return boutonFlottant;
  } else {
    console.log('❌ Aucun bouton de modification trouvé');
    return null;
  }
}

// Test 2: Cliquer sur le bouton
function testClicBouton() {
  console.log('\n📋 Test 2: Clic sur le bouton');
  
  const bouton = testPresenceBouton();
  
  if (bouton) {
    console.log('🖱️ Clic sur le bouton...');
    bouton.click();
    
    setTimeout(() => {
      const champsInput = document.querySelectorAll('input[type="number"]');
      if (champsInput.length > 0) {
        console.log(`✅ Mode édition activé - ${champsInput.length} champs d'édition trouvés`);
        return true;
      } else {
        console.log('❌ Mode édition non activé');
        return false;
      }
    }, 500);
    
    return true;
  } else {
    console.log('❌ Impossible de cliquer - bouton non trouvé');
    return false;
  }
}

// Test 3: Vérifier les champs d'édition
function testChampsEdition() {
  console.log('\n📋 Test 3: Champs d\'édition');
  
  const champsInput = document.querySelectorAll('input[type="number"]');
  
  if (champsInput.length >= 4) {
    console.log(`✅ ${champsInput.length} champs d'édition trouvés`);
    
    // Lister les champs
    champsInput.forEach((input, index) => {
      const carte = input.closest('.bg-white.rounded-lg.shadow-sm.border.p-6');
      const label = carte?.querySelector('.text-gray-600')?.textContent || `Champ ${index + 1}`;
      console.log(`   - ${label}: ${input.value}`);
    });
    
    return true;
  } else {
    console.log(`❌ Seulement ${champsInput.length} champs trouvés (attendu: 4)`);
    return false;
  }
}

// Test 4: Modifier une valeur
function testModificationValeur() {
  console.log('\n📋 Test 4: Modification d\'une valeur');
  
  const champsInput = document.querySelectorAll('input[type="number"]');
  
  if (champsInput.length > 0) {
    const premierChamp = champsInput[0];
    const ancienneValeur = premierChamp.value;
    const nouvelleValeur = '999';
    
    premierChamp.value = nouvelleValeur;
    premierChamp.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log(`✅ Valeur modifiée: ${ancienneValeur} -> ${nouvelleValeur}`);
    return true;
  } else {
    console.log('❌ Aucun champ d\'édition trouvé');
    return false;
  }
}

// Test 5: Vérifier les boutons de sauvegarde/annulation
function testBoutonsSauvegarde() {
  console.log('\n📋 Test 5: Boutons de sauvegarde/annulation');
  
  const boutonSauvegarder = document.querySelector('button[class*="bg-green-600"]');
  const boutonAnnuler = document.querySelector('button[class*="bg-gray-600"]');
  
  if (boutonSauvegarder && boutonSauvegarder.textContent.includes('Sauvegarder')) {
    console.log('✅ Bouton "Sauvegarder" trouvé');
  } else {
    console.log('❌ Bouton "Sauvegarder" non trouvé');
  }
  
  if (boutonAnnuler && boutonAnnuler.textContent.includes('Annuler')) {
    console.log('✅ Bouton "Annuler" trouvé');
  } else {
    console.log('❌ Bouton "Annuler" non trouvé');
  }
  
  return boutonSauvegarder && boutonAnnuler;
}

// Fonction principale de test
function executerTestRapide() {
  console.log('\n🚀 DÉMARRAGE DU TEST RAPIDE...');
  
  const tests = [
    { nom: 'Présence Bouton', fonction: testPresenceBouton },
    { nom: 'Clic Bouton', fonction: testClicBouton },
    { nom: 'Champs Édition', fonction: testChampsEdition },
    { nom: 'Modification Valeur', fonction: testModificationValeur },
    { nom: 'Boutons Sauvegarde', fonction: testBoutonsSauvegarde }
  ];
  
  let testsReussis = 0;
  
  tests.forEach((test, index) => {
    console.log(`\n⏳ Test ${index + 1}/5: ${test.nom}`);
    
    try {
      const resultat = test.fonction();
      if (resultat) {
        testsReussis++;
        console.log(`✅ Test ${index + 1} réussi`);
      } else {
        console.log(`❌ Test ${index + 1} échoué`);
      }
    } catch (error) {
      console.log(`❌ Test ${index + 1} erreur:`, error.message);
    }
  });
  
  console.log('\n' + '='.repeat(40));
  console.log(`📊 RÉSULTATS: ${testsReussis}/${tests.length} tests réussis`);
  
  if (testsReussis === tests.length) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS ! Le bouton de modification fonctionne parfaitement !');
  } else if (testsReussis >= 3) {
    console.log('⚠️  La plupart des tests sont passés. Le bouton fonctionne partiellement.');
  } else {
    console.log('❌ La plupart des tests ont échoué. Le bouton ne fonctionne pas correctement.');
  }
}

// Fonction de vérification immédiate
function verifierMaintenant() {
  console.log('\n🔍 VÉRIFICATION IMMÉDIATE');
  
  const boutonHeader = document.querySelector('.flex.items-center.space-x-3 button[class*="bg-green-600"]');
  const boutonFlottant = document.querySelector('.fixed.top-4.right-4 button[class*="bg-green-600"]');
  const champsInput = document.querySelectorAll('input[type="number"]');
  
  console.log('Éléments visibles:');
  console.log(`- Bouton dans header: ${boutonHeader ? '✅' : '❌'}`);
  console.log(`- Bouton flottant: ${boutonFlottant ? '✅' : '❌'}`);
  console.log(`- Champs d'édition: ${champsInput.length}`);
  
  if (boutonHeader || boutonFlottant) {
    console.log('\n✅ LE BOUTON DE MODIFICATION EST VISIBLE !');
    console.log('Cliquez dessus pour commencer à modifier les statistiques.');
  } else {
    console.log('\n❌ LE BOUTON DE MODIFICATION N\'EST PAS VISIBLE');
    console.log('Exécutez: executerTestRapide() pour diagnostiquer le problème');
  }
}

// Instructions
console.log('\n📖 INSTRUCTIONS:');
console.log('1. verifierMaintenant() - Vérification immédiate');
console.log('2. executerTestRapide() - Test complet');
console.log('3. Le bouton devrait être visible en haut à droite du tableau de bord');

// Exécuter la vérification immédiate
setTimeout(() => {
  verifierMaintenant();
}, 1000);

console.log('\n✨ Script de test rapide chargé !');
