const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🧪 TEST EMAIL DIRECT');
  console.log('═══════════════════════════════════════');
  console.log('');

  // Configuration Gmail avec vos credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amadoubarkere4@gmail.com',
      pass: 'atlz bogk zajd uglz'
    }
  });

  const testEmail = 'amadoubarkere4@gmail.com'; // Email de test (votre propre email)
  const otp = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: '"Bowoye Multi Services" <amadoubarkere4@gmail.com>',
    to: testEmail,
    subject: 'TEST - Code de vérification - Bowoye Multi Services',
    html: `
      <h2>🧪 TEST EMAIL</h2>
      <p>Ceci est un test pour vérifier que l'email fonctionne.</p>
      <p><strong>Code de test :</strong> ${otp}</p>
      <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p><small>Bowoye Multi Services</small></p>
    `
  };

  try {
    console.log('📧 Envoi du test email...');
    console.log(`📬 Vers : ${testEmail}`);
    console.log(`🔑 Code : ${otp}`);
    console.log('');

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS !');
    console.log('═══════════════════════════════════════');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Destinataire: ${testEmail}`);
    console.log(`🔑 Code: ${otp}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log('');
    console.log('🎯 VÉRIFIEZ VOTRE BOÎTE EMAIL !');
    console.log('   (Vérifiez aussi les spams)');
    
  } catch (error) {
    console.log('❌ ERREUR ENVOI EMAIL :');
    console.log('═══════════════════════════════════════');
    console.log(`🔴 Code: ${error.code}`);
    console.log(`🔴 Message: ${error.message}`);
    console.log('');
    
    if (error.code === 'EAUTH') {
      console.log('💡 SOLUTION :');
      console.log('   - Vérifiez que le mot de passe d\'application est correct');
      console.log('   - Assurez-vous que la validation en 2 étapes est activée');
      console.log('   - Vérifiez que l\'email est correct');
    }
  }
}

testEmail().catch(console.error);
