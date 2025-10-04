import React, { useState } from 'react';
import { X, Mail, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import emailVerificationService from '../services/simpleEmailVerificationService';

const SimpleEmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  firstName, 
  lastName,
  onVerificationSuccess,
  onVerificationFailed 
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Veuillez saisir le code de vérification');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = emailVerificationService.verifyCode(email, code);
      
      if (result.success) {
        onVerificationSuccess && onVerificationSuccess();
        onClose();
      } else {
        setError(result.message);
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setError('Erreur lors de la vérification');
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
      await emailVerificationService.sendVerificationEmail(email, firstName, lastName);
      setError('');
    } catch (error) {
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    setAttempts(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vérification d'email</h2>
              <p className="text-sm text-gray-500">Confirmez votre adresse email</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Nous avons envoyé un code de vérification à <strong>{email}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Vérifiez votre boîte email et saisissez le code ci-dessous.
            </p>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de vérification (6 chiffres)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
              placeholder="123456"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

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
              Tentatives: {attempts}/{maxAttempts}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            
            <button
              onClick={handleResend}
              className="flex-1 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Renvoyer</span>
            </button>
            
            <button
              onClick={handleVerify}
              disabled={isLoading || !code.trim() || attempts >= maxAttempts}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Vérifier</span>
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {attempts >= maxAttempts && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Trop de tentatives. Veuillez renvoyer un nouveau code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailVerificationModal;
