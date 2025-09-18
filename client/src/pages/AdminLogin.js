import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Vérifier les identifiants admin
    const validAdminCredentials = [
      { email: 'admin@koula.gn', password: 'admin123' },
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'superadmin@koula.gn', password: 'superadmin123' }
    ];

    // Simuler un délai de vérification
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isValidAdmin = validAdminCredentials.some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (isValidAdmin) {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'Koula',
        email: formData.email,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      navigate('/admin-simple-complete');
    } else {
      setErrors({ 
        general: 'Identifiants administrateur incorrects. Accès refusé.' 
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-red-900">
          Accès Administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-red-600">
          Connexion sécurisée pour les administrateurs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-red-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-red-700">
                Email Administrateur
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border border-red-300 rounded-md placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="admin@koula.gn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-red-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-red-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border border-red-300 rounded-md placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-red-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-red-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Vérification...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Se connecter
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-red-500">Comptes de test</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Identifiants de démonstration :
              </h4>
              <div className="text-xs text-red-700 space-y-1">
                <p><strong>Admin :</strong> admin@koula.gn / admin123</p>
                <p><strong>Super Admin :</strong> superadmin@koula.gn / superadmin123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-red-600 hover:text-red-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
