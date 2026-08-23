import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Eye } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { applicationsApi } from '@/api/applications';
import type { Application, ApplicationStatus } from '@/types';

const statusFilters: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'ACCEPTEE', label: 'Acceptées' },
  { value: 'REFUSEE', label: 'Refusées' },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function StudentApplicationsPage() {
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);

  const { data, loading, error, refetch } = useAsync(
    () => applicationsApi.list({ scope: 'student', status }),
    [status]
  );

  const columns: Column<Application>[] = [
    {
      key: 'offer', header: 'Offre',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.student_photo} name={row.offer_title} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{row.offer_title}</p>
            <p className="text-sm text-ink-500">{row.company_name}</p>
          </div>
        </div>
      ),
    },
    { key: 'company_name', header: 'Entreprise', render: (row) => <span className="text-ink-600">{row.company_name}</span> },
    { key: 'application_date', header: 'Date', render: (row) => <span className="text-ink-500">{formatDate(row.application_date)}</span> },
    { key: 'status', header: 'Statut', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions', header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => setSelected(row)} leftIcon={<Eye className="w-4 h-4" />}>Voir</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Mes candidatures</h1>
        <p className="text-ink-500 mt-1">Suivez le statut de toutes vos candidatures</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              status === f.value ? 'bg-primary-600 text-white shadow-soft' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card><CardBody><SkeletonList count={5} /></CardBody></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <Card>
          <DataTable columns={columns} data={data.results} onRowClick={setSelected} />
        </Card>
      ) : (
        <Card>
          <EmptyState
            type="empty"
            title="Aucune candidature"
            message="Vous n'avez pas encore postulé à une offre. Commencez votre recherche dès maintenant !"
            action={<LinkButton to="/offres" leftIcon={<Search className="w-4 h-4" />}>Rechercher un stage</LinkButton>}
          />
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Détail de la candidature"
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
              <Avatar src={selected.student_photo} name={selected.student_name} size="md" />
              <div className="flex-1">
                <p className="font-bold text-ink-900">{selected.offer_title}</p>
                <p className="text-sm text-ink-500">{selected.company_name}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-1">Date de candidature</p>
              <p className="text-sm text-ink-500">{formatDate(selected.application_date)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700 mb-1">Lettre de motivation</p>
              <div className="p-4 rounded-xl bg-ink-50 text-sm text-ink-600 whitespace-pre-wrap leading-relaxed">
                {selected.cover_letter}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
              <FileText className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-semibold text-ink-900 flex-1">{selected.cv}</span>
              <Button size="sm" variant="outline">Télécharger le CV</Button>
            </div>
            <Link to={`/offres/${selected.offer}`}>
              <Button variant="ghost" className="w-full">Voir l'offre complète</Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
