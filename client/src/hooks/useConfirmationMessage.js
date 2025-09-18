import { useState, useCallback } from 'react';

const useConfirmationMessage = () => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((type, text, duration = 4000) => {
    setMessage({
      type,
      message: text,
      duration,
      show: true
    });
  }, []);

  const showSuccess = useCallback((text, duration) => {
    showMessage('success', text, duration);
  }, [showMessage]);

  const showError = useCallback((text, duration) => {
    showMessage('error', text, duration);
  }, [showMessage]);

  const showWarning = useCallback((text, duration) => {
    showMessage('warning', text, duration);
  }, [showMessage]);

  const showInfo = useCallback((text, duration) => {
    showMessage('info', text, duration);
  }, [showMessage]);

  const hideMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideMessage
  };
};

export default useConfirmationMessage;
