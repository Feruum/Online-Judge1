import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400'
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm transition-all",
        typeStyles[type],
        isVisible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}







