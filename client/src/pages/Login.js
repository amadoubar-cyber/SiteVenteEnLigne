import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Shield, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [adminErrors, setAdminErrors] = useState({});
  const [showAdminForm, setShowAdminForm] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();
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
    if (showAdmin) {
      setShowAdminForm(true);
    }
  }, [showAdmin]);

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

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (adminErrors[name]) {
      setAdminErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateAdminForm = () => {
    const newErrors = {};

    if (!adminFormData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(adminFormData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!adminFormData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setAdminErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!validateAdminForm()) {
      return;
    }

    // Vérifier les identifiants admin
    const validAdminCredentials = [
      { email: 'admin@koula.gn', password: 'admin123' },
      { email: 'admin@example.com', password: 'admin123' }
    ];

    const isValidAdmin = validAdminCredentials.some(
      cred => cred.email === adminFormData.email && cred.password === adminFormData.password
    );

    if (isValidAdmin) {
      const adminUser = {
        firstName: 'Admin',
        lastName: 'Bowoye Multi Services',
        email: adminFormData.email,
        role: 'admin'
      };
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      navigate('/admin-simple-complete');
    } else {
      setAdminErrors({ 
        general: 'Identifiants administrateur incorrects' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Connexion à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">
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
                  className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
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
                  className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
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

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          {/* Admin Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Ou</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Shield className="h-4 w-4 mr-2" />
                {showAdminForm ? 'Masquer' : 'Connexion Administrateur'}
              </button>
            </div>

            {/* Admin Login Form */}
            {showAdminForm && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Accès Administrateur
                </h3>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {adminErrors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {adminErrors.general}
                    </div>
                  )}

                  <div>
                    <label htmlFor="admin-email" className="block text-sm font-medium text-red-700 mb-1">
                      Email Administrateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-red-400" />
                      </div>
                      <input
                        id="admin-email"
                        name="email"
                        type="email"
                        value={adminFormData.email}
                        onChange={handleAdminChange}
                        className={`w-full pl-10 pr-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${adminErrors.email ? 'border-red-500' : ''}`}
                        placeholder="admin@koula.gn"
                      />
                    </div>
                    {adminErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{adminErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-red-700 mb-1">
                      Mot de passe Administrateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-red-400" />
                      </div>
                      <input
                        id="admin-password"
                        name="password"
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminFormData.password}
                        onChange={handleAdminChange}
                        className={`w-full pl-10 pr-10 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${adminErrors.password ? 'border-red-500' : ''}`}
                        placeholder="Votre mot de passe admin"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="h-5 w-5 text-red-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-red-400" />
                        )}
                      </button>
                    </div>
                    {adminErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{adminErrors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Se connecter en tant qu'Admin
                  </button>
                </form>

                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <h4 className="text-sm font-medium text-red-900 mb-2">
                    Identifiants de test :
                  </h4>
                  <div className="text-xs text-red-700 space-y-1">
                    <p><strong>Email :</strong> admin@koula.gn</p>
                    <p><strong>Mot de passe :</strong> admin123</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Comptes de démonstration :
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Client :</strong> client@koula.gn / password123</p>
              <p><strong>Admin :</strong> admin@koula.gn / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
