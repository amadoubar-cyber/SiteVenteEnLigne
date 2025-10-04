const axios = require('axios');

async function testEmailSystem() {
  console.log('🧪 Test du système d\'envoi d\'email...\n');
  
  const baseURL = 'http://localhost:3001/api';
  
  try {
    // Test 1: Inscription avec OTP
    console.log('📧 Test 1: Inscription avec envoi d\'OTP');
    const testUser = {
      firstName: 'Test',
      lastName: 'Email',
      email: 'test@gmail.com',
      password: 'test123456',
      phone: '+22461234567'
    };
    
    console.log('📤 Envoi de la requête d\'inscription...');
    const registerResponse = await axios.post(`${baseURL}/auth-otp/register`, testUser);
    
    if (registerResponse.data.success) {
      console.log('✅ Succès: Email de vérification envoyé!');
      console.log(`📧 Réponse: ${registerResponse.data.message}`);
      console.log(`📮 Email: ${registerResponse.data.email}\n`);
      
      // Test 2: Renvoi d'OTP
      console.log('📧 Test 2: Renvoi d\'OTP');
      try {
        const resendResponse = await axios.post(`${baseURL}/auth-otp/resend-otp`, { 
          email: testUser.email 
        });
        
        if (resendResponse.data.success) {
          console.log('✅ Succès: Nouveau code OTP envoyé!');
          console.log(`📧 Réponse: ${resendResponse.data.message}\n`);
        } else {
          console.log('❌ Échec du renvoi d\'OTP');
        }
      } catch (resendError) {
        console.log('❌ Erreur lors du renvoi d\'OTP:', resendError.response?.data?.message || resendError.message);
      }
      
      // Test 3: Vérification avec code invalide
      console.log('📧 Test 3: Vérification avec code invalide');
      try {
        await axios.post(`${baseURL}/auth-otp/verify`, { 
          email: testUser.email, 
          otp: '000000' 
        });
        console.log('❌ Erreur: Code invalide accepté');
      } catch (verifyError) {
        console.log('✅ Succès: Code invalide correctement rejeté');
        console.log(`📧 Erreur: ${verifyError.response?.data?.message}\n`);
      }
      
    } else {
      console.log('❌ Échec de l\'inscription:', registerResponse.data.message);
    }
    
  } catch (error) {
    console.log('❌ Erreur générale:', error.response?.data?.message || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🚨 Le serveur semble être arrêté. Démarrez-le avec: cd server && node index.js');
    }
  }
  
  console.log('\n🧪 Test terminé');
}

// Attendre un peu que le serveur démarre
setTimeout(testEmailSystem, 3000);

module.exports = testEmailSystem;
