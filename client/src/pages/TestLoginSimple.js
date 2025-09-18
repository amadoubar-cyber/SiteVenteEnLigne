import React, { useState } from 'react';

const TestLoginSimple = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    // Simulation de connexion
    if (email === 'admin@koula.gn' && password === 'admin123') {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'Koula',
        email: 'admin@koula.gn',
        role: 'admin'
      };
      setUser(adminUser);
      setIsLoggedIn(true);
      setMessage('✅ Connexion admin réussie !');
      localStorage.setItem('token', 'fake-admin-token');
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else if (email === 'client@koula.gn' && password === 'password123') {
      const clientUser = {
        firstName: 'Client',
        lastName: 'Test',
        email: 'client@koula.gn',
        role: 'user'
      };
      setUser(clientUser);
      setIsLoggedIn(true);
      setMessage('✅ Connexion client réussie !');
      localStorage.setItem('token', 'fake-client-token');
      localStorage.setItem('user', JSON.stringify(clientUser));
    } else {
      setMessage('❌ Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const goToAdminPage = () => {
    if (user?.role === 'admin') {
      window.location.href = '/admin-page';
    } else {
      setMessage('❌ Accès refusé. Vous devez être administrateur.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          🧪 Test de Connexion Simple
        </h1>

        {/* État actuel */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">État actuel :</h2>
          <div className="space-y-2">
            <p><strong>Connecté :</strong> {isLoggedIn ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non défini'}</p>
            <p><strong>Email :</strong> {user?.email || 'Non défini'}</p>
            <p><strong>Rôle :</strong> {user?.role || 'Non défini'}</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        {!isLoggedIn ? (
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600">✅ Vous êtes connecté !</p>
            <div className="space-y-2">
              <button
                onClick={goToAdminPage}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                🏠 Aller à Admin Page
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
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

        {/* Actions rapides */}
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
        </div>
      </div>
    </div>
  );
};

export default TestLoginSimple;
