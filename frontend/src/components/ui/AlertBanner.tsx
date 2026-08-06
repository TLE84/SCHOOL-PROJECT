import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertBannerProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export function AlertBanner({ title, description, variant = 'info' }: AlertBannerProps) {
  const variants = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Info className="text-blue-600 w-5 h-5 mt-0.5" />
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle className="text-yellow-600 w-5 h-5 mt-0.5" />
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="text-red-600 w-5 h-5 mt-0.5" />
    }
  };

  const activeVariant = variants[variant];

  return (
    <div className={cn("flex gap-3 p-4 border rounded-lg", activeVariant.bg)}>
      {activeVariant.icon}
      <div>
        <h4 className={cn("font-semibold text-sm", activeVariant.text)}>{title}</h4>
        {description && (
          <p className={cn("text-sm mt-1 opacity-90", activeVariant.text)}>{description}</p>
        )}
      </div>
    </div>
  );
}
