import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit2, EyeOff, Trash2, Calendar, FileText } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { CompanyLogo } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { adminApi } from '@/api/admin';
import { offersApi } from '@/api/offers';
import { useToast } from '@/context/ToastContext';
import type { Offer } from '@/types';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminOffersPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [deleteOffer, setDeleteOffer] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, refetch } = useAsync(
    () => adminApi.getOffers({ search, status }),
    [search, status]
  );

  const handleDelete = async () => {
    if (!deleteOffer) return;
    setDeleting(true);
    try {
      await offersApi.remove(deleteOffer.id);
      toast.success('Offre supprimée');
      setDeleteOffer(null);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de supprimer cette offre.');
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Offer>[] = [
    {
      key: 'title', header: 'Titre',
      render: (row) => (
        <div className="flex items-center gap-3">
          <CompanyLogo name={row.company_name} logo={row.company_logo} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{row.title}</p>
            <p className="text-sm text-ink-500">{row.company_name}</p>
          </div>
        </div>
      ),
    },
    { key: 'sector', header: 'Secteur', render: (row) => <span className="text-ink-600">{row.sector}</span> },
    { key: 'publication_date', header: 'Date', render: (row) => <span className="text-ink-500">{formatDate(row.publication_date)}</span> },
    { key: 'applications_count', header: 'Candidatures', render: (row) => <span className="inline-flex items-center gap-1 text-ink-600"><FileText className="w-3.5 h-3.5" /> {row.applications_count || 0}</span> },
    { key: 'status', header: 'Statut', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions', header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/offres/${row.id}`}>
            <Button size="sm" variant="ghost" aria-label="Voir"><Eye className="w-4 h-4" /></Button>
          </Link>
          <Link to={`/company/offers/${row.id}/edit`}>
            <Button size="sm" variant="ghost" aria-label="Modifier"><Edit2 className="w-4 h-4" /></Button>
          </Link>
          <Button size="sm" variant="ghost" className="text-warm-600 hover:bg-warm-50" onClick={() => setDeleteOffer(row)} aria-label="Supprimer">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Offres</h1>
        <p className="text-ink-500 mt-1">Gérez toutes les offres de stage publiées sur la plateforme</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Rechercher une offre..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="ACTIVE">Actives</option>
            <option value="DRAFT">Brouillons</option>
            <option value="CLOSED">Clôturées</option>
            <option value="EXPIRED">Expirées</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card><CardBody><SkeletonList count={5} /></CardBody></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <Card><DataTable columns={columns} data={data.results} /></Card>
      ) : (
        <Card><EmptyState type="empty" title="Aucune offre" message="Aucune offre ne correspond à votre recherche." /></Card>
      )}

      <ConfirmDialog
        open={!!deleteOffer}
        onClose={() => setDeleteOffer(null)}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message={`Voulez-vous vraiment supprimer l'offre "${deleteOffer?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        loading={deleting}
      />
    </div>
  );
}
