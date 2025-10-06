/**
 * 💰 MODIFICATION RAPIDE DU CHIFFRE D'AFFAIRES
 * 
 * Script ultra-simple pour modifier le chiffre d'affaires
 */

console.log('💰 MODIFICATION RAPIDE DU CHIFFRE D\'AFFAIRES');
console.log('='.repeat(45));

// Fonction ultra-rapide
function modifierChiffreAffairesRapide() {
  console.log('🔄 Recherche du chiffre d\'affaires...');
  
  // Chercher "12 327 000 FG"
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    const texte = element.textContent?.trim();
    
    if (texte && texte.includes('12 327 000')) {
      console.log('✅ Chiffre d\'affaires trouvé:', texte);
      
      // Ajouter un bouton de modification
      const bouton = document.createElement('button');
      bouton.innerHTML = '✏️ Modifier CA';
      bouton.style.cssText = `
        background: #16a34a !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 6px 12px !important;
        margin-left: 10px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: bold !important;
      `;
      
      bouton.onclick = function() {
        // Demander la nouvelle valeur
        const nouvelleValeur = prompt('Entrez le nouveau chiffre d\'affaires (sans FG):', '12327000');
        
        if (nouvelleValeur && !isNaN(nouvelleValeur)) {
          // Formater la valeur
          const valeurFormatee = `${parseInt(nouvelleValeur).toLocaleString('fr-FR')} FG`;
          
          // Mettre à jour l\'affichage
          element.textContent = valeurFormatee;
          
          // Sauvegarder
          localStorage.setItem('chiffreAffairesAdmin', JSON.stringify({
            valeur: parseInt(nouvelleValeur),
            valeurFormatee: valeurFormatee,
            date: new Date().toISOString()
          }));
          
          console.log('✅ Chiffre d\'affaires modifié:', valeurFormatee);
          alert(`✅ Chiffre d\'affaires modifié: ${valeurFormatee}`);
          
          // Recharger la page pour voir les changements
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          
        } else {
          alert('❌ Valeur invalide');
        }
      };
      
      // Ajouter le bouton
      element.parentNode.insertBefore(bouton, element.nextSibling);
      
      console.log('✅ Bouton de modification ajouté !');
    }
  });
}

// Fonction pour charger le chiffre d'affaires sauvegardé
function chargerChiffreAffaires() {
  const data = localStorage.getItem('chiffreAffairesAdmin');
  
  if (data) {
    const chiffreAffaires = JSON.parse(data);
    console.log('📊 Chiffre d\'affaires sauvegardé:', chiffreAffaires);
    
    // Mettre à jour l'affichage
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const texte = element.textContent?.trim();
      
      if (texte && texte.includes('12 327 000')) {
        element.textContent = chiffreAffaires.valeurFormatee;
        console.log('✅ Chiffre d\'affaires mis à jour:', chiffreAffaires.valeurFormatee);
      }
    });
    
    return true;
  }
  
  return false;
}

// Exécuter
console.log('🚀 Exécution...');

// Charger d'abord les données sauvegardées
const donneesChargees = chargerChiffreAffaires();

if (!donneesChargees) {
  // Si pas de données sauvegardées, ajouter le bouton de modification
  modifierChiffreAffairesRapide();
}

console.log('✨ Script exécuté !');
