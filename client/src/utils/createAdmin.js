// Script pour créer un utilisateur admin de test
export const createTestAdmin = async () => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Admin',
        lastName: 'Test',
        email: 'admin@koula.gn',
        password: 'admin123',
        phone: '+224 123 456 789',
        role: 'admin'
      })
    });

    const result = await response.json();
    console.log('Admin créé:', result);
    return result;
  } catch (error) {
    console.error('Erreur création admin:', error);
    return null;
  }
};

// Vérifier si l'utilisateur est admin
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Obtenir les informations de l'utilisateur connecté
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Erreur décodage token:', error);
    return null;
  }
};
