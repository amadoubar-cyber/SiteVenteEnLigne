// Service d'upload d'images vers le backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bowoye-backend.onrender.com';

// Convertir une image base64 en blob
const base64ToBlob = (base64String, mimeType = 'image/jpeg') => {
  const byteCharacters = atob(base64String.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Upload une image vers le backend
export const uploadImage = async (imageData) => {
  try {
    console.log('📤 Upload d\'image vers le backend...');
    
    // Si c'est déjà une URL (image existante), retourner directement
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
      return { success: true, url: imageData };
    }
    
    // Si c'est un objet avec url base64
    const base64Data = typeof imageData === 'object' ? imageData.url : imageData;
    
    if (!base64Data || !base64Data.startsWith('data:image/')) {
      throw new Error('Format d\'image invalide');
    }
    
    // Convertir base64 en blob
    const blob = base64ToBlob(base64Data);
    const formData = new FormData();
    formData.append('image', blob, 'product-image.jpg');
    
    // Upload vers le backend
    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Image uploadée avec succès:', result.url);
      return { success: true, url: result.url };
    } else {
      throw new Error(`Erreur upload: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Erreur upload image:', error);
    
    // Fallback: garder l'image en base64 localement
    console.log('📱 Fallback: Image gardée localement');
    return { 
      success: true, 
      url: typeof imageData === 'object' ? imageData.url : imageData,
      local: true 
    };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (imagesArray) => {
  console.log(`📤 Upload de ${imagesArray.length} images...`);
  
  const uploadPromises = imagesArray.map(async (imageData) => {
    try {
      return await uploadImage(imageData);
    } catch (error) {
      console.error('Erreur upload image:', error);
      return { 
        success: false, 
        error: error.message,
        url: typeof imageData === 'object' ? imageData.url : imageData 
      };
    }
  });
  
  const results = await Promise.all(uploadPromises);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ ${successful.length} images uploadées, ${failed.length} échecs`);
  
  return {
    success: successful.length > 0,
    images: successful.map(r => r.url),
    failed: failed.length,
    results
  };
};

// Synchroniser les images d'un produit
export const syncProductImages = async (product) => {
  if (!product.images || product.images.length === 0) {
    return product;
  }
  
  console.log(`🔄 Synchronisation des images du produit: ${product.name}`);
  
  const uploadResult = await uploadMultipleImages(product.images);
  
  if (uploadResult.success) {
    return {
      ...product,
      images: uploadResult.images.map(url => ({ url })),
      imageSync: true,
      lastSync: new Date().toISOString()
    };
  }
  
  return product;
};

export default {
  uploadImage,
  uploadMultipleImages,
  syncProductImages
};
