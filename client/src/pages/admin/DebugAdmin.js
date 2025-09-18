import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DebugAdmin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goToSimpleTest = () => {
    navigate('/admin/simple');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🔍 Debug Admin
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de connexion */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📊 État de connexion
            </h2>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Authentifié :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}
              </div>
              <div className={`p-3 rounded-lg ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                <strong>Chargement :</strong> {loading ? '⏳ En cours...' : '✅ Terminé'}
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
                <strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non défini'}
              </div>
              <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
                <strong>Email :</strong> {user?.email || 'Non défini'}
              </div>
              <div className={`p-3 rounded-lg ${user?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Rôle :</strong> {user?.role || 'Non défini'} {user?.role === 'admin' ? '👑' : '👤'}
              </div>
            </div>
          </div>

          {/* Actions de test */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚀 Actions de test
            </h2>
            <div className="space-y-4">
              <button
                onClick={goToAdmin}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🏠 Aller au Dashboard Admin
              </button>
              
              <button
                onClick={goToSimpleTest}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                🧪 Test Simple Admin
              </button>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔐 Aller à la connexion
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                🔄 Recharger la page
              </button>
            </div>
          </div>

          {/* Informations du token */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔑 Informations du token
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify({
                  token: localStorage.getItem('token') ? 'Présent' : 'Absent',
                  user: user,
                  isAuthenticated: isAuthenticated,
                  loading: loading
                }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Instructions
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>1.</strong> Si vous n'êtes pas connecté, cliquez sur "Aller à la connexion"</p>
              <p><strong>2.</strong> Connectez-vous avec : <code className="bg-gray-200 px-2 py-1 rounded">admin@koula.gn</code> / <code className="bg-gray-200 px-2 py-1 rounded">admin123</code></p>
              <p><strong>3.</strong> Revenez sur cette page et vérifiez que le rôle est "admin"</p>
              <p><strong>4.</strong> Cliquez sur "Aller au Dashboard Admin" pour tester l'interface</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAdmin;
