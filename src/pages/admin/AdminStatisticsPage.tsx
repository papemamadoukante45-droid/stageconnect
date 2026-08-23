import { Users, Building2, Briefcase, FileText, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { LineChart, BarChart, DonutChart, HorizontalBarChart } from '@/components/ui/Charts';
import { useAsync } from '@/hooks/useAsync';
import { adminApi } from '@/api/admin';

export function AdminStatisticsPage() {
  const { data, loading, error, refetch } = useAsync(() => adminApi.getStatistics(), []);

  if (loading) return <SkeletonStats />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const offersEvolution = data.monthly_evolution.map((m) => ({ label: m.month, value: m.offers }));
  const applicationsEvolution = data.monthly_evolution.map((m) => ({ label: m.month, value: m.applications }));
  const donutData = [
    { label: 'En attente', value: data.pending, color: '#f59e0b' },
    { label: 'Acceptées', value: data.accepted, color: '#059669' },
    { label: 'Refusées', value: data.refused, color: '#dc2626' },
  ];
  const domainsData = data.top_domains.map((d) => ({ label: d.domain, value: d.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Statistiques</h1>
        <p className="text-ink-500 mt-1">Analyse détaillée de la plateforme</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Étudiants" value={data.students} icon={<Users className="w-5 h-5" />} color="primary" />
        <StatCard title="Entreprises" value={data.companies} icon={<Building2 className="w-5 h-5" />} color="accent" />
        <StatCard title="Offres" value={data.offers} icon={<Briefcase className="w-5 h-5" />} color="warning" />
        <StatCard title="Candidatures" value={data.applications} icon={<FileText className="w-5 h-5" />} color="warm" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-ink-900">Évolution mensuelle des offres</h3>
            </div>
            <LineChart data={offersEvolution} color="#059669" height={240} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent-600" />
              <h3 className="font-bold text-ink-900">Évolution mensuelle des candidatures</h3>
            </div>
            <BarChart data={applicationsEvolution} color="#f59e0b" height={240} />
          </CardBody>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="font-bold text-ink-900 mb-4">Répartition des candidatures</h3>
            <DonutChart data={donutData} centerValue={String(data.applications)} centerLabel="Total" />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-ink-900">Domaines les plus recherchés</h3>
            </div>
            <HorizontalBarChart data={domainsData} color="#059669" />
          </CardBody>
        </Card>
      </div>

      {/* Cities */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-accent-600" />
            <h3 className="font-bold text-ink-900">Villes avec le plus d'offres</h3>
          </div>
          <HorizontalBarChart data={data.top_cities.map((c) => ({ label: c.city, value: c.count }))} color="#f59e0b" />
        </CardBody>
      </Card>
    </div>
  );
}
