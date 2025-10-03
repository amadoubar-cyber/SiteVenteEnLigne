import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Building2, Zap } from 'lucide-react';
import { validateLogin } from '../utils/authValidation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('client'); // Toujours en mode client
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const urlParams = new URLSearchParams(location.search);
  const showAdmin = urlParams.get('admin') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Toujours en mode client avec identifiants par défaut
    setFormData({
      email: 'client@bowoye.gn',
      password: 'password123'
    });
  }, []);

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
    const validation = validateLogin(formData.email, formData.password);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Vérifier d'abord si c'est un admin
    const validAdminCredentials = [
             { email: 'amadoubowoye@gmail.com', password: 'admin123' },
      { email: 'admin@koula.gn', password: 'admin123' },
             { email: 'superadmin@koula.gn', password: 'superadmin123' }
    ];

    const isValidAdmin = validAdminCredentials.some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (isValidAdmin) {
      // Connexion admin
      const adminUser = {
        firstName: 'Admin',
        lastName: 'Bowoye Multi Services',
        email: formData.email,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      navigate('/admin-simple-complete');
    } else {
      // Connexion client normale
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex">
      {/* Côté gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold text-2xl">B</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bowoye Multi Services</h1>
              <p className="text-blue-200">Votre plateforme e-commerce</p>
          </div>
        </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Connectez-vous à votre compte
        </h2>
          
          <p className="text-xl text-blue-100 mb-8">
            Gérez vos commandes, suivez vos achats et accédez à tous nos services en un seul endroit.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-400" />
              <span>Commandes rapides et sécurisées</span>
            </div>
            <div className="flex items-center">
              <User className="h-6 w-6 mr-3 text-yellow-400" />
              <span>Support client 24/7</span>
            </div>
            <div className="flex items-center">
              <Building2 className="h-6 w-6 mr-3 text-yellow-400" />
              <span>Matériaux de construction et électronique</span>
            </div>
          </div>
        </div>
      </div>

      {/* Côté droit - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connexion à votre compte
          </h2>
          <p className="text-gray-600 mb-8">
            Accédez à votre compte et gérez vos commandes
          </p>

          {/* Formulaire de connexion */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur général */}
            {errors.general && (
              <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {errors.general}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-gray-300 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-gray-300 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

                   {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                         className="h-4 w-4 focus:ring-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                       <Link
                         to="/forgot-password"
                         className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                       >
                  Mot de passe oublié ?
                       </Link>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Se connecter
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Liens utiles */}
          <div className="mt-8">
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 underline block"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
