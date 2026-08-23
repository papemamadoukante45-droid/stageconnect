import { Link } from 'react-router-dom';
import { Briefcase, FileText, Clock, CheckCircle2, XCircle, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { LineChart } from '@/components/ui/Charts';
import { useAsync } from '@/hooks/useAsync';
import { companiesApi } from '@/api/companies';
import { useAuth } from '@/context/AuthContext';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function CompanyDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => companiesApi.getDashboard(), []);

  if (loading) return <SkeletonStats />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const chartData = data.monthly_applications.map((m) => ({ label: m.month, value: m.count }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Tableau de bord</h1>
          <p className="text-ink-500 mt-1">Bienvenue, {user?.email}</p>
        </div>
        <LinkButton to="/company/offers/create" leftIcon={<PlusCircle className="w-4 h-4" />}>Créer une offre</LinkButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Offres publiées" value={data.published} icon={<Briefcase className="w-5 h-5" />} color="primary" />
        <StatCard title="Candidatures reçues" value={data.total_applications} icon={<FileText className="w-5 h-5" />} color="accent" />
        <StatCard title="En attente" value={data.pending} icon={<Clock className="w-5 h-5" />} color="warning" />
        <StatCard title="Acceptées" value={data.accepted} icon={<CheckCircle2 className="w-5 h-5" />} color="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-ink-900">Évolution des candidatures</h3>
              </div>
            </div>
            <LineChart data={chartData} color="#059669" height={240} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="font-bold text-ink-900 mb-4">Statuts des candidatures</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent-50">
                <span className="text-sm font-semibold text-accent-700">En attente</span>
                <span className="text-lg font-bold text-accent-700">{data.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50">
                <span className="text-sm font-semibold text-primary-700">Acceptées</span>
                <span className="text-lg font-bold text-primary-700">{data.accepted}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary-50">
                <span className="text-sm font-semibold text-secondary-700">Refusées</span>
                <span className="text-lg font-bold text-secondary-700">{data.refused}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent applications */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-ink-900">Candidatures récentes</h3>
            <Link to="/company/applications" className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {data.recent_applications.map((app) => (
              <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors">
                <Avatar src={app.student_photo} name={app.student_name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 truncate">{app.student_name}</p>
                  <p className="text-sm text-ink-500 truncate">{app.offer_title}</p>
                </div>
                <div className="hidden sm:block text-sm text-ink-400">{formatDate(app.application_date)}</div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
