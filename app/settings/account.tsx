import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AccountSettingsScreen() {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres du compte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>E-mail</Text>
              <Text style={styles.settingDescription}>utilisateur@exemple.com</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Numéro de téléphone</Text>
              <Text style={styles.settingDescription}>Ajouter un numéro</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Nom d'utilisateur</Text>
              <Text style={styles.settingDescription}>Définir un nom d'utilisateur</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Identités Crypto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identités Crypto</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Adresse Ethereum</Text>
              <Text style={styles.settingDescription}>—</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="add-circle-outline" size={20} color="#6c58f5" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Adresse Solana</Text>
              <Text style={styles.settingDescription}>—</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="add-circle-outline" size={20} color="#6c58f5" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          La liaison des portefeuilles crypto n'est pas prise en charge 
          dans l'application pour le moment. Vous pouvez le faire sur le site web.
        </Text>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.dangerSectionTitle}>Zone de danger</Text>
          
          <TouchableOpacity style={styles.dangerItem}>
            <View>
              <Text style={styles.dangerItemTitle}>Supprimer le compte</Text>
              <Text style={styles.dangerItemDescription}>Cette action est irréversible</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#18171c',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#26252e',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  dangerSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  dangerItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  dangerItemDescription: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  disclaimer: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 20,
  },
}); 