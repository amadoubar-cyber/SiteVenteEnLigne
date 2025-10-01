// Utilitaires de validation sécurisée pour l'authentification

// Validation email sécurisée
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email) {
    return { isValid: false, message: 'L\'email est requis' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Format d\'email invalide' };
  }
  
  // Vérifier la longueur
  if (email.length > 254) {
    return { isValid: false, message: 'L\'email est trop long' };
  }
  
  return { isValid: true, message: '' };
};

// Validation mot de passe sécurisé
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Le mot de passe est trop long' };
  }
  
  // Vérifier la complexité
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (complexityScore < 3) {
    return { 
      isValid: false, 
      message: 'Le mot de passe doit contenir au moins 3 des éléments suivants : majuscules, minuscules, chiffres, caractères spéciaux' 
    };
  }
  
  // Vérifier les mots de passe courants
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, message: 'Ce mot de passe est trop courant, veuillez en choisir un autre' };
  }
  
  return { isValid: true, message: '' };
};

// Validation nom/prénom
export const validateName = (name, fieldName = 'Nom') => {
  if (!name || !name.trim()) {
    return { isValid: false, message: `${fieldName} est requis` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} doit contenir au moins 2 caractères` };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: `${fieldName} est trop long` };
  }
  
  // Vérifier qu'il ne contient que des lettres, espaces et tirets
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: `${fieldName} ne peut contenir que des lettres, espaces et tirets` };
  }
  
  return { isValid: true, message: '' };
};

// Validation téléphone
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Le numéro de téléphone est requis' };
  }
  
  // Nettoyer le numéro
  const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
  
  // Vérifier le format guinéen (+224) ou international
  const phoneRegex = /^(\+224|224)?[0-9]{8,9}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, message: 'Format de numéro de téléphone invalide (ex: +224 XXX XX XX XX)' };
  }
  
  return { isValid: true, message: '' };
};

// Fonction de validation complète pour l'inscription
export const validateRegistration = (formData) => {
  const errors = {};
  
  // Validation email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Validation mot de passe
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Validation confirmation mot de passe
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  // Validation prénom
  const firstNameValidation = validateName(formData.firstName, 'Le prénom');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message;
  }
  
  // Validation nom
  const lastNameValidation = validateName(formData.lastName, 'Le nom');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message;
  }
  
  // Validation téléphone
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Fonction de validation pour la connexion
export const validateLogin = (email, password) => {
  const errors = {};
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  if (!password) {
    errors.password = 'Le mot de passe est requis';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
