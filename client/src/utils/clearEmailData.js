// Utilitaire pour nettoyer les données email
export const clearEmailData = () => {
  // Nettoyer localStorage
  localStorage.removeItem('bowoye_email_verifications');
  localStorage.removeItem('bowoye_pending_accounts');
  
  console.log('🧹 Données email nettoyées');
};

// Nettoyer automatiquement au chargement
if (typeof window !== 'undefined') {
  clearEmailData();
}
