import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Fonction utilitaire pour gérer le localStorage de manière sécurisée
const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Erreur lors de la lecture de ${key} depuis localStorage:`, error);
    // Nettoyer les données corrompues
    try {
      localStorage.removeItem(key);
    } catch (removeError) {
      console.error(`Impossible de supprimer ${key} du localStorage:`, removeError);
    }
    return defaultValue;
  }
};

const setLocalStorageItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    // Vérifier la taille avant d'écrire
    if (serializedValue.length > 1024 * 1024) { // 1MB limite
      console.warn(`Les données ${key} sont trop volumineuses (${serializedValue.length} bytes). Nettoyage...`);
      localStorage.removeItem(key);
      toast.error('Panier trop volumineux, nettoyage automatique effectué');
      return false;
    }
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'écriture de ${key} dans localStorage:`, error);
    if (error.name === 'QuotaExceededError') {
      // Nettoyer le localStorage en cas de quota dépassé
      try {
        localStorage.clear();
        toast.error('Espace de stockage insuffisant, nettoyage effectué');
      } catch (clearError) {
        console.error('Impossible de vider le localStorage:', clearError);
      }
    }
    return false;
  }
};

const initialState = {
  items: getLocalStorageItem('cartItems', []),
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product._id === action.payload.product._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };
    
    case 'CALCULATE_TOTALS':
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      return {
        ...state,
        totalItems,
        totalPrice
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculer les totaux à chaque changement
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items]);

  // Sauvegarder dans localStorage de manière sécurisée
  useEffect(() => {
    setLocalStorageItem('cartItems', state.items);
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    // Vérifier le stock
    if (product.stock < quantity) {
      toast.error(`Stock insuffisant. Disponible: ${product.stock}`);
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity }
    });
    
    toast.success(`${product.name} ajouté au panier`);
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
    
    toast.success('Produit retiré du panier');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Vérifier le stock
    const item = state.items.find(item => item.product._id === productId);
    if (item && item.product.stock < quantity) {
      toast.error(`Stock insuffisant. Disponible: ${item.product.stock}`);
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Panier vidé');
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
