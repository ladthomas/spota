import { useCallback, useState } from 'react';
import { PopupConfig } from '../components/PopupManager';

interface UsePopupReturn {
  popupConfig: PopupConfig | null;
  isVisible: boolean;
  showPopup: (config: Omit<PopupConfig, 'id'>) => void;
  hidePopup: () => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, buttons?: PopupConfig['buttons']) => void;
  showWarning: (title: string, message: string, buttons?: PopupConfig['buttons']) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  showLoading: (title: string, message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

export const usePopup = (): UsePopupReturn => {
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateId = () => `popup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showPopup = useCallback((config: Omit<PopupConfig, 'id'>) => {
    const fullConfig: PopupConfig = {
      ...config,
      id: generateId(),
    };
    setPopupConfig(fullConfig);
    setIsVisible(true);
  }, []);

  const hidePopup = useCallback(() => {
    setIsVisible(false);
    // Délai pour permettre l'animation de sortie
    setTimeout(() => {
      setPopupConfig(null);
    }, 200);
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration = 6000) => {
    showPopup({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [showPopup]);

  const showError = useCallback((title: string, message: string, buttons?: PopupConfig['buttons']) => {
    showPopup({
      type: 'error',
      title,
      message,
      duration: 0, // Manuel par défaut pour les erreurs
      buttons,
    });
  }, [showPopup]);

  const showWarning = useCallback((title: string, message: string, buttons?: PopupConfig['buttons']) => {
    showPopup({
      type: 'warning',
      title,
      message,
      duration: 0,
      buttons,
    });
  }, [showPopup]);

  const showInfo = useCallback((title: string, message: string, duration = 6000) => {
    showPopup({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [showPopup]);

  const showLoading = useCallback((title: string, message: string) => {
    showPopup({
      type: 'loading',
      title,
      message,
      duration: 0, // Manuel pour les chargements
    });
  }, [showPopup]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showPopup({
      type: 'warning',
      title,
      message,
      duration: 0,
      buttons: [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: onConfirm,
        },
      ],
    });
  }, [showPopup]);

  return {
    popupConfig,
    isVisible,
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirm,
  };
}; 