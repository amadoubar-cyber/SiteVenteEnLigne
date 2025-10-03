import React, { useState, useEffect } from 'react';
import { Mail, Copy, Check } from 'lucide-react';

const SimpleEmailDebug = () => {
  const [codes, setCodes] = useState([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // Vérifier toutes les 2 secondes les nouveaux codes
    const interval = setInterval(() => {
      try {
        const verifications = JSON.parse(localStorage.getItem('bowoye_email_verifications') || '[]');
        const pendingAccounts = JSON.parse(localStorage.getItem('bowoye_pending_accounts') || '[]');
        
        // Récupérer tous les codes de vérification
        const allCodes = verifications.map(v => ({
          email: v.email,
          code: v.code,
          firstName: v.firstName,
          lastName: v.lastName,
          expiresAt: v.expiresAt,
          timestamp: new Date().toLocaleTimeString('fr-FR')
        }));

        setCodes(allCodes);
      } catch (error) {
        console.error('Erreur lecture codes:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  if (codes.length === 0) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 z-50 max-w-sm">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">En attente de codes...</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          Remplissez le formulaire d'inscription pour voir le code ici
        </p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-green-500 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Mail className="h-5 w-5 text-green-600" />
        <h3 className="font-bold text-gray-900">📧 CODES DE VÉRIFICATION</h3>
      </div>

      <div className="space-y-3">
        {codes.map((item, index) => (
          <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                {item.firstName} {item.lastName}
              </span>
              <span className="text-xs text-green-600">{item.timestamp}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 mb-1">Email: {item.email}</p>
                <div className="text-xl font-mono font-bold text-green-900">
                  {item.code}
                </div>
              </div>
              
              <button
                onClick={() => copyCode(item.code)}
                className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                {copied === item.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied === item.code ? 'Copié!' : 'Copier'}</span>
              </button>
            </div>
            
            <p className="text-xs text-green-600 mt-1">
              Expire: {new Date(item.expiresAt).toLocaleString('fr-FR')}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 Ce panneau affiche automatiquement tous les codes générés
        </p>
      </div>
    </div>
  );
};

export default SimpleEmailDebug;
