import { Users, Building2, Briefcase, FileText, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { LineChart, DonutChart, BarChart } from '@/components/ui/Charts';
import { useAsync } from '@/hooks/useAsync';
import { adminApi } from '@/api/admin';

export function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAsync(() => adminApi.getStatistics(), []);

  if (loading) return <SkeletonStats />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const evolutionData = data.monthly_evolution.map((m) => ({ label: m.month, value: m.offers }));
  const appEvolution = data.monthly_evolution.map((m) => ({ label: m.month, value: m.applications }));
  const donutData = [
    { label: 'En attente', value: data.pending, color: '#f59e0b' },
    { label: 'Acceptées', value: data.accepted, color: '#059669' },
    { label: 'Refusées', value: data.refused, color: '#dc2626' },
  ];
  const domainData = data.top_domains.slice(0, 5).map((d) => ({ label: d.domain, value: d.count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Tableau de bord administrateur</h1>
        <p className="text-ink-500 mt-1">Vue d'ensemble de la plateforme StageConnect Sénégal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Étudiants inscrits" value={data.students} icon={<Users className="w-5 h-5" />} color="primary" trend={12} trendLabel="vs mois dernier" />
        <StatCard title="Entreprises" value={data.companies} icon={<Building2 className="w-5 h-5" />} color="accent" trend={8} />
        <StatCard title="Offres publiées" value={data.offers} icon={<Briefcase className="w-5 h-5" />} color="warning" trend={15} />
        <StatCard title="Candidatures" value={data.applications} icon={<FileText className="w-5 h-5" />} color="warm" trend={22} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-ink-900">Évolution des offres (2026)</h3>
            </div>
            <LineChart data={evolutionData} color="#059669" height={220} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent-600" />
              <h3 className="font-bold text-ink-900">Évolution des candidatures</h3>
            </div>
            <BarChart data={appEvolution} color="#f59e0b" height={220} />
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="font-bold text-ink-900 mb-4">Statut des candidatures</h3>
            <DonutChart data={donutData} centerValue={String(data.applications)} centerLabel="Total" />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardBody>
            <h3 className="font-bold text-ink-900 mb-4">Domaines les plus recherchés</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.top_domains.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-ink-100">
                  <span className="text-sm font-semibold text-ink-700">{d.domain}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-sm font-bold">{d.count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="font-bold text-ink-900 mb-4">Villes avec le plus d'offres</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {data.top_cities.map((c, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-ink-50">
                <p className="text-2xl font-extrabold text-ink-900 font-display">{c.count}</p>
                <p className="text-sm text-ink-500 mt-1">{c.city}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
