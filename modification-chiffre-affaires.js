/**
 * 💰 SCRIPT DE MODIFICATION DU CHIFFRE D'AFFAIRES
 * 
 * Ce script permet à l'admin de modifier directement le chiffre d'affaires depuis le tableau de bord
 */

console.log('💰 MODIFICATION DU CHIFFRE D\'AFFAIRES');
console.log('='.repeat(40));

// Fonction pour trouver et modifier le chiffre d'affaires
function modifierChiffreAffaires() {
  console.log('\n📋 Recherche du chiffre d\'affaires...');
  
  // Chercher le chiffre d'affaires (12 327 000 FG)
  const elements = document.querySelectorAll('*');
  let chiffreAffairesElement = null;
  
  elements.forEach(element => {
    const texte = element.textContent?.trim();
    
    // Chercher le pattern du chiffre d'affaires (ex: "12 327 000 FG")
    if (texte && /^\d+[\s\d]*\s*FG$/.test(texte)) {
      console.log('✅ Chiffre d\'affaires trouvé:', texte);
      chiffreAffairesElement = element;
    }
  });
  
  if (!chiffreAffairesElement) {
    console.log('❌ Chiffre d\'affaires non trouvé, recherche alternative...');
    
    // Recherche alternative - chercher "12 327 000"
    elements.forEach(element => {
      const texte = element.textContent?.trim();
      
      if (texte && texte.includes('12 327 000')) {
        console.log('✅ Chiffre d\'affaires trouvé (alternative):', texte);
        chiffreAffairesElement = element;
      }
    });
  }
  
  if (chiffreAffairesElement) {
    console.log('✅ Élément du chiffre d\'affaires identifié');
    
    // Créer un bouton de modification à côté du chiffre d'affaires
    const boutonModifier = document.createElement('button');
    boutonModifier.innerHTML = '✏️';
    boutonModifier.style.cssText = `
      background: #16a34a !important;
      color: white !important;
      border: none !important;
      border-radius: 4px !important;
      padding: 4px 8px !important;
      margin-left: 8px !important;
      cursor: pointer !important;
      font-size: 14px !important;
    `;
    
    // Ajouter l'événement de clic
    boutonModifier.onclick = function() {
      modifierValeurChiffreAffaires(chiffreAffairesElement, boutonModifier);
    };
    
    // Ajouter le bouton à côté du chiffre d'affaires
    chiffreAffairesElement.parentNode.insertBefore(boutonModifier, chiffreAffairesElement.nextSibling);
    
    console.log('✅ Bouton de modification ajouté au chiffre d\'affaires');
    
    return chiffreAffairesElement;
  } else {
    console.log('❌ Impossible de trouver le chiffre d\'affaires');
    return null;
  }
}

// Fonction pour modifier la valeur du chiffre d'affaires
function modifierValeurChiffreAffaires(element, bouton) {
  console.log('\n📋 Modification de la valeur du chiffre d\'affaires...');
  
  const valeurActuelle = element.textContent?.trim();
  console.log('Valeur actuelle:', valeurActuelle);
  
  // Extraire le nombre (enlever "FG" et les espaces)
  const nombreActuel = valeurActuelle.replace(/[^\d]/g, '');
  console.log('Nombre extrait:', nombreActuel);
  
  // Créer un input pour la modification
  const input = document.createElement('input');
  input.type = 'number';
  input.value = nombreActuel;
  input.style.cssText = `
    background: #f0f0f0 !important;
    border: 2px solid #16a34a !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    font-size: 18px !important;
    font-weight: bold !important;
    color: #333 !important;
    width: 150px !important;
    text-align: center !important;
  `;
  
  // Remplacer l'élément par l'input
  element.parentNode.replaceChild(input, element);
  
  // Changer le bouton en boutons de sauvegarde/annulation
  const conteneurBoutons = document.createElement('div');
  conteneurBoutons.style.cssText = `
    display: inline-flex;
    gap: 4px;
    margin-left: 8px;
  `;
  
  // Bouton Sauvegarder
  const boutonSauvegarder = document.createElement('button');
  boutonSauvegarder.innerHTML = '💾';
  boutonSauvegarder.style.cssText = `
    background: #16a34a !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    cursor: pointer !important;
    font-size: 14px !important;
  `;
  
  // Bouton Annuler
  const boutonAnnuler = document.createElement('button');
  boutonAnnuler.innerHTML = '❌';
  boutonAnnuler.style.cssText = `
    background: #dc2626 !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    cursor: pointer !important;
    font-size: 14px !important;
  `;
  
  // Événements des boutons
  boutonSauvegarder.onclick = function() {
    sauvegarderChiffreAffaires(input, conteneurBoutons, valeurActuelle);
  };
  
  boutonAnnuler.onclick = function() {
    annulerModification(input, conteneurBoutons, element, valeurActuelle);
  };
  
  // Ajouter les boutons au conteneur
  conteneurBoutons.appendChild(boutonSauvegarder);
  conteneurBoutons.appendChild(boutonAnnuler);
  
  // Remplacer le bouton original
  bouton.parentNode.replaceChild(conteneurBoutons, bouton);
  
  // Focus sur l'input
  input.focus();
  input.select();
  
  console.log('✅ Mode édition activé pour le chiffre d\'affaires');
}

