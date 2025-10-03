import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import emailLinkService from '../services/emailLinkService';
import emailVerificationService from '../services/emailVerificationService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide ou manquant');
      return;
    }

    // Décoder le lien de vérification
    const result = emailLinkService.decodeVerificationLink(token);
    
    if (!result.success) {
      setStatus('error');
      setMessage(result.error);
      return;
    }

    if (result.expired) {
      setStatus('expired');
      setMessage('Ce lien de vérification a expiré. Veuillez en demander un nouveau.');
      return;
    }

    setUserData(result.data);
    setStatus('success');
    setMessage(`Email vérifié avec succès ! Bienvenue ${result.data.firstName} ${result.data.lastName}`);
  }, [searchParams]);

  const handleCompleteVerification = async () => {
    if (!userData) return;
    
    setIsProcessing(true);
    
    try {
      // Vérifier le code dans le système
      const verificationResult = emailVerificationService.verifyCode(userData.email, userData.code);
      
      if (verificationResult.success) {
        // Rediriger vers la page de connexion avec un message de succès
        navigate('/login?verified=true&email=' + encodeURIComponent(userData.email));
      } else {
        setStatus('error');
        setMessage('Code de vérification invalide ou expiré');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur lors de la vérification');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendEmail = async () => {
    if (!userData) return;
    
    setIsProcessing(true);
    
    try {
      const result = await emailVerificationService.sendVerificationEmail(
        userData.email,
        userData.firstName,
        userData.lastName
      );
      
      if (result.success) {
        setMessage('Nouveau code de vérification envoyé !');
      } else {
        setMessage('Erreur lors de l\'envoi du nouveau code');
      }
    } catch (error) {
      setMessage('Erreur lors de l\'envoi du nouveau code');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'success' ? 'Email Vérifié !' : 
             status === 'expired' ? 'Lien Expiré' : 'Erreur de Vérification'}
          </h2>
          
          <div className={`mt-4 p-4 rounded-lg border ${getStatusColor()}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>

        {status === 'success' && userData && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations du compte
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Nom :</strong> {userData.firstName} {userData.lastName}</p>
                <p><strong>Email :</strong> {userData.email}</p>
                <p><strong>Code utilisé :</strong> {userData.code}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCompleteVerification}
                disabled={isProcessing}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Finalisation...
                  </>
                ) : (
                  <>
                    Finaliser la vérification
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aller à la connexion
              </button>
            </div>
          </div>
        )}

        {(status === 'error' || status === 'expired') && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/register')}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer un nouveau compte
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aller à la connexion
            </button>

            {status === 'expired' && (
              <button
                onClick={handleResendEmail}
                disabled={isProcessing}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Demander un nouveau code'
                )}
              </button>
            )}
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Bowoye Multi Services - Votre partenaire de confiance
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
