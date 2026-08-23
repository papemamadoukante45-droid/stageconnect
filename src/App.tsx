import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StudentLayout, CompanyLayout, AdminLayout } from '@/components/layout/DashboardLayoutWrappers';

// Public pages
import { HomePage } from '@/pages/public/HomePage';
import { OffersPage } from '@/pages/public/OffersPage';
import { OfferDetailPage } from '@/pages/public/OfferDetailPage';
import { CompaniesPage } from '@/pages/public/CompaniesPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { AboutPage } from '@/pages/public/AboutPage';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Student pages
import { StudentDashboardPage } from '@/pages/student/StudentDashboardPage';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentApplicationsPage } from '@/pages/student/StudentApplicationsPage';
import { StudentFavoritesPage } from '@/pages/student/StudentFavoritesPage';

// Company pages
import { CompanyDashboardPage } from '@/pages/company/CompanyDashboardPage';
import { CompanyProfilePage } from '@/pages/company/CompanyProfilePage';
import { CompanyOffersPage } from '@/pages/company/CompanyOffersPage';
import { CompanyCreateOfferPage } from '@/pages/company/CompanyCreateOfferPage';
import { CompanyEditOfferPage } from '@/pages/company/CompanyEditOfferPage';
import { CompanyApplicationsPage } from '@/pages/company/CompanyApplicationsPage';

// Admin pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminOffersPage } from '@/pages/admin/AdminOffersPage';
import { AdminApplicationsPage } from '@/pages/admin/AdminApplicationsPage';
import { AdminStatisticsPage } from '@/pages/admin/AdminStatisticsPage';

// Shared pages
import { NotificationsView } from '@/pages/shared/NotificationsView';
import { SettingsView } from '@/pages/shared/SettingsView';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/offres" element={<OffersPage />} />
              <Route path="/offres/:id" element={<OfferDetailPage />} />
              <Route path="/entreprises" element={<CompaniesPage />} />
              <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
              <Route path="/a-propos" element={<AboutPage />} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/student" element={<RegisterPage role="STUDENT" />} />
            <Route path="/register/company" element={<RegisterPage role="COMPANY" />} />

            {/* Student routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute roles={['STUDENT']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="applications" element={<StudentApplicationsPage />} />
              <Route path="favorites" element={<StudentFavoritesPage />} />
              <Route path="notifications" element={<NotificationsView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>

            {/* Company routes */}
            <Route
              path="/company"
              element={
                <ProtectedRoute roles={['COMPANY']}>
                  <CompanyLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CompanyDashboardPage />} />
              <Route path="profile" element={<CompanyProfilePage />} />
              <Route path="offers" element={<CompanyOffersPage />} />
              <Route path="offers/create" element={<CompanyCreateOfferPage />} />
              <Route path="offers/:id/edit" element={<CompanyEditOfferPage />} />
              <Route path="applications" element={<CompanyApplicationsPage />} />
              <Route path="notifications" element={<NotificationsView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="statistics" element={<AdminStatisticsPage />} />
              <Route path="notifications" element={<NotificationsView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
