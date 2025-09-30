import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

const ResetButton = ({ 
  onReset, 
  resetType = 'données', 
  confirmMessage = 'Êtes-vous sûr de vouloir réinitialiser toutes les données ?',
  className = '',
  variant = 'danger' // 'danger', 'warning', 'info'
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await onReset();
      setResetComplete(true);
      setTimeout(() => {
        setResetComplete(false);
        setShowConfirm(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'warning':
        return `${baseStyles} bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 border border-yellow-300`;
      case 'info':
        return `${baseStyles} bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500 border border-blue-300`;
      default:
        return `${baseStyles} bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500 border border-red-300`;
    }
  };

  const getIcon = () => {
    if (resetComplete) return <CheckCircle className="h-4 w-4 mr-2" />;
    if (isResetting) return <RotateCcw className="h-4 w-4 mr-2 animate-spin" />;
    return <RotateCcw className="h-4 w-4 mr-2" />;
  };

  const getText = () => {
    if (resetComplete) return 'Réinitialisé !';
    if (isResetting) return 'Réinitialisation...';
    return `Réinitialiser ${resetType}`;
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Confirmation</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {confirmMessage}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {getIcon()}
              {isResetting ? 'Réinitialisation...' : 'Oui, réinitialiser'}
            </button>
            
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isResetting}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={isResetting || resetComplete}
      className={`${getButtonStyles()} ${className} ${(isResetting || resetComplete) ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={`Réinitialiser toutes les ${resetType}`}
    >
      {getIcon()}
      {getText()}
    </button>
  );
};

export default ResetButton;
