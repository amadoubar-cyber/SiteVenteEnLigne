import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  BarChart3,
  Package,
  TrendingUp,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Settings
} from 'lucide-react';

const RouteDiagnostic = () => {
  const routes = [
    { path: '/admin', name: 'Dashboard Admin', icon: BarChart3, status: 'active' },
    { path: '/admin/products', name: 'Gestion Produits', icon: Package, status: 'active' },
    { path: '/admin/stock', name: 'Mouvements de Stock', icon: TrendingUp, status: 'active' },
    { path: '/admin/stock-control', name: 'Contrôle de Stock', icon: BarChart3, status: 'active' },
    { path: '/admin/test-stock-control', name: 'Test Contrôle Stock', icon: CheckCircle, status: 'test' },
    { path: '/admin/orders', name: 'Commandes', icon: ShoppingCart, status: 'active' },
    { path: '/admin/users', name: 'Utilisateurs', icon: Users, status: 'active' },
    { path: '/admin/images', name: 'Images', icon: ImageIcon, status: 'active' },
    { path: '/admin/categories', name: 'Catégories', icon: Settings, status: 'active' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'test':
        return <XCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200';
      case 'test':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔍 Diagnostic des Routes Admin
        </h1>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions de Test</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Assurez-vous que le serveur frontend est démarré (port 3001)</li>
            <li>Assurez-vous que le serveur backend est démarré (port 5000)</li>
            <li>Connectez-vous en tant qu'admin</li>
            <li>Testez chaque route ci-dessous</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getStatusColor(route.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <route.icon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">{route.name}</span>
                </div>
                {getStatusIcon(route.status)}
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {route.path}
                </code>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={route.path}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tester
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Problèmes Courants</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>Si une page ne se charge pas : vérifiez la console du navigateur (F12)</li>
            <li>Si vous voyez "ERR_CONNECTION_REFUSED" : le serveur n'est pas démarré</li>
            <li>Si la page est blanche : il y a une erreur JavaScript</li>
            <li>Si vous n'êtes pas connecté : utilisez "Connexion Administrateur"</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Page Contrôle de Stock</h3>
          <p className="text-green-800 mb-3">
            La page de contrôle de stock complète est accessible via :
          </p>
          <div className="flex gap-2">
            <Link
              to="/admin/stock-control"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Ouvrir Contrôle de Stock
            </Link>
            <Link
              to="/admin/test-stock-control"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Page de Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDiagnostic;
