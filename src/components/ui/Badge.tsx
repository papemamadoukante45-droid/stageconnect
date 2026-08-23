import type { ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'warning' | 'danger' | 'neutral' | 'success';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<Variant, { bg: string; text: string; dot: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
  accent: { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500' },
  warning: { bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-400' },
  danger: { bg: 'bg-secondary-50', text: 'text-secondary-700', dot: 'bg-secondary-500' },
  neutral: { bg: 'bg-ink-100', text: 'text-ink-600', dot: 'bg-ink-400' },
  success: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
};

export function Badge({ variant = 'neutral', children, className = '', dot }: BadgeProps) {
  const v = variants[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${v.bg} ${v.text} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: Variant; label: string }> = {
    EN_ATTENTE: { variant: 'warning', label: 'En attente' },
    ACCEPTEE: { variant: 'success', label: 'Acceptée' },
    REFUSEE: { variant: 'danger', label: 'Refusée' },
    ACTIVE: { variant: 'success', label: 'Active' },
    DRAFT: { variant: 'neutral', label: 'Brouillon' },
    CLOSED: { variant: 'warning', label: 'Clôturée' },
    EXPIRED: { variant: 'danger', label: 'Expirée' },
  };
  const config = map[status] || { variant: 'neutral' as Variant, label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
