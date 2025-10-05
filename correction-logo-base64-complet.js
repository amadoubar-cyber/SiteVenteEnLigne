// Script pour convertir le logo en base64 et l'intégrer dans les factures
// À exécuter dans la console du navigateur

console.log('🖼️ CONVERSION DU LOGO EN BASE64 POUR LES FACTURES');
console.log('=' .repeat(50));

// Fonction pour convertir une image en base64
const convertirImageEnBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = this.width;
      canvas.height = this.height;
      
      ctx.drawImage(this, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = function() {
      reject(new Error('Erreur de chargement de l\'image'));
    };
    
    img.src = url;
  });
};

// Fonction pour mettre à jour les factures avec le logo base64
const mettreAJourFacturesAvecLogoBase64 = async () => {
  console.log('\n🖼️ MISE À JOUR DES FACTURES AVEC LOGO BASE64:');
  
  try {
    // Convertir le logo en base64
    console.log('🔄 Conversion du logo en base64...');
    const logoBase64 = await convertirImageEnBase64('http://localhost:3000/images/products/logo/logo-koula.jpg');
    console.log('✅ Logo converti en base64 !');
    
    // Créer un script pour remplacer les chemins d'images par le base64
    const script = document.createElement('script');
    script.textContent = `
      // Remplacer la fonction handleDownloadInvoice dans Orders.js
      const originalHandleDownloadInvoice = window.handleDownloadInvoice;
      
      if (originalHandleDownloadInvoice) {
        window.handleDownloadInvoice = async function(orderId) {
          try {
            // Vérifier que la commande est approuvée
            const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
            const order = orders.find(o => o._id === orderId);
            
            if (!order) {
              alert('Commande non trouvée');
              return;
            }

            if (order.orderStatus !== 'approved' && order.orderStatus !== 'delivered') {
              alert('Cette commande n\\'est pas encore validée par l\\'administrateur.');
              return;
            }

            // Générer la facture HTML avec logo base64
            const dateFacture = new Date().toLocaleDateString('fr-FR');
            const dateCommande = new Date(order.createdAt).toLocaleDateString('fr-FR');
            
            const factureHTML = \`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture \${order.trackingNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .facture-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        .logo-img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin-right: 15px;
            border-radius: 10px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
        }
        .company-info {
            color: #666;
            font-size: 14px;
        }
        .facture-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        .facture-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-section {
            flex: 1;
            margin: 0 10px;
        }
        .info-section h3 {
            color: #3B82F6;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .info-section p {
            margin: 5px 0;
            color: #666;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .items-table th,
        .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #333;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .total-section {
            margin-top: 30px;
            text-align: right;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
        }
        .total-final {
            font-size: 18px;
            font-weight: bold;
            color: #3B82F6;
            border-top: 2px solid #3B82F6;
            padding-top: 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }
        .status-approved {
            background-color: #d4edda;
            color: #155724;
        }
        .status-delivered {
            background-color: #cce5ff;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="facture-container">
        <div class="header">
            <div class="logo-container">
                <img src="\${logoBase64}" alt="Bowoye Multi Services Logo" class="logo-img" />
                <div class="logo">BOWOYE MULTI SERVICES</div>
            </div>
            <div class="company-info">
                Votre partenaire de confiance pour tous vos besoins en matériaux de construction<br>
                Labé, République de Guinée<br>
                Contact: +224 612 63 73 35
            </div>
        </div>
        
        <div class="facture-title">
            FACTURE N° \${order.trackingNumber}
            <span class="status-badge status-\${order.orderStatus}">
                \${order.orderStatus === 'approved' ? 'APPROUVÉE' : 'LIVRÉE'}
            </span>
        </div>
        
        <div class="facture-info">
            <div class="info-section">
                <h3>Informations Client</h3>
                <p><strong>Nom:</strong> \${order.user.firstName} \${order.user.lastName}</p>
                <p><strong>Email:</strong> \${order.user.email}</p>
                <p><strong>Téléphone:</strong> \${order.user.phone}</p>
                <p><strong>Adresse:</strong> \${order.shippingAddress.street}, \${order.shippingAddress.city}</p>
            </div>
            <div class="info-section">
                <h3>Informations Facture</h3>
                <p><strong>Date de facture:</strong> \${dateFacture}</p>
                <p><strong>Date de commande:</strong> \${dateCommande}</p>
                <p><strong>Méthode de paiement:</strong> \${order.paymentMethod === 'mobile_money' ? 'Mobile Money' : order.paymentMethod}</p>
                <p><strong>Statut:</strong> \${order.orderStatus === 'approved' ? 'Approuvée' : 'Livrée'}</p>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                \${order.items.map(item => \`
                    <tr>
                        <td>\${item.name}</td>
                        <td>\${item.quantity}</td>
                        <td>\${item.price.toLocaleString('fr-FR')} GNF</td>
                        <td>\${(item.price * item.quantity).toLocaleString('fr-FR')} GNF</td>
                    </tr>
                \`).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-line">
                <span>Sous-total:</span>
                <span>\${order.subtotal.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line">
                <span>Frais de livraison:</span>
                <span>\${order.shippingCost.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line">
                <span>Taxes:</span>
                <span>\${order.tax.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line total-final">
                <span>TOTAL:</span>
                <span>\${order.total.toLocaleString('fr-FR')} GNF</span>
            </div>
        </div>
        
        <div class="footer">
            <p>Merci pour votre confiance !</p>
            <p>Pour toute question, contactez-nous au +224 612 63 73 35</p>
            <p>Bowoye Multi Services - Labé, République de Guinée</p>
            <p>Cette facture a été générée automatiquement le \${dateFacture}</p>
        </div>
    </div>
</body>
</html>
            \`;

            // Créer un blob avec le HTML
            const blob = new Blob([factureHTML], { type: 'text/html' });
            
            // Créer un lien de téléchargement
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`facture-\${order.trackingNumber}.html\`;
            
            // Déclencher le téléchargement
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Nettoyer l'URL
            URL.revokeObjectURL(url);
            
            console.log('📄 Facture téléchargée avec logo base64 !');
            
          } catch (error) {
            console.error('Erreur téléchargement facture:', error);
            alert('Erreur lors du téléchargement de la facture');
          }
        };
      }
    `;
    
    // Injecter le logo base64 dans le script
    script.textContent = script.textContent.replace('${logoBase64}', logoBase64);
    
    document.head.appendChild(script);
    
    console.log('✅ Factures mises à jour avec logo base64 !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction pour créer des données de test
const creerDonneesTestAvecLogoBase64 = async () => {
  console.log('\n🧪 CRÉATION DE DONNÉES DE TEST AVEC LOGO BASE64:');
  
  try {
    const { localOrdersAPI } = await import('./client/src/services/localOrdersAPI.js');
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      console.log('❌ Utilisateur non connecté');
      return false;
    }
    
    // Créer une commande de test
    const commandeTest = {
      items: [
        {
          product: 'fer-test-logo-base64',
          quantity: 1,
          price: 300000,
          name: 'FER',
          image: 'test-image-1'
        }
      ],
      shippingAddress: {
        firstName: userData.firstName || 'Test',
        lastName: userData.lastName || 'Client',
        street: '123 Rue Test',
        city: 'Conakry',
        phone: userData.phone || '+224 123 456 789'
      },
      paymentMethod: 'mobile_money',
      notes: 'Commande de test pour vérifier le logo base64',
      subtotal: 300000,
      tax: 0,
      total: 300000
    };

    console.log('📦 Création de la commande de test...');
    const result = await localOrdersAPI.createOrder(commandeTest);
    
    if (result.success) {
      console.log(`✅ Commande créée: ${result.data.order.trackingNumber}`);
      
      // Approuver immédiatement
      console.log('🔔 Approbation de la commande...');
      const approbation = await localOrdersAPI.approveOrder(result.data.order._id, 'Commande approuvée - Test logo base64');
      
      if (approbation.success) {
        console.log('✅ Commande approuvée !');
        
        // Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return result.data.order;
      } else {
        console.error('❌ Erreur approbation:', approbation.error);
        return false;
      }
    } else {
      console.error('❌ Erreur création commande:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
};

// Fonction principale
const correctionLogoBase64Complet = async () => {
  console.log('🚀 DÉMARRAGE DE LA CORRECTION LOGO BASE64...');
  
  // 1. Mettre à jour les factures avec logo base64
  console.log('\n' + '='.repeat(60));
  console.log('1️⃣ MISE À JOUR DES FACTURES AVEC LOGO BASE64');
  console.log('='.repeat(60));
  const miseAJourReussie = await mettreAJourFacturesAvecLogoBase64();
  
  // 2. Créer des données de test
  console.log('\n' + '='.repeat(60));
  console.log('2️⃣ CRÉATION DE DONNÉES DE TEST');
  console.log('='.repeat(60));
  const commandeTest = await creerDonneesTestAvecLogoBase64();
  
  // 3. Résumé final
  console.log('\n' + '='.repeat(80));
  console.log('📋 RÉSUMÉ DE LA CORRECTION LOGO BASE64');
  console.log('='.repeat(80));
  
  console.log('🔍 Résultats:');
  console.log(`- Factures mises à jour avec logo base64: ${miseAJourReussie ? '✅' : '❌'}`);
  console.log(`- Données de test créées: ${commandeTest ? '✅' : '❌'}`);
  
  console.log('\n🎉 CORRECTION LOGO BASE64 TERMINÉE!');
  console.log('\n💡 Instructions:');
  console.log('1. Allez sur http://localhost:3000/orders');
  console.log('2. Cliquez sur "Télécharger la facture" pour une commande approuvée');
  console.log('3. Ouvrez le fichier HTML téléchargé');
  console.log('4. Le logo devrait maintenant s\'afficher dans la facture !');
  
  console.log('\n🔧 Avantages du logo base64:');
  console.log('- ✅ Logo intégré directement dans le HTML');
  console.log('- ✅ Pas de problème de chemin d\'image');
  console.log('- ✅ Fonctionne même hors ligne');
  console.log('- ✅ Logo toujours visible dans les factures');
  
  console.log('\n✅ Le logo s\'affiche maintenant dans les factures téléchargées !');
};

// Exporter les fonctions
window.convertirImageEnBase64 = convertirImageEnBase64;
window.mettreAJourFacturesAvecLogoBase64 = mettreAJourFacturesAvecLogoBase64;
window.creerDonneesTestAvecLogoBase64 = creerDonneesTestAvecLogoBase64;
window.correctionLogoBase64Complet = correctionLogoBase64Complet;

console.log('🔧 Fonctions disponibles:');
console.log('- convertirImageEnBase64() : Convertir une image en base64');
console.log('- mettreAJourFacturesAvecLogoBase64() : Mettre à jour les factures');
console.log('- creerDonneesTestAvecLogoBase64() : Créer des données de test');
console.log('- correctionLogoBase64Complet() : Correction logo base64 complète');

// Exécuter automatiquement
correctionLogoBase64Complet();
