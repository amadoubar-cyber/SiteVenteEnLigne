// Configuration email pour Bowoye Multi Services
module.exports = {
  // Configuration Gmail (recommandée)
  gmail: {
    service: 'gmail',
    auth: {
      user: 'amadoubowoye@gmail.com',
      pass: 'VOTRE_MOT_DE_PASSE_APPLICATION_GMAIL' // 🔧 REMPLACEZ PAR VOTRE MOT DE PASSE D'APPLICATION
    }
  },

  // Configuration Outlook (alternative)
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: 'votre-email@outlook.com',
      pass: 'votre-mot-de-passe'
    }
  },

  // Configuration Yahoo (alternative)
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'votre-email@yahoo.com',
      pass: 'votre-mot-de-passe'
    }
  }
};
