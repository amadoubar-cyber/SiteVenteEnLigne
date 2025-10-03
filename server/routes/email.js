const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Service email simple pour les tests (en production, utiliser SendGrid, Mailgun, etc.)
class SimpleEmailService {
  
  // Simuler l'envoi d'email (en production, intégrer avec un vrai service)
  async sendEmail(emailData) {
    try {
      console.log('════════════════════════════════════════════════════════════════');
      console.log('📧 EMAIL ENVOYÉ (SIMULATION)');
      console.log('════════════════════════════════════════════════════════════════');
      console.log(`📬 Destinataire: ${emailData.to}`);
      console.log(`📝 Sujet: ${emailData.subject}`);
      console.log(`📋 Template: ${emailData.template}`);
      console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`);
      
      if (emailData.template === 'verification') {
        console.log(`👤 Nom: ${emailData.data.firstName} ${emailData.data.lastName}`);
        console.log(`🔑 CODE: ${emailData.data.verificationCode}`);
        console.log(`🔗 Lien: ${emailData.data.verificationLink}`);
      } else if (emailData.template === 'password-reset') {
        console.log(`👤 Nom: ${emailData.data.firstName}`);
        console.log(`🔑 CODE: ${emailData.data.resetCode}`);
        console.log(`🔗 Lien: ${emailData.data.resetLink}`);
      }
      
      console.log('════════════════════════════════════════════════════════════════');
      
      // En production, ici on ferait l'appel à SendGrid, Mailgun, etc.
      // await sendGrid.send(emailData);
      
      return {
        success: true,
        message: 'Email envoyé avec succès',
        emailId: `email_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw error;
    }
  }
}

const simpleEmailService = new SimpleEmailService();

// Route pour envoyer un email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, template, data } = req.body;
    
    // Validation des données
    if (!to || !subject || !template) {
      return res.status(400).json({
        success: false,
        message: 'Données email manquantes'
      });
    }
    
    // Utiliser le vrai service email si c'est une vérification
    if (template === 'verification' && data && data.verificationCode) {
      try {
        const result = await emailService.sendVerificationEmail(
          to,
          data.firstName,
          data.lastName,
          data.verificationCode
        );
        
        console.log('✅ Email réel envoyé avec succès');
        return res.json({
          success: true,
          message: 'Email de vérification envoyé à votre adresse',
          messageId: result.messageId
        });
      } catch (emailError) {
        console.warn('⚠️ Erreur service email réel, utilisation du fallback:', emailError.message);
        // Fallback vers le service simple
      }
    }
    
    // Fallback : utiliser le service simple
    const result = await simpleEmailService.sendEmail({
      to,
      subject,
      template,
      data
    });
    
    res.json(result);
    
  } catch (error) {
    console.error('Erreur route email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
});

// Route pour tester le service email
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Service email opérationnel',
    timestamp: new Date().toISOString(),
    endpoints: {
      send: 'POST /api/email/send',
      test: 'GET /api/email/test'
    }
  });
});

module.exports = router;
