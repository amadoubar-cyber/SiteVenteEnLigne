import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';

const ProductCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      // Rediriger vers la page des produits si aucun produit à comparer
      navigate('/electronics');
    }
  }, [location.state, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const removeProduct = (productId) => {
    const newProducts = products.filter(p => p._id !== productId);
    if (newProducts.length === 0) {
      navigate('/electronics');
    } else {
      setProducts(newProducts);
    }
  };

  const getSpecificationValue = (product, specName) => {
    const spec = product.specifications?.find(s => s.name === specName);
    return spec ? spec.value : '-';
  };

  const getAllSpecifications = () => {
    const allSpecs = new Set();
    products.forEach(product => {
      product.specifications?.forEach(spec => {
        allSpecs.add(spec.name);
      });
    });
    return Array.from(allSpecs);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Aucun produit à comparer
          </h2>
          <p className="text-secondary-600 mb-4">
            Sélectionnez des produits pour les comparer
          </p>
          <button
            onClick={() => navigate('/electronics')}
            className="btn btn-primary"
          >
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Comparaison de Produits
              </h1>
              <p className="text-secondary-600">
                Comparez {products.length} produit(s) côte à côte
              </p>
            </div>
            <button
              onClick={() => navigate('/electronics')}
              className="btn btn-outline"
            >
              Retour aux produits
            </button>
          </div>
        </div>

        {/* Products Comparison Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900">
                    Caractéristiques
                  </th>
                  {products.map((product) => (
                    <th key={product._id} className="px-6 py-4 text-center min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => removeProduct(product._id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-3">
                          <img
                            src={product.images?.[0]?.url || '/placeholder-product.svg'}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                          <div>
                            <h3 className="font-medium text-secondary-900 text-sm line-clamp-2">
                              {product.name}
                            </h3>
                            {product.brand && (
                              <p className="text-xs text-secondary-600 mt-1">
                                {product.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {/* Prix */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Prix
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-6 py-4 text-center">
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
                    </td>
                  ))}
                </tr>

                {/* Note */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Note
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
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
                        <span className="text-sm text-secondary-500 ml-1">
                          ({product.rating?.count || 0})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Disponibilité
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {product.stock > 0 ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              En stock ({product.stock})
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">
                              Rupture de stock
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Garantie */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Garantie
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-6 py-4 text-center">
                      <span className="text-sm text-secondary-600">
                        {product.warranty || '-'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Spécifications techniques */}
                {getAllSpecifications().map((specName) => (
                  <tr key={specName}>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                      {specName}
                    </td>
                    {products.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-center">
                        <span className="text-sm text-secondary-600">
                          {getSpecificationValue(product, specName)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-secondary-900">
                    Actions
                  </td>
                  {products.map((product) => (
                    <td key={product._id} className="px-6 py-4 text-center">
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="btn btn-primary btn-sm w-full"
                        >
                          Voir le produit
                        </button>
                        {product.stock > 0 && (
                          <button
                            onClick={() => {
                              // Ajouter au panier
                              navigate(`/products/${product._id}`);
                            }}
                            className="btn btn-outline btn-sm w-full"
                          >
                            Ajouter au panier
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card p-6">
              <h3 className="font-medium text-secondary-900 mb-4">
                Résumé - {product.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Prix:</span>
                  <span className="font-medium">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Note:</span>
                  <span className="font-medium">
                    {product.rating?.average || 0}/5 ({product.rating?.count || 0} avis)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Stock:</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Rupture'}
                  </span>
                </div>
                {product.warranty && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Garantie:</span>
                    <span className="font-medium">{product.warranty}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;
