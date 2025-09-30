// Utilitaire pour corriger définitivement la persistance des produits
// Ce fichier résout les conflits entre différents systèmes de stockage

const PRODUCT_STORAGE_KEY = 'koula_products';
const CONFLICTING_KEYS = [
  'products',
  'adminProducts', 
  'productsData',
  'testProducts',
  'defaultProducts'
];

// Fonction pour nettoyer et consolider les données de produits
export const fixProductPersistence = () => {
  console.log('🔧 Correction de la persistance des produits...');
  
  try {
    // 1. Collecter tous les produits de toutes les sources
    const allProducts = [];
    
    // Récupérer de la clé principale
    const mainData = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (mainData) {
      try {
        const parsed = JSON.parse(mainData);
        if (Array.isArray(parsed)) {
          allProducts.push(...parsed);
        }
      } catch (error) {
        console.error('Erreur parsing koula_products:', error);
      }
    }
    
    // Récupérer des clés conflictuelles
    CONFLICTING_KEYS.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            allProducts.push(...parsed);
          } else if (parsed.products && Array.isArray(parsed.products)) {
            allProducts.push(...parsed.products);
          }
        } catch (error) {
          console.error(`Erreur parsing ${key}:`, error);
        }
      }
    });
    
    // 2. Supprimer les doublons et normaliser
    const uniqueProducts = [];
    const seenIds = new Set();
    
    allProducts.forEach(product => {
      const id = product._id || product.id;
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        uniqueProducts.push(normalizeProduct(product));
      }
    });
    
    // 3. Nettoyer les clés conflictuelles
    CONFLICTING_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // 4. Sauvegarder dans la clé principale
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(uniqueProducts));
    
    console.log(`✅ Persistance corrigée: ${uniqueProducts.length} produits uniques sauvegardés`);
    
    return {
      success: true,
      productCount: uniqueProducts.length,
      products: uniqueProducts
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Normaliser un produit pour assurer la cohérence
const normalizeProduct = (product) => {
  return {
    _id: product._id || product.id || Date.now().toString(),
    name: product.name || 'Produit sans nom',
    description: product.description || '',
    price: parseFloat(product.price) || 0,
    stock: parseInt(product.stock) || 0,
    productType: product.productType || 'construction',
    category: product.category || 'Matériaux de Construction',
    featured: Boolean(product.featured),
    isPublished: Boolean(product.isPublished),
    images: Array.isArray(product.images) ? product.images : [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Fonction pour vérifier l'intégrité des données
export const verifyProductData = () => {
  try {
    const products = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || '[]');
    
    const issues = [];
    
    // Vérifier les produits
    products.forEach((product, index) => {
      if (!product._id) {
        issues.push(`Produit ${index}: ID manquant`);
      }
      if (!product.name) {
        issues.push(`Produit ${index}: Nom manquant`);
      }
      if (typeof product.price !== 'number' || product.price < 0) {
        issues.push(`Produit ${index}: Prix invalide`);
      }
      if (typeof product.stock !== 'number' || product.stock < 0) {
        issues.push(`Produit ${index}: Stock invalide`);
      }
    });
    
    // Vérifier les doublons
    const ids = products.map(p => p._id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      issues.push(`${ids.length - uniqueIds.size} produits dupliqués détectés`);
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      productCount: products.length
    };
    
  } catch (error) {
    return {
      isValid: false,
      issues: [`Erreur de parsing: ${error.message}`],
      productCount: 0
    };
  }
};

// Fonction pour initialiser le système de produits
export const initializeProductSystem = () => {
  console.log('🚀 Initialisation du système de produits...');
  
  // Vérifier l'intégrité
  const verification = verifyProductData();
  
  if (!verification.isValid) {
    console.log('⚠️ Problèmes détectés:', verification.issues);
    
    // Corriger automatiquement
    const fixResult = fixProductPersistence();
    
    if (fixResult.success) {
      console.log('✅ Système de produits initialisé et corrigé');
      return fixResult;
    } else {
      console.error('❌ Échec de la correction:', fixResult.error);
      return fixResult;
    }
  } else {
    console.log('✅ Système de produits déjà valide');
    return {
      success: true,
      productCount: verification.productCount,
      message: 'Système déjà valide'
    };
  }
};

// Fonction pour sauvegarder un produit de manière sécurisée
export const saveProduct = (productData) => {
  try {
    const products = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || '[]');
    
    const normalizedProduct = normalizeProduct(productData);
    
    // Vérifier si le produit existe déjà
    const existingIndex = products.findIndex(p => p._id === normalizedProduct._id);
    
    if (existingIndex >= 0) {
      // Mettre à jour
      products[existingIndex] = {
        ...products[existingIndex],
        ...normalizedProduct,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Ajouter nouveau
      products.push(normalizedProduct);
    }
    
    // Sauvegarder
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    
    console.log(`✅ Produit sauvegardé: ${normalizedProduct.name}`);
    
    return {
      success: true,
      product: normalizedProduct
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fonction pour récupérer tous les produits
export const getAllProducts = () => {
  try {
    const products = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || '[]');
    return {
      success: true,
      products: products
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    return {
      success: false,
      products: [],
      error: error.message
    };
  }
};

// Auto-correction au chargement du module
if (typeof window !== 'undefined') {
  // Exécuter la correction automatiquement
  setTimeout(() => {
    initializeProductSystem();
  }, 1000);
}
