import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { adminApi } from '@/api/admin';
import type { Application } from '@/types';

const statusFilters = [
  { value: 'all', label: 'Toutes' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'ACCEPTEE', label: 'Acceptées' },
  { value: 'REFUSEE', label: 'Refusées' },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminApplicationsPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);

  const { data, loading, error, refetch } = useAsync(
    () => adminApi.getApplications({ status }),
    [status]
  );

  const filtered = data?.results.filter(
    (a) => a.student_name.toLowerCase().includes(search.toLowerCase()) ||
           a.offer_title.toLowerCase().includes(search.toLowerCase()) ||
           a.company_name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const columns: Column<Application>[] = [
    {
      key: 'student', header: 'Étudiant',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.student_photo} name={row.student_name} size="sm" />
          <p className="font-semibold text-ink-900 truncate">{row.student_name}</p>
        </div>
      ),
    },
    { key: 'offer_title', header: 'Offre', render: (row) => <span className="text-ink-600 truncate">{row.offer_title}</span> },
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
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Candidatures</h1>
        <p className="text-ink-500 mt-1">Toutes les candidatures de la plateforme</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Rechercher par étudiant, offre, entreprise..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusFilters.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card><CardBody><SkeletonList count={5} /></CardBody></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length > 0 ? (
        <Card><DataTable columns={columns} data={filtered} onRowClick={setSelected} /></Card>
      ) : (
        <Card><EmptyState type="empty" title="Aucune candidature" message="Aucune candidature ne correspond à votre recherche." /></Card>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail de la candidature" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
              <Avatar src={selected.student_photo} name={selected.student_name} size="md" />
              <div className="flex-1">
                <p className="font-bold text-ink-900">{selected.student_name}</p>
                <p className="text-sm text-ink-500">{selected.offer_title} — {selected.company_name}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-ink-50">
                <p className="text-ink-400">Date</p>
                <p className="font-semibold text-ink-900">{formatDate(selected.application_date)}</p>
              </div>
              <div className="p-3 rounded-xl bg-ink-50">
                <p className="text-ink-400">Formation</p>
                <p className="font-semibold text-ink-900">{selected.student_education}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900 mb-2">Lettre de motivation</p>
              <div className="p-4 rounded-xl bg-ink-50 text-sm text-ink-600 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selected.cover_letter}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
