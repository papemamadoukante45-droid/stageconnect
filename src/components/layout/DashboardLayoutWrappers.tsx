import { DashboardLayout, studentNav, companyNav, adminNav } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { studentsApi } from '@/api/students';
import { companiesApi } from '@/api/companies';

export function StudentLayout() {
  const { user } = useAuth();
  const { data: profile } = useAsync(() => studentsApi.getProfile(), []);

  return (
    <DashboardLayout
      navItems={studentNav}
      role="STUDENT"
      roleLabel="Espace étudiant"
      userName={profile ? `${profile.first_name} ${profile.last_name}` : user?.email || 'Étudiant'}
      userAvatar={profile?.photo}
    />
  );
}

export function CompanyLayout() {
  const { user } = useAuth();
  const { data: profile } = useAsync(() => companiesApi.getProfile(), []);

  return (
    <DashboardLayout
      navItems={companyNav}
      role="COMPANY"
      roleLabel="Espace entreprise"
      userName={profile?.name || user?.email || 'Entreprise'}
      userAvatar={profile?.logo}
    />
  );
}

export function AdminLayout() {
  const { user } = useAuth();
  return (
    <DashboardLayout
      navItems={adminNav}
      role="ADMIN"
      roleLabel="Espace administrateur"
      userName={user?.email || 'Administrateur'}
    />
  );
}
