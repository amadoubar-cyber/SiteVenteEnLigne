/**
 * 🧪 SCRIPT DE TEST - BOUTON DE MODIFICATION TABLEAU DE BORD
 * 
 * Ce script teste la fonctionnalité de modification du tableau de bord admin
 * 
 * Instructions d'utilisation :
 * 1. Ouvrez la console du navigateur (F12)
 * 2. Copiez et collez ce script
 * 3. Exécutez les tests
 */

console.log('🧪 DÉMARRAGE DES TESTS - BOUTON DE MODIFICATION TABLEAU DE BORD');
console.log('='.repeat(60));

// Test 1: Vérifier la présence du bouton de modification
function testBoutonModification() {
  console.log('\n📋 TEST 1: Vérification du bouton de modification');
  
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  const texteModifier = boutonModifier?.textContent?.includes('Modifier');
  
  if (boutonModifier && texteModifier) {
    console.log('✅ Bouton "Modifier" trouvé et visible');
    return true;
  } else {
    console.log('❌ Bouton "Modifier" non trouvé');
    return false;
  }
}

// Test 2: Vérifier les champs d'édition
function testChampsEdition() {
  console.log('\n📋 TEST 2: Vérification des champs d\'édition');
  
  // Cliquer sur le bouton modifier
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  if (boutonModifier) {
    boutonModifier.click();
    
    // Attendre un peu pour que l'interface se mette à jour
    setTimeout(() => {
      const champsInput = document.querySelectorAll('input[type="number"]');
      
      if (champsInput.length >= 4) {
        console.log('✅ Champs d\'édition trouvés:', champsInput.length);
        
        // Vérifier chaque champ
        champsInput.forEach((input, index) => {
          const label = input.closest('.bg-white').querySelector('.text-gray-600')?.textContent;
          console.log(`   - Champ ${index + 1}: ${label} (valeur: ${input.value})`);
        });
        
        return true;
      } else {
        console.log('❌ Champs d\'édition non trouvés');
        return false;
      }
    }, 500);
  }
  
  return false;
}

// Test 3: Tester la modification des valeurs
function testModificationValeurs() {
  console.log('\n📋 TEST 3: Test de modification des valeurs');
  
  const champsInput = document.querySelectorAll('input[type="number"]');
  
  if (champsInput.length >= 4) {
    // Modifier les valeurs
    const nouvellesValeurs = [100, 5000000, 25, 15];
    
    champsInput.forEach((input, index) => {
      if (nouvellesValeurs[index]) {
        input.value = nouvellesValeurs[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Valeur ${index + 1} modifiée: ${nouvellesValeurs[index]}`);
      }
    });
    
    return true;
  } else {
    console.log('❌ Impossible de modifier les valeurs');
    return false;
  }
}

// Test 4: Tester la sauvegarde
function testSauvegarde() {
  console.log('\n📋 TEST 4: Test de sauvegarde');
  
  const boutonSauvegarder = document.querySelector('button[class*="bg-green-600"]');
  
  if (boutonSauvegarder && boutonSauvegarder.textContent.includes('Sauvegarder')) {
    console.log('✅ Bouton "Sauvegarder" trouvé');
    
    // Cliquer sur sauvegarder
    boutonSauvegarder.click();
    
    // Vérifier que les données sont sauvegardées
    setTimeout(() => {
      const dashboardData = localStorage.getItem('adminDashboardData');
      if (dashboardData) {
        const data = JSON.parse(dashboardData);
        console.log('✅ Données sauvegardées:', data);
        return true;
      } else {
        console.log('❌ Données non sauvegardées');
        return false;
      }
    }, 1000);
    
    return true;
  } else {
    console.log('❌ Bouton "Sauvegarder" non trouvé');
    return false;
  }
}

// Test 5: Vérifier l'annulation
function testAnnulation() {
  console.log('\n📋 TEST 5: Test d\'annulation');
  
  // Cliquer sur modifier pour revenir en mode édition
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  if (boutonModifier && boutonModifier.textContent.includes('Modifier')) {
    boutonModifier.click();
    
    setTimeout(() => {
      const boutonAnnuler = document.querySelector('button[class*="bg-gray-600"]');
      
      if (boutonAnnuler && boutonAnnuler.textContent.includes('Annuler')) {
        console.log('✅ Bouton "Annuler" trouvé');
        
        // Cliquer sur annuler
        boutonAnnuler.click();
        
        setTimeout(() => {
          const champsInput = document.querySelectorAll('input[type="number"]');
          if (champsInput.length === 0) {
            console.log('✅ Mode édition annulé avec succès');
            return true;
          } else {
            console.log('❌ Mode édition toujours actif');
            return false;
          }
        }, 500);
        
        return true;
      } else {
        console.log('❌ Bouton "Annuler" non trouvé');
        return false;
      }
    }, 500);
  }
  
  return false;
}

// Fonction principale de test
function executerTests() {
  console.log('\n🚀 EXÉCUTION DES TESTS...');
  
  const tests = [
    { nom: 'Bouton Modification', fonction: testBoutonModification },
    { nom: 'Champs Édition', fonction: testChampsEdition },
    { nom: 'Modification Valeurs', fonction: testModificationValeurs },
    { nom: 'Sauvegarde', fonction: testSauvegarde },
    { nom: 'Annulation', fonction: testAnnulation }
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
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 RÉSULTATS: ${testsReussis}/${tests.length} tests réussis`);
  
  if (testsReussis === tests.length) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS ! Le bouton de modification fonctionne parfaitement !');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }
}

// Fonction de vérification rapide
function verificationRapide() {
  console.log('\n🔍 VÉRIFICATION RAPIDE');
  
  const boutonModifier = document.querySelector('button[class*="bg-green-600"]');
  const champsInput = document.querySelectorAll('input[type="number"]');
  const boutonSauvegarder = document.querySelector('button[class*="bg-green-600"]');
  const boutonAnnuler = document.querySelector('button[class*="bg-gray-600"]');
  
  console.log('Éléments trouvés:');
  console.log(`- Bouton Modifier: ${boutonModifier ? '✅' : '❌'}`);
  console.log(`- Champs d'édition: ${champsInput.length} (attendu: 4)`);
  console.log(`- Bouton Sauvegarder: ${boutonSauvegarder ? '✅' : '❌'}`);
  console.log(`- Bouton Annuler: ${boutonAnnuler ? '✅' : '❌'}`);
  
  const dashboardData = localStorage.getItem('adminDashboardData');
  console.log(`- Données sauvegardées: ${dashboardData ? '✅' : '❌'}`);
  
  if (dashboardData) {
    const data = JSON.parse(dashboardData);
    console.log('Données actuelles:', data);
  }
}

// Instructions d'utilisation
console.log('\n📖 INSTRUCTIONS D\'UTILISATION:');
console.log('1. Assurez-vous d\'être sur la page du tableau de bord admin (/admin)');
console.log('2. Exécutez: executerTests() pour tous les tests');
console.log('3. Exécutez: verificationRapide() pour une vérification rapide');
console.log('4. Les tests vont automatiquement cliquer sur les boutons et vérifier les fonctionnalités');

// Exécuter automatiquement la vérification rapide
setTimeout(() => {
  verificationRapide();
}, 1000);

console.log('\n✨ Script de test chargé ! Utilisez executerTests() pour commencer.');
