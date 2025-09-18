import { useState } from 'react';

const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    type: 'danger',
    icon: null,
    details: [],
    onConfirm: null
  });

  const showConfirmation = ({
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger',
    icon = null,
    details = [],
    onConfirm
  }) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      icon,
      details,
      onConfirm
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    hideConfirmation();
  };

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
};

export default useConfirmation;
