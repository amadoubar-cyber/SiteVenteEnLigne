import { useState, useCallback } from 'react';

const useSuccessModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "Succès !",
    message: "",
    productName: null
  });

  const showSuccess = useCallback((title, message, productName = null) => {
    setModalData({
      title: title || "Succès !",
      message: message || "",
      productName
    });
    setIsOpen(true);
  }, []);

  const hideSuccess = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    modalData,
    showSuccess,
    hideSuccess
  };
};

export default useSuccessModal;
