const express = require('express');
const router = express.Router();

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

const emailService = new SimpleEmailService();

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
    
    // Envoyer l'email
    const result = await emailService.sendEmail({
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
