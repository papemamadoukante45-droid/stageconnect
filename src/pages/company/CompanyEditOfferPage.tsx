import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, EyeOff, CheckCircle2 } from 'lucide-react';
import { LinkButton, Button } from '@/components/ui/Button';
import { OfferForm } from '@/components/offers/OfferForm';
import { ConfirmDialog } from '@/components/ui/Modal';
import { FullPageLoader } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { offersApi } from '@/api/offers';
import { useToast } from '@/context/ToastContext';
import type { OfferFormData } from '@/types';

export function CompanyEditOfferPage() {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: offer, loading, error, refetch } = useAsync(() => offersApi.get(Number(id)), [id]);

  const handleSubmit = async (formData: OfferFormData) => {
    await offersApi.update(Number(id), formData);
    if (formData.status === 'DRAFT') {
      toast.success('Brouillon mis à jour');
    } else {
      toast.success('Offre mise à jour', 'Votre offre a été modifiée avec succès.');
    }
    navigate('/company/offers');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await offersApi.remove(Number(id));
      toast.success('Offre supprimée');
      navigate('/company/offers');
    } catch {
      toast.error('Erreur', 'Impossible de supprimer cette offre.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!offer) return <ErrorState title="Offre introuvable" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <LinkButton to="/company/offers" variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-2">
            Retour aux offres
          </LinkButton>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Modifier l'offre</h1>
          <p className="text-ink-500 mt-1">{offer.title}</p>
        </div>
        <Button variant="danger" onClick={() => setDeleteOpen(true)} leftIcon={<Trash2 className="w-4 h-4" />}>
          Supprimer
        </Button>
      </div>

      <OfferForm initialData={offer} onSubmit={handleSubmit} submitLabel="Enregistrer les modifications" />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message="Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible."
        confirmText="Supprimer définitivement"
        loading={deleting}
      />
    </div>
  );
}
