// SERVICE EMAIL ULTRA-SIMPLE - PAS DE COMPLEXITÉ
class SimpleEmailService {
  constructor() {
    this.verifications = new Map();
  }

  // Générer un code simple
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Envoyer un email (simulation)
  async sendVerificationEmail(email, firstName, lastName) {
    const code = this.generateCode();
    
    // Stocker la vérification
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

    // Afficher le code dans la console pour test
    console.log(`📧 EMAIL SIMPLE ENVOYÉ À: ${email}`);
    console.log(`🔑 CODE DE VÉRIFICATION: ${code}`);
    console.log(`👤 NOM: ${firstName} ${lastName}`);
    console.log('═══════════════════════════════════════');

    return {
      success: true,
      message: `Code envoyé à ${email}`,
      code: code // Retourner le code pour test
    };
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
