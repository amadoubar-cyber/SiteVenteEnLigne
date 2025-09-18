import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, ArrowRight, Truck, Shield, Headphones, Zap, Calculator, BarChart3 } from 'lucide-react';
import { getProductImage, getPlaceholderImage } from '../utils/imageUtils';

const Home = () => {
  const { addToCart } = useCart();

  // Récupérer les produits vedettes de construction
  const { data: featuredConstruction, isLoading: featuredConstructionLoading } = useQuery(
    'featured-construction',
    () => productsAPI.getProducts({ featured: 'true', productType: 'construction', limit: 4 }),
    {
      select: (response) => response.data.data.products
    }
  );

  // Récupérer les produits vedettes électroniques
  const { data: featuredElectronics, isLoading: featuredElectronicsLoading } = useQuery(
    'featured-electronics',
    () => productsAPI.getProducts({ featured: 'true', productType: 'electronique', limit: 4 }),
    {
      select: (response) => response.data.data.products
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Votre Plateforme de Vente en Ligne
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Découvrez nos deux univers : Matériaux de construction et Produits électroniques. 
              Tout ce dont vous avez besoin, au meilleur prix.
            </p>
          </div>

          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              to="/construction"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
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
              Voir tout →
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
