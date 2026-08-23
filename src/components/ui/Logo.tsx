import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
  to?: string;
}

const sizes = {
  sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
  md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-lg' },
  lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xl' },
};

export function Logo({ size = 'md', showText = true, light = false, to = '/' }: LogoProps) {
  const s = sizes[size];
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 group" aria-label="StageConnect Sénégal">
      <div className={`${s.box} rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-105 group-hover:shadow-glow-lg transition-all duration-300`}>
        <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V10l5 3 5-3v6" />
          <circle cx="12" cy="7" r="2.5" fill="white" stroke="none" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-extrabold ${light ? 'text-white' : 'text-ink-900'} font-display tracking-tight`}>
            StageConnect
          </span>
          <span className={`text-[10px] font-bold ${light ? 'text-white/60' : 'text-primary-600'} tracking-[0.15em] uppercase`}>
            Sénégal
          </span>
        </div>
      )}
    </Link>
  );
}
