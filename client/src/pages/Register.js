import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegistration } from '../utils/authValidation';
import { useAuth } from '../contexts/AuthContext';
import emailVerificationService from '../services/emailVerificationService';
import EmailVerificationModal from '../components/EmailVerification/EmailVerificationModal';
import EmailDebug from '../components/Debug/EmailDebug';
import SimpleEmailDebug from '../components/Debug/SimpleEmailDebug';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  Globe,
  CreditCard,
  Truck,
  Headphones,
  Star,
  Zap,
  Users,
  Target,
  Award
} from 'lucide-react';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('individual'); // 'individual' ou 'business'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessType: '',
    country: 'Guinée',
    city: '',
    address: '',
    postalCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // États pour la vérification email
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [testMode, setTestMode] = useState(false);
  
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Utiliser la validation sécurisée pour l'étape 1
      const validation = validateRegistration({
        ...formData,
        firstName: formData.firstName || 'temp',
        lastName: formData.lastName || 'temp',
        phone: formData.phone || '+22400000000'
      });
      
      // Extraire seulement les erreurs de l'étape 1
      if (validation.errors.email) newErrors.email = validation.errors.email;
      if (validation.errors.password) newErrors.password = validation.errors.password;
      if (validation.errors.confirmPassword) newErrors.confirmPassword = validation.errors.confirmPassword;
    }

    if (step === 2) {
      // Utiliser la validation sécurisée pour l'étape 2
      const validation = validateRegistration(formData);
      
      if (validation.errors.firstName) newErrors.firstName = validation.errors.firstName;
      if (validation.errors.lastName) newErrors.lastName = validation.errors.lastName;
      if (validation.errors.phone) newErrors.phone = validation.errors.phone;

      if (userType === 'business') {
        if (!formData.companyName.trim()) {
          newErrors.companyName = 'Le nom de l\'entreprise est requis';
        }
        if (!formData.businessType.trim()) {
          newErrors.businessType = 'Le type d\'entreprise est requis';
        }
      }
    }

    if (step === 3) {
      if (!agreedToTerms) {
        newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    // Vérifier si l'email est déjà vérifié
    if (emailVerificationService.isEmailVerified(formData.email)) {
      // Email déjà vérifié, procéder à l'inscription
      await completeRegistration();
    } else {
      // Email non vérifié, lancer la vérification
      setIsSubmitting(true);
      const result = await emailVerificationService.sendVerificationEmail(
        formData.email, 
        formData.firstName, 
        formData.lastName
      );
      
      if (result.success) {
        // Sauvegarder les données en attente
        emailVerificationService.savePendingAccount(formData);
        setShowEmailVerification(true);
      } else {
        alert('Erreur lors de l\'envoi de l\'email de vérification: ' + result.message);
      }
      setIsSubmitting(false);
    }
  };

  const completeRegistration = async () => {
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) {
      // Supprimer le compte en attente
      emailVerificationService.removePendingAccount(formData.email);
      navigate('/');
    }
  };

  const sendVerificationCode = (type) => {
    // Simulation d'envoi de code de vérification
    if (type === 'email') {
      setEmailVerified(true);
    } else if (type === 'phone') {
      setPhoneVerified(true);
    }
  };

  // Callback pour succès de vérification email
  const handleEmailVerificationSuccess = async (email) => {
    setShowEmailVerification(false);
    await completeRegistration();
  };

  // Callback pour échec de vérification email
  const handleEmailVerificationFailed = () => {
    setShowEmailVerification(false);
    // Optionnel: afficher un message d'erreur
  };

  // Fonction de test direct
  const handleDirectTest = async () => {
    setTestMode(true);
    try {
      const testEmail = 'test@bowoye.gn';
      const testFirstName = 'Test';
      const testLastName = 'User';
      
      const result = await emailVerificationService.sendVerificationEmail(
        testEmail,
        testFirstName,
        testLastName
      );
      
      if (result.success) {
        alert('✅ Test réussi ! Vérifiez le panneau en haut à droite pour voir le code.');
      } else {
        alert('❌ Erreur: ' + result.message);
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    } finally {
      setTestMode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Bowoye Multi Services</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Se connecter
              </Link>
              <Link
                to="/"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Côté gauche - Informations et avantages */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Rejoignez la plus grande plateforme B2B d'Afrique
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Marché Mondial</h3>
                      <p className="text-gray-600 text-sm">Accédez à des millions de fournisseurs et acheteurs du monde entier</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Transactions Sécurisées</h3>
                      <p className="text-gray-600 text-sm">Protection garantie avec notre système de paiement sécurisé</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Logistique Optimisée</h3>
                      <p className="text-gray-600 text-sm">Livraison rapide et fiable dans toute l'Afrique</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Support 24/7</h3>
                      <p className="text-gray-600 text-sm">Assistance technique et commerciale en continu</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Qualité Certifiée</h3>
                      <p className="text-gray-600 text-sm">Fournisseurs vérifiés et produits de qualité</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Plus de 50,000 clients satisfaits</p>
                      <p className="text-sm text-gray-600">Rejoignez notre communauté grandissante</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Côté droit - Formulaire d'inscription */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Créer votre compte
              </h2>
              <p className="text-gray-600">
                Commencez votre parcours commercial dès aujourd'hui
              </p>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Étape {currentStep} sur 3</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
                  <button
                    onClick={handleDirectTest}
                    disabled={testMode}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                  >
                    {testMode ? 'Test...' : '🧪 Test'}
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Étape 1: Type de compte et informations de base */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Type de compte</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUserType('individual')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        userType === 'individual' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <User className={`h-6 w-6 ${userType === 'individual' ? 'text-orange-600' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">Particulier</h4>
                          <p className="text-sm text-gray-600">Pour vos achats personnels</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserType('business')}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        userType === 'business' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Building2 className={`h-6 w-6 ${userType === 'business' ? 'text-orange-600' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">Entreprise</h4>
                          <p className="text-sm text-gray-600">Pour vos achats professionnels</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="votre@email.com"
                    />
                    {emailVerified && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            )}

            {/* Étape 2: Informations personnelles/entreprise */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {userType === 'business' ? 'Informations de l\'entreprise' : 'Informations personnelles'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        placeholder="Votre prénom"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="+224 XXX XX XX XX"
                    />
                    {phoneVerified && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {userType === 'business' && (
                  <>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        placeholder="Nom de votre entreprise"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'entreprise
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.businessType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                        }`}
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="manufacturer">Fabricant</option>
                        <option value="wholesaler">Grossiste</option>
                        <option value="retailer">Détaillant</option>
                        <option value="service">Service</option>
                        <option value="other">Autre</option>
                      </select>
                      {errors.businessType && (
                        <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Étape 3: Conditions et finalisation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Finalisation de votre compte
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Votre compte sera créé avec</h4>
                      <ul className="mt-2 text-sm text-blue-800 space-y-1">
                        <li>• Accès à des millions de produits</li>
                        <li>• Protection des transactions</li>
                        <li>• Support client 24/7</li>
                        <li>• Outils de gestion avancés</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      J'accepte les{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                        conditions d'utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                        politique de confidentialité
                      </a>{' '}
                      de Bowoye Multi Services
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Récapitulatif</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Type de compte:</span>
                      <span className="font-medium">
                        {userType === 'individual' ? 'Particulier' : 'Entreprise'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nom:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    {userType === 'business' && formData.companyName && (
                      <div className="flex justify-between">
                        <span>Entreprise:</span>
                        <span className="font-medium">{formData.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || isSubmitting}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {loading || isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isSubmitting ? 'Envoi du code...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <Zap className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Lien vers la connexion */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vérification email */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        email={formData.email}
        firstName={formData.firstName}
        lastName={formData.lastName}
        onVerificationSuccess={handleEmailVerificationSuccess}
        onVerificationFailed={handleEmailVerificationFailed}
      />

      {/* Composant de debug simple pour voir tous les codes */}
      <SimpleEmailDebug />

      {/* Composant de debug pour voir le code */}
      {formData.email && (
        <EmailDebug
          email={formData.email}
          firstName={formData.firstName}
          lastName={formData.lastName}
        />
      )}

    </div>
  );
};

export default Register;
