import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export interface PopupConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message: string;
  duration?: number; // en millisecondes, 0 = manuel
  buttons?: Array<{
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }>;
  onClose?: () => void;
}

interface PopupManagerProps {
  visible: boolean;
  config: PopupConfig | null;
  onClose: () => void;
}

const PopupManager: React.FC<PopupManagerProps> = ({ visible, config, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (visible && config) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-fermeture si durée spécifiée
      if (config.duration && config.duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, config.duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Animation de sortie
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, config]);

  const handleClose = () => {
    if (config?.onClose) {
      config.onClose();
    }
    onClose();
  };

  const getIconName = () => {
    switch (config?.type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      case 'loading': return 'time';
      default: return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (config?.type) {
      case 'success': return '#7f7fff';  // Violet Spota
      case 'error': return '#ff6f91';    // Rose Spota
      case 'warning': return '#FFD36F';  // Orange Spota
      case 'info': return '#7f7fff';     // Violet Spota
      case 'loading': return '#7f7fff';  // Violet Spota
      default: return '#7f7fff';
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (config?.type) {
      case 'success': return ['#7f7fff', '#FFD36F']; // Couleurs Spota
      case 'error': return ['#ff6f91', '#FFD36F'];   // Rose-orange Spota
      case 'warning': return ['#FFD36F', '#ff6f91']; // Orange-rose Spota
      case 'info': return ['#7f7fff', '#ff6f91'];    // Violet-rose Spota
      case 'loading': return ['#7f7fff', '#FFD36F']; // Violet-orange Spota
      default: return ['#7f7fff', '#FFD36F'];
    }
  };

  if (!config) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.popup}>
                {/* Header avec icône */}
                <View style={styles.header}>
                  <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
                    <Ionicons
                      name={getIconName()}
                      size={32}
                      color={getIconColor()}
                    />
                  </View>
                </View>

                {/* Contenu */}
                <View style={styles.content}>
                  <Text style={styles.title}>{config.title}</Text>
                  <Text style={styles.message}>{config.message}</Text>
                </View>

                {/* Boutons */}
                <View style={styles.buttonsContainer}>
                  {config.buttons && config.buttons.length > 0 ? (
                    config.buttons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.button,
                          button.style === 'cancel' && styles.cancelButton,
                          button.style === 'destructive' && styles.destructiveButton,
                        ]}
                        onPress={() => {
                          if (button.onPress) button.onPress();
                          handleClose();
                        }}
                      >
                        {button.style === 'destructive' ? (
                          <LinearGradient
                            colors={['#F44336', '#d32f2f']}
                            style={styles.buttonGradient}
                          >
                            <Text style={[styles.buttonText, styles.destructiveButtonText]}>
                              {button.text}
                            </Text>
                          </LinearGradient>
                        ) : button.style === 'default' ? (
                          <LinearGradient
                            colors={getGradientColors()}
                            style={styles.buttonGradient}
                          >
                            <Text style={styles.buttonText}>{button.text}</Text>
                          </LinearGradient>
                        ) : (
                          <Text style={styles.cancelButtonText}>{button.text}</Text>
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <TouchableOpacity style={styles.button} onPress={handleClose}>
                      <LinearGradient
                        colors={getGradientColors()}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.buttonText}>OK</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 23, 28, 0.85)', // Couleur de fond Spota avec transparence
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
  },
  popup: {
    backgroundColor: '#23202a', // Couleur de fond intermédiaire Spota
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(127, 127, 255, 0.2)', // Bordure violet Spota
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b0b0b0',
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  destructiveButton: {
    backgroundColor: 'transparent',
  },
  destructiveButtonText: {
    color: '#ffffff',
  },
});

export default PopupManager; 