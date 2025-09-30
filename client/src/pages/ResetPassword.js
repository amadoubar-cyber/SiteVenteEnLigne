import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la validité du token
    if (!token) {
      setTokenValid(false);
      setError('Token de réinitialisation invalide ou manquant');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.password) {
      newErrors.push('Le mot de passe est requis');
    } else if (formData.password.length < 6) {
      newErrors.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (!formData.confirmPassword) {
      newErrors.push('La confirmation du mot de passe est requise');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push('Les mots de passe ne correspondent pas');
    }

    if (newErrors.length > 0) {
      setError(newErrors[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Simulation de réinitialisation (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lien invalide
            </h2>
            
            <p className="text-gray-600 mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Demander un nouveau lien
              </Link>
              
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Mot de passe réinitialisé !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h1>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-600">
              Créez un nouveau mot de passe sécurisé pour votre compte.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {error && (
              <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-gray-300 focus:ring-orange-500"
                  placeholder="Votre nouveau mot de passe"
                  required
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
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-gray-300 focus:ring-orange-500"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Conseils de sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Conseils pour un mot de passe sécurisé :</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Utilisez au moins 6 caractères</li>
                <li>• Combinez lettres, chiffres et symboles</li>
                <li>• Évitez les informations personnelles</li>
                <li>• Ne réutilisez pas d'anciens mots de passe</li>
              </ul>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Loader>
                    Réinitialisation...
                  </div>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </div>
          </form>

          {/* Liens */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
