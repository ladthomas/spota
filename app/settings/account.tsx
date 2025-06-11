import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();

  // États pour les informations du compte
  const [accountInfo, setAccountInfo] = useState({
    email: 'utilisateur@exemple.com',
    phone: '',
    username: '',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
  });

  // États pour les modals
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const navigateBack = () => {
    router.back();
  };

  const handleEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setEditingValue(currentValue);
  };

  const handleSaveField = () => {
    if (editingField) {
      setAccountInfo(prev => ({
        ...prev,
        [editingField]: editingValue
      }));
      setEditingField(null);
      setEditingValue('');
      Alert.alert('Succès', 'Les informations ont été mises à jour');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès');
          }
        }
      ]
    );
  };

  const getFieldLabel = (fieldName: string) => {
    const labels: { [key: string]: string } = {
      email: 'E-mail',
      phone: 'Numéro de téléphone',
      username: 'Nom d\'utilisateur',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      dateOfBirth: 'Date de naissance',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
    };
    return labels[fieldName] || fieldName;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Informations de base */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Informations de base</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('email', accountInfo.email)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>E-mail</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.email || 'Ajouter un e-mail'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('phone', accountInfo.phone)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Numéro de téléphone</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.phone || 'Ajouter un numéro'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('username', accountInfo.username)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Nom d'utilisateur</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.username || 'Définir un nom d\'utilisateur'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Informations personnelles */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Informations personnelles</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('firstName', accountInfo.firstName)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Prénom</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.firstName || 'Ajouter votre prénom'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('lastName', accountInfo.lastName)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Nom de famille</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.lastName || 'Ajouter votre nom'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('dateOfBirth', accountInfo.dateOfBirth)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Date de naissance</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.dateOfBirth || 'Ajouter votre date de naissance'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Adresse */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Adresse</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('address', accountInfo.address)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Adresse</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.address || 'Ajouter votre adresse'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('city', accountInfo.city)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Ville</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.city || 'Ajouter votre ville'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('country', accountInfo.country)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Pays</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.country || 'Ajouter votre pays'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={styles.dangerSectionTitle}>Zone de danger</Text>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View>
              <Text style={styles.dangerItemTitle}>Supprimer le compte</Text>
              <Text style={[styles.dangerItemDescription, { color: colors.textSecondary }]}>Cette action est irréversible</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={editingField !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingField(null)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <TouchableOpacity 
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setEditingField(null)}
          >
            <TouchableOpacity 
              style={[styles.modalContent, { backgroundColor: colors.surface }]}
              activeOpacity={1}
              onPress={() => {}}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setEditingField(null)}>
                  <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Annuler</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={handleSaveField}>
                  <Text style={styles.modalSave}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {editingField && getFieldLabel(editingField)}
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F2F2F7', 
                    color: theme === 'dark' ? '#FFFFFF' : '#000000',
                    borderColor: theme === 'dark' ? '#48484A' : '#C7C7CC'
                  }]}
                  value={editingValue}
                  onChangeText={setEditingValue}
                  placeholder={`Entrez votre ${editingField && getFieldLabel(editingField).toLowerCase()}`}
                  placeholderTextColor={theme === 'dark' ? '#8E8E93' : '#8E8E93'}
                  keyboardType={editingField === 'email' ? 'email-address' : editingField === 'phone' ? 'phone-pad' : 'default'}
                  autoCapitalize={editingField === 'email' ? 'none' : 'words'}
                  autoFocus={true}
                  selectionColor={theme === 'dark' ? '#FFD36F' : '#007AFF'}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    paddingVertical: 16,
    paddingHorizontal: 4,
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
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
  },
  dangerItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  dangerItemDescription: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: -4,
  },
  disclaimer: {
    fontSize: 14,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    color: '#FFD36F',
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 50,
    fontWeight: '500',
  },
}); 