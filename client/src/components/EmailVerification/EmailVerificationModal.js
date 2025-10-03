import React, { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import emailVerificationService from '../../services/emailVerificationService';

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  firstName, 
  lastName, 
  onVerificationSuccess,
  onVerificationFailed 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // info, success, error
  const [attempts, setAttempts] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Nettoyer les codes expirés
      emailVerificationService.cleanupExpiredCodes();
      
      // Initialiser le compte à rebours
      setTimeLeft(15 * 60); // 15 minutes
      setMessage('');
      setVerificationCode('');
      setAttempts(0);
      setCanResend(true);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setMessage('Veuillez saisir le code de vérification');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = emailVerificationService.verifyCode(email, verificationCode.trim());
      
      if (result.success) {
        setMessage('Email vérifié avec succès ! Votre compte est maintenant activé.');
        setMessageType('success');
        
        // Appeler le callback de succès après un délai
        setTimeout(() => {
          onVerificationSuccess(email);
          onClose();
        }, 2000);
      } else {
        setMessage(result.message);
        setMessageType('error');
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setMessage('Erreur lors de la vérification du code');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = await emailVerificationService.sendVerificationEmail(email, firstName, lastName);
      
      if (result.success) {
        setMessage('Nouveau code envoyé ! Vérifiez votre email.');
        setMessageType('success');
        setTimeLeft(15 * 60);
        setAttempts(0);
        setVerificationCode('');
        setCanResend(false);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erreur lors de l\'envoi du nouveau code');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onVerificationFailed) {
      onVerificationFailed();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Vérification d'email
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Message d'information */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Nous avons envoyé un code de vérification à <strong>{email}</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Vérifiez votre boîte email et saisissez le code ci-dessous.
            </p>
          </div>

          {/* Compte à rebours */}
          {timeLeft > 0 && (
            <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Code valide pendant: <strong>{formatTime(timeLeft)}</strong></span>
            </div>
          )}

          {/* Champ de saisie du code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de vérification (6 chiffres)
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
                setMessage(''); // Effacer le message d'erreur
              }}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-widest"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          {/* Message de retour */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : messageType === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : messageType === 'error' ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Tentatives */}
          {attempts > 0 && (
            <div className="mb-4 text-sm text-gray-600 text-center">
              Tentatives: {attempts}/3
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            
            <button
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Renvoyer</span>
            </button>
            
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Vérification...</span>
                </div>
              ) : (
                'Vérifier'
              )}
            </button>
          </div>

          {/* Note pour le développement */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Mode développement:</strong> Vérifiez la console pour voir le code de vérification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
