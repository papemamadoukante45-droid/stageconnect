import { useState } from 'react';
import { Eye, Download, CheckCircle2, XCircle, FileText, Phone, Mail, GraduationCap, Star, Languages, Briefcase } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { applicationsApi } from '@/api/applications';
import { useToast } from '@/context/ToastContext';
import type { Application, ApplicationStatus } from '@/types';

const statusFilters = [
  { value: 'all', label: 'Toutes' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'ACCEPTEE', label: 'Acceptées' },
  { value: 'REFUSEE', label: 'Refusées' },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function CompanyApplicationsPage() {
  const toast = useToast();
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [actionApp, setActionApp] = useState<{ app: Application; action: ApplicationStatus } | null>(null);
  const [acting, setActing] = useState(false);

  const { data, loading, error, refetch } = useAsync(
    () => applicationsApi.list({ scope: 'company', status }),
    [status]
  );

  const handleAction = async () => {
    if (!actionApp) return;
    setActing(true);
    try {
      await applicationsApi.updateStatus(actionApp.app.id, actionApp.action);
      toast.success(
        actionApp.action === 'ACCEPTEE' ? 'Candidature acceptée' : 'Candidature refusée',
        actionApp.action === 'ACCEPTEE' ? 'L\'étudiant a été notifié.' : 'L\'étudiant a été notifié.'
      );
      setActionApp(null);
      setSelected(null);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de modifier le statut.');
    } finally {
      setActing(false);
    }
  };

  const columns: Column<Application>[] = [
    {
      key: 'student', header: 'Étudiant',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.student_photo} name={row.student_name} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{row.student_name}</p>
            <p className="text-sm text-ink-500">{row.student_education}</p>
          </div>
        </div>
      ),
    },
    { key: 'offer_title', header: 'Offre', render: (row) => <span className="text-ink-600 truncate">{row.offer_title}</span> },
    { key: 'application_date', header: 'Date', render: (row) => <span className="text-ink-500">{formatDate(row.application_date)}</span> },
    { key: 'status', header: 'Statut', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions', header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setSelected(row)} leftIcon={<Eye className="w-4 h-4" />}>Profil</Button>
          {row.status === 'EN_ATTENTE' && (
            <>
              <Button size="sm" variant="ghost" className="text-accent-600 hover:bg-accent-50" onClick={() => setActionApp({ app: row, action: 'ACCEPTEE' })} aria-label="Accepter">
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-warm-600 hover:bg-warm-50" onClick={() => setActionApp({ app: row, action: 'REFUSEE' })} aria-label="Refuser">
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Candidatures reçues</h1>
        <p className="text-ink-500 mt-1">Consultez et gérez les candidatures de votre entreprise</p>
      </div>

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
          <EmptyState type="empty" icon={<FileText className="w-8 h-8" />} title="Aucune candidature" message="Vous n'avez pas encore reçu de candidatures." />
        </Card>
      )}

      {/* Candidate Profile Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Profil du candidat"
        size="lg"
        footer={
          selected && selected.status === 'EN_ATTENTE' ? (
            <>
              <Button variant="outline" onClick={() => setActionApp({ app: selected, action: 'REFUSEE' })} leftIcon={<XCircle className="w-4 h-4" />}>
                Refuser
              </Button>
              <Button variant="accent" onClick={() => setActionApp({ app: selected, action: 'ACCEPTEE' })} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                Accepter
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar src={selected.student_photo} name={selected.student_name} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-ink-900">{selected.student_name}</h3>
                <p className="text-sm text-ink-500">{selected.student_education}</p>
                <p className="text-sm text-ink-400">{selected.student_school}</p>
                <div className="mt-2"><StatusBadge status={selected.status} /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-ink-700">{selected.student_education}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50">
                <Briefcase className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-semibold text-ink-700">{selected.student_school}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-ink-900 mb-2">Lettre de motivation</p>
              <div className="p-4 rounded-xl bg-ink-50 text-sm text-ink-600 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selected.cover_letter}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
              <FileText className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-semibold text-ink-900 flex-1">{selected.cv}</span>
              <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />}>Télécharger le CV</Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl border border-ink-100">
                <Mail className="w-4 h-4 text-ink-400" />
                <span className="text-sm text-ink-600">Email disponible</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-ink-100">
                <Phone className="w-4 h-4 text-ink-400" />
                <span className="text-sm text-ink-600">Téléphone disponible</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!actionApp}
        onClose={() => setActionApp(null)}
        onConfirm={handleAction}
        title={actionApp?.action === 'ACCEPTEE' ? 'Accepter la candidature' : 'Refuser la candidature'}
        message={actionApp?.action === 'ACCEPTEE'
          ? `Voulez-vous accepter la candidature de ${actionApp?.app.student_name} ? L'étudiant sera notifié.`
          : `Voulez-vous refuser la candidature de ${actionApp?.app.student_name} ? L'étudiant sera notifié.`}
        confirmText={actionApp?.action === 'ACCEPTEE' ? 'Accepter' : 'Refuser'}
        variant={actionApp?.action === 'ACCEPTEE' ? 'accent' : 'danger'}
        loading={acting}
      />
    </div>
  );
}
