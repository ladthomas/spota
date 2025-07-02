// Configuration centralisée pour l'API
import { Platform } from 'react-native';

// Fonction pour obtenir l'URL de base de l'API
const getApiBaseUrl = (): string => {
  if (!__DEV__) {
    
    return 'https://votre-api-production.com/api';
  }

  // En développement, tenter d'utiliser l'IP locale détectée
  // Vous pouvez changer cette IP si votre réseau change
  const LOCAL_IP = '192.168.1.48'; // IP actuelle détectée
  const BACKEND_PORT = 5001;
  
  
  if (Platform.OS === 'web') {
    return `http://localhost:${BACKEND_PORT}/api`;
  }
  
  // Pour les appareils mobiles (Expo Go, etc.)
  return `http://${LOCAL_IP}:${BACKEND_PORT}/api`;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3
};

// Fonction utilitaire pour obtenir l'IP locale (à des fins de debug)
export const getCurrentConfig = () => {
  console.log(' Configuration API actuelle:', {
    baseUrl: API_CONFIG.BASE_URL,
    platform: Platform.OS,
    isDev: __DEV__,
    timeout: API_CONFIG.TIMEOUT
  });
  return API_CONFIG;
};

export default API_CONFIG; 