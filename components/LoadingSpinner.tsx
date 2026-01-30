import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 24, className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 size={size} className="animate-spin text-blue-600" />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

export function TableLoadingState() {
  return (
    <div className="bg-white rounded-lg shadow p-12">
      <LoadingSpinner size={40} text="Loading data..." />
    </div>
  );
}

export function OverlayLoadingState({ text = 'Processing...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <LoadingSpinner size={48} text={text} />
      </div>
    </div>
  );
}
