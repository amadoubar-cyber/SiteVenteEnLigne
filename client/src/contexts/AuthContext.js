import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, authOTPAPI } from '../services/api';
import { localAuthAPI } from '../services/localAuthAPI';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Essayer d'abord l'API locale
          const response = await localAuthAPI.getMe();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token
            }
          });
        } catch (error) {
          // Si l'API locale échoue, essayer l'API serveur
          try {
            const response = await authAPI.getMe();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.user,
                token
              }
            });
          } catch (serverError) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Session expirée' });
          }
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Essayer d'abord l'API locale
      const response = await localAuthAPI.login(email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      toast.success('Connexion réussie !');
      return { success: true };
    } catch (error) {
      // Si l'API locale échoue, essayer l'API serveur
      try {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });
        
        toast.success('Connexion réussie !');
        return { success: true };
      } catch (serverError) {
        const message = serverError.response?.data?.message || serverError.message || 'Erreur de connexion';
        dispatch({ type: 'AUTH_FAILURE', payload: message });
        toast.error(message);
        return { success: false, error: message };
      }
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Utiliser l'API OTP pour l'inscription avec vérification email
      const response = await authOTPAPI.register(userData);
      
      console.log('📡 Réponse API inscription:', response.data);
      
      if (response.data.success) {
        // L'inscription a réussi, mais le compte n'est pas encore vérifié
        // Ne pas connecter l'utilisateur - il doit d'abord vérifier son email
        dispatch({ type: 'AUTH_FAILURE', payload: null }); // Pas connecté
        toast.success(response.data.message || 'Un code de vérification a été envoyé sur votre email !');
        return { success: true, emailSent: true, email: response.data.email };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        toast.error(response.data.message || 'Erreur d\'inscription');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.log('❌ Erreur API inscription:', error.response?.data || error.message);
      const message = error.response?.data?.message || error.message || 'Erreur d\'inscription';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Nouvelle fonction pour vérifier l'email avec OTP
  const verifyEmail = async (email, otp) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authOTPAPI.verify(email, otp);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      toast.success('Email vérifié avec succès !');
      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erreur de vérification';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Nouvelle fonction pour renvoyer le code OTP
  const resendOTP = async (email) => {
    try {
      const response = await authOTPAPI.resendOTP(email);
      toast.success('Un nouveau code de vérification a été envoyé sur votre email !');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erreur lors du renvoi du code';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localAuthAPI.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Déconnexion réussie');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      });
      toast.success('Profil mis à jour avec succès');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de mise à jour';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Mot de passe modifié avec succès');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de changement de mot de passe';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout, 
    updateProfile,
    changePassword,
    clearError,
    verifyEmail,
    resendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
