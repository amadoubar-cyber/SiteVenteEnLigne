import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, X, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const {
    items,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount
  } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const cartItemCount = getCartItemCount();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-secondary-400" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Votre panier est vide
          </h2>
          <p className="text-secondary-600 mb-8">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link
            to="/products"
            className="btn btn-primary btn-lg"
          >
            Découvrir les Produits
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Mon Panier
          </h1>
          <p className="text-secondary-600">
            {cartItemCount} article(s) dans votre panier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Articles</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>

              <div className="divide-y divide-secondary-200">
                {items.map((item) => (
                  <div key={item.product._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-secondary-900">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="hover:text-primary-600"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-secondary-600 line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-primary-600">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="ml-2 text-sm text-secondary-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-secondary-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-secondary-300 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary-100 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-secondary-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <p className="text-sm text-green-600">
                            Économie: {formatPrice((item.product.originalPrice - item.product.price) * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Taxes</span>
                  <span className="font-medium">0 GNF</span>
                </div>
                <hr className="border-secondary-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  className="btn btn-primary w-full btn-lg mb-4"
                >
                  Passer la commande
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="btn btn-primary w-full btn-lg"
                  >
                    Se connecter pour commander
                  </Link>
                  <p className="text-sm text-secondary-600 text-center">
                    Ou{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700">
                      créer un compte
                    </Link>
                  </p>
                </div>
              )}

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="btn btn-outline w-full"
              >
                Continuer mes achats
              </Link>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-secondary-100 rounded-lg">
                <h3 className="text-sm font-medium text-secondary-900 mb-2">
                  Paiement sécurisé
                </h3>
                <p className="text-xs text-secondary-600">
                  Vos informations de paiement sont protégées par un cryptage SSL.
                  Nous acceptons Mobile Money, Orange Money et paiement à la livraison.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
