import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Copy, Check } from 'lucide-react';

const EmailDebug = ({ email, firstName, lastName }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Charger le code depuis localStorage
    loadVerificationCode();
  }, [email]);

  const loadVerificationCode = () => {
    try {
      const verifications = JSON.parse(localStorage.getItem('bowoye_email_verifications') || '[]');
      const latestVerification = verifications.find(v => v.email === email);
      
      if (latestVerification) {
        setVerificationCode(latestVerification.code);
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Erreur chargement code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  if (!emailSent || !verificationCode || isHidden) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 max-w-xs opacity-90 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Code de Vérification</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showDebug ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsHidden(true)}
            className="text-gray-400 hover:text-red-600 text-xs"
            title="Masquer (mode production)"
          >
            ✕
          </button>
        </div>
      </div>

      {showDebug && (
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Destinataire:</strong> {email}
            </p>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Nom:</strong> {firstName} {lastName}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800 mb-1">Code de vérification:</p>
                <div className="text-2xl font-mono font-bold text-blue-900 tracking-wider">
                  {verificationCode}
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copié!' : 'Copier'}</span>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Mode développement:</strong> Ce code est affiché uniquement pour les tests.
            </p>
          </div>

          <button
            onClick={loadVerificationCode}
            className="w-full text-sm text-blue-600 hover:text-blue-800"
          >
            🔄 Actualiser le code
          </button>
        </div>
      )}

      {!showDebug && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Code disponible</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Actif</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDebug;
