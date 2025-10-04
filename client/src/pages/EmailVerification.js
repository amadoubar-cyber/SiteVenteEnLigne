import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailVerification = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { verifyEmail, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer les données depuis localStorage ou location.state
  const userData = location.state || JSON.parse(localStorage.getItem('pendingRegistration')) || {};
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Veuillez saisir le code de vérification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyEmail(userData.email, code);
      if (result.success) {
        // Supprimer les données temporaires
        localStorage.removeItem('pendingRegistration');
        // Afficher un message de succès
        setError('');
        setSuccess(true);
        // Rediriger vers la page d'accueil après vérification réussie
        setTimeout(() => {
          navigate('/');
        }, 2000); // 2 secondes de délai pour voir le message de succès
      } else {
        setError(result.error || 'Code de vérification incorrect');
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setError('Code de vérification incorrect');
      setAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    setAttempts(0);
    
    try {
      await resendOTP(userData.email);
      setError('');
    } catch (error) {
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas de données utilisateur, rediriger vers l'inscription
  useEffect(() => {
    if (!userData.email) {
      navigate('/register');
    }
  }, [userData.email, navigate]);

  if (!userData.email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vérification d'email
          </h1>
          <p className="text-gray-600">
            Nous avons envoyé un code de vérification à{' '}
            <strong className="text-blue-600">{userData.email}</strong>
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="space-y-4">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification (6 chiffres)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
                placeholder="123456"
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">Email vérifié avec succès ! Redirection en cours...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Attempts Info */}
            {attempts > 0 && (
              <div className="text-sm text-gray-600">
                Tentatives: {attempts}/3
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !code.trim() || attempts >= 3 || success}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Vérifier le code</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full flex justify-center py-3 px-4 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Renvoyer le code</span>
              </div>
            </button>

            <Link
              to="/register"
              className="w-full flex justify-center items-center space-x-2 py-2 px-4 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'inscription</span>
            </Link>
          </div>
        </form>

        {/* Success Message */}
        {attempts >= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Trop de tentatives. Veuillez renvoyer un nouveau code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
