// SERVICE EMAIL ULTRA-SIMPLE - PAS DE COMPLEXITÉ
class SimpleEmailService {
  constructor() {
    this.verifications = new Map();
  }

  // Générer un code simple
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Envoyer un email (essayer réel d'abord, puis console)
  async sendVerificationEmail(email, firstName, lastName) {
    const code = this.generateCode();
    
    // NETTOYER : Supprimer l'ancienne vérification
    this.verifications.delete(email);
    
    // Stocker la nouvelle vérification
    this.verifications.set(email, {
      code: code,
      email: email,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date().toISOString(),
      verified: false,
      attempts: 0,
      maxAttempts: 3
    });

    // Essayer d'envoyer un email réel
    try {
      const response = await fetch('http://localhost:5000/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Code de vérification - Bowoye Multi Services',
          template: 'verification',
          data: {
            firstName: firstName,
            lastName: lastName,
            verificationCode: code
          }
        })
      });

      if (response.ok) {
        console.log(`✅ EMAIL RÉEL ENVOYÉ À: ${email}`);
        console.log(`🔑 CODE: ${code}`);
        console.log(`👤 NOM: ${firstName} ${lastName}`);
        console.log('═══════════════════════════════════════');
        return {
          success: true,
          message: `Email envoyé à ${email} - Vérifiez votre boîte !`,
          code: code
        };
      } else {
        throw new Error('Erreur serveur email');
      }
    } catch (error) {
      console.warn('⚠️ Email réel échoué, affichage console:', error.message);
      
      // Fallback : afficher dans la console
      console.log(`📧 EMAIL SIMPLE ENVOYÉ À: ${email}`);
      console.log(`🔑 CODE DE VÉRIFICATION: ${code}`);
      console.log(`👤 NOM: ${firstName} ${lastName}`);
      console.log('═══════════════════════════════════════');

      return {
        success: true,
        message: `Code envoyé à ${email} (mode console)`,
        code: code
      };
    }
  }

  // Vérifier le code
  verifyCode(email, inputCode) {
    const verification = this.verifications.get(email);
    
    if (!verification) {
      return {
        success: false,
        message: 'Aucune vérification trouvée'
      };
    }

    if (verification.attempts >= verification.maxAttempts) {
      return {
        success: false,
        message: 'Trop de tentatives'
      };
    }

    // Comparaison simple
    if (verification.code === inputCode.toString()) {
      verification.verified = true;
      return {
        success: true,
        message: 'Code correct !'
      };
    } else {
      verification.attempts += 1;
      return {
        success: false,
        message: `Code incorrect. ${verification.maxAttempts - verification.attempts} tentatives restantes.`
      };
    }
  }

  // Obtenir le code pour debug
  getCode(email) {
    const verification = this.verifications.get(email);
    return verification ? verification.code : null;
  }

  // Vérifier si un email est déjà vérifié
  isEmailVerified(email) {
    const verification = this.verifications.get(email);
    return verification ? verification.verified : false;
  }
}

export default new SimpleEmailService();
