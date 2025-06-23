import { useEffect, useState } from 'react';
import type { User } from '../services/authService';
import authService from '../services/authService';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export default function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Initialiser l'état d'authentification au montage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log(' Initialisation de l\'authentification...');
      
      // Attendre que le service d'auth soit initialisé
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const isAuthenticated = authService.getIsAuthenticated();
      const user = authService.getUser();
      const token = authService.getToken();

      console.log(' État d\'auth récupéré:', { isAuthenticated, user: user?.email, hasToken: !!token });

      setAuthState({
        isLoading: false,
        isAuthenticated,
        user,
        token,
      });

      if (isAuthenticated && user) {
        console.log(' Utilisateur connecté:', user.email);
      } else {
        console.log(' Utilisateur non connecté');
      }
    } catch (error) {
      console.error(' Erreur initialisation auth:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: response.user!,
          token: response.token!,
        });
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur de connexion' 
      };
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authService.register({ name, email, password, confirmPassword });
      
      if (response.success) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: response.user!,
          token: response.token!,
        });
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur d\'inscription' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      console.log(' Déconnexion réussie');
    } catch (error) {
      console.error(' Erreur déconnexion:', error);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.success && response.user) {
        // Mettre à jour l'état avec les nouvelles données utilisateur
        setAuthState(prev => ({
          ...prev,
          user: response.user!,
        }));
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil' 
      };
    }
  };

  const deleteAccount = async () => {
    try {
      console.log('🗑️ Hook useAuth: Début de la suppression...');
      const response = await authService.deleteAccount();
      console.log('🗑️ Hook useAuth: Réponse reçue:', response);
      
      if (response.success) {
        // Le service authService.deleteAccount() fait déjà le logout automatiquement
        // Mais on s'assure que l'état local est bien mis à jour
        console.log('🗑️ Hook useAuth: Suppression réussie, mise à jour de l\'état...');
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
        });
        console.log('✅ Hook useAuth: État mis à jour, utilisateur déconnecté');
        return { success: true };
      } else {
        console.log('❌ Hook useAuth: Échec de la suppression:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('❌ Hook useAuth: Erreur lors de la suppression:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression du compte' 
      };
    }
  };

  const refreshAuth = () => {
    initializeAuth();
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    refreshAuth,
    setAuthState,
  };
} 