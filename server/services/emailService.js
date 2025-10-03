const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configuration pour Gmail (ou autre service email)
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // Ou 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER || 'amadoubowoye@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'votre_mot_de_passe_application' // Mot de passe d'application Gmail
      }
    });
  }

  // Envoyer un email de vérification
  async sendVerificationEmail(email, firstName, lastName, verificationCode) {
    try {
      const mailOptions = {
        from: `"Bowoye Multi Services" <${process.env.EMAIL_USER || 'amadoubowoye@gmail.com'}>`,
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

  // Template HTML pour l'email de vérification
  getVerificationEmailTemplate(firstName, lastName, verificationCode) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification de compte</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: #fff; border: 3px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Bowoye Multi Services</h1>
                <p>Vérification de votre compte</p>
            </div>
            
            <div class="content">
                <h2>Bonjour ${firstName} ${lastName},</h2>
                
                <p>Merci de vous être inscrit sur <strong>Bowoye Multi Services</strong> !</p>
                
                <p>Pour activer votre compte et accéder à tous nos services, veuillez utiliser le code de vérification suivant :</p>
                
                <div class="code-box">
                    <p><strong>Code de vérification :</strong></p>
                    <div class="code">${verificationCode}</div>
                    <p><small>Ce code expire dans 15 minutes</small></p>
                </div>
                
                <p><strong>Comment utiliser ce code :</strong></p>
                <ol>
                    <li>Retournez sur la page d'inscription</li>
                    <li>Entrez le code dans le champ de vérification</li>
                    <li>Cliquez sur "Vérifier"</li>
                </ol>
                
                <p>Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
                
                <p>Cordialement,<br>
                <strong>L'équipe Bowoye Multi Services</strong></p>
            </div>
            
            <div class="footer">
                <p>Bowoye Multi Services - Labé, Guinée</p>
                <p>Téléphone: +224 626 99 13 18 | Email: amadoubowoye@gmail.com</p>
                <p>© 2025 Bowoye Multi Services. Tous droits réservés.</p>
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
        from: `"Bowoye Multi Services" <${process.env.EMAIL_USER || 'amadoubowoye@gmail.com'}>`,
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
