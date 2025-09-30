import React from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

const UserConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning',
  confirmText = 'Confirmer',
  cancelText = 'Annuler'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
            {getIcon()}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            {message}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConfirmationModal;
