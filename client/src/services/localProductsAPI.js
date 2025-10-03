// Import du service d'upload d'images
import { syncProductImages } from './imageUploadAPI';

// API hybride pour les produits : localStorage + Backend
const LOCAL_PRODUCTS_KEY = 'koula_products';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bowoye-backend.onrender.com';

// Simuler un délai de réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Charger les produits depuis le backend (avec fallback localStorage)
const loadProducts = async () => {
  try {
    // Essayer d'abord le backend
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (response.ok) {
      const products = await response.json();
      console.log(`📦 ${products.length} produits chargés depuis le backend`);
      
      // Synchroniser avec localStorage
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
      return products;
    }
  } catch (error) {
    console.warn('Backend indisponible, utilisation du localStorage:', error.message);
  }
  
  // Fallback vers localStorage
  try {
    const products = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
    console.log(`📦 ${products.length} produits chargés depuis localStorage (fallback)`);
    return products;
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    return [];
  }
};

// Filtrer les produits selon les critères
const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filtrer par type de produit
  if (filters.productType) {
    filtered = filtered.filter(product => 
      product.productType?.toLowerCase() === filters.productType.toLowerCase()
    );
  }

  // Filtrer par catégorie
  if (filters.category) {
    filtered = filtered.filter(product => 
      product.category?.toLowerCase().includes(filters.category.toLowerCase())
    );
  }

  // Filtrer par recherche textuelle
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.name?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrer par prix minimum
  if (filters.minPrice) {
    filtered = filtered.filter(product => 
      product.price >= parseFloat(filters.minPrice)
    );
  }

  // Filtrer par prix maximum
  if (filters.maxPrice) {
    filtered = filtered.filter(product => 
      product.price <= parseFloat(filters.maxPrice)
    );
  }

  // Filtrer par marque
  if (filters.brand) {
    filtered = filtered.filter(product => 
      product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
    );
  }

  // Filtrer par produits vedettes
  if (filters.featured === 'true') {
    filtered = filtered.filter(product => product.featured === true);
  }

  // Filtrer par produits publiés seulement
  filtered = filtered.filter(product => product.isPublished === true);

  return filtered;
};

// Trier les produits
const sortProducts = (products, sort, order) => {
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sort) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return sorted;
};

// Paginer les produits
const paginateProducts = (products, page, limit = 12) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(products.length / limit),
      totalProducts: products.length,
      hasNext: endIndex < products.length,
      hasPrev: startIndex > 0,
      limit
    }
  };
};

export const localProductsAPI = {
  // Récupérer tous les produits avec filtres
  getProducts: async (filters = {}) => {
    await delay(500); // Simuler un délai de réseau
    
    const allProducts = await loadProducts();
    const filteredProducts = filterProducts(allProducts, filters);
    const sortedProducts = sortProducts(filteredProducts, filters.sort || 'createdAt', filters.order || 'desc');
    
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    
    const result = paginateProducts(sortedProducts, page, limit);
    
    return result;
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    await delay(300);
    
    const products = await loadProducts();
    const product = products.find(p => p._id === id);
    
    if (!product) {
      throw new Error('Produit non trouvé');
    }
    
    return product;
  },

  // Récupérer les catégories
  getCategories: async () => {
    await delay(200);
    
    const products = loadProducts();
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    return {
      data: {
        success: true,
        data: categories.map((name, index) => ({ _id: (index + 1).toString(), name }))
      }
    };
  },

  // Récupérer les marques
  getBrands: async () => {
    await delay(200);
    
    const products = loadProducts();
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    
    return {
      data: {
        success: true,
        data: brands.map((name, index) => ({ _id: (index + 1).toString(), name }))
      }
    };
  },

  // Synchroniser les produits avec le backend
  syncProducts: async () => {
    try {
      console.log('🔄 Synchronisation des produits...');
      
      // Charger depuis le backend
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const products = await response.json();
        
        // Sauvegarder dans localStorage
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
        
        console.log(`✅ ${products.length} produits synchronisés`);
        return { success: true, count: products.length };
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Erreur de synchronisation:', error);
      return { success: false, error: error.message };
    }
  },

  // Ajouter un produit au backend
  addProduct: async (productData) => {
    try {
      console.log('➕ Ajout d\'un produit (mode localStorage)...');
      
      // Mode localStorage uniquement en attendant la correction CORS
      const newProduct = {
        ...productData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Ajouter au localStorage
      const localProducts = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
      localProducts.push(newProduct);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(localProducts));
      
      console.log('✅ Produit ajouté avec succès (localStorage)');
      return { success: true, product: newProduct };
      
      // TODO: Réactiver la synchronisation backend après correction CORS
      /*
      // Synchroniser les images d'abord
      const productWithSyncedImages = await syncProductImages(productData);
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productWithSyncedImages)
      });

      if (response.ok) {
        const newProduct = await response.json();
        
        // Ajouter aussi au localStorage
        const localProducts = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
        localProducts.push(newProduct);
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(localProducts));
        
        console.log('✅ Produit ajouté avec succès (images synchronisées)');
        return { success: true, product: newProduct };
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      */
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      
      // Fallback : ajouter au localStorage seulement
      const localProducts = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
      const newProduct = {
        ...productData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      localProducts.push(newProduct);
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(localProducts));
      
      return { success: true, product: newProduct, warning: 'Ajouté localement seulement' };
    }
  },

  // Synchroniser les images de tous les produits
  syncAllImages: async () => {
    try {
      console.log('🔄 Synchronisation de toutes les images...');
      
      const products = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
      const productsWithImages = products.filter(p => p.images && p.images.length > 0);
      
      console.log(`📤 Synchronisation de ${productsWithImages.length} produits avec images...`);
      
      const syncPromises = productsWithImages.map(async (product) => {
        try {
          return await syncProductImages(product);
        } catch (error) {
          console.error(`Erreur sync images pour ${product.name}:`, error);
          return product;
        }
      });
      
      const syncedProducts = await Promise.all(syncPromises);
      
      // Mettre à jour localStorage
      const updatedProducts = products.map(product => {
        const synced = syncedProducts.find(p => p._id === product._id);
        return synced || product;
      });
      
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updatedProducts));
      
      console.log('✅ Synchronisation des images terminée');
      return { success: true, count: productsWithImages.length };
    } catch (error) {
      console.error('❌ Erreur synchronisation images:', error);
      return { success: false, error: error.message };
    }
  }
};

export default localProductsAPI;
