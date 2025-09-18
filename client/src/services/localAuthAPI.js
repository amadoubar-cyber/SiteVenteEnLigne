// API d'authentification locale pour les tests
const LOCAL_USERS = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Koula',
    email: 'admin@koula.gn',
    password: 'admin123',
    phone: '+224 123 456 789',
    role: 'admin',
    address: {
      street: 'Rue de la République',
      city: 'Conakry',
      country: 'Guinée'
    }
  },
  {
    id: '2',
    firstName: 'Client',
    lastName: 'Test',
    email: 'client@koula.gn',
    password: 'password123',
    phone: '+224 987 654 321',
    role: 'user',
    address: {
      street: 'Avenue du Commerce',
      city: 'Conakry',
      country: 'Guinée'
    }
  },
  {
    id: '3',
    firstName: 'Marie',
    lastName: 'Diallo',
    email: 'marie@koula.gn',
    password: 'password123',
    phone: '+224 555 123 456',
    role: 'user',
    address: {
      street: 'Boulevard du 8 Mars',
      city: 'Conakry',
      country: 'Guinée'
    }
  }
];

// Simuler un délai de réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Générer un token simple
const generateToken = (userId) => {
  return `local_token_${userId}_${Date.now()}`;
};

export const localAuthAPI = {
  // Connexion
  login: async (email, password) => {
    await delay(1000); // Simuler un délai de réseau
    
    const user = LOCAL_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    
    // Stocker en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      data: {
        token,
        user: userWithoutPassword
      }
    };
  },

  // Inscription
  register: async (userData) => {
    await delay(1000);
    
    const { email, password, firstName, lastName, phone } = userData;
    
    // Vérifier si l'email existe déjà
    const existingUser = LOCAL_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Créer un nouvel utilisateur
    const newUser = {
      id: (LOCAL_USERS.length + 1).toString(),
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      role: 'user',
      address: {
        street: '',
        city: '',
        country: 'Guinée'
      }
    };

    LOCAL_USERS.push(newUser);
    const token = generateToken(newUser.id);
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Stocker en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      data: {
        token,
        user: userWithoutPassword
      }
    };
  },

  // Obtenir le profil de l'utilisateur connecté
  getMe: async () => {
    await delay(500);
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      throw new Error('Non authentifié');
    }

    return {
      data: {
        user: JSON.parse(user)
      }
    };
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    await delay(1000);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, ...profileData };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      data: {
        user: updatedUser
      }
    };
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    await delay(1000);
    
    const { currentPassword, newPassword } = passwordData;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Vérifier l'ancien mot de passe
    const localUser = LOCAL_USERS.find(u => u.id === user.id);
    if (!localUser || localUser.password !== currentPassword) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Mettre à jour le mot de passe
    localUser.password = newPassword;
    
    return {
      data: {
        message: 'Mot de passe modifié avec succès'
      }
    };
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default localAuthAPI;
