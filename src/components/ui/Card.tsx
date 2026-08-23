import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: ReactNode;
}

export function Card({ hover, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink-100/80 shadow-card ${hover ? 'card-hover-lift hover:shadow-elevated hover:border-primary-200/60' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 border-b border-ink-100/80 ${className}`}>{children}</div>;
}

export function CardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 border-t border-ink-100/80 ${className}`}>{children}</div>;
}
