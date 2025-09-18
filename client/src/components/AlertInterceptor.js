import React, { useEffect } from 'react';
import useConfirmationMessage from '../hooks/useConfirmationMessage';
import ConfirmationMessage from './ConfirmationMessage';

const AlertInterceptor = ({ children }) => {
  const { message, showError, showWarning, showSuccess, hideMessage } = useConfirmationMessage();

  useEffect(() => {
    // Intercepter les alertes natives
    const originalAlert = window.alert;
    window.alert = (message) => {
      // Détecter le type de message et utiliser notre système
      if (message.includes('succès') || message.includes('créé avec succès')) {
        showSuccess(message);
      } else if (message.includes('erreur') || message.includes('Erreur')) {
        showError(message);
      } else if (message.includes('attention') || message.includes('Attention')) {
        showWarning(message);
      } else {
        showWarning(message);
      }
    };

    // Intercepter les confirmations natives
    const originalConfirm = window.confirm;
    window.confirm = (message) => {
      // Pour les confirmations, on peut soit les laisser passer soit les remplacer
      // Ici on les laisse passer pour l'instant
      return originalConfirm(message);
    };

    // Nettoyage
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    };
  }, [showError, showWarning, showSuccess]);

  return (
    <>
      {children}
      {/* Message de confirmation global */}
      {message && (
        <ConfirmationMessage
          type={message.type}
          message={message.message}
          duration={message.duration}
          onClose={hideMessage}
          show={message.show}
        />
      )}
    </>
  );
};

export default AlertInterceptor;
