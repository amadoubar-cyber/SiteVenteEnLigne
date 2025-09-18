import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartSidebar = () => {
  const {
    isOpen,
    items,
    totalPrice,
    closeCart,
    updateQuantity,
    removeFromCart,
    getCartItemCount
  } = useCart();

  const cartItemCount = getCartItemCount();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Panier ({cartItemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-secondary-300 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-secondary-500 mb-6">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="btn btn-primary"
              >
                Voir les Produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex space-x-4 p-3 border border-secondary-200 rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-secondary-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-secondary-500">
                      {formatPrice(item.product.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 hover:bg-secondary-100 rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 hover:bg-secondary-100 rounded transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-secondary-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-secondary-900">
                Total:
              </span>
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="btn btn-outline w-full"
              >
                Voir le Panier
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn btn-primary w-full"
              >
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
