import React, { useState } from 'react';
import { Mail, TestTube } from 'lucide-react';
import emailVerificationService from '../../services/emailVerificationService';

const EmailTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    
    try {
      const testEmail = 'test@bowoye.gn';
      const testFirstName = 'Amadou';
      const testLastName = 'Diallo';
      
      const result = await emailVerificationService.sendVerificationEmail(
        testEmail,
        testFirstName,
        testLastName
      );
      
      if (result.success) {
        console.log('✅ Test email réussi!');
        alert('✅ Test email envoyé avec succès!\n\nVérifiez la console pour voir le code de vérification.');
      } else {
        alert('❌ Erreur lors du test: ' + result.message);
      }
    } catch (error) {
      console.error('Erreur test email:', error);
      alert('❌ Erreur lors du test: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleTestEmail}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        title="Tester l'envoi d'email de vérification"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Test...</span>
          </>
        ) : (
          <>
            <TestTube className="h-4 w-4" />
            <span>Test Email</span>
          </>
        )}
      </button>
    </div>
  );
};

export default EmailTestButton;
