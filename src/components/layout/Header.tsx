import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, ChevronDown, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button, LinkButton } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Offres de stage', to: '/offres' },
  { label: 'Entreprises', to: '/entreprises' },
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'À propos', to: '/a-propos' },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboardLink =
    user?.role === 'STUDENT' ? '/student/dashboard' :
    user?.role === 'COMPANY' ? '/company/dashboard' :
    user?.role === 'ADMIN' ? '/admin/dashboard' : '/login';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-soft border-b border-ink-100' : 'bg-transparent'}`}>
      <div className="h-0.5 bg-senegal-stripe w-full" />
      <div className="container-page">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link to={dashboardLink} className="relative p-2 rounded-lg text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-white" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-ink-50 transition-colors"
                  >
                    <Avatar src={null} name={`${user.role === 'STUDENT' ? 'Étudiant' : user.role === 'COMPANY' ? 'Entreprise' : 'Admin'}`} size="sm" />
                    <ChevronDown className="w-4 h-4 text-ink-500" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-ink-100 py-2 animate-fade-in-scale">
                      <div className="px-4 py-2 border-b border-ink-50 bg-gradient-to-r from-primary-50/50 to-transparent">
                        <p className="text-sm font-bold text-ink-900">{user.email}</p>
                        <p className="text-xs text-ink-500">{user.role === 'STUDENT' ? 'Étudiant' : user.role === 'COMPANY' ? 'Entreprise' : 'Administrateur'}</p>
                      </div>
                      <Link to={dashboardLink} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">
                        <User className="w-4 h-4 text-ink-400" /> Mon tableau de bord
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Se connecter</Button>
                </Link>
                <LinkButton to="/register/student" size="sm" leftIcon={<GraduationCap className="w-4 h-4" />}>Créer un compte</LinkButton>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-ink-100 animate-fade-in">
          <nav className="container-page py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 text-sm font-semibold rounded-lg ${
                  location.pathname === link.to ? 'text-primary-700 bg-primary-50' : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-ink-100 mt-2 pt-3 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link to={dashboardLink} className="px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 rounded-lg flex items-center gap-2">
                    <User className="w-4 h-4" /> Mon tableau de bord
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-sm font-semibold text-secondary-600 hover:bg-secondary-50 rounded-lg flex items-center gap-2 text-left">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 rounded-lg">Se connecter</Link>
                  <div className="flex gap-2 px-2">
                    <Link to="/register/student" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full" leftIcon={<GraduationCap className="w-4 h-4" />}>Étudiant</Button>
                    </Link>
                    <Link to="/register/company" className="flex-1">
                      <Button variant="primary" size="sm" className="w-full" leftIcon={<Building2 className="w-4 h-4" />}>Entreprise</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
