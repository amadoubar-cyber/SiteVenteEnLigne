import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation de l'email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez saisir une adresse email valide');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'envoi d'email (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Pour la démo, on considère que l'email est toujours envoyé
      setEmailSent(true);
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h1>
          </div>

          {/* Message de succès */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              
              <p className="text-gray-600 mb-6">
                Nous avons envoyé un lien de réinitialisation à l'adresse :
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="font-medium text-gray-900">{email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Instructions :</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Vérifiez votre boîte email</li>
                        <li>• Cliquez sur le lien de réinitialisation</li>
                        <li>• Créez un nouveau mot de passe</li>
                        <li>• Le lien expire dans 24 heures</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      'Renvoyer l\'email'
                    )}
                  </button>
                  
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="text-center space-y-2">
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Créer un nouveau compte
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 underline block"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h1>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-gray-600">
              Pas de souci ! Entrez votre email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Message d'erreur */}
            {error && (
              <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors border-gray-300 focus:ring-orange-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></Loader>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </div>
          </form>

          {/* Liens */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la connexion
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-500 hover:text-gray-700 underline block"
            >
              Créer un nouveau compte
            </Link>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Besoin d'aide ?
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Vérifiez que l'adresse email est correcte</p>
            <p>• Consultez votre dossier spam/courrier indésirable</p>
            <p>• Le lien de réinitialisation expire dans 24 heures</p>
            <p>• Contactez le support si vous rencontrez des difficultés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
