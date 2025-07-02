import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import AuthGuard from '../components/AuthGuard';
import PopupManager from '../components/PopupManager';
import ToastManager from '../components/ToastManager';
import { usePopup } from '../hooks/usePopup';
import { useToast } from '../hooks/useToast';
import authService from '../services/authService';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  
  // Refs pour les champs
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  const {
    popupConfig,
    isVisible,
    hidePopup,
    showSuccess,
    showError,
    showLoading,
  } = usePopup();
  
  const {
    toasts,
    removeToast,
    showSuccess: showToastSuccess,
    showError: showToastError,
    showInfo: showToastInfo,
    showWarning: showToastWarning,
  } = useToast();

  // Fonction pour valider le mot de passe en temps réel
  const getPasswordValidation = () => {
    const hasLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      hasLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: hasLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const handleRegister = async () => {
    if (isLoading) return;

    // Validations détaillées avec toasts
    if (!name.trim()) {
      showToastError('Nom requis', 'Veuillez saisir votre nom complet');
      return;
    }
    
    if (name.trim().length < 2) {
      showToastError('Nom trop court', 'Le nom doit contenir au moins 2 caractères');
      return;
    }

    if (!email.trim()) {
      showToastError('Email requis', 'Veuillez saisir votre adresse email');
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToastError('Email invalide', 'Veuillez saisir une adresse email valide');
      return;
    }

    if (!password) {
      showToastError('Mot de passe requis', 'Veuillez créer un mot de passe');
      return;
    }

    if (password.length < 6) {
      showToastWarning('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Validation stricte du mot de passe avant envoi
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      showError(
        'Mot de passe requis', 
        'Votre mot de passe doit contenir :\n\n' +
        '• Au moins 6 caractères\n' +
        '• Au moins une majuscule (A-Z)\n' +
        '• Au moins une minuscule (a-z)\n' +
        '• Au moins un chiffre (0-9)\n\n' +
        'Exemple : MonMotDePasse123'
      );
      return;
    }

    if (!confirmPassword) {
      showToastError('Confirmation requise', 'Veuillez confirmer votre mot de passe');
      return;
    }

    if (password !== confirmPassword) {
      showToastError('Mots de passe différents', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setIsLoading(true);
      showLoading('Inscription', 'Création de votre compte...');
      showToastInfo('Inscription', 'Vérification des informations...');
      console.log(' Tentative d\'inscription...', email);

      // Test de connexion au backend
      const isConnected = await authService.testConnection();
      if (!isConnected) {
        hidePopup();
        showError(
          'Erreur de connexion', 
          'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.'
        );
        return;
      }

      // Inscription via le service d'authentification
      const response = await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword
      });

      hidePopup();

      if (response.success) {
        console.log(' Inscription réussie, redirection vers l\'accueil...');
        showSuccess('Inscription réussie', 'Bienvenue dans la communauté Spota !', 7000);
        showToastSuccess('Compte créé', 'Redirection vers l\'accueil...');
        // Rediriger automatiquement vers l'écran principal après un délai
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 7000);
      } else {
        // Vérifier si c'est une erreur de validation du mot de passe
        if (response.message?.includes('Données de validation invalides') || 
            response.message?.includes('mot de passe') ||
            response.message?.includes('majuscule') ||
            response.message?.includes('minuscule') ||
            response.message?.includes('chiffre')) {
          
          showError(
            'Mot de passe requis', 
            'Votre mot de passe doit contenir :\n\n' +
            '• Au moins 6 caractères\n' +
            '• Au moins une majuscule (A-Z)\n' +
            '• Au moins une minuscule (a-z)\n' +
            '• Au moins un chiffre (0-9)\n\n' +
            'Exemple : MonMotDePasse123'
          );
        } else {
          showError('Erreur d\'inscription', response.message);
        }
        showToastError('Échec d\'inscription', 'Vérifiez vos informations');
      }
    } catch (error) {
      hidePopup();
      console.error(' Erreur inscription:', error);
      showError(
        'Erreur', 
        'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.'
      );
      showToastError('Erreur réseau', 'Problème de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard redirectIfAuthenticated={true}>
      <LinearGradient
        colors={["#18171c", "#23202a", "#18171c"]}
        style={styles.container}
      >
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={["#ff6f91", "#FFD36F", "#7f7fff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoGradient}
                  >
                    <Text style={styles.logoText}>S</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez la communauté Spota</Text>
              </View>

              <View style={styles.form}>
                {/* Champs fantômes pour tromper l'autocomplétion */}
                <TextInput
                  style={{ position: 'absolute', left: -1000, opacity: 0 }}
                  autoComplete="username"
                  value=""
                  onChangeText={() => {}}
                />
                <TextInput
                  style={{ position: 'absolute', left: -1000, opacity: 0 }}
                  autoComplete="current-password"
                  secureTextEntry={true}
                  value=""
                  onChangeText={() => {}}
                />
                
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={22} color="#b0b0b0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    placeholderTextColor="#b0b0b0"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="off"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={22} color="#b0b0b0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#b0b0b0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#b0b0b0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#b0b0b0"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setShowPasswordHints(text.length > 0);
                    }}
                    onFocus={() => setShowPasswordHints(password.length > 0)}
                    onBlur={() => setShowPasswordHints(false)}
                    secureTextEntry={showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    passwordRules=""
                    importantForAutofill="no"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    ref={passwordRef}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={22} 
                      color="#b0b0b0" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Indicateur de validation du mot de passe */}
                {showPasswordHints && (
                  <View style={styles.passwordHints}>
                    <Text style={styles.passwordHintsTitle}>Votre mot de passe doit contenir :</Text>
                    {(() => {
                      const validation = getPasswordValidation();
                      return (
                        <View style={styles.passwordCriteria}>
                          <View style={styles.criteriaItem}>
                            <Ionicons 
                              name={validation.hasLength ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={validation.hasLength ? "#4CAF50" : "#FF5252"} 
                            />
                            <Text style={[styles.criteriaText, validation.hasLength && styles.criteriaValid]}>
                              Au moins 6 caractères
                            </Text>
                          </View>
                          <View style={styles.criteriaItem}>
                            <Ionicons 
                              name={validation.hasUpperCase ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={validation.hasUpperCase ? "#4CAF50" : "#FF5252"} 
                            />
                            <Text style={[styles.criteriaText, validation.hasUpperCase && styles.criteriaValid]}>
                              Une majuscule (A-Z)
                            </Text>
                          </View>
                          <View style={styles.criteriaItem}>
                            <Ionicons 
                              name={validation.hasLowerCase ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={validation.hasLowerCase ? "#4CAF50" : "#FF5252"} 
                            />
                            <Text style={[styles.criteriaText, validation.hasLowerCase && styles.criteriaValid]}>
                              Une minuscule (a-z)
                            </Text>
                          </View>
                          <View style={styles.criteriaItem}>
                            <Ionicons 
                              name={validation.hasNumbers ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={validation.hasNumbers ? "#4CAF50" : "#FF5252"} 
                            />
                            <Text style={[styles.criteriaText, validation.hasNumbers && styles.criteriaValid]}>
                              Un chiffre (0-9)
                            </Text>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                )}
                
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#b0b0b0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#b0b0b0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    passwordRules=""
                    importantForAutofill="no"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={handleRegister}
                    ref={confirmPasswordRef}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={22} 
                      color="#b0b0b0" 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.separator}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>ou</Text>
                  <View style={styles.separatorLine} />
                </View>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Déjà un compte ? </Text>
                  <Link href="/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.footerLink}>Se connecter</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      
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
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2730',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 2,
    minHeight: 55,
    borderWidth: 1,
    borderColor: '#3A3740',
    // Force la couleur pour empêcher le surlignage
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 15,
    minHeight: 50,
    lineHeight: 20,
    backgroundColor: '#2A2730',
    outline: 'none',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    // Force la couleur pour empêcher le surlignage
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#7f7fff',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  separatorText: {
    color: '#b0b0b0',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2730',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#b0b0b0',
    fontSize: 16,
  },
  footerLink: {
    color: '#FFD36F',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordHints: {
    backgroundColor: '#2A2730',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3A3740',
  },
  passwordHintsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  passwordCriteria: {
    gap: 8,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  criteriaText: {
    color: '#b0b0b0',
    fontSize: 13,
  },
  criteriaValid: {
    color: '#4CAF50',
  },
}); 