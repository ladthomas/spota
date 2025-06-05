import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);

  const navigateToSettings = () => {
    router.push('/settings/account');
  };

  const navigateToPayment = () => {
    router.push('/settings/payment');
  };

  const navigateToNotifications = () => {
    router.push('/settings/notifications');
  };

  // Ces routes ne sont pas encore implémentées
  // En attendant, utilisons une fonction temporaire
  
  /*
  const navigateToAppearance = () => {
    router.push('/settings/appearance');
  };

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

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Profil utilisateur */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>T Y</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleTemporaryNavigation}>
              <Text style={styles.editProfileText}>Modifier le profil</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Compte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres du compte</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToSettings}>
            <View style={styles.menuIconContainer}>
              <MaterialCommunityIcons name="account-outline" size={24} color="#999" />
            </View>
            <Text style={styles.menuText}>Paramètres du compte</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToPayment}>
            <View style={styles.menuIconContainer}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#999" />
            </View>
            <Text style={styles.menuText}>Paiement</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToNotifications}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="#999" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Section Préférences */}
        <Text style={styles.sectionTitle}>Préférences</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToNotifications}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={22} color="#999" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="color-palette-outline" size={22} color="#999" />
            </View>
            <Text style={styles.menuText}>Apparence</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* Section Ressources */}
        <Text style={styles.sectionTitle}>Ressources</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-buoy-outline" size={22} color="#999" />
            </View>
            <Text style={styles.menuText}>Contacter le support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="star-outline" size={22} color="#999" />
            </View>
            <Text style={styles.menuText}>Notez dans l'App Store</Text>
            <Ionicons name="arrow-up-outline" size={20} color="#999" style={[styles.arrowIcon, styles.externalLink]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTemporaryNavigation}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="logo-twitter" size={22} color="#999" />
            </View>
            <Text style={styles.menuText}>Suivez @SpotaApp</Text>
            <Ionicons name="arrow-up-outline" size={20} color="#999" style={[styles.arrowIcon, styles.externalLink]} />
          </TouchableOpacity>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
          <Text style={styles.versionText}>Version 1.0.0 (123)</Text>
          <View style={styles.legalContainer}>
            <TouchableOpacity onPress={handleTemporaryNavigation}>
              <Text style={styles.legalText}>Conditions et Confidentialité</Text>
            </TouchableOpacity>
            <Text style={styles.legalDot}>•</Text>
            <TouchableOpacity onPress={handleTemporaryNavigation}>
              <Text style={styles.legalText}>Données & Remerciements</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171c',
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
    color: '#fff',
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
    color: '#fff',
    marginBottom: 5,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    color: '#999',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#222',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 25,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#666',
    marginLeft: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 17,
    color: '#fff',
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
    backgroundColor: '#222',
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
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalText: {
    color: '#666',
    fontSize: 14,
  },
  legalDot: {
    color: '#666',
    marginHorizontal: 5,
  },
}); 