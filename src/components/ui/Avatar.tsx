interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-24 h-24 text-3xl',
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow-soft ${className}`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white font-bold flex items-center justify-center ring-2 ring-white shadow-soft ${className}`}
    >
      {initials(name)}
    </div>
  );
}

interface LogoProps {
  company?: { name: string; logo: string | null };
  name: string;
  logo?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const logoSizes = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

export function CompanyLogo({ name, logo, size = 'md', className = '' }: LogoProps) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${logoSizes[size]} rounded-xl object-cover bg-white ring-1 ring-ink-100 ${className}`}
      />
    );
  }
  return (
    <div
      className={`${logoSizes[size]} rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white font-bold flex items-center justify-center shadow-soft ${className}`}
    >
      {initials(name)}
    </div>
  );
}
