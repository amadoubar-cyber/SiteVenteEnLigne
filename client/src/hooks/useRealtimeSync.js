import { useEffect, useRef } from 'react';
import syncService from '../services/syncService';

const useRealtimeSync = (componentId, onSync) => {
  const onSyncRef = useRef(onSync);

  // Mettre à jour la référence de callback
  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    // Fonction de synchronisation
    const handleSync = (eventType, data) => {
      if (onSyncRef.current) {
        onSyncRef.current(eventType, data);
      }
    };

    // Enregistrer le composant pour la synchronisation
    syncService.subscribe(componentId, handleSync);

    // Écouter les événements globaux de synchronisation
    const handleGlobalSync = (event) => {
      const { eventType, data } = event.detail;
      if (onSyncRef.current) {
        onSyncRef.current(eventType, data);
      }
    };

    window.addEventListener('globalSync', handleGlobalSync);

    // Nettoyage
    return () => {
      syncService.unsubscribe(componentId);
      window.removeEventListener('globalSync', handleGlobalSync);
    };
  }, [componentId]);

  // Fonction pour forcer la synchronisation
  const forceSync = () => {
    syncService.forceSync();
  };

  // Fonction pour obtenir les statistiques
  const getStats = () => {
    return syncService.getStats();
  };

  return {
    forceSync,
    getStats
  };
};

export default useRealtimeSync;
