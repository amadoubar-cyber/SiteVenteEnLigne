import React, { useState } from 'react';
import { DollarSign, RotateCcw, Edit3, AlertTriangle, CheckCircle } from 'lucide-react';

const RevenueManager = ({ currentRevenue, onRevenueUpdate, onClose }) => {
  const [newRevenue, setNewRevenue] = useState(currentRevenue || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAdjustConfirm, setShowAdjustConfirm] = useState(false);

  const handleResetRevenue = () => {
    // Réinitialiser le chiffre d'affaires en supprimant toutes les commandes
    const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    
    // Option 1: Supprimer toutes les commandes (réinitialisation complète)
    localStorage.removeItem('clientOrders');
    
    // Option 2: Marquer les commandes comme "exclues du CA" (conservation des données)
    const updatedOrders = orders.map(order => ({
      ...order,
      excludedFromRevenue: true,
      excludedAt: new Date().toISOString(),
      excludedBy: 'admin'
    }));
    localStorage.setItem('clientOrders', JSON.stringify(updatedOrders));
    
    // Mettre à jour le chiffre d'affaires
    onRevenueUpdate(0);
    setNewRevenue(0);
    setShowResetConfirm(false);
    
    // Afficher une notification de succès
    alert('✅ Chiffre d\'affaires réinitialisé avec succès !');
  };

  const handleAdjustRevenue = () => {
    const adjustedValue = parseFloat(newRevenue) || 0;
    onRevenueUpdate(adjustedValue);
    setIsEditing(false);
    setShowAdjustConfirm(false);
    
    // Sauvegarder le chiffre d'affaires ajusté
    localStorage.setItem('adminAdjustedRevenue', adjustedValue.toString());
    
    alert('✅ Chiffre d\'affaires ajusté avec succès !');
  };

  const handleCancelEdit = () => {
    setNewRevenue(currentRevenue || 0);
    setIsEditing(false);
    setShowAdjustConfirm(false);
  };

  const formatRevenue = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Gestion du Chiffre d'Affaires
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Chiffre d'affaires actuel */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Chiffre d'affaires actuel :</p>
            <p className="text-2xl font-bold text-green-600">
              {formatRevenue(currentRevenue || 0)}
            </p>
          </div>

          {/* Options de gestion */}
          <div className="space-y-4">
            {/* Réinitialisation */}
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <RotateCcw className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-gray-900">Réinitialisation</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Remet le chiffre d'affaires à zéro en excluant toutes les commandes du calcul.
              </p>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Réinitialiser à Zéro
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-800 font-medium">
                        Confirmation requise
                      </p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Cette action va exclure toutes les commandes du calcul du chiffre d'affaires.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResetRevenue}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ajustement manuel */}
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Ajustement Manuel</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Définir manuellement le chiffre d'affaires.
              </p>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ajuster le Chiffre d'Affaires
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau chiffre d'affaires (FCFA)
                    </label>
                    <input
                      type="number"
                      value={newRevenue}
                      onChange={(e) => setNewRevenue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Entrez le montant"
                    />
                  </div>
                  
                  {!showAdjustConfirm ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAdjustConfirm(true)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Appliquer
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <p className="text-sm text-blue-800 font-medium">
                            Confirmer l'ajustement
                          </p>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Nouveau chiffre d'affaires : {formatRevenue(newRevenue)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAdjustRevenue}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setShowAdjustConfirm(false)}
                          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">
                Information importante
              </p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Les commandes existantes sont conservées mais exclues du calcul du chiffre d'affaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManager;
