// Service pour générer des liens de vérification email
const BASE_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';

export const emailLinkService = {
  // Générer un lien de vérification email
  generateVerificationLink: (email, code, firstName, lastName) => {
    const verificationData = {
      email,
      code,
      firstName,
      lastName,
      timestamp: Date.now()
    };
    
    // Encoder les données en base64
    const encodedData = btoa(JSON.stringify(verificationData));
    
    // Créer le lien
    const link = `${BASE_URL}/verify-email?token=${encodedData}`;
    
    return {
      link,
      encodedData
    };
  },

  // Décoder les données du lien
  decodeVerificationLink: (token) => {
    try {
      const decodedData = JSON.parse(atob(token));
      
      // Vérifier si le lien n'est pas trop ancien (24h)
      const isExpired = Date.now() - decodedData.timestamp > 24 * 60 * 60 * 1000;
      
      return {
        success: true,
        data: decodedData,
        expired: isExpired
      };
    } catch (error) {
      return {
        success: false,
        error: 'Lien de vérification invalide'
      };
    }
  },

  // Générer le contenu de l'email HTML
  generateEmailContent: (firstName, lastName, verificationLink, code) => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte Bowoye Multi Services</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #3B82F6, #F59E0B);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3B82F6, #F59E0B);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .code-box {
            background: #f3f4f6;
            border: 2px dashed #6b7280;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            letter-spacing: 3px;
            font-family: monospace;
        }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e5e7eb;
            border-top: none;
            font-size: 12px;
            color: #6b7280;
        }
        .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Bienvenue chez Bowoye Multi Services !</h1>
        <p>Vérifiez votre adresse email pour activer votre compte</p>
    </div>
    
    <div class="content">
        <h2>Bonjour ${firstName} ${lastName},</h2>
        
        <p>Merci de vous être inscrit sur <strong>Bowoye Multi Services</strong> ! Pour finaliser la création de votre compte, veuillez vérifier votre adresse email.</p>
        
        <div class="security-note">
            <strong>🔒 Sécurité :</strong> Ce code de vérification est valide pendant <strong>15 minutes</strong> uniquement.
        </div>
        
        <h3>Votre code de vérification :</h3>
        <div class="code-box">
            <div class="code">${code}</div>
        </div>
        
        <p><strong>Option 1 :</strong> Copiez le code ci-dessus et collez-le sur la page de vérification.</p>
        
        <p><strong>Option 2 :</strong> Cliquez sur le bouton ci-dessous pour vérifier automatiquement votre email :</p>
        
        <div style="text-align: center;">
            <a href="${verificationLink}" class="button">
                ✅ Vérifier mon email maintenant
            </a>
        </div>
        
        <p><strong>Si vous n'avez pas créé de compte :</strong> Ignorez cet email. Votre adresse sera supprimée de nos systèmes.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <h3>Pourquoi vérifier votre email ?</h3>
        <ul>
            <li>✅ Sécuriser votre compte</li>
            <li>✅ Recevoir les notifications importantes</li>
            <li>✅ Accéder à toutes les fonctionnalités</li>
            <li>✅ Protéger contre les comptes frauduleux</li>
        </ul>
    </div>
    
    <div class="footer">
        <p><strong>Bowoye Multi Services</strong> - Votre partenaire de confiance en Guinée</p>
        <p>📧 Email : amadoubowoye@gmail.com | 📞 Téléphone : +224 626 99 13 18</p>
        <p>📍 Adresse : Labé, Guinée</p>
        <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
</body>
</html>
    `;
  },

  // Simuler l'envoi d'email (pour le développement)
  sendVerificationEmail: async (email, firstName, lastName, code) => {
    try {
      // Générer le lien de vérification
      const { link } = emailLinkService.generateVerificationLink(email, code, firstName, lastName);
      
      // Générer le contenu HTML de l'email
      const emailContent = emailLinkService.generateEmailContent(firstName, lastName, link, code);
      
      console.log('📧 EMAIL DE VÉRIFICATION SIMULÉ:');
      console.log('════════════════════════════════════════════════════════════════');
      console.log(`📬 Destinataire: ${email}`);
      console.log(`👤 Nom: ${firstName} ${lastName}`);
      console.log(`🔑 Code: ${code}`);
      console.log(`🔗 Lien: ${link}`);
      console.log('════════════════════════════════════════════════════════════════');
      console.log('📄 Contenu HTML de l\'email:');
      console.log(emailContent);
      console.log('════════════════════════════════════════════════════════════════');
      
      // Dans un vrai projet, vous enverriez l'email ici
      // await sendRealEmail(email, emailContent, 'Vérification de votre compte Bowoye Multi Services');
      
      return {
        success: true,
        message: 'Email de vérification envoyé avec succès',
        link,
        code
      };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }
};

export default emailLinkService;
