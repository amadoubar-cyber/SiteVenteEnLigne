// SERVICE DE VÉRIFICATION EMAIL ULTRA-SIMPLE
import simpleEmailService from './simpleEmailService';

export const emailVerificationService = {
  // Envoyer un email de vérification
  sendVerificationEmail: async (email, firstName, lastName) => {
    try {
      const result = await simpleEmailService.sendVerificationEmail(email, firstName, lastName);
      return {
        success: true,
        message: 'Code de vérification envoyé ! Vérifiez votre email.',
        verificationCode: result.code
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de l\'envoi du code de vérification'
      };
    }
  },

  // Vérifier le code
  verifyCode: (email, code) => {
    return simpleEmailService.verifyCode(email, code);
  },

  // Obtenir le code pour debug
  getCode: (email) => {
    return simpleEmailService.getCode(email);
  },

  // Supprimer un compte en attente
  removePendingAccount: (email) => {
    // Simple - pas de localStorage complexe
    return true;
  }
};

export default emailVerificationService;
