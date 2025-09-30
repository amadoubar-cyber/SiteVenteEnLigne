import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  ChevronLeft,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Import des pages complètes
import AdminDashboardComplete from './AdminDashboardComplete';
import AdminProductsComplete from './AdminProductsComplete';
import AdminUsersComplete from './AdminUsersComplete';
import AdminCommentManagement from './AdminCommentManagement';

const AdminComplete = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  React.useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      setUser(JSON.parse(adminUser));
      setIsLoggedIn(true);
    } else {
      // Simuler une connexion admin automatique
      const adminUser = {
        firstName: 'Admin',
        lastName: 'Koula',
        email: 'admin@koula.gn',
        role: 'admin'
      };
      setUser(adminUser);
      setIsLoggedIn(true);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const navigation = [
    { name: 'Tableau de bord', tab: 'dashboard', icon: LayoutDashboard },
    { name: 'Produits', tab: 'products', icon: Package },
    { name: 'Utilisateurs', tab: 'users', icon: Users },
    { name: 'Commentaires', tab: 'comments', icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboardComplete />;
      case 'products': return <AdminProductsComplete />;
      case 'users': return <AdminUsersComplete />;
      case 'comments': return <AdminCommentManagement />;
      default: return <AdminDashboardComplete />;
    }
  };

  // Afficher un loader pendant la vérification
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'interface admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Koula</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center w-full px-2 py-2 text-base font-medium rounded-md ${
                        activeTab === item.tab
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">A</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">Admin Koula</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Koula</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.tab)}
                    className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                      activeTab === item.tab
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">A</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">Admin Koula</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <Home className="h-4 w-4 mr-1" />
                  Retour au site
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">A</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">Admin Koula</p>
                    <p className="text-xs text-gray-500">Administrateur</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Déconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminComplete;
