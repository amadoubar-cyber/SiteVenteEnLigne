// Service d'envoi d'emails réels pour les clients
const REAL_EMAIL_SERVICE_URL = process.env.REACT_APP_EMAIL_SERVICE_URL || 'http://localhost:5000/api/email';

class RealEmailService {
  
  // Envoyer un email de vérification réel
  async sendVerificationEmail(email, firstName, lastName, verificationCode) {
    try {
      const emailData = {
        to: email,
        subject: '🔐 Vérification de votre compte Bowoye Multi Services',
        template: 'verification',
        data: {
          firstName,
          lastName,
          verificationCode,
          verificationLink: `${window.location.origin}/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`,
          companyName: 'Bowoye Multi Services',
          companyAddress: 'Labé, Guinée',
          companyPhone: '+224 626 99 13 18',
          companyEmail: 'amadoubowoye@gmail.com'
        }
      };

      const response = await fetch(`${REAL_EMAIL_SERVICE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email réel envoyé avec succès:', result);
        return {
          success: true,
          message: 'Email de vérification envoyé à votre adresse email',
          emailId: result.emailId
        };
      } else {
        throw new Error(`Erreur serveur email: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur envoi email réel:', error);
      
      // Fallback: afficher le code dans la console et une alerte
      console.log('════════════════════════════════════════════════════════════════');
      console.log('📧 EMAIL DE VÉRIFICATION (MODE FALLBACK)');
      console.log('════════════════════════════════════════════════════════════════');
      console.log(`📬 Destinataire: ${email}`);
      console.log(`👤 Nom: ${firstName} ${lastName}`);
      console.log(`🔑 CODE DE VÉRIFICATION: ${verificationCode}`);
      console.log(`🔗 Lien: ${window.location.origin}/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`);
      console.log('════════════════════════════════════════════════════════════════');
      
      alert(`📧 EMAIL DE VÉRIFICATION\n\nDestinataire: ${email}\nCode: ${verificationCode}\n\nNote: Service email temporairement indisponible. Utilisez ce code pour continuer.`);
      
      return {
        success: true,
        message: 'Code de vérification affiché (service email indisponible)',
        fallback: true
      };
    }
  }

  // Envoyer un email de récupération de mot de passe
  async sendPasswordResetEmail(email, firstName, resetCode) {
    try {
      const emailData = {
        to: email,
        subject: '🔒 Réinitialisation de votre mot de passe - Bowoye Multi Services',
        template: 'password-reset',
        data: {
          firstName,
          resetCode,
          resetLink: `${window.location.origin}/reset-password?code=${resetCode}&email=${encodeURIComponent(email)}`,
          companyName: 'Bowoye Multi Services',
          companyAddress: 'Labé, Guinée',
          companyPhone: '+224 626 99 13 18',
          companyEmail: 'amadoubowoye@gmail.com'
        }
      };

      const response = await fetch(`${REAL_EMAIL_SERVICE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Email de réinitialisation envoyé',
          emailId: result.emailId
        };
      } else {
        throw new Error(`Erreur serveur email: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur envoi email reset:', error);
      
      // Fallback
      alert(`📧 RÉINITIALISATION MOT DE PASSE\n\nDestinataire: ${email}\nCode: ${resetCode}\n\nNote: Service email temporairement indisponible.`);
      
      return {
        success: true,
        message: 'Code de réinitialisation affiché (service email indisponible)',
        fallback: true
      };
    }
  }

  // Envoyer un email de notification de commande
  async sendOrderNotificationEmail(email, firstName, orderData) {
    try {
      const emailData = {
        to: email,
        subject: `📦 Commande #${orderData.orderNumber} confirmée - Bowoye Multi Services`,
        template: 'order-confirmation',
        data: {
          firstName,
          orderData,
          companyName: 'Bowoye Multi Services',
          companyAddress: 'Labé, Guinée',
          companyPhone: '+224 626 99 13 18',
          companyEmail: 'amadoubowoye@gmail.com'
        }
      };

      const response = await fetch(`${REAL_EMAIL_SERVICE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Email de confirmation de commande envoyé',
          emailId: result.emailId
        };
      } else {
        throw new Error(`Erreur serveur email: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur envoi email commande:', error);
      
      return {
        success: false,
        message: 'Erreur envoi email de confirmation',
        error: error.message
      };
    }
  }
}

const realEmailService = new RealEmailService();
export default realEmailService;
