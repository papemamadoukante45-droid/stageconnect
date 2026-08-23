import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { CompanyLogo } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { companiesApi } from '@/api/companies';

export function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');

  const { data, loading, error, refetch } = useAsync(
    () => companiesApi.list({ search, sector }),
    [search, sector]
  );

  return (
    <div>
      <section className="relative bg-ink-900 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/15 rounded-full blur-[100px]" />
        <div className="container-page relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-5">
            <Building2 className="w-4 h-4 text-accent-400" /> Partenaires
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white font-display">Entreprises partenaires</h1>
          <p className="mt-3 text-lg text-ink-300 max-w-2xl">Découvrez les entreprises sénégalaises qui recrutent des stagiaires sur StageConnect</p>
        </div>
      </section>

    <div className="container-page py-8 lg:py-12">

      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Rechercher une entreprise..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="all">Tous les secteurs</option>
            <option value="Télécommunications & IT">Télécommunications & IT</option>
            <option value="FinTech & Services">FinTech & Services</option>
            <option value="IA & Data Science">IA & Data Science</option>
            <option value="Énergie">Énergie</option>
            <option value="Banque & Finance">Banque & Finance</option>
            <option value="Communication & Marketing">Communication & Marketing</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.results.map((company) => (
            <Card key={company.id} hover className="p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo name={company.name} logo={company.logo} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink-900 line-clamp-1">{company.name}</h3>
                  <p className="text-sm text-primary-600 font-semibold mt-0.5">{company.sector}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-500 leading-relaxed line-clamp-3">{company.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ink-400" /> {company.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-ink-400" /> {company.offers_count || 0} offre{(company.offers_count || 0) > 1 ? 's' : ''}
                </span>
              </div>
              <Link to="/offres" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
                Voir les offres <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState type="empty" title="Aucune entreprise trouvée" message="Essayez de modifier votre recherche." />
      )}
    </div>
    </div>
  );
}
