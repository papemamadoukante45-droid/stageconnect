import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OfferCard } from '@/components/offers/OfferCard';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { offersApi } from '@/api/offers';
import { useAuth } from '@/context/AuthContext';
import { studentsApi } from '@/api/students';
import { useToast } from '@/context/ToastContext';
import type { OfferFilters } from '@/types';

const domains = [
  'Informatique', 'Intelligence Artificielle', 'Marketing', 'Finance', 'Communication',
  'Ressources humaines', 'Réseaux', 'Développement web', 'Data', 'Cybersécurité',
];

export function OffersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();

  const [filters, setFilters] = useState<OfferFilters>({
    search: searchParams.get('search') || '',
    domain: searchParams.get('domain') || 'all',
    location: searchParams.get('location') || 'all',
    type: searchParams.get('type') || 'all',
    page: Number(searchParams.get('page')) || 1,
    ordering: searchParams.get('ordering') || '-publication_date',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const { data, loading, error, refetch } = useAsync(() => offersApi.list(filters), [filters]);

  // Load favorites if student
  const { } = useAsync(() =>
    studentsApi.getFavorites().then((res) => {
      setFavorites(res.results.map((o) => o.id));
      return res;
    }), [user?.id]
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 1) params[k] = String(v);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const toggleFavorite = async (offerId: number) => {
    if (!user || user.role !== 'STUDENT') {
      toast.info('Connectez-vous', 'Créez un compte étudiant pour sauvegarder des offres.');
      return;
    }
    try {
      if (favorites.includes(offerId)) {
        await studentsApi.removeFavorite(offerId);
        setFavorites(favorites.filter((id) => id !== offerId));
        toast.success('Retiré des favoris');
      } else {
        await studentsApi.addFavorite(offerId);
        setFavorites([...favorites, offerId]);
        toast.success('Ajouté aux favoris');
      }
    } catch {
      toast.error('Erreur', 'Impossible de modifier vos favoris.');
    }
  };

  const totalPages = data ? Math.ceil(data.count / 6) : 1;

  return (
    <div>
      <section className="relative bg-ink-900 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/15 rounded-full blur-[100px]" />
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-5">
            <Briefcase className="w-4 h-4 text-accent-400" /> Opportunités
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white font-display">Offres de stage</h1>
          <p className="mt-3 text-lg text-ink-300 max-w-2xl">Trouvez le stage idéal parmi nos opportunités au Sénégal</p>
        </div>
      </section>

    <div className="container-page py-8 lg:py-12">

      {/* Search & Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-card border border-ink-100/80 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <Input
            placeholder="Rechercher par mot-clé, entreprise, compétence..."
            leftIcon={<Search className="w-4 h-4" />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value, page: 1 })}
            >
              <option value="all">Tous les domaines</option>
              {domains.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value, page: 1 })}
            >
              <option value="all">Toutes les villes</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
            </Select>
            <Select
              value={filters.ordering}
              onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
            >
              <option value="-publication_date">Plus récents</option>
              <option value="deadline">Date limite proche</option>
            </Select>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="lg:hidden"
            >
              Filtres
            </Button>
          </div>
        </div>

        {/* Active filters chips */}
        {(filters.search || filters.domain !== 'all' || filters.location !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-ink-50">
            <span className="text-xs font-bold text-ink-400 uppercase tracking-wide">Filtres actifs:</span>
            {filters.search && (
              <Chip label={`"${filters.search}"`} onClear={() => setFilters({ ...filters, search: '', page: 1 })} />
            )}
            {filters.domain !== 'all' && (
              <Chip label={filters.domain!} onClear={() => setFilters({ ...filters, domain: 'all', page: 1 })} />
            )}
            {filters.location !== 'all' && (
              <Chip label={filters.location!} onClear={() => setFilters({ ...filters, location: 'all', page: 1 })} />
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-ink-500">
          {loading ? <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" /> Chargement...</span> : data ? `${data.count} offre${data.count > 1 ? 's' : ''} trouvée${data.count > 1 ? 's' : ''}` : ''}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.results.map((offer, i) => (
              <div key={offer.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <OfferCard
                  offer={offer}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(offer.id)}
                />
              </div>
            ))}
          </div>
          <Pagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      ) : (
        <EmptyState
          type="empty"
          title="Aucune offre trouvée"
          message="Essayez de modifier vos critères de recherche pour trouver plus d'opportunités."
          action={<Button variant="primary" onClick={() => setFilters({ search: '', domain: 'all', location: 'all', type: 'all', page: 1 })}>Réinitialiser les filtres</Button>}
        />
      )}
    </div>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 text-xs font-semibold border border-primary-100/50">
      {label}
      <button onClick={onClear} className="hover:text-primary-900 hover:scale-110 transition-all">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
