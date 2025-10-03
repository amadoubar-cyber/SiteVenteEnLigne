import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../services/api';
import { localProductsAPI } from '../services/localProductsAPI';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, ArrowRight, Truck, Shield, Headphones, Zap, Calculator, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductImage, getPlaceholderImage } from '../utils/imageUtils';
import '../styles/carousel.css';

const Home = () => {
  const { addToCart } = useCart();

  // Images pour l'animation du carrousel
  const carouselImages = [
    {
      src: process.env.PUBLIC_URL + '/images/products/construction/A3.jpeg',
      alt: 'Matériaux de construction - Ciment et briques',
      title: 'Matériaux de Construction',
      description: 'Ciment, briques et tous les matériaux pour vos projets'
    },
    {
      src: process.env.PUBLIC_URL + '/images/products/construction/A4.jpeg',
      alt: 'Matériaux de construction - Fer à béton',
      title: 'Fer à Béton',
      description: 'Armatures et structures métalliques de qualité'
    },
    {
      src: process.env.PUBLIC_URL + '/images/products/construction/A5.jpeg',
      alt: 'Matériaux de construction - Outils',
      title: 'Outils de Construction',
      description: 'Tous les outils nécessaires pour vos chantiers'
    },
    {
      src: process.env.PUBLIC_URL + '/images/products/construction/A6.jpeg',
      alt: 'Matériaux de construction - Peinture',
      title: 'Peintures et Finitions',
      description: 'Peintures intérieures et extérieures de qualité'
    }
  ];

  // État pour le carrousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Animation automatique du carrousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change d'image toutes les 3 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  // Navigation manuelle
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
  };

  // Reprendre l'animation automatique après 10 secondes d'inactivité
  useEffect(() => {
    if (!isAutoPlaying) {
      const timeout = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isAutoPlaying]);

  // Récupérer les produits vedettes de construction
  const { data: featuredConstruction, isLoading: featuredConstructionLoading } = useQuery(
    'featured-construction',
    async () => {
      try {
        const response = await localProductsAPI.getProducts({ featured: 'true', productType: 'matériau', limit: 4 });
        return response;
      } catch (error) {
        return await productsAPI.getProducts({ featured: 'true', productType: 'construction', limit: 4 });
      }
    },
    {
      select: (response) => {
        // Si c'est l'API locale, retourner directement
        if (response.products) {
          return response.products;
        }
        // Si c'est l'API serveur, extraire data.data.products
        return response.data.data.products;
      }
    }
  );

  // Récupérer les produits vedettes électroniques
  const { data: featuredElectronics, isLoading: featuredElectronicsLoading } = useQuery(
    'featured-electronics',
    async () => {
      try {
        const response = await localProductsAPI.getProducts({ featured: 'true', productType: 'électronique', limit: 4 });
        return response;
      } catch (error) {
        return await productsAPI.getProducts({ featured: 'true', productType: 'electronique', limit: 4 });
      }
    },
    {
      select: (response) => {
        // Si c'est l'API locale, retourner directement
        if (response.products) {
          return response.products;
        }
        // Si c'est l'API serveur, extraire data.data.products
        return response.data.data.products;
      }
    }
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="relative mb-4">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = getPlaceholderImage();
          }}
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating?.average || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.rating?.count || 0})
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
        
        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.stock === 0}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec Carrousel */}
      <section className="relative bg-gradient-to-r from-blue-600 to-orange-500 text-white overflow-hidden">
        {/* Carrousel d'Images */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-construction.jpg';
                  }}
                />
                {/* Overlay sombre pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu par-dessus le carrousel */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg carousel-title text-white">
              BOWOYE MULTI SERVICES
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 drop-shadow-md fade-in">
              Découvrez nos deux univers : Matériaux de construction et Produits électroniques. 
              Tout ce dont vous avez besoin, au meilleur prix.
            </p>
            
            {/* Informations de l'image actuelle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto carousel-info">
              <h3 className="text-lg font-semibold mb-2">
                {carouselImages[currentImageIndex]?.title}
              </h3>
              <p className="text-sm text-blue-100">
                {carouselImages[currentImageIndex]?.description}
              </p>
            </div>
          </div>

          {/* Contrôles du carrousel */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {/* Bouton Précédent */}
            <button
              onClick={goToPrevious}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 carousel-nav-button carousel-button-shine"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Indicateurs de pagination */}
            <div className="flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 carousel-dot ${
                    index === currentImageIndex
                      ? 'bg-white scale-125 active pulse'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>

            {/* Bouton Suivant */}
            <button
              onClick={goToNext}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 carousel-nav-button carousel-button-shine"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Indicateur de lecture automatique */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 carousel-play-button ${
                isAutoPlaying
                  ? 'bg-white/20 backdrop-blur-sm text-white'
                  : 'bg-white/10 backdrop-blur-sm text-blue-100'
              }`}
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Lecture'}
            </button>
          </div>

          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <Link
              to="/construction"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 carousel-category slide-in-left"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform carousel-icon">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Matériaux de Construction</h2>
                <p className="text-blue-100 mb-4">
                  Ciment, fer à béton, peinture, outils et tous les matériaux pour vos projets
                </p>
                <div className="flex items-center justify-center space-x-2 text-orange-200">
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm">Devis personnalisés disponibles</span>
                </div>
              </div>
            </Link>

            <Link
              to="/electronics"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 carousel-category slide-in-right"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform carousel-icon">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Électronique</h2>
                <p className="text-blue-100 mb-4">
                  Téléphones, ordinateurs, électroménagers et accessoires technologiques
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-200">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Comparateur de produits</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Style Amazon */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Livraison Rapide</h3>
                <p className="text-gray-600 text-sm">
                  Livraison gratuite en 24-48h
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-secondary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Paiement Sécurisé</h3>
                <p className="text-gray-600 text-sm">
                  Mobile Money, Orange Money
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Support 24/7</h3>
                <p className="text-gray-600 text-sm">
                  Assistance client disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Construction Materials Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Matériaux de Construction
              </h2>
            </div>
            <Link
              to="/construction"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              Voir tout → team
            </Link>
          </div>
          
          {featuredConstructionLoading ? (
            <div className="flex justify-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredConstruction?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/construction"
              className="btn btn-primary btn-lg"
            >
              Voir Tous les Matériaux
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Electronics Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Électronique
              </h2>
            </div>
            <Link
              to="/electronics"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              Voir tout →
            </Link>
          </div>
          
          {featuredElectronicsLoading ? (
            <div className="flex justify-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredElectronics?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/electronics"
              className="btn btn-primary btn-lg"
            >
              Voir Tous les Produits d'Électronique
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
