import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PopupManager from '../../components/PopupManager';
import ToastManager from '../../components/ToastManager';
import { useTheme } from '../../contexts/ThemeContext';
import useAuth, { type AuthState } from '../../hooks/useAuth';
import { usePopup } from '../../hooks/usePopup';
import { useToast } from '../../hooks/useToast';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const { user, isLoading, isAuthenticated, updateProfile, deleteAccount, logout, refreshAuth, setAuthState } = useAuth();

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

  // États pour les informations du compte (initialisées avec les données de l'utilisateur connecté)
  const [accountInfo, setAccountInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // États pour les modals
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mettre à jour les informations quand l'utilisateur change
  useEffect(() => {
    if (user) {
      console.log('🔄 Mise à jour des informations locales avec:', user.name);
      setAccountInfo({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Rediriger vers login seulement si le chargement est terminé ET que l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Afficher rien pendant le chargement ou si pas authentifié
  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const navigateBack = () => {
    router.back();
  };

  const handleEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setEditingValue(currentValue);
  };

  const handleSaveField = async () => {
    if (editingField && user) {
      setIsUpdating(true);
      
      // Sauvegarder l'état actuel pour pouvoir revenir en arrière en cas d'erreur
      const previousUser = { ...user };
      
      try {
        // Préparer les données à mettre à jour
        const updateData = {
          [editingField]: editingValue
        };

        console.log('📝 Mise à jour du champ:', editingField, 'avec la valeur:', editingValue);

        // ✨ OPTIMISTIC UPDATE : Mettre à jour immédiatement l'état local ET global
        const optimisticUser = {
          ...user,
          [editingField]: editingValue
        };

        // Mettre à jour l'état local immédiatement
        setAccountInfo(prev => ({
          ...prev,
          [editingField]: editingValue
        }));

        // Mettre à jour l'état global immédiatement (optimistic update)
        setAuthState((prev: AuthState) => ({
          ...prev,
          user: optimisticUser,
        }));

        console.log('⚡ Mise à jour optimiste appliquée. Interface mise à jour immédiatement.');

        // Appeler l'API pour confirmer la mise à jour
        const result = await updateProfile(updateData);
        
        if (result.success) {
          console.log('✅ Mise à jour confirmée par le backend:', result.user);
          
          // Forcer la synchronisation pour être sûr
          refreshAuth();
          
          setEditingField(null);
          setEditingValue('');
          showSuccess('Mise à jour réussie', 'Les informations ont été mises à jour dans la base de données');
          showToastSuccess('Profil mis à jour', 'Vos informations ont été sauvegardées');
        } else {
          // ❌ L'API a échoué, revenir à l'état précédent
          console.log('❌ Échec de la mise à jour, restauration de l\'état précédent');
          
          setAccountInfo({
            name: previousUser.name || '',
            email: previousUser.email || '',
          });
          
          // Restaurer l'état global
          setAuthState((prev: AuthState) => ({
            ...prev,
            user: previousUser,
          }));
          
          showError('Erreur de mise à jour', result.message || 'Impossible de mettre à jour les informations');
          showToastError('Échec de sauvegarde', 'Vérifiez votre connexion');
        }
      } catch (error) {
        // ❌ Erreur réseau, revenir à l'état précédent
        console.log('❌ Erreur réseau, restauration de l\'état précédent');
        
        setAccountInfo({
          name: previousUser.name || '',
          email: previousUser.email || '',
        });
        
        // Restaurer l'état global
        setAuthState((prev: AuthState) => ({
          ...prev,
          user: previousUser,
        }));
        
        showError('Erreur réseau', 'Une erreur est survenue lors de la mise à jour');
        showToastError('Problème de connexion', 'Veuillez réessayer plus tard');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteAccount = () => {
    console.log('🗑️ Fonction handleDeleteAccount appelée');
    showConfirm(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues définitivement.',
      async () => {
            try {
              console.log('🗑️ Début de la suppression du compte...');
              console.log('🗑️ Utilisateur actuel:', user);
              console.log('🗑️ Authentifié:', isAuthenticated);
          
          showLoading('Suppression du compte', 'Suppression de votre compte en cours...');
          showToastInfo('Suppression', 'Traitement de votre demande...');
              
              // Supprimer le compte côté serveur et attendre la confirmation
              console.log('🗑️ Appel de deleteAccount()...');
              const result = await deleteAccount();
              console.log('🗑️ Résultat de deleteAccount:', result);
              
              if (result.success) {
                // Suppression réussie, déconnexion automatique immédiate
                console.log('✅ Suppression réussie, déconnexion automatique en cours...');
            
            hidePopup();
            showSuccess('Compte supprimé', 'Votre compte a été supprimé avec succès. Vous avez été déconnecté automatiquement.', 6000);
            showToastSuccess('Suppression réussie', 'Redirection vers la page d\'accueil...');
                
                // Déconnexion immédiate et redirection
                console.log('🚪 Déconnexion automatique...');
                await logout();
                console.log('🔄 Redirection vers /login...');
                
            // Redirection après un délai pour permettre à l'utilisateur de voir le message
                setTimeout(() => {
              router.replace('/login');
            }, 6000);
              } else {
                // Erreur lors de la suppression
            hidePopup();
                console.log('❌ Échec de la suppression:', result.message);
            showError(
                  'Erreur de suppression',
                  result.message || 'Impossible de supprimer le compte de la base de données. Veuillez réessayer.',
                  [
                    {
                      text: 'Réessayer',
                  style: 'default',
                      onPress: () => handleDeleteAccount()
                    },
                    {
                      text: 'Annuler',
                  style: 'cancel',
                  onPress: () => {}
                    }
                  ]
                );
            showToastError('Échec de suppression', 'Veuillez réessayer plus tard');
              }
            } catch (error) {
          hidePopup();
          console.error('❌ Erreur suppression compte:', error);
          showError(
            'Erreur inattendue',
            'Une erreur inattendue s\'est produite lors de la suppression. Veuillez réessayer.',
                [
                  {
                    text: 'Réessayer',
                style: 'default',
                    onPress: () => handleDeleteAccount()
                  },
                  {
                    text: 'Annuler',
                style: 'cancel',
                onPress: () => {}
                  }
                ]
              );
          showToastError('Erreur réseau', 'Problème de connexion au serveur');
        }
      },
      () => {
        showToastInfo('Suppression annulée', 'Votre compte n\'a pas été supprimé');
      }
    );
  };

  const getFieldLabel = (fieldName: string) => {
    const labels: { [key: string]: string } = {
      name: 'Nom complet',
      email: 'E-mail',
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
        {/* Informations du compte */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionSubTitle, { color: colors.text }]}>Informations du compte</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleEditField('name', accountInfo.name)}
          >
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Nom complet</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                {accountInfo.name || 'Ajouter votre nom'}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#333' : '#E5E5E5' }]} />

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
                <TouchableOpacity onPress={() => setEditingField(null)} disabled={isUpdating}>
                  <Text style={[styles.modalCancel, { 
                    color: colors.textSecondary,
                    opacity: isUpdating ? 0.5 : 1
                  }]}>Annuler</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={handleSaveField} disabled={isUpdating}>
                  <Text style={[styles.modalSave, { opacity: isUpdating ? 0.5 : 1 }]}>
                    {isUpdating ? 'Sauvegarde...' : 'Enregistrer'}
                  </Text>
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
                  keyboardType={editingField === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={editingField === 'email' ? 'none' : 'words'}
                  autoFocus={true}
                  selectionColor={theme === 'dark' ? '#FFD36F' : '#007AFF'}
                  editable={!isUpdating}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

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