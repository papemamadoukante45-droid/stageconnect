import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, School, GraduationCap, Eye, EyeOff, ArrowRight, Building2, CheckCircle2, Zap, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { senegalImages } from '@/lib/senegal-images';

interface Props {
  role: 'STUDENT' | 'COMPANY';
}

export function RegisterPage({ role }: Props) {
  const { registerStudent, registerCompany } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isStudent = role === 'STUDENT';

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.password !== form.password2) e.password2 = 'Les mots de passe ne correspondent pas';

    if (isStudent) {
      if (!form.first_name) e.first_name = 'Prénom requis';
      if (!form.last_name) e.last_name = 'Nom requis';
      if (!form.school) e.school = 'Établissement requis';
    } else {
      if (!form.name) e.name = 'Nom de l\'entreprise requis';
      if (!form.sector) e.sector = 'Secteur requis';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isStudent) {
        await registerStudent({
          email: form.email, password: form.password, password2: form.password2,
          first_name: form.first_name, last_name: form.last_name,
          phone: form.phone || '', city: form.city || '', school: form.school,
          education: form.education || '',
        });
        toast.success('Compte créé', 'Bienvenue sur StageConnect Sénégal !');
        navigate('/student/dashboard');
      } else {
        await registerCompany({
          email: form.email, password: form.password, password2: form.password2,
          name: form.name, sector: form.sector, location: form.location || '', phone: form.phone || '',
        });
        toast.success('Compte créé', 'Bienvenue sur StageConnect Sénégal !');
        navigate('/company/dashboard');
      }
    } catch (err) {
      toast.error('Erreur d\'inscription', err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={isStudent ? senegalImages.studentsStudy : senegalImages.businessCollab} alt={isStudent ? 'Étudiants au Sénégal' : 'Entreprises au Sénégal'} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/90 via-primary-900/80 to-ink-900/95" />
        <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-col justify-between p-14 text-white">
          <Logo light size="lg" />
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-5">
              {isStudent ? <GraduationCap className="w-4 h-4 text-accent-400" /> : <Building2 className="w-4 h-4 text-accent-400" />}
              {isStudent ? 'Compte étudiant' : 'Compte entreprise'}
            </div>
            <h1 className="text-4xl font-extrabold font-display leading-tight text-balance">
              {isStudent ? 'Démarrez votre carrière professionnelle' : 'Trouvez vos futurs talents'}
            </h1>
            <p className="mt-4 text-white/70 text-lg max-w-md leading-relaxed">
              {isStudent
                ? 'Accédez à des centaines d\'offres de stage au Sénégal et postulez en un clic.'
                : 'Publiez vos offres et recevez des candidatures qualifiées d\'étudiants sénégalais.'}
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: CheckCircle2, text: isStudent ? 'Inscription 100% gratuite' : 'Publiez des offres illimitées' },
                { icon: Zap, text: isStudent ? 'Candidature en un clic' : 'Centralisez vos candidatures' },
                { icon: TrendingUp, text: isStudent ? 'Suivez vos candidatures' : 'Trouvez les meilleurs talents' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-white/90">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-accent-400" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-10">
            <p className="text-white/50 text-sm">© 2026 StageConnect Sénégal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-ink-50 overflow-y-auto relative">
        <div className="absolute inset-0 dot-pattern opacity-30 lg:hidden" />
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 relative">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden mb-8"><Logo size="lg" /></div>
            <h2 className="text-3xl font-extrabold text-ink-900 font-display">
              {isStudent ? 'Créer un compte étudiant' : 'Créer un compte entreprise'}
            </h2>
            <p className="mt-2 text-ink-500">Inscription gratuite en moins d'une minute</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isStudent ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Prénom" name="first_name" leftIcon={<User className="w-4 h-4" />} value={form.first_name || ''} onChange={(e) => update('first_name', e.target.value)} error={errors.first_name} required />
                    <Input label="Nom" name="last_name" leftIcon={<User className="w-4 h-4" />} value={form.last_name || ''} onChange={(e) => update('last_name', e.target.value)} error={errors.last_name} required />
                  </div>
                  <Input label="Email" type="email" name="email" leftIcon={<Mail className="w-4 h-4" />} value={form.email || ''} onChange={(e) => update('email', e.target.value)} error={errors.email} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Téléphone" name="phone" leftIcon={<Phone className="w-4 h-4" />} placeholder="+221 ..." value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} />
                    <Input label="Ville" name="city" leftIcon={<MapPin className="w-4 h-4" />} value={form.city || ''} onChange={(e) => update('city', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Établissement" name="school" leftIcon={<School className="w-4 h-4" />} value={form.school || ''} onChange={(e) => update('school', e.target.value)} error={errors.school} required />
                    <Select label="Niveau d'étude" name="education" value={form.education || ''} onChange={(e) => update('education', e.target.value)}>
                      <option value="">Sélectionner</option>
                      <option value="Licence 1">Licence 1</option>
                      <option value="Licence 2">Licence 2</option>
                      <option value="Licence 3">Licence 3</option>
                      <option value="Master 1">Master 1</option>
                      <option value="Master 2">Master 2</option>
                      <option value="Doctorat">Doctorat</option>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <Input label="Nom de l'entreprise" name="name" leftIcon={<Building2 className="w-4 h-4" />} value={form.name || ''} onChange={(e) => update('name', e.target.value)} error={errors.name} required />
                  <Input label="Email" type="email" name="email" leftIcon={<Mail className="w-4 h-4" />} value={form.email || ''} onChange={(e) => update('email', e.target.value)} error={errors.email} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Secteur d'activité" name="sector" value={form.sector || ''} onChange={(e) => update('sector', e.target.value)} error={errors.sector} required>
                      <option value="">Sélectionner</option>
                      <option>Télécommunications & IT</option>
                      <option>FinTech & Services</option>
                      <option>IA & Data Science</option>
                      <option>Énergie</option>
                      <option>Banque & Finance</option>
                      <option>Communication & Marketing</option>
                      <option>Autre</option>
                    </Select>
                    <Input label="Ville" name="location" leftIcon={<MapPin className="w-4 h-4" />} value={form.location || ''} onChange={(e) => update('location', e.target.value)} />
                  </div>
                  <Input label="Téléphone" name="phone" leftIcon={<Phone className="w-4 h-4" />} placeholder="+221 ..." value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} />
                </>
              )}

              <div className="relative">
                <Input label="Mot de passe" type={showPassword ? 'text' : 'password'} name="password" leftIcon={<Lock className="w-4 h-4" />} value={form.password || ''} onChange={(e) => update('password', e.target.value)} error={errors.password} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-9 text-ink-400 hover:text-ink-700" aria-label="Afficher">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input label="Confirmer le mot de passe" type="password" name="password2" leftIcon={<Lock className="w-4 h-4" />} value={form.password2 || ''} onChange={(e) => update('password2', e.target.value)} error={errors.password2} required />

              <Button type="submit" className="w-full shine" size="lg" loading={loading} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-ink-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Se connecter</Link>
            </div>
            {!isStudent && (
              <p className="mt-3 text-center text-sm text-ink-500">
                Vous êtes étudiant ?{' '}
                <Link to="/register/student" className="font-semibold text-primary-600 hover:text-primary-700">Créer un compte étudiant</Link>
              </p>
            )}
            {isStudent && (
              <p className="mt-3 text-center text-sm text-ink-500">
                Vous êtes une entreprise ?{' '}
                <Link to="/register/company" className="font-semibold text-primary-600 hover:text-primary-700">Créer un compte entreprise</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
