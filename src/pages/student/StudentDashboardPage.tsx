import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, XCircle, Heart, Search, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { SkeletonStats } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/Button';
import { OfferCard } from '@/components/offers/OfferCard';
import { DonutChart } from '@/components/ui/Charts';
import { useAsync } from '@/hooks/useAsync';
import { studentsApi } from '@/api/students';
import { useAuth } from '@/context/AuthContext';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => studentsApi.getDashboard(), []);

  if (loading) return <div><SkeletonStats /></div>;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const donutData = [
    { label: 'En attente', value: data.pending, color: '#f59e0b' },
    { label: 'Acceptées', value: data.accepted, color: '#059669' },
    { label: 'Refusées', value: data.refused, color: '#dc2626' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Bonjour, {user?.email}</h1>
          <p className="text-ink-500 mt-1">Voici un aperçu de votre activité</p>
        </div>
        <LinkButton to="/offres" leftIcon={<Search className="w-4 h-4" />}>Rechercher un stage</LinkButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Candidatures envoyées" value={data.sent} icon={<FileText className="w-5 h-5" />} color="primary" />
        <StatCard title="En attente" value={data.pending} icon={<Clock className="w-5 h-5" />} color="warning" />
        <StatCard title="Acceptées" value={data.accepted} icon={<CheckCircle2 className="w-5 h-5" />} color="primary" />
        <StatCard title="Favoris" value={data.favorites} icon={<Heart className="w-5 h-5" />} color="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-1">
          <CardBody>
            <h3 className="font-bold text-ink-900 mb-4">Répartition des candidatures</h3>
            <DonutChart
              data={donutData}
              centerValue={String(data.sent)}
              centerLabel="Total"
            />
          </CardBody>
        </Card>

        {/* Recommended */}
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-ink-900">Offres recommandées</h3>
              </div>
              <Link to="/offres" className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.recommended.slice(0, 2).map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/student/applications">
          <Card hover className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink-900">Mes candidatures</p>
              <p className="text-sm text-ink-500">Suivez vos candidatures</p>
            </div>
            <ArrowRight className="w-5 h-5 text-ink-300" />
          </Card>
        </Link>
        <Link to="/student/profile">
          <Card hover className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink-900">Mon profil</p>
              <p className="text-sm text-ink-500">Complétez votre profil</p>
            </div>
            <ArrowRight className="w-5 h-5 text-ink-300" />
          </Card>
        </Link>
        <Link to="/student/favorites">
          <Card hover className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink-900">Mes favoris</p>
              <p className="text-sm text-ink-500">Offres sauvegardées</p>
            </div>
            <ArrowRight className="w-5 h-5 text-ink-300" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
