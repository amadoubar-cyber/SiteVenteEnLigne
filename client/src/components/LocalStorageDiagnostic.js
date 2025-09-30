import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LocalStorageDiagnostic = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  const checkStorage = () => {
    try {
      let totalSize = 0;
      const items = {};
      
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = localStorage[key].length;
          totalSize += size;
          items[key] = {
            size: size,
            sizeKB: (size / 1024).toFixed(2) + ' KB',
            data: localStorage[key].substring(0, 100) + (localStorage[key].length > 100 ? '...' : '')
          };
        }
      }
      
      setStorageInfo({
        totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        items,
        isOverLimit: totalSize > 1024 * 1024 // 1MB
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du localStorage:', error);
      toast.error('Erreur lors de la vérification du stockage');
    }
  };

  const clearStorage = async () => {
    setIsClearing(true);
    try {
      // Sauvegarder les données importantes
      const authToken = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      // Nettoyer tout
      localStorage.clear();
      
      // Restaurer les données importantes
      if (authToken) localStorage.setItem('authToken', authToken);
      if (user) localStorage.setItem('user', user);
      
      toast.success('localStorage nettoyé avec succès');
      checkStorage(); // Re-vérifier
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      toast.error('Erreur lors du nettoyage');
    } finally {
      setIsClearing(false);
    }
  };

  const clearCartOnly = () => {
    try {
      localStorage.removeItem('cartItems');
      toast.success('Panier nettoyé');
      checkStorage();
    } catch (error) {
      console.error('Erreur lors du nettoyage du panier:', error);
      toast.error('Erreur lors du nettoyage du panier');
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  if (!storageInfo) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>Vérification du localStorage en cours...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {storageInfo.isOverLimit ? (
            <AlertTriangle className="text-red-500" />
          ) : (
            <CheckCircle className="text-green-500" />
          )}
          Diagnostic du localStorage
        </h2>
        <button
          onClick={checkStorage}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Statut général */}
      <div className={`p-4 rounded-lg mb-6 ${
        storageInfo.isOverLimit 
          ? 'bg-red-50 border border-red-200' 
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {storageInfo.isOverLimit ? '⚠️ Stockage surchargé' : '✅ Stockage normal'}
            </h3>
            <p className="text-gray-600">
              Taille totale: <strong>{storageInfo.totalSizeKB} KB</strong>
              {storageInfo.isOverLimit && (
                <span className="text-red-600 ml-2">(Limite recommandée: 1MB)</span>
              )}
            </p>
          </div>
          {storageInfo.isOverLimit && (
            <div className="flex gap-2">
              <button
                onClick={clearCartOnly}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Nettoyer le panier
              </button>
              <button
                onClick={clearStorage}
                disabled={isClearing}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isClearing ? 'Nettoyage...' : 'Nettoyer tout'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Détail des éléments */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Éléments stockés</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Clé</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Taille</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Aperçu</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(storageInfo.items).map(([key, info]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                    {key}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info.sizeKB}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                    {info.data}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem(key);
                        toast.success(`${key} supprimé`);
                        checkStorage();
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-4">
        <button
          onClick={clearCartOnly}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Nettoyer le panier seulement
        </button>
        <button
          onClick={clearStorage}
          disabled={isClearing}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isClearing ? 'Nettoyage...' : 'Nettoyer tout le localStorage'}
        </button>
      </div>
    </div>
  );
};

export default LocalStorageDiagnostic;
