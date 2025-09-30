import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../services/api';
import { localProductsAPI } from '../services/localProductsAPI';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmationMessage from '../components/ConfirmationMessage';
import CommentSection from '../components/CommentSection';
import useConfirmationMessage from '../hooks/useConfirmationMessage';
import { getProductImage } from '../utils/imageUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { message, showSuccess, showError, showWarning, hideMessage } = useConfirmationMessage();

  // Récupérer le produit
  const { data: productData, isLoading } = useQuery(
    ['product', id],
    async () => {
      try {
        // Essayer d'abord l'API locale
        return await localProductsAPI.getProductById(id);
      } catch (error) {
        console.error('Erreur API locale:', error);
        // Si l'API locale échoue, essayer l'API serveur
        const response = await productsAPI.getProduct(id);
        return response.data.data.product;
      }
    },
    {
      enabled: !!id
    }
  );

  // Récupérer les produits recommandés
  const { data: recommendedData } = useQuery(
    ['recommended-products', id],
    async () => {
      try {
        // Essayer d'abord l'API locale pour les produits recommandés
        const allProductsData = await localProductsAPI.getProducts({});
        // Filtrer les produits de la même catégorie (recommandations simples)
        return allProductsData.products.filter(p => p._id !== id && p.category === productData?.category).slice(0, 4);
      } catch (error) {
        console.error('Erreur API locale pour recommandations:', error);
        // Si l'API locale échoue, essayer l'API serveur
        const response = await productsAPI.getRecommendedProducts(id);
        return response.data.data.products;
      }
    },
    {
      enabled: !!id && !!productData
    }
  );

  const product = productData;
  const recommendedProducts = recommendedData || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      showError(`Stock insuffisant. Disponible: ${product.stock} unité${product.stock > 1 ? 's' : ''}`);
      return;
    }
    
    addToCart(product, quantity);
    showSuccess(`🎉 ${product.name} a été ajouté au panier avec succès !`);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      showWarning('Vous devez être connecté pour laisser un avis');
      return;
    }

    if (rating === 0) {
      showWarning('Veuillez sélectionner une note avant de publier votre avis');
      return;
    }

    try {
      await productsAPI.addReview(id, { rating, comment });
      showSuccess('⭐ Votre avis a été publié avec succès ! Merci pour votre retour.');
      setRating(0);
      setComment('');
      // Refetch product data to show new review
    } catch (error) {
      showError('Une erreur est survenue lors de la publication de votre avis. Veuillez réessayer.');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Produit non trouvé
          </h2>
          <Link to="/products" className="btn btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const cartQuantity = getItemQuantity(product._id);
  const isProductInCart = isInCart(product._id);

  return (
    <div className="min-h-screen bg-white">
      {/* Message de confirmation */}
      {message && (
        <ConfirmationMessage
          type={message.type}
          message={message.message}
          duration={message.duration}
          onClose={hideMessage}
          show={message.show}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Accueil</Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <Link to="/products" className="hover:text-primary-600">Produits</Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="text-secondary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = getProductImage({});
                }}
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    disabled={selectedImage === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    disabled={selectedImage === product.images.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  -{product.discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-secondary-200'
                    }`}
                  >
                    <img
                      src={getProductImage({ images: [image] })}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = getProductImage({});
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating?.average || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-secondary-600">
                  ({product.rating?.count || 0} avis)
                </span>
                <span className="text-secondary-500">
                  Catégorie: {product.category?.name}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-secondary-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-green-600 font-medium">
                  Vous économisez {formatPrice(product.originalPrice - product.price)} !
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantité:</label>
                <div className="flex items-center border border-secondary-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-secondary-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-secondary-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-secondary-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary btn-lg flex-1 disabled:opacity-50"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isProductInCart ? `Ajouté (${cartQuantity})` : 'Ajouter au panier'}
                </button>
                <button className="btn btn-outline btn-lg">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="btn btn-outline btn-lg">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Livraison gratuite</p>
                  <p className="text-xs text-secondary-600">En 24-48h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Paiement sécurisé</p>
                  <p className="text-xs text-secondary-600">Mobile Money</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="font-medium text-sm">Retour facile</p>
                  <p className="text-xs text-secondary-600">30 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8">
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  {tab === 'description' ? 'Description' : 'Avis'}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-secondary-700 leading-relaxed">
                  {product.description}
                </p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex">
                          <span className="font-medium mr-2">{feature.name}:</span>
                          <span>{feature.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Add Review Form */}
                {isAuthenticated && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Laisser un avis</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Note</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className={`h-8 w-8 ${
                                star <= rating ? 'text-yellow-400' : 'text-secondary-300'
                              }`}
                            >
                              <Star className="h-full w-full fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Commentaire</label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="input w-full"
                          placeholder="Partagez votre expérience avec ce produit..."
                        />
                      </div>
                      <button
                        onClick={handleSubmitReview}
                        className="btn btn-primary"
                      >
                        Publier l'avis
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Avis clients ({product.reviews?.length || 0})
                  </h3>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="card p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {review.user?.firstName} {review.user?.lastName}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-secondary-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-secondary-500">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-secondary-700">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-600">Aucun avis pour le moment.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        {/* Section des commentaires */}
        <div className="mt-16">
          <CommentSection 
            productId={product._id || product.id} 
            productName={product.name} 
          />
        </div>

        {/* Produits recommandés */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Produits recommandés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recProduct) => (
                <div key={recProduct._id} className="product-card card p-4">
                  <Link to={`/products/${recProduct._id}`}>
                    <img
                      src={getProductImage(recProduct)}
                      alt={recProduct.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = getProductImage({});
                      }}
                    />
                    <h3 className="font-medium text-secondary-900 mb-2 line-clamp-2">
                      {recProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(recProduct.price)}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-secondary-500 ml-1">
                          {recProduct.rating?.average || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
