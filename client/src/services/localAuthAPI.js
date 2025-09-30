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
    
    // Charger les utilisateurs depuis localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Si aucun utilisateur n'existe, créer les utilisateurs par défaut
    if (users.length === 0) {
      const defaultUsers = [
        {
          _id: '1',
          id: 1,
          firstName: 'Admin',
          lastName: 'Koula',
          email: 'admin@koula.gn',
          password: 'admin123',
          phone: '+224 123 456 789',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          totalOrders: 0,
          totalSpent: 0,
          address: 'Conakry, Guinée'
        },
        {
          _id: '2',
          id: 2,
          firstName: 'Client',
          lastName: 'Test',
          email: 'client@koula.gn',
          password: 'password123',
          phone: '+224 987 654 321',
          role: 'client',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          totalOrders: 0,
          totalSpent: 0,
          address: 'Conakry, Guinée'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      users.push(...defaultUsers);
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    
    // Mettre à jour la dernière connexion
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
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
    
    // Charger les utilisateurs existants depuis localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'email existe déjà
    const existingUser = existingUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Créer un nouvel utilisateur
    const newUser = {
      _id: Date.now().toString(),
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      role: 'client',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      totalOrders: 0,
      totalSpent: 0,
      address: phone || ''
    };

    // Ajouter à la liste des utilisateurs
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

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
