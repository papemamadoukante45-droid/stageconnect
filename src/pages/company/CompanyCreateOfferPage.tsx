import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { OfferForm } from '@/components/offers/OfferForm';
import { offersApi } from '@/api/offers';
import { useToast } from '@/context/ToastContext';
import type { OfferFormData } from '@/types';

export function CompanyCreateOfferPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: OfferFormData) => {
    await offersApi.create(data);
    if (data.status === 'DRAFT') {
      toast.success('Brouillon enregistré', 'Votre offre a été enregistrée comme brouillon.');
    } else {
      toast.success('Offre publiée', 'Votre offre est maintenant visible par les étudiants.');
    }
    navigate('/company/offers');
  };

  return (
    <div className="space-y-6">
      <div>
        <LinkButton to="/company/offers" variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-2">
          Retour aux offres
        </LinkButton>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Créer une offre</h1>
        <p className="text-ink-500 mt-1">Publiez une nouvelle offre de stage</p>
      </div>
      <OfferForm onSubmit={handleSubmit} />
    </div>
  );
}
