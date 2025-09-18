import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../services/api';
import { localProductsAPI } from '../services/localProductsAPI';
import { useCart } from '../contexts/CartContext';
import { Star, ShoppingCart, Filter, Grid, List, BarChart3, Shield, Zap } from 'lucide-react';
import { getProductImage, getPlaceholderImage } from '../utils/imageUtils';

const ElectronicsProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [compareList, setCompareList] = useState([]);
  
  const { addToCart } = useCart();

  // Paramètres de recherche
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const brand = searchParams.get('brand') || '';

  // Récupérer les produits électroniques
  const { data: productsData, isLoading } = useQuery(
    ['electronics-products', { page, search, category, minPrice, maxPrice, sort, order, brand }],
    async () => {
      try {
        // Essayer d'abord l'API locale
        return await localProductsAPI.getProducts({
          page,
          search,
          category,
          minPrice,
          maxPrice,
          sort,
          order,
          brand,
          productType: 'électronique'
        });
      } catch (error) {
        // Si l'API locale échoue, essayer l'API serveur
        return await productsAPI.getProducts({
          page,
          search,
          category,
          minPrice,
          maxPrice,
          sort,
          order,
          productType: 'electronique'
        });
      }
    },
    {
      select: (response) => {
        // Si c'est l'API locale, retourner directement
        if (response.products) {
          return response;
        }
        // Si c'est l'API serveur, extraire data.data
        return response.data.data;
      }
    }
  );

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    updateSearchParams({ [key]: value });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const toggleCompare = (product) => {
    if (compareList.find(p => p._id === product._id)) {
      setCompareList(compareList.filter(p => p._id !== product._id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, product]);
    }
  };

  const ProductCard = ({ product, viewMode }) => {
    const isInCompare = compareList.find(p => p._id === product._id);
    
    return (
      <div className={`product-card card ${viewMode === 'list' ? 'flex flex-row p-4' : 'p-4'} ${isInCompare ? 'ring-2 ring-blue-500' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            className={`object-cover rounded-lg ${
              viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
            }`}
            onError={(e) => {
              e.target.src = getPlaceholderImage();
            }}
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{product.discountPercentage}%
            </div>
          )}
          {product.warranty && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {product.warranty}
            </div>
          )}
        </div>
        
        <div className={`space-y-2 ${viewMode === 'list' ? 'ml-4 flex-1' : ''}`}>
          <div className="flex items-start justify-between">
            <h3 className={`font-medium text-secondary-900 ${
              viewMode === 'list' ? 'text-lg' : 'line-clamp-2'
            }`}>
              {product.name}
            </h3>
            {product.brand && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {product.brand}
              </span>
            )}
          </div>
          
          {viewMode === 'list' && (
            <p className="text-secondary-600 text-sm line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating?.average || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-secondary-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-secondary-500">
              ({product.rating?.count || 0})
            </span>
          </div>

          {/* Spécifications techniques */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="text-sm text-secondary-600">
              <p className="font-medium">Spécifications:</p>
              <ul className="text-xs space-y-1">
                {product.specifications.slice(0, 2).map((spec, index) => (
                  <li key={index}>
                    <span className="font-medium">{spec.name}:</span> {spec.value}
                  </li>
                ))}
                {product.specifications.length > 2 && (
                  <li className="text-blue-600">+{product.specifications.length - 2} autres...</li>
                )}
              </ul>
            </div>
          )}
          
          <div className={`flex items-center justify-between ${
            viewMode === 'list' ? 'mt-4' : ''
          }`}>
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-secondary-500 line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => addToCart(product, 1)}
                disabled={product.stock === 0}
                className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`btn btn-sm ${
                  isInCompare 
                    ? 'btn-primary' 
                    : compareList.length >= 4 
                      ? 'btn-outline disabled:opacity-50' 
                      : 'btn-outline'
                }`}
                disabled={compareList.length >= 4 && !isInCompare}
                title={compareList.length >= 4 && !isInCompare ? 'Maximum 4 produits en comparaison' : 'Comparer'}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <Link
                to={`/products/${product._id}`}
                className="btn btn-outline btn-sm"
              >
                Voir
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Électronique
              </h1>
              <p className="text-secondary-600">
                Découvrez les dernières technologies et innovations
              </p>
            </div>
          </div>
          <p className="text-secondary-600">
            {pagination.totalProducts} produit(s) trouvé(s)
          </p>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {compareList.length} produit(s) en comparaison
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to="/compare"
                  state={{ products: compareList }}
                  className="btn btn-primary btn-sm"
                >
                  Comparer
                </Link>
                <button
                  onClick={() => setCompareList([])}
                  className="btn btn-outline btn-sm"
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Effacer tout
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Recherche</label>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input w-full"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input w-full"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="construction">Matériaux de Construction</option>
                  <option value="electronics">Électronique</option>
                </select>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Marque</label>
                <input
                  type="text"
                  placeholder="Marque..."
                  value={brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input w-full"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Prix</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Prix min"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input w-full"
                  />
                  <input
                    type="number"
                    placeholder="Prix max"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Trier par</label>
                <select
                  value={`${sort}-${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split('-');
                    handleFilterChange('sort', newSort);
                    handleFilterChange('order', newOrder);
                  }}
                  className="input w-full"
                >
                  <option value="createdAt-desc">Plus récents</option>
                  <option value="createdAt-asc">Plus anciens</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating.average-desc">Mieux notés</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn btn-outline btn-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-600">Vue:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="loading-spinner"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-secondary-400 mb-4">
                  <Zap className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Aucun produit électronique trouvé
                </h3>
                <p className="text-secondary-600 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateSearchParams({ page: pagination.currentPage - 1 })}
                        disabled={!pagination.hasPrev}
                        className="btn btn-outline btn-sm disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrentPage = pageNum === pagination.currentPage;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateSearchParams({ page: pageNum })}
                            className={`btn btn-sm ${
                              isCurrentPage ? 'btn-primary' : 'btn-outline'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => updateSearchParams({ page: pagination.currentPage + 1 })}
                        disabled={!pagination.hasNext}
                        className="btn btn-outline btn-sm disabled:opacity-50"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicsProducts;
