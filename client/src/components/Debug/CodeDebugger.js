import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';

const CodeDebugger = ({ email }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const loadVerifications = () => {
      try {
        const data = JSON.parse(localStorage.getItem('bowoye_email_verifications') || '[]');
        setVerifications(data);
      } catch (error) {
        console.error('Erreur chargement vérifications:', error);
      }
    };

    loadVerifications();
    const interval = setInterval(loadVerifications, 1000); // Vérifier toutes les secondes
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  const currentVerification = verifications.find(v => v.email === email);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
          title="Afficher le debug des codes"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 z-50 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">🔍 DEBUG CODES</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {currentVerification ? (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                {currentVerification.firstName} {currentVerification.lastName}
              </span>
              <span className="text-xs text-green-600">
                {new Date(currentVerification.createdAt).toLocaleTimeString('fr-FR')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Email:</span>
                <span className="text-xs text-green-900">{currentVerification.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Code:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-mono font-bold text-green-900">
                    {currentVerification.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(currentVerification.code)}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    {copied === currentVerification.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Tentatives:</span>
                <span className="text-xs text-green-900">
                  {currentVerification.attempts || 0} / {currentVerification.maxAttempts || 3}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Expire:</span>
                <span className="text-xs text-green-900">
                  {new Date(currentVerification.expiresAt).toLocaleString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Vérifié:</span>
                <span className="text-xs text-green-900">
                  {currentVerification.verified ? '✅ Oui' : '❌ Non'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Aucune vérification trouvée pour {email}
            </p>
          </div>
        )}

        {verifications.length > 0 && (
          <div className="bg-gray-50 p-2 rounded border border-gray-200">
            <p className="text-xs text-gray-700 font-medium mb-1">Toutes les vérifications:</p>
            {verifications.map((v, index) => (
              <div key={index} className="text-xs text-gray-600 flex justify-between">
                <span>{v.email}</span>
                <span className="font-mono">{v.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeDebugger;
