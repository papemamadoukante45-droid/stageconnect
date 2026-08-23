import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, MapPin, Calendar, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { CompanyLogo } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { companiesApi } from '@/api/companies';
import { offersApi } from '@/api/offers';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';
import type { Offer } from '@/types';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function CompanyOffersPage() {
  const toast = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refetch } = useAsync(() => companiesApi.getMyOffers(), []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await offersApi.remove(deleteId);
      toast.success('Offre supprimée');
      setDeleteId(null);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de supprimer cette offre.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Mes offres</h1>
          <p className="text-ink-500 mt-1">Gérez vos offres de stage publiées</p>
        </div>
        <LinkButton to="/company/offers/create" leftIcon={<PlusCircle className="w-4 h-4" />}>Créer une offre</LinkButton>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.results.map((offer: Offer) => (
            <Card key={offer.id} hover className="p-5 flex flex-col">
              <div className="flex items-start gap-3">
                <CompanyLogo name={offer.company_name} logo={offer.company_logo} size="md" />
                <div className="flex-1 min-w-0">
                  <Link to={`/offres/${offer.id}`}>
                    <h3 className="font-bold text-ink-900 line-clamp-2 hover:text-primary-700 transition-colors">{offer.title}</h3>
                  </Link>
                  <p className="text-sm text-ink-500 mt-0.5">{offer.location} • {offer.duration}</p>
                </div>
                <StatusBadge status={offer.status} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-ink-500">
                <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(offer.publication_date)}</span>
                <span className="inline-flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {offer.applications_count || 0} cand.</span>
              </div>
              <div className="mt-4 pt-4 border-t border-ink-50 flex gap-2">
                <Link to={`/offres/${offer.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full" leftIcon={<Eye className="w-4 h-4" />}>Voir</Button>
                </Link>
                <Link to={`/company/offers/${offer.id}/edit`}>
                  <Button size="sm" variant="ghost" leftIcon={<Edit2 className="w-4 h-4" />}>Modifier</Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-warm-600 hover:bg-warm-50" onClick={() => setDeleteId(offer.id)} aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            type="empty"
            icon={<Briefcase className="w-8 h-8" />}
            title="Aucune offre publiée"
            message="Créez votre première offre de stage pour recevoir des candidatures."
            action={<LinkButton to="/company/offers/create" leftIcon={<PlusCircle className="w-4 h-4" />}>Créer une offre</LinkButton>}
          />
        </Card>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message="Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible."
        confirmText="Supprimer"
        loading={deleting}
      />
    </div>
  );
}
