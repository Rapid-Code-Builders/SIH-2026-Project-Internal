import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading data...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#A67C5A' }} />
      <p className="text-sm" style={{ color: '#6B4F3E' }}>{message}</p>
    </div>
  );
}
