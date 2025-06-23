import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
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
  } = useToast();

  const handleLogin = async () => {
    if (isLoading) return;

    // Validation des champs avec toast pour les erreurs mineures
    if (!email.trim()) {
      showToastError('Email requis', 'Veuillez saisir votre adresse email');
      return;
    }
    
    if (!password) {
      showToastError('Mot de passe requis', 'Veuillez saisir votre mot de passe');
      return;
    }
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToastError('Email invalide', 'Veuillez saisir une adresse email valide');
      return;
    }

    try {
      setIsLoading(true);
      showLoading('Connexion', 'Connexion en cours...');
      showToastInfo('Connexion', 'Vérification de vos identifiants...');
      console.log('Tentative de connexion...', email);

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

      // Connexion via le service d'authentification
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password
      });

      hidePopup();
      
      if (response.success) {
        console.log(' Connexion réussie, redirection vers l\'accueil...');
        showSuccess('Connexion réussie', 'Bienvenue sur Spota !', 6000);
        showToastSuccess('Connexion réussie', 'Redirection vers l\'accueil...');
        // Rediriger automatiquement vers l'écran principal après un délai
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 6000);
      } else {
        showError('Erreur de connexion', response.message);
        showToastError('Échec de connexion', 'Vérifiez vos identifiants');
      }
    } catch (error) {
      hidePopup();
      console.error(' Erreur connexion:', error);
      showError(
        'Erreur', 
        'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.'
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
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={["#7f7fff", "#FFD36F", "#ff6f91"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoGradient}
                >
                  <Text style={styles.logoText}>S</Text>
                </LinearGradient>
              </View>
              <Text style={styles.title}>Connexion</Text>
              <Text style={styles.subtitle}>Retrouvez des sorties près de chez vous</Text>
            </View>

            <View style={styles.form}>
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
                  onChangeText={setPassword}
                  secureTextEntry={showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  returnKeyType="done"
                  enablesReturnKeyAutomatically={true}
                  blurOnSubmit={true}
                  spellCheck={false}
                  passwordRules=""
                  importantForAutofill="no"
                  onSubmitEditing={handleLogin}
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
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
                <Text style={styles.footerText}>Pas encore de compte ? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLink}>S'inscrire</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
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
    marginBottom: 40,
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
    // Force la couleur pour empêcher le surlignage
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#7f7fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FFD36F',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#18171c',
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
    color: '#7f7fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
}); 