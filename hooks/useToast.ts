import { useCallback, useState } from 'react';
import { ToastConfig } from '../components/ToastManager';

interface UseToastReturn {
  toasts: ToastConfig[];
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const generateId = () => `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showToast = useCallback((config: Omit<ToastConfig, 'id'>) => {
    const id = generateId();
    const fullConfig: ToastConfig = {
      ...config,
      id,
    };

    setToasts(prev => {
      const newToasts = [fullConfig, ...prev];
      // Limiter le nombre de toasts affichés simultanément
      return newToasts.slice(0, 3);
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, duration = 5000) => {
    showToast({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, duration = 6000) => {
    showToast({
      type: 'error',
      title,
      message,
      duration,
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, duration = 6000) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, duration = 5000) => {
    showToast({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 