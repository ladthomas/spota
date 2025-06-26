import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true pour les pages qui nécessitent une connexion
  redirectIfAuthenticated?: boolean; // true pour les pages login/register
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  redirectIfAuthenticated = false 
}: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Attendre que l'état soit déterminé

    if (redirectIfAuthenticated && isAuthenticated) {
      // Utilisateur connecté sur page login/register -> rediriger vers l'accueil
      console.log('🔄 Utilisateur connecté, redirection vers l\'accueil...');
      router.replace('/(tabs)');
      return;
    }

    if (requireAuth && !isAuthenticated) {
      // Page protégée et utilisateur non connecté -> rediriger vers login
      console.log('🔄 Utilisateur non connecté, redirection vers login...');
      router.replace('/login');
      return;
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectIfAuthenticated]);

  // Afficher un écran de chargement pendant l'initialisation
  if (isLoading) {
    return (
      <LinearGradient
        colors={["#18171c", "#23202a", "#18171c"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#7f7fff" />
      </LinearGradient>
    );
  }

  // Ne pas afficher le contenu si une redirection est nécessaire
  if (redirectIfAuthenticated && isAuthenticated) {
    return (
      <LinearGradient
        colors={["#18171c", "#23202a", "#18171c"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#7f7fff" />
      </LinearGradient>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <LinearGradient
        colors={["#18171c", "#23202a", "#18171c"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#7f7fff" />
      </LinearGradient>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 