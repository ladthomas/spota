import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export interface ToastConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // en millisecondes
  onClose?: () => void;
}

interface ToastManagerProps {
  toasts: ToastConfig[];
  onRemoveToast: (id: string) => void;
}

const ToastItem: React.FC<{
  toast: ToastConfig;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleRemove = useCallback(() => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (toast.onClose) toast.onClose();
      onRemove();
    });
  }, [translateY, opacity, toast.onClose, onRemove]);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-fermeture
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove, translateY, opacity]);

  const getIconName = () => {
    switch (toast.type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };

  const getColors = (): [string, string] => {
    switch (toast.type) {
      case 'success': return ['#7f7fff', '#FFD36F']; // Couleurs Spota
      case 'error': return ['#ff6f91', '#FFD36F'];   // Rose-orange Spota
      case 'warning': return ['#FFD36F', '#ff6f91']; // Orange-rose Spota
      case 'info': return ['#7f7fff', '#ff6f91'];    // Violet-rose Spota
      default: return ['#7f7fff', '#FFD36F'];
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleRemove}
        style={styles.touchableContainer}
      >
        <LinearGradient
          colors={getColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.toastGradient}
        >
          <View style={styles.toastContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIconName()}
                size={24}
                color="#ffffff"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.toastTitle}>{toast.title}</Text>
              {toast.message && (
                <Text style={styles.toastMessage}>{toast.message}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleRemove}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ToastManager: React.FC<ToastManagerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <View style={styles.container}>
      {toasts.map((toast, index) => (
        <View key={toast.id} style={[styles.toastWrapper, { zIndex: 1000 - index }]}>
          <ToastItem
            toast={toast}
            onRemove={() => onRemoveToast(toast.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  toastContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  touchableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  toastGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 18,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ToastManager; 