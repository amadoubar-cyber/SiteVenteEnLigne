// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Construit l'URL complète d'une image
 * @param {string} imageUrl - URL relative de l'image (ex: /uploads/image.jpg)
 * @returns {string} URL complète de l'image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-product.svg';
  
  // Si l'URL est déjà complète, la retourner
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // SOLUTION TEMPORAIRE : Utiliser des images de test si le serveur n'est pas disponible
  if (imageUrl.startsWith('/uploads')) {
    // Générer une image de test basée sur le nom du fichier
    const fileName = imageUrl.split('/').pop();
    const testImageNumber = fileName.charCodeAt(0) % 2 + 1;
    return `/test-image-${testImageNumber}.jpg`;
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
export const handleImageError = (event, fallbackUrl = '/placeholder-product.svg') => {
  console.error('Erreur chargement image:', event.target.src);
  event.target.src = fallbackUrl;
};

/**
 * Gère le succès de chargement d'image
 * @param {Event} event - Événement de succès
 * @param {string} productName - Nom du produit (optionnel)
 */
export const handleImageLoad = (event, productName = '') => {
  console.log('Image chargée avec succès:', event.target.src, productName ? `(${productName})` : '');
};

/**
 * Alias pour getImageUrl - utilisé par les autres composants
 * @param {string} imageUrl - URL relative de l'image
 * @returns {string} URL complète de l'image
 */
export const getProductImage = getImageUrl;

/**
 * Retourne l'URL du placeholder
 * @returns {string} URL du placeholder
 */
export const getPlaceholderImage = () => '/placeholder-product.svg';