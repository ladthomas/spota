import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_CONFIG } from './config';

// Configuration de l'API (maintenant centralisée)
const API_BASE_URL = API_CONFIG.BASE_URL;

// Clés de stockage local
const STORAGE_KEYS = {
  TOKEN: '@spota_auth_token',
  USER_DATA: '@spota_user_data',
  IS_AUTHENTICATED: '@spota_is_authenticated'
};

// Types pour l'authentification
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private isAuthenticated: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    // Initialiser seulement si on est sur mobile/natif
    if (Platform.OS !== 'web') {
      this.initializeAuth();
    }
  }

  // Initialiser l'authentification au démarrage
  private async initializeAuth() {
    if (this.isInitialized) return;
    
    try {
      // Vérifier si AsyncStorage est disponible
      if (Platform.OS === 'web') {
        this.isInitialized = true;
        return;
      }

      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const isAuth = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);

      if (token && userData && isAuth === 'true') {
        this.token = token;
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
        console.log(' Utilisateur restauré:', this.user?.email);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error(' Erreur initialisation auth:', error);
      this.isInitialized = true;
      await this.logout();
    }
  }

  // Effectuer une requête API avec gestion d'erreurs
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      // Ajouter le token si disponible
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      console.log(` API Request: ${options.method || 'GET'} ${url}`);

      // Ajouter un timeout pour éviter les blocages
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        // Si c'est une erreur de validation avec des détails
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          throw new Error(`${data.message}: ${errorMessages}`);
        }
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(' Backend non accessible: [TypeError: Network request timed out]');
          throw new Error('La requête a expiré. Vérifiez que le backend est démarré et accessible.');
        }
        console.error(' Erreur API:', error.message);
      }
      throw error;
    }
  }

  // Inscription d'un nouvel utilisateur
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log(' Inscription en cours...', credentials.email);

      const response = await this.apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.token && response.user) {
        // Sauvegarder les données d'authentification
        await this.saveAuthData(response.token, response.user);
        console.log(' Inscription réussie:', response.user.email);
      }

      return response;
    } catch (error) {
      console.error(' Erreur inscription:', error);
      
      // Gestion spéciale pour l'erreur de contrainte unique
      if (error instanceof Error && error.message.includes('CONSTRAINT')) {
        return {
          success: false,
          message: 'Un compte avec cet email existe déjà. Veuillez vous connecter ou utiliser un autre email.'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
      };
    }
  }

  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log(' Connexion en cours...', credentials.email);

      const response = await this.apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.token && response.user) {
        // Sauvegarder les données d'authentification
        await this.saveAuthData(response.token, response.user);
        console.log(' Connexion réussie:', response.user.email);
      }

      return response;
    } catch (error) {
      console.error(' Erreur connexion:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la connexion'
      };
    }
  }

  // Obtenir le profil utilisateur
  async getProfile(): Promise<User | null> {
    try {
      if (!this.isAuthenticated || !this.token) {
        throw new Error('Non authentifié');
      }

      const response = await this.apiRequest('/auth/me');
      
      if (response.success && response.user) {
        this.user = response.user;
        await this.saveToStorage(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
        return this.user;
      }

      return null;
    } catch (error) {
      console.error(' Erreur récupération profil:', error);
      // Si le token est invalide, déconnecter
      if (error instanceof Error && error.message.includes('Token')) {
        await this.logout();
      }
      return null;
    }
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(profileData: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.isAuthenticated || !this.token) {
        throw new Error('Non authentifié');
      }

      console.log(' Mise à jour du profil en cours...');

      const response = await this.apiRequest('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success && response.user) {
        // Mettre à jour les données utilisateur localement
        this.user = response.user;
        await this.saveToStorage(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
        console.log(' Profil mis à jour avec succès');
      }

      return response;
    } catch (error) {
      console.error(' Erreur mise à jour profil:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
      };
    }
  }

  // Supprimer le compte utilisateur
  async deleteAccount(): Promise<AuthResponse> {
    try {
      if (!this.isAuthenticated || !this.token) {
        throw new Error('Non authentifié');
      }

      console.log(' Suppression du compte en cours...');

      const response = await this.apiRequest('/auth/delete-account', {
        method: 'DELETE',
      });

      if (response.success) {
        // Nettoyer les données locales après suppression réussie
        await this.logout();
        console.log(' Compte supprimé avec succès');
      }

      return response;
    } catch (error) {
      console.error(' Erreur suppression compte:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression du compte'
      };
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      console.log(' Déconnexion...');
      
      // Nettoyer les données locales seulement si on n'est pas sur web
      if (Platform.OS !== 'web') {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.IS_AUTHENTICATED
        ]);
      }

      // Réinitialiser l'état
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;

      console.log(' Déconnexion terminée');
    } catch (error) {
      console.error(' Erreur déconnexion:', error);
      // Force la réinitialisation même en cas d'erreur
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
    }
  }

  // Sauvegarder les données d'authentification
  private async saveAuthData(token: string, user: User): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      }

      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
    } catch (error) {
      console.error(' Erreur sauvegarde auth:', error);
      throw error;
    }
  }

  // Méthode helper pour sauvegarder dans le stockage
  private async saveToStorage(key: string, value: string): Promise<void> {
    if (Platform.OS !== 'web') {
      await AsyncStorage.setItem(key, value);
    }
  }

  // Getters pour l'état d'authentification
  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Vérifier si l'utilisateur est connecté
  async checkAuthStatus(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializeAuth();
    }
    return this.isAuthenticated;
  }

  // Test de connectivité avec le backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      const data = await response.json();
      console.log(' Backend connecté:', data.message);
      return true;
    } catch (error) {
      console.error(' Backend non accessible:', error);
      return false;
    }
  }
}

// Instance singleton
const authService = new AuthService();

export default authService; 