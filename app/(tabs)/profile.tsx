import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PopupManager from '../../components/PopupManager';
import ToastManager from '../../components/ToastManager';
import { useTheme } from '../../contexts/ThemeContext';
import useAuth from '../../hooks/useAuth';
import { usePopup } from '../../hooks/usePopup';
import { useToast } from '../../hooks/useToast';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const { theme, colors } = useTheme();
  const { logout, user } = useAuth();
  
  // Hooks pour pop-ups et toasts
  const { 
    isVisible, 
    popupConfig, 
    showConfirm, 
    showSuccess, 
    showError, 
    showLoading, 
    hidePopup 
  } = usePopup();
  
  const { 
    toasts, 
    showSuccess: showToastSuccess, 
    showError: showToastError, 
    showInfo: showToastInfo, 
    removeToast 
  } = useToast();

  const navigateToSettings = () => {
    router.push('/settings/account');
  };

  const navigateToPayment = () => {
    router.push('/settings/payment');
  };

  const navigateToNotifications = () => {
    router.push('/settings/notifications');
  };

  const navigateToAppearance = () => {
    router.push('/settings/appearance');
  };

  // Fonction temporaire pour le partage
  const handleShareApp = () => {
    console.log('Partage à implémenter');
  };

  // Ces routes ne sont pas encore implémentées
  // En attendant, utilisons une fonction temporaire
  
  /*

  const navigateToSupport = () => {
    router.push('/settings/support');
  };

  const navigateToAppStore = () => {
    // Ouvrir le lien vers l'App Store
  };

  const navigateToTwitter = () => {
    // Ouvrir le lien Twitter
  };

  const navigateToEditProfile = () => {
    router.push('/profile/edit');
  };

  const navigateToTerms = () => {
    router.push('/legal/terms');
  };

  const navigateToCredits = () => {
    router.push('/legal/credits');
  };
  */

  const handleTemporaryNavigation = () => {
    console.log('Navigation temporaire - cette section sera implémentée plus tard');
  };

  const handleLogout = async () => {
    showConfirm(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      async () => {
        try {
          showLoading('Déconnexion', 'Déconnexion en cours...');
          showToastInfo('Déconnexion', 'Fermeture de votre session...');
          
          console.log('🚪 Déconnexion en cours...');
          await logout();
          
          hidePopup();
          showSuccess('Déconnexion réussie', 'À bientôt sur Spota !', 4000);
          showToastSuccess('Déconnexion réussie', 'Session fermée avec succès');
          
          console.log('✅ Déconnexion réussie, redirection vers register...');
          
          // Redirection après un délai pour permettre à l'utilisateur de voir le message
          setTimeout(() => {
            router.replace('/register');
          }, 4000);
        } catch (error) {
          hidePopup();
          console.error('❌ Erreur lors de la déconnexion:', error);
          showError(
            'Erreur de déconnexion',
            'Une erreur s\'est produite lors de la déconnexion. Redirection forcée...'
          );
          showToastError('Erreur', 'Problème lors de la déconnexion');
          
          // En cas d'erreur, rediriger quand même vers register après un délai
          setTimeout(() => {
            router.replace('/register');
          }, 3000);
        }
      },
      () => {
        showToastInfo('Déconnexion annulée', 'Vous restez connecté');
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profil</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Profil */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.name || 'Utilisateur'}
            </Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleTemporaryNavigation}>
              <Text style={[styles.editProfileText, { color: colors.textSecondary }]}>Modifier le profil</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Paramètres du compte */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Paramètres du compte</Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
       
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={navigateToSettings}>
            <View style={styles.menuIconContainer}>
              <MaterialCommunityIcons name="account-outline" size={24} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Paramètres du compte</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={() => {}}>
            <View style={styles.menuIconContainer}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Paiement</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity>
          
         {/* <TouchableOpacity style={styles.menuItem} onPress={navigateToNotifications}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity> */}
        </View>

        {/* Section Préférences */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Préférences</Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={navigateToNotifications}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={navigateToAppearance}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="color-palette-outline" size={22} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Apparence</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Section Ressources */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Ressources</Text>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-buoy-outline" size={22} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Contacter le support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="star-outline" size={22} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Notez dans l'App Store</Text>
            <Ionicons name="arrow-up-outline" size={20} color={colors.textSecondary} style={[styles.arrowIcon, styles.externalLink]} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: 'transparent' }]} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="logo-twitter" size={22} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text }]}>Suivez @SpotaApp</Text>
            <Ionicons name="arrow-up-outline" size={20} color={colors.textSecondary} style={[styles.arrowIcon, styles.externalLink]} />
          </TouchableOpacity>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          </View>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        {/* Version et infos légales */}
        <View style={styles.footer}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0 (123)</Text>
          <View style={styles.legalContainer}>
            <TouchableOpacity onPress={handleTemporaryNavigation}>
              <Text style={[styles.legalText, { color: colors.textSecondary }]}>Conditions et Confidentialité</Text>
            </TouchableOpacity>
            <Text style={[styles.legalDot, { color: colors.textSecondary }]}>•</Text>
            <TouchableOpacity onPress={handleTemporaryNavigation}>
              <Text style={[styles.legalText, { color: colors.textSecondary }]}>Données & Remerciements</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Pop-up Manager */}
      <PopupManager
        visible={isVisible}
        config={popupConfig}
        onClose={hidePopup}
      />
      
      {/* Toast Manager */}
      <ToastManager
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2ecc71',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 16,
  },
  section: {
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 25,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 17,
  },
  arrowIcon: {
    opacity: 0.5,
  },
  externalLink: {
    transform: [{ rotate: '45deg' }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 17,
    color: '#FF6B6B',
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerLogo: {
    width: 40,
    height: 40,
    marginBottom: 10,
    opacity: 0.5,
  },
  versionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 14,
  },
  legalDot: {
    marginHorizontal: 5,
  },
}); 