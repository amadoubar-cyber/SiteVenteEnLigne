import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Search, ShoppingCart, User, Menu, X, LogOut, Truck, Zap, Shield } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount, openCart } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleAdminLogin = () => {
    // Rediriger vers la page de connexion admin dédiée
    navigate('/admin-login');
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className="bg-primary-500 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold font-heading">Bowoye Multi Services</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-10 px-4 py-2 border-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary-500 text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-r-md transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link to="/construction" className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors text-sm font-medium">
                <Truck className="h-4 w-4" />
                <span>Construction</span>
              </Link>
              <Link to="/electronics" className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Électronique</span>
              </Link>
              <Link to="/products" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
                Tous les produits
              </Link>
            </div>
            
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm font-medium">Panier</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.firstName}</span>
                  {user?.role === 'admin' && (
                    <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                      ADMIN
                    </span>
                  )}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mon Profil
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mes Commandes
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🔧 Administration
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAdminLogin}
                  className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors text-sm font-medium bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-500 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={openCart}
              className="relative p-2 text-secondary-700"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-secondary-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/construction"
                className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Truck className="h-4 w-4" />
                <span>Matériaux de Construction</span>
              </Link>
              <Link
                to="/electronics"
                className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Zap className="h-4 w-4" />
                <span>Électronique</span>
              </Link>
              <Link
                to="/products"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tous les produits
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-secondary-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="text-secondary-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes Commandes
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔧 Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleAdminLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Administration</span>
                  </button>
                  <Link
                    to="/login"
                    className="text-secondary-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
