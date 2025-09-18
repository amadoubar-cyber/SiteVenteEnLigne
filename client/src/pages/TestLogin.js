import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, user, isAuthenticated, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        setMessage('✅ Connexion réussie !');
      } else {
        setMessage(`❌ Erreur: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error.message}`);
    }
  };

  const handleLogout = () => {
    // Simuler une déconnexion
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          🧪 Test de Connexion
        </h1>

        {/* État actuel */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">État actuel :</h2>
          <div className="space-y-2">
            <p><strong>Connecté :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non défini'}</p>
            <p><strong>Email :</strong> {user?.email || 'Non défini'}</p>
            <p><strong>Rôle :</strong> {user?.role || 'Non défini'}</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@koula.gn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 mb-4">✅ Vous êtes connecté !</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Comptes de test */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Comptes de test :
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin :</strong> admin@koula.gn / admin123</p>
            <p><strong>Client :</strong> client@koula.gn / password123</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              setEmail('admin@koula.gn');
              setPassword('admin123');
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Remplir Admin
          </button>
          <button
            onClick={() => {
              setEmail('client@koula.gn');
              setPassword('password123');
            }}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
          >
            Remplir Client
          </button>
          <button
            onClick={() => window.location.href = '/admin-page'}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Aller à Admin Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
