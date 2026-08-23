import { useState, useCallback } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { OfferCard } from '@/components/offers/OfferCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { studentsApi } from '@/api/students';
import { useToast } from '@/context/ToastContext';

export function StudentFavoritesPage() {
  const toast = useToast();
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [removing, setRemoving] = useState(false);

  const { data, loading, error, refetch } = useAsync(() => studentsApi.getFavorites(), []);

  const handleRemove = useCallback(async () => {
    if (removeId === null) return;
    setRemoving(true);
    try {
      await studentsApi.removeFavorite(removeId);
      toast.success('Retiré des favoris');
      setRemoveId(null);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de retirer cette offre.');
    } finally {
      setRemoving(false);
    }
  }, [removeId, refetch, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Mes favoris</h1>
        <p className="text-ink-500 mt-1">Les offres que vous avez sauvegardées</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.results.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isFavorite
              onToggleFavorite={(id) => setRemoveId(id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            type="empty"
            icon={<Heart className="w-8 h-8" />}
            title="Aucun favori"
            message="Sauvegardez vos offres préférées en cliquant sur le cœur pour les retrouver ici."
            action={<LinkButton to="/offres" leftIcon={<Search className="w-4 h-4" />}>Parcourir les offres</LinkButton>}
          />
        </Card>
      )}

      <ConfirmDialog
        open={removeId !== null}
        onClose={() => setRemoveId(null)}
        onConfirm={handleRemove}
        title="Retirer des favoris"
        message="Voulez-vous vraiment retirer cette offre de vos favoris ?"
        confirmText="Retirer"
        loading={removing}
      />
    </div>
  );
}
