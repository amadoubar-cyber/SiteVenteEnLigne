const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

class EmailService {
  constructor() {
    // Configuration Gmail simple et directe
    // ⚠️ IMPORTANT: Le mot de passe doit être dans les variables d'environnement !
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'amadoubarkere4@gmail.com',
        pass: process.env.EMAIL_PASSWORD // UTILISEZ UN MOT DE PASSE D'APPLICATION GMAIL
      }
    });

    // Vérification que le mot de passe est configuré
    if (!process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  EMAIL_PASSWORD non configuré - les emails ne pourront pas être envoyés');
    }
  }

  // Envoyer un email de vérification
  async sendVerificationEmail(email, firstName, lastName, verificationCode) {
    try {
      const mailOptions = {
        from: '"Bowoye Multi Services" <amadoubarkere4@gmail.com>',
        to: email,
        subject: '🔐 Vérification de votre compte - Bowoye Multi Services',
        html: this.getVerificationEmailTemplate(firstName, lastName, verificationCode)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé avec succès:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email de vérification envoyé à votre adresse'
      };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw error;
    }
  }

  // Template HTML pour l'email de vérification (Style Alibaba)
  getVerificationEmailTemplate(firstName, lastName, verificationCode) {
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
            .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
            .message { color: #666; margin-bottom: 30px; line-height: 1.8; }
            .code-container { background: #f8f9fa; border: 2px dashed #FF6B35; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; }
            .code-label { color: #666; font-size: 14px; margin-bottom: 10px; }
            .verification-code { font-size: 36px; font-weight: bold; color: #FF6B35; letter-spacing: 8px; margin: 15px 0; font-family: 'Courier New', monospace; }
            .expiry { color: #999; font-size: 12px; margin-top: 10px; }
            .instructions { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 30px 0; }
            .instructions h3 { color: #1976d2; margin-top: 0; font-size: 16px; }
            .instructions ol { margin: 10px 0; padding-left: 20px; }
            .instructions li { margin-bottom: 8px; color: #555; }
            .security-note { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0; }
            .security-note p { margin: 0; color: #856404; font-size: 14px; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer h3 { color: #333; margin-bottom: 15px; font-size: 16px; }
            .contact-info { color: #666; font-size: 14px; line-height: 1.6; }
            .contact-info strong { color: #FF6B35; }
            .copyright { color: #999; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🏢 Bowoye Multi Services</h1>
                <p>Votre partenaire commercial de confiance</p>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${firstName} ${lastName},</div>
                
                <div class="message">
                    Bienvenue sur <strong>Bowoye Multi Services</strong> ! Nous sommes ravis de vous accueillir sur notre plateforme B2B.
                </div>
                
                <div class="code-container">
                    <div class="code-label">Code de vérification de votre compte</div>
                    <div class="verification-code">${verificationCode}</div>
                    <div class="expiry">⏰ Ce code expire dans 15 minutes</div>
                </div>
                
                <div class="instructions">
                    <h3>📋 Comment activer votre compte :</h3>
                    <ol>
                        <li>Retournez sur la page de vérification</li>
                        <li>Saisissez le code ci-dessus dans le champ prévu</li>
                        <li>Cliquez sur "Vérifier mon compte"</li>
                        <li>Accédez à votre espace client</li>
                    </ol>
                </div>
                
                <div class="security-note">
                    <p>🔒 <strong>Sécurité :</strong> Ne partagez jamais ce code avec qui que ce soit. Notre équipe ne vous demandera jamais votre code de vérification.</p>
                </div>
                
                <div class="message">
                    Une fois votre compte activé, vous pourrez :
                    <br>• Accéder à des milliers de produits de qualité
                    <br>• Négocier directement avec les fournisseurs
                    <br>• Bénéficier de prix préférentiels
                    <br>• Recevoir un support client 24/7
                </div>
            </div>
            
            <div class="footer">
                <h3>🏢 Bowoye Multi Services</h3>
                <div class="contact-info">
                    <strong>📍 Adresse :</strong> Labé, République de Guinée<br>
                    <strong>📞 Téléphone :</strong> +224 626 99 13 18<br>
                    <strong>✉️ Email :</strong> amadoubowoye@gmail.com<br>
                    <strong>🌐 Site :</strong> https://bowoye.vercel.app
                </div>
                <div class="copyright">
                    © 2025 Bowoye Multi Services. Tous droits réservés.<br>
                    Votre confiance est notre priorité.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Envoyer un email de récupération de mot de passe
  async sendPasswordResetEmail(email, firstName, resetCode) {
    try {
      const mailOptions = {
        from: '"Bowoye Multi Services" <amadoubarkere4@gmail.com>',
        to: email,
        subject: '🔒 Réinitialisation de votre mot de passe',
        html: this.getPasswordResetTemplate(firstName, resetCode)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de récupération envoyé:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email de récupération envoyé'
      };
    } catch (error) {
      console.error('❌ Erreur envoi email récupération:', error);
      throw error;
    }
  }

  // Template pour la récupération de mot de passe
  getPasswordResetTemplate(firstName, resetCode) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Récupération de mot de passe</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: #fff; border: 3px solid #ff6b6b; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Bowoye Multi Services</h1>
                <p>Récupération de mot de passe</p>
            </div>
            
            <div class="content">
                <h2>Bonjour ${firstName},</h2>
                
                <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                
                <div class="code-box">
                    <p><strong>Code de réinitialisation :</strong></p>
                    <div class="code">${resetCode}</div>
                    <p><small>Ce code expire dans 15 minutes</small></p>
                </div>
                
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                
                <p>Cordialement,<br>
                <strong>L'équipe Bowoye Multi Services</strong></p>
            </div>
            
            <div class="footer">
                <p>Bowoye Multi Services - Labé, Guinée</p>
                <p>Téléphone: +224 626 99 13 18 | Email: amadoubowoye@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();
