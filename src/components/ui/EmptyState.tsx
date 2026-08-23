import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, WifiOff, Lock, ServerCrash, FileQuestion } from 'lucide-react';
import { Button } from './Button';

type StateType = 'empty' | 'error' | 'unauthorized' | 'forbidden' | 'server' | 'network' | 'notfound';

interface StateProps {
  type?: StateType;
  title: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const config: Record<StateType, { icon: ReactNode; color: string }> = {
  empty: { icon: <Inbox className="w-8 h-8" />, color: 'text-ink-400 bg-ink-100' },
  error: { icon: <AlertTriangle className="w-8 h-8" />, color: 'text-warm-600 bg-warm-50' },
  unauthorized: { icon: <Lock className="w-8 h-8" />, color: 'text-secondary-600 bg-secondary-50' },
  forbidden: { icon: <Lock className="w-8 h-8" />, color: 'text-warm-600 bg-warm-50' },
  server: { icon: <ServerCrash className="w-8 h-8" />, color: 'text-warm-600 bg-warm-50' },
  network: { icon: <WifiOff className="w-8 h-8" />, color: 'text-warm-600 bg-warm-50' },
  notfound: { icon: <FileQuestion className="w-8 h-8" />, color: 'text-ink-400 bg-ink-100' },
};

export function EmptyState({ type = 'empty', title, message, action, icon }: StateProps) {
  const c = config[type];
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${c.color}`}>
        {icon || c.icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
      {message && <p className="mt-1.5 text-ink-500 max-w-md">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Une erreur est survenue', message, onRetry }: { title?: string; message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      type="error"
      title={title}
      message={message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.'}
      action={onRetry && <Button variant="primary" onClick={onRetry}>Réessayer</Button>}
    />
  );
}
