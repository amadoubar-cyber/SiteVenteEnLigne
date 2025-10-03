import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import emailVerificationService from '../../services/emailVerificationService';

const CodeTester = ({ email }) => {
  const [testCode, setTestCode] = useState('986555');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestCode = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 TEST DIRECT DU CODE:', testCode);
      console.log('📧 EMAIL:', email);
      
      const result = emailVerificationService.verifyCode(email, testCode);
      
      console.log('✅ RÉSULTAT VÉRIFICATION:', result);
      
      setTestResult({
        success: result.success,
        message: result.message,
        details: result
      });
      
    } catch (error) {
      console.error('❌ ERREUR TEST:', error);
      setTestResult({
        success: false,
        message: 'Erreur: ' + error.message,
        error: true
      });
    } finally {
      setIsTesting(false);
    }
  };

  const checkLocalStorage = () => {
    try {
      const verifications = JSON.parse(localStorage.getItem('bowoye_email_verifications') || '[]');
      const verification = verifications.find(v => v.email === email);
      
      console.log('🔍 VÉRIFICATIONS STOCKÉES:', verifications);
      console.log('🎯 VÉRIFICATION POUR EMAIL:', verification);
      
      if (verification) {
        console.log('📋 DÉTAILS VÉRIFICATION:');
        console.log('  - Code:', verification.code);
        console.log('  - Type:', typeof verification.code);
        console.log('  - Email:', verification.email);
        console.log('  - Expire:', verification.expiresAt);
        console.log('  - Tentatives:', verification.attempts);
        
        setTestResult({
          success: true,
          message: `Code trouvé: ${verification.code} (${typeof verification.code})`,
          verification
        });
      } else {
        setTestResult({
          success: false,
          message: 'Aucune vérification trouvée pour cet email',
          error: true
        });
      }
    } catch (error) {
      console.error('❌ Erreur localStorage:', error);
      setTestResult({
        success: false,
        message: 'Erreur localStorage: ' + error.message,
        error: true
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-purple-500 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <h3 className="font-bold text-gray-900 mb-3">🧪 TESTEUR DE CODE</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code à tester:
          </label>
          <input
            type="text"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="986555"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleTestCode}
            disabled={isTesting}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Test...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Tester Code</span>
              </>
            )}
          </button>
          
          <button
            onClick={checkLocalStorage}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Check Storage</span>
          </button>
        </div>
        
        {testResult && (
          <div className={`p-3 rounded border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? 'Succès' : 'Échec'}
              </span>
            </div>
            
            <p className={`text-sm ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>
            
            {testResult.verification && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                <p><strong>Code stocké:</strong> {testResult.verification.code}</p>
                <p><strong>Type:</strong> {typeof testResult.verification.code}</p>
                <p><strong>Tentatives:</strong> {testResult.verification.attempts || 0}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>• Teste la vérification du code</p>
          <p>• Vérifie le localStorage</p>
          <p>• Affiche les détails de debug</p>
        </div>
      </div>
    </div>
  );
};

export default CodeTester;
