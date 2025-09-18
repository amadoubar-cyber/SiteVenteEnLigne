// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Images de test encodées en base64
const TEST_IMAGES = {
  'test-image-1': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzYwQTVGQSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAxPC90ZXh0Pgo8L3N2Zz4K',
  'test-image-2': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM0RDM5OSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUFHRSAyPC90ZXh0Pgo8L3N2Zz4K',
  'placeholder': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0NDQ0NDQyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QQVMgRCdJTUFHRTwvdGV4dD4KPC9zdmc+Cg=='
};

/**
 * Construit l'URL complète d'une image
 * @param {string} imageUrl - URL relative de l'image (ex: /uploads/image.jpg)
 * @returns {string} URL complète de l'image
 */
export const getImageUrl = (imageUrl) => {
  // Vérifier si imageUrl existe et est une chaîne
  if (!imageUrl || typeof imageUrl !== 'string') {
    return TEST_IMAGES.placeholder;
  }

  // Si l'URL est déjà complète (http/https ou data:), la retourner directement
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // Si c'est une image de test, retourner l'image base64 correspondante
  if (imageUrl.includes('test-image-1')) {
    return TEST_IMAGES['test-image-1'];
  }
  if (imageUrl.includes('test-image-2')) {
    return TEST_IMAGES['test-image-2'];
  }

  // Si l'URL commence par /uploads, utiliser une image de test
  if (imageUrl.startsWith('/uploads')) {
    const fileName = imageUrl.split('/').pop();
    if (fileName.includes('1')) {
      return TEST_IMAGES['test-image-1'];
    } else if (fileName.includes('2')) {
      return TEST_IMAGES['test-image-2'];
    }
    return TEST_IMAGES['test-image-1'];
  }

  // Si l'URL ne commence pas par /, l'ajouter
  if (!imageUrl.startsWith('/')) {
    return `${API_BASE_URL}/uploads/${imageUrl}`;
  }

  // Par défaut, ajouter l'URL de base
  return `${API_BASE_URL}${imageUrl}`;
};

/**
 * Gère l'erreur de chargement d'image
 * @param {Event} event - Événement d'erreur
 * @param {string} fallbackUrl - URL de fallback
 */
export const handleImageError = (event, fallbackUrl = null) => {
  console.log('Erreur image:', event.target.src);
  if (fallbackUrl) {
    event.target.src = fallbackUrl;
  } else {
    event.target.src = TEST_IMAGES.placeholder;
  }
};

/**
 * Gère le succès de chargement d'image
 * @param {Event} event - Événement de succès
 * @param {string} productName - Nom du produit (optionnel)
 */
export const handleImageLoad = (event, productName = '') => {
  console.log('Image chargée:', productName, event.target.src);
};

/**
 * Extrait l'URL de l'image d'un produit
 * @param {Object} product - Objet produit
 * @returns {string} URL de l'image
 */
export const getProductImage = (product) => {
  if (!product) return TEST_IMAGES.placeholder;
  
  // Si le produit a un champ image direct (string)
  if (typeof product.image === 'string') {
    return getImageUrl(product.image);
  }
  
  // Si le produit a un tableau d'images
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    
    // Si la première image est une chaîne
    if (typeof firstImage === 'string') {
      return getImageUrl(firstImage);
    }
    
    // Si la première image est un objet avec une propriété url
    if (firstImage && typeof firstImage === 'object' && firstImage.url) {
      return getImageUrl(firstImage.url);
    }
  }
  
  // Si le produit a une propriété imageUrl
  if (product.imageUrl) {
    return getImageUrl(product.imageUrl);
  }
  
  // Par défaut, retourner le placeholder
  return TEST_IMAGES.placeholder;
};

/**
 * Retourne l'URL du placeholder
 * @returns {string} URL du placeholder
 */
export const getPlaceholderImage = () => TEST_IMAGES.placeholder;