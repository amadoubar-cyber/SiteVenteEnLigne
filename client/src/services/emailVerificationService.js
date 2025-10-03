// Service de vérification d'email pour la création de comptes
import emailLinkService from './emailLinkService';
import realEmailService from './realEmailService';

const EMAIL_VERIFICATION_KEY = 'bowoye_email_verifications';
const PENDING_ACCOUNTS_KEY = 'bowoye_pending_accounts';

export const emailVerificationService = {
  // Générer un code de vérification
  generateVerificationCode: () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres
  },

  // Envoyer un email de vérification avec lien
  sendVerificationEmail: async (email, firstName, lastName) => {
    try {
      const verificationCode = emailVerificationService.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Sauvegarder la demande de vérification
      const verifications = JSON.parse(localStorage.getItem(EMAIL_VERIFICATION_KEY) || '[]');
      verifications.push({
        email,
        code: verificationCode,
        firstName,
        lastName,
        expiresAt: expiresAt.toISOString(),
        attempts: 0,
        maxAttempts: 3
      });
      localStorage.setItem(EMAIL_VERIFICATION_KEY, JSON.stringify(verifications));

      // Essayer d'abord le service email réel, puis fallback vers le service local
      let result;
      try {
        result = await realEmailService.sendVerificationEmail(email, firstName, lastName, verificationCode);
        console.log('✅ Service email réel utilisé');
      } catch (error) {
        console.warn('⚠️ Service email réel indisponible, utilisation du fallback local');
        result = await emailLinkService.sendVerificationEmail(email, firstName, lastName, verificationCode);
      }
      
      if (result.success) {
        console.log('════════════════════════════════════════════════════════════════');
        console.log('📧 EMAIL DE VÉRIFICATION ENVOYÉ');
        console.log('════════════════════════════════════════════════════════════════');
        console.log(`📬 Destinataire: ${email}`);
        console.log(`👤 Nom: ${firstName} ${lastName}`);
        console.log(`🔑 CODE DE VÉRIFICATION: ${verificationCode}`);
        console.log(`🔗 Lien de vérification: ${result.link}`);
        console.log(`⏰ Code valide pendant 15 minutes`);
        console.log(`📅 Expire le: ${new Date(expiresAt).toLocaleString('fr-FR')}`);
        console.log('════════════════════════════════════════════════════════════════');
        
        // Mode développement seulement - pas d'alerte en production
        if (process.env.NODE_ENV === 'development') {
          alert(`📧 EMAIL ENVOYÉ!\n\nCode de vérification: ${verificationCode}\n\nVérifiez la console pour plus de détails.`);
        }
      }

      return {
        success: true,
        message: 'Email de vérification envoyé avec lien de vérification',
        expiresIn: 15 * 60, // 15 minutes en secondes
        link: result.link
      };
    } catch (error) {
      console.error('Erreur envoi email vérification:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de vérification'
      };
    }
  },

  // Vérifier le code de vérification
  verifyCode: (email, code) => {
    try {
      const verifications = JSON.parse(localStorage.getItem(EMAIL_VERIFICATION_KEY) || '[]');
      const verification = verifications.find(v => v.email === email);

      if (!verification) {
        return {
          success: false,
          message: 'Aucune demande de vérification trouvée pour cet email'
        };
      }

      // Vérifier si le code a expiré
      if (new Date() > new Date(verification.expiresAt)) {
        return {
          success: false,
          message: 'Le code de vérification a expiré. Veuillez en demander un nouveau.'
        };
      }

      // Vérifier le nombre de tentatives
      if (verification.attempts >= verification.maxAttempts) {
        return {
          success: false,
          message: 'Trop de tentatives incorrectes. Veuillez en demander un nouveau code.'
        };
      }

      // Vérifier le code
      if (verification.code !== code) {
        verification.attempts += 1;
        localStorage.setItem(EMAIL_VERIFICATION_KEY, JSON.stringify(verifications));
        
        return {
          success: false,
          message: `Code incorrect. ${verification.maxAttempts - verification.attempts} tentatives restantes.`
        };
      }

      // Code correct - marquer comme vérifié
      verification.verified = true;
      verification.verifiedAt = new Date().toISOString();
      localStorage.setItem(EMAIL_VERIFICATION_KEY, JSON.stringify(verifications));

      return {
        success: true,
        message: 'Email vérifié avec succès'
      };
    } catch (error) {
      console.error('Erreur vérification code:', error);
      return {
        success: false,
        message: 'Erreur lors de la vérification du code'
      };
    }
  },

  // Vérifier si un email est déjà vérifié
  isEmailVerified: (email) => {
    try {
      const verifications = JSON.parse(localStorage.getItem(EMAIL_VERIFICATION_KEY) || '[]');
      const verification = verifications.find(v => v.email === email);
      return verification && verification.verified === true;
    } catch (error) {
      return false;
    }
  },

  // Nettoyer les codes expirés
  cleanupExpiredCodes: () => {
    try {
      const verifications = JSON.parse(localStorage.getItem(EMAIL_VERIFICATION_KEY) || '[]');
      const now = new Date();
      const validVerifications = verifications.filter(v => new Date(v.expiresAt) > now);
      localStorage.setItem(EMAIL_VERIFICATION_KEY, JSON.stringify(validVerifications));
    } catch (error) {
      console.error('Erreur nettoyage codes expirés:', error);
    }
  },

  // Sauvegarder un compte en attente de vérification
  savePendingAccount: (accountData) => {
    try {
      const pendingAccounts = JSON.parse(localStorage.getItem(PENDING_ACCOUNTS_KEY) || '[]');
      pendingAccounts.push({
        ...accountData,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(PENDING_ACCOUNTS_KEY, JSON.stringify(pendingAccounts));
      return { success: true };
    } catch (error) {
      console.error('Erreur sauvegarde compte en attente:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer un compte en attente
  getPendingAccount: (email) => {
    try {
      const pendingAccounts = JSON.parse(localStorage.getItem(PENDING_ACCOUNTS_KEY) || '[]');
      return pendingAccounts.find(account => account.email === email);
    } catch (error) {
      console.error('Erreur récupération compte en attente:', error);
      return null;
    }
  },

  // Supprimer un compte en attente après vérification
  removePendingAccount: (email) => {
    try {
      const pendingAccounts = JSON.parse(localStorage.getItem(PENDING_ACCOUNTS_KEY) || '[]');
      const filteredAccounts = pendingAccounts.filter(account => account.email !== email);
      localStorage.setItem(PENDING_ACCOUNTS_KEY, JSON.stringify(filteredAccounts));
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression compte en attente:', error);
      return { success: false, error: error.message };
    }
  }
};

export default emailVerificationService;
