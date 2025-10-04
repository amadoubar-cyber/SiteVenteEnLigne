const nodemailer = require('nodemailer');

class ProfessionalEmailService {
  constructor() {
    // Configuration Nodemailer selon votre méthode
    this.transporter = nodemailer.createTransporter({
      service: "gmail", // Gmail service
      auth: {
        user: "amadoubarkere4@gmail.com", // Votre email configuré
        pass: "atlz bogk zajd uglz" // ✅ MOT DE PASSE D'APPLICATION GMAIL CONFIGURÉ
      }
    });
  }

  // Fonction pour générer un code OTP selon votre méthode
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6 chiffres
  }

  // Envoyer un email de vérification selon votre méthode
  async sendVerificationEmail(email, firstName, lastName, otp) {
    try {
      const mailOptions = {
        from: "amadoubarkere4@gmail.com",
        to: email,
        subject: "Vérification de votre compte - Bowoye Multi Services",
        html: this.getProfessionalEmailTemplate(firstName, lastName, otp)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de vérification envoyé:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw error;
    }
  }

  // Template HTML professionnel
  getProfessionalEmailTemplate(firstName, lastName, otp) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification de compte - Bowoye Multi Services</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: #FF6B35; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
            .code-container { background: #f8f9fa; border: 2px dashed #FF6B35; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }
            .verification-code { font-size: 36px; font-weight: bold; color: #FF6B35; letter-spacing: 8px; margin: 15px 0; font-family: 'Courier New', monospace; }
            .instructions { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 30px 0; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; }
            .security-note { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🏢 Bowoye Multi Services</h1>
                <p>Vérification de votre compte</p>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${firstName} ${lastName},</div>
                
                <p>Bienvenue sur <strong>Bowoye Multi Services</strong> ! Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
                
                <div class="code-container">
                    <div class="verification-code">${otp}</div>
                    <p><small>Ce code expire dans 10 minutes</small></p>
                </div>
                
                <div class="instructions">
                    <h3>📋 Comment procéder :</h3>
                    <ol>
                        <li>Retournez sur la page de vérification</li>
                        <li>Saisissez le code ci-dessus</li>
                        <li>Cliquez sur "Vérifier"</li>
                    </ol>
                </div>
                
                <div class="security-note">
                    <p><strong>🔒 Sécurité :</strong> Ne partagez jamais ce code avec qui que ce soit.</p>
                </div>
            </div>
            
            <div class="footer">
                <h3>🏢 Bowoye Multi Services</h3>
                <p><strong>📍 Adresse :</strong> Labé, République de Guinée</p>
                <p><strong>📞 Téléphone :</strong> +224 626 99 13 18</p>
                <p><strong>✉️ Email :</strong> amadoubarkere4@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new ProfessionalEmailService();
