// API locale pour les produits côté client
const LOCAL_PRODUCTS_KEY = 'koula_products';

// Simuler un délai de réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Charger les produits depuis localStorage uniquement
const loadProducts = async () => {
  try {
    // Charger uniquement depuis localStorage
    const products = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
    console.log(`📦 ${products.length} produits chargés depuis localStorage`);
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
  }
};

export default localProductsAPI;
