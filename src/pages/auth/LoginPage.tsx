import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Building2, Info, Sparkles, Briefcase } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { UserRole } from '@/types';
import { senegalImages, senegalAvatars } from '@/lib/senegal-images';

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = (role: UserRole) => {
    const from = (location.state as { from?: string })?.from;
    if (from) return navigate(from);
    if (role === 'STUDENT') return navigate('/student/dashboard');
    if (role === 'COMPANY') return navigate('/company/dashboard');
    if (role === 'ADMIN') return navigate('/admin/dashboard');
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Connexion réussie', `Bienvenue ${user.email}`);
      redirectTo(user.role);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Email ou mot de passe incorrect.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: UserRole) => {
    if (role === 'STUDENT') { setEmail('etudiant@stageconnect.sn'); setPassword('etudiant123'); }
    if (role === 'COMPANY') { setEmail('entreprise@stageconnect.sn'); setPassword('entreprise123'); }
    if (role === 'ADMIN') { setEmail('admin@stageconnect.sn'); setPassword('admin123'); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={senegalImages.businessmenDakar} alt="Hommes d'affaires à Dakar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 via-primary-900/80 to-ink-900/95" />
        <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-col justify-between p-14 text-white">
          <Logo light size="lg" />
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4 text-accent-400" /> Bienvenue
            </div>
            <h1 className="text-4xl font-extrabold font-display leading-tight text-balance">
              Connecter les talents<br />aux opportunités
            </h1>
            <p className="mt-4 text-white/70 text-lg max-w-md leading-relaxed">
              La plateforme moderne de recherche et de gestion de stages au Sénégal.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Briefcase, text: '+500 offres de stage disponibles' },
                { icon: Building2, text: '+200 entreprises partenaires' },
                { icon: GraduationCap, text: '+1000 étudiants connectés' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-3 text-white/90">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <t.icon className="w-4 h-4 text-accent-400" />
                  </div>
                  {t.text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[senegalAvatars.womanSmiling, senegalAvatars.manConfident, senegalAvatars.womanGreen, senegalAvatars.manYoung].map((src, i) => (
                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full ring-2 ring-ink-900 object-cover" />
              ))}
            </div>
            <p className="text-white/50 text-sm">© 2026 StageConnect Sénégal</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-gradient-to-b from-white to-ink-50 relative">
        <div className="absolute inset-0 dot-pattern opacity-30 lg:hidden" />
        <div className="w-full max-w-md relative">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-ink-900 font-display">Connexion</h2>
          <p className="mt-2 text-ink-500">Connectez-vous à votre compte StageConnect</p>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50/50 border border-primary-100/50">
            <p className="text-xs font-bold text-primary-700 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Info className="w-3.5 h-3.5" /> Comptes de démonstration
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => fillDemo('STUDENT')} className="px-3 py-1.5 rounded-xl bg-white shadow-soft text-xs font-semibold text-primary-700 hover:bg-primary-50 hover:shadow-glow transition-all flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Étudiant
              </button>
              <button onClick={() => fillDemo('COMPANY')} className="px-3 py-1.5 rounded-xl bg-white shadow-soft text-xs font-semibold text-accent-700 hover:bg-accent-50 hover:shadow-glow-accent transition-all flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Entreprise
              </button>
              <button onClick={() => fillDemo('ADMIN')} className="px-3 py-1.5 rounded-xl bg-white shadow-soft text-xs font-semibold text-ink-700 hover:bg-ink-100 transition-all">
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="votre@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-9 text-ink-400 hover:text-ink-700"
                aria-label="Afficher le mot de passe"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-secondary-50 border border-secondary-200 text-sm text-secondary-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full shine" size="lg" loading={loading} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Se connecter
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Pas encore de compte ?{' '}
            <Link to="/register/student" className="font-semibold text-primary-600 hover:text-primary-700">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
