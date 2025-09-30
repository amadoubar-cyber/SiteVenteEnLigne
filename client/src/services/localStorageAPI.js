// API temporaire utilisant localStorage pour stocker les produits
// Cette solution fonctionne immédiatement sans serveur backend

const STORAGE_KEY = 'koula_products';

// Récupérer tous les produits
export const getAllProducts = () => {
  try {
    const products = localStorage.getItem(STORAGE_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

// Sauvegarder tous les produits
const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des produits:', error);
    return false;
  }
};

// Créer un nouveau produit
export const createProduct = (productData) => {
  const products = getAllProducts();
  const newProduct = {
    _id: Date.now().toString(), // ID temporaire basé sur le timestamp
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  if (saveProducts(products)) {
    return { success: true, data: { product: newProduct } };
  } else {
    throw new Error('Erreur lors de la sauvegarde du produit');
  }
};

// Mettre à jour un produit
export const updateProduct = (id, productData) => {
  const products = getAllProducts();
  const index = products.findIndex(p => p._id === id);
  
  if (index === -1) {
    throw new Error('Produit non trouvé');
  }
  
  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };
  
  if (saveProducts(products)) {
    return { success: true, data: { product: products[index] } };
  } else {
    throw new Error('Erreur lors de la mise à jour du produit');
  }
};

// Supprimer un produit
export const deleteProduct = (id) => {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p._id !== id);
  
  if (saveProducts(filteredProducts)) {
    return { success: true, message: 'Produit supprimé avec succès' };
  } else {
    throw new Error('Erreur lors de la suppression du produit');
  }
};

// Récupérer les catégories (données statiques)
export const getCategories = () => {
  return {
    success: true,
    data: [
      { _id: '1', name: 'Matériaux de Construction' },
      { _id: '2', name: 'Électronique' },
      { _id: '3', name: 'Outillage' },
      { _id: '4', name: 'Plomberie' },
      { _id: '5', name: 'Électricité' }
    ]
  };
};

// Fonction supprimée - plus de données de test automatiques
