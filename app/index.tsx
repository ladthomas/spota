import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import useAuth from '../hooks/useAuth';

export default function IndexScreen() {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Attendre que l'état soit déterminé

    if (isAuthenticated) {
      // Utilisateur connecté -> rediriger vers l'accueil
      console.log('Utilisateur connecté, redirection vers l\'accueil...');
      router.replace('/(tabs)');
    } else {
      // Utilisateur non connecté -> rediriger vers login
      console.log(' Utilisateur non connecté, redirection vers login...');
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated]);

  // Afficher un écran de chargement pendant la détermination de l'état
  return (
    <LinearGradient
      colors={["#18171c", "#23202a", "#18171c"]}
      style={styles.container}
    >
      <ActivityIndicator size="large" color="#7f7fff" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 