// Fonction pour sauvegarder le chiffre d'affaires
function sauvegarderChiffreAffaires(input, conteneurBoutons, valeurOriginale) {
  console.log('\n📋 Sauvegarde du chiffre d\'affaires...');
  
  const nouvelleValeur = input.value;
  console.log('Nouvelle valeur:', nouvelleValeur);
  
  if (!nouvelleValeur || nouvelleValeur <= 0) {
    alert('❌ Veuillez entrer une valeur valide pour le chiffre d\'affaires');
    return;
  }
  
  // Formater la nouvelle valeur
  const valeurFormatee = `${parseInt(nouvelleValeur).toLocaleString('fr-FR')} FG`;
  console.log('Valeur formatée:', valeurFormatee);
  
  // Créer le nouvel élément
  const nouvelElement = document.createElement('span');
  nouvelElement.textContent = valeurFormatee;
  nouvelElement.style.cssText = `
    font-size: 18px !important;
    font-weight: bold !important;
    color: #111827 !important;
  `;
  
  // Remplacer l'input par le nouvel élément
  input.parentNode.replaceChild(nouvelElement, input);
  
  // Supprimer les boutons
  conteneurBoutons.remove();
  
  // Sauvegarder dans localStorage
  const chiffreAffairesData = {
    valeur: parseInt(nouvelleValeur),
    valeurFormatee: valeurFormatee,
    dateModification: new Date().toISOString(),
    modifiePar: 'admin'
  };
  
  localStorage.setItem('chiffreAffairesModifie', JSON.stringify(chiffreAffairesData));
  
  console.log('✅ Chiffre d\'affaires sauvegardé:', chiffreAffairesData);
  
  // Afficher un message de succès
  const message = document.createElement('div');
  message.innerHTML = `✅ Chiffre d'affaires modifié: ${valeurFormatee}`;
  message.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    background: #10b981 !important;
    color: white !important;
    padding: 12px 20px !important;
    border-radius: 8px !important;
    z-index: 99999 !important;
    font-weight: bold !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
  `;
  
  document.body.appendChild(message);
  
  // Supprimer le message après 3 secondes
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
  
  // Ajouter à nouveau le bouton de modification
  setTimeout(() => {
    ajouterBoutonModificationChiffreAffaires(nouvelElement);
  }, 1000);
}

// Fonction pour annuler la modification
function annulerModification(input, conteneurBoutons, elementOriginal, valeurOriginale) {
  console.log('\n📋 Annulation de la modification...');
  
  // Restaurer l'élément original
  elementOriginal.textContent = valeurOriginale;
  input.parentNode.replaceChild(elementOriginal, input);
  
  // Supprimer les boutons
  conteneurBoutons.remove();
  
  console.log('✅ Modification annulée');
}

// Fonction pour ajouter le bouton de modification au chiffre d'affaires
function ajouterBoutonModificationChiffreAffaires(element) {
  const boutonModifier = document.createElement('button');
  boutonModifier.innerHTML = '✏️';
  boutonModifier.style.cssText = `
    background: #16a34a !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    margin-left: 8px !important;
    cursor: pointer !important;
    font-size: 14px !important;
  `;
  
  boutonModifier.onclick = function() {
    modifierValeurChiffreAffaires(element, boutonModifier);
  };
  
  element.parentNode.insertBefore(boutonModifier, element.nextSibling);
}

// Fonction pour charger le chiffre d'affaires sauvegardé
function chargerChiffreAffairesSauvegarde() {
  console.log('\n📋 Chargement du chiffre d\'affaires sauvegardé...');
  
  const dataSauvegardee = localStorage.getItem('chiffreAffairesModifie');
  
  if (dataSauvegardee) {
    const data = JSON.parse(dataSauvegardee);
    console.log('✅ Données sauvegardées trouvées:', data);
    
    // Chercher et remplacer le chiffre d'affaires
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const texte = element.textContent?.trim();
      
      if (texte && /^\d+[\s\d]*\s*FG$/.test(texte)) {
        element.textContent = data.valeurFormatee;
        console.log('✅ Chiffre d\'affaires mis à jour:', data.valeurFormatee);
        
        // Ajouter le bouton de modification
        ajouterBoutonModificationChiffreAffaires(element);
      }
    });
    
    return true;
  } else {
    console.log('ℹ️ Aucune donnée sauvegardée trouvée');
    return false;
  }
}

// Fonction principale
function activerModificationChiffreAffaires() {
  console.log('\n🚀 ACTIVATION DE LA MODIFICATION DU CHIFFRE D\'AFFAIRES...');
  
  try {
    // Charger les données sauvegardées
    const donneesChargees = chargerChiffreAffairesSauvegarde();
    
    if (!donneesChargees) {
      // Si pas de données sauvegardées, chercher le chiffre d'affaires actuel
      const elementTrouve = modifierChiffreAffaires();
      
      if (elementTrouve) {
        console.log('✅ Modification du chiffre d\'affaires activée !');
        console.log('Cliquez sur le bouton ✏️ à côté du chiffre d\'affaires pour le modifier.');
      } else {
        console.log('❌ Impossible d\'activer la modification du chiffre d\'affaires');
      }
    } else {
      console.log('✅ Modification du chiffre d\'affaires activée avec les données sauvegardées !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'activation:', error);
  }
}

// Fonction de vérification
function verifierModificationChiffreAffaires() {
  console.log('\n🔍 VÉRIFICATION DE LA MODIFICATION DU CHIFFRE D\'AFFAIRES');
  
  const boutonsModification = document.querySelectorAll('button[style*="background: #16a34a"]');
  const chiffreAffaires = document.querySelectorAll('*');
  let chiffreTrouve = false;
  
  chiffreAffaires.forEach(element => {
    const texte = element.textContent?.trim();
    if (texte && /^\d+[\s\d]*\s*FG$/.test(texte)) {
      chiffreTrouve = true;
      console.log('✅ Chiffre d\'affaires trouvé:', texte);
    }
  });
  
  console.log(`- Boutons de modification: ${boutonsModification.length}`);
  console.log(`- Chiffre d'affaires trouvé: ${chiffreTrouve ? '✅' : '❌'}`);
  
  if (boutonsModification.length > 0 && chiffreTrouve) {
    console.log('✅ La modification du chiffre d\'affaires est active !');
  } else {
    console.log('❌ La modification du chiffre d\'affaires n\'est pas active');
  }
}

// Instructions
console.log('\n📖 INSTRUCTIONS:');
console.log('1. activerModificationChiffreAffaires() - Active la modification');
console.log('2. verifierModificationChiffreAffaires() - Vérifie l\'état');
console.log('3. Cliquez sur ✏️ à côté du chiffre d\'affaires pour le modifier');

// Exécuter automatiquement
setTimeout(() => {
  activerModificationChiffreAffaires();
}, 1000);

console.log('\n✨ Script de modification du chiffre d\'affaires chargé !');
