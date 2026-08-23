import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, User, Briefcase, Search, FileText, Heart, Bell, Settings,
  LogOut, Menu, X, Building2, PlusCircle, Users, BarChart3, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  roleLabel: string;
  userName: string;
  userAvatar?: string | null;
}

const roleColors: Record<string, string> = {
  STUDENT: 'from-primary-600 to-accent-500',
  COMPANY: 'from-primary-700 to-primary-500',
  ADMIN: 'from-ink-800 to-ink-700',
};

const roleBadge: Record<string, { variant: 'primary' | 'accent' | 'neutral'; label: string }> = {
  STUDENT: { variant: 'primary', label: 'Étudiant' },
  COMPANY: { variant: 'accent', label: 'Entreprise' },
  ADMIN: { variant: 'neutral', label: 'Administrateur' },
};

export function DashboardLayout({ navItems, role, roleLabel, userName, userAvatar }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-ink-100 z-30">
        <div className="h-16 flex items-center px-5 border-b border-ink-100">
          <Logo size="sm" to="/" />
        </div>
        <div className="px-3 py-3 border-b border-ink-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-ink-50">
            <Avatar src={userAvatar} name={userName} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink-900 truncate">{userName}</p>
              <Badge variant={roleBadge[role].variant} className="mt-0.5">{roleBadge[role].label}</Badge>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 group ${
                isActive(item.to)
                  ? 'bg-gradient-to-r from-primary-50 to-transparent text-primary-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              {isActive(item.to) && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary-600 rounded-full" />}
              <span className={`transition-transform group-hover:scale-110 ${isActive(item.to) ? 'text-primary-600' : 'text-ink-400'}`}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-accent-500 text-white rounded-full animate-pulse-soft">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-ink-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary-600 hover:bg-secondary-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-elevated animate-slide-in-right flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-ink-100">
              <Logo size="sm" />
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-ink-50">
                <X className="w-5 h-5 text-ink-600" />
              </button>
            </div>
            <div className="px-3 py-3 border-b border-ink-100">
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-ink-50">
                <Avatar src={userAvatar} name={userName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink-900 truncate">{userName}</p>
                  <Badge variant={roleBadge[role].variant} className="mt-0.5">{roleBadge[role].label}</Badge>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 ${
                    isActive(item.to) ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <span className={isActive(item.to) ? 'text-primary-600' : 'text-ink-400'}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-bold bg-accent-500 text-white rounded-full">{item.badge}</span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-ink-100">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-secondary-600 hover:bg-secondary-50 w-full">
                <LogOut className="w-5 h-5" /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-ink-100 h-16 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-ink-50">
            <Menu className="w-5 h-5 text-ink-700" />
          </button>
          <Logo size="sm" showText={false} />
          <div className="relative">
            <button onClick={() => setUserMenu(!userMenu)} className="p-1">
              <Avatar src={userAvatar} name={userName} size="sm" />
            </button>
            {userMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-elevated border border-ink-100 py-2 animate-fade-in-scale">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-30 glass border-b border-ink-100/80 h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-ink-900">{roleLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-2.5 rounded-xl text-ink-600 hover:bg-ink-50 transition-all hover:scale-105">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-500 rounded-full ring-2 ring-white animate-pulse-soft" />
            </Link>
            <div className="relative">
              <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-ink-50 transition-all">
                <Avatar src={userAvatar} name={userName} size="sm" />
                <ChevronDown className={`w-4 h-4 text-ink-500 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-ink-100/80 py-2 animate-fade-in-scale overflow-hidden">
                  <div className="px-4 py-3 border-b border-ink-50 bg-gradient-to-r from-primary-50/50 to-transparent">
                    <p className="text-sm font-bold text-ink-900">{userName}</p>
                    <p className="text-xs text-ink-500">{roleBadge[role].label}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Navigation presets
export const studentNav: NavItem[] = [
  { label: 'Tableau de bord', to: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Mon profil', to: '/student/profile', icon: <User className="w-5 h-5" /> },
  { label: 'Rechercher un stage', to: '/offres', icon: <Search className="w-5 h-5" /> },
  { label: 'Mes candidatures', to: '/student/applications', icon: <FileText className="w-5 h-5" /> },
  { label: 'Mes favoris', to: '/student/favorites', icon: <Heart className="w-5 h-5" /> },
  { label: 'Notifications', to: '/student/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Paramètres', to: '/student/settings', icon: <Settings className="w-5 h-5" /> },
];

export const companyNav: NavItem[] = [
  { label: 'Tableau de bord', to: '/company/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Mon entreprise', to: '/company/profile', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Mes offres', to: '/company/offers', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Créer une offre', to: '/company/offers/create', icon: <PlusCircle className="w-5 h-5" /> },
  { label: 'Candidatures reçues', to: '/company/applications', icon: <FileText className="w-5 h-5" /> },
  { label: 'Notifications', to: '/company/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Paramètres', to: '/company/settings', icon: <Settings className="w-5 h-5" /> },
];

export const adminNav: NavItem[] = [
  { label: 'Tableau de bord', to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Étudiants', to: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Entreprises', to: '/admin/users?role=COMPANY', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Offres', to: '/admin/offers', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Candidatures', to: '/admin/applications', icon: <FileText className="w-5 h-5" /> },
  { label: 'Statistiques', to: '/admin/statistics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Notifications', to: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Paramètres', to: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];
