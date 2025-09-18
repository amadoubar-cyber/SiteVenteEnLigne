const fs = require('fs');
const path = require('path');

// Liste des fichiers à nettoyer
const filesToClean = [
  'client/src/pages/admin/AdminUsersComplete.js',
  'client/src/pages/admin/StockMovement.js',
  'client/src/pages/admin/SalesManagement.js',
  'client/src/pages/admin/DebtManagement.js',
  'client/src/pages/admin/CreateSale.js',
  'client/src/pages/admin/CreateDebt.js',
  'client/src/pages/admin/StockControl.js',
  'client/src/pages/admin/AdminSimpleComplete.js'
];

// Fonction pour nettoyer un fichier
function cleanMockData(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer les tableaux de données mockées par des tableaux vides
    const patterns = [
      // Pattern pour les tableaux de produits
      /const\s+mockProducts\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux de commandes
      /const\s+mockOrders\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux d'utilisateurs
      /const\s+mockUsers\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux de dettes
      /const\s+mockDebts\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux de ventes
      /const\s+mockSales\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux de mouvements de stock
      /const\s+mockMovements\s*=\s*\[[\s\S]*?\];/g,
      // Pattern pour les tableaux de statistiques
      /const\s+mockStats\s*=\s*\[[\s\S]*?\];/g
    ];
    
    patterns.forEach(pattern => {
      content = content.replace(pattern, (match) => {
        // Extraire le nom de la variable
        const varName = match.match(/const\s+(\w+)\s*=/)[1];
        return `const ${varName} = [];`;
      });
    });
    
    // Remplacer les objets de statistiques mockées
    const statsPatterns = [
      /const\s+stats\s*=\s*\{[\s\S]*?\};/g,
      /const\s+statistics\s*=\s*\{[\s\S]*?\};/g
    ];
    
    statsPatterns.forEach(pattern => {
      content = content.replace(pattern, (match) => {
        const varName = match.match(/const\s+(\w+)\s*=/)[1];
        return `const ${varName} = {
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        completedOrders: 0,
        lowStockProducts: 0
      };`;
      });
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Nettoyé: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage de ${filePath}:`, error.message);
  }
}

// Nettoyer tous les fichiers
console.log('🧹 Nettoyage des données mockées...\n');

filesToClean.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    cleanMockData(fullPath);
  } else {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
  }
});

console.log('\n✅ Nettoyage terminé !');
console.log('\n📝 Fichiers nettoyés :');
filesToClean.forEach(filePath => {
  console.log(`  - ${filePath}`);
});

console.log('\n🎯 Toutes les données mockées ont été supprimées.');
console.log('   L\'application commencera maintenant avec des données vides.');
