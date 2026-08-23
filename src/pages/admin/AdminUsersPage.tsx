import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Eye, UserCheck, UserX, Mail, Calendar } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { useAsync } from '@/hooks/useAsync';
import { adminApi, type AdminUser } from '@/api/admin';
import { useToast } from '@/context/ToastContext';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const roleLabels: Record<string, string> = {
  STUDENT: 'Étudiant',
  COMPANY: 'Entreprise',
  ADMIN: 'Administrateur',
};

export function AdminUsersPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'all';
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState(initialRole);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [toggleUser, setToggleUser] = useState<AdminUser | null>(null);
  const [toggling, setToggling] = useState(false);

  const { data, loading, error, refetch } = useAsync(
    () => adminApi.getUsers({ search, role }),
    [search, role]
  );

  const handleToggle = async () => {
    if (!toggleUser) return;
    setToggling(true);
    try {
      await adminApi.toggleUserActive(toggleUser.id, !toggleUser.is_active);
      toast.success(toggleUser.is_active ? 'Compte désactivé' : 'Compte réactivé');
      setToggleUser(null);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de modifier ce compte.');
    } finally {
      setToggling(false);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'user', header: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={null} name={row.email} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-ink-900 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Rôle', render: (row) => <Badge variant={row.role === 'STUDENT' ? 'primary' : row.role === 'COMPANY' ? 'accent' : 'neutral'}>{roleLabels[row.role]}</Badge> },
    { key: 'date_joined', header: 'Inscrit le', render: (row) => <span className="text-ink-500">{formatDate(row.date_joined)}</span> },
    { key: 'is_active', header: 'Statut', render: (row) => <StatusBadge status={row.is_active ? 'ACTIVE' : 'CLOSED'} /> },
    {
      key: 'actions', header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setSelected(row)} leftIcon={<Eye className="w-4 h-4" />}>Voir</Button>
          <Button size="sm" variant="ghost" className={row.is_active ? 'text-warm-600 hover:bg-warm-50' : 'text-accent-600 hover:bg-accent-50'} onClick={() => setToggleUser(row)}>
            {row.is_active ? <><UserX className="w-4 h-4" /> Désactiver</> : <><UserCheck className="w-4 h-4" /> Réactiver</>}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Utilisateurs</h1>
        <p className="text-ink-500 mt-1">Gérez les comptes étudiants et entreprises</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Rechercher par email..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">Tous les rôles</option>
            <option value="STUDENT">Étudiants</option>
            <option value="COMPANY">Entreprises</option>
            <option value="ADMIN">Administrateurs</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card><CardBody><SkeletonList count={5} /></CardBody></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.results.length > 0 ? (
        <Card>
          <DataTable columns={columns} data={data.results} onRowClick={setSelected} />
        </Card>
      ) : (
        <Card><EmptyState type="empty" title="Aucun utilisateur" message="Aucun utilisateur ne correspond à votre recherche." /></Card>
      )}

      {/* Profile Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Profil utilisateur" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar src={null} name={selected.email} size="xl" />
              <div>
                <p className="font-bold text-ink-900 text-lg">{selected.email}</p>
                <Badge variant={selected.role === 'STUDENT' ? 'primary' : selected.role === 'COMPANY' ? 'accent' : 'neutral'} className="mt-1">{roleLabels[selected.role]}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50">
                <Mail className="w-4 h-4 text-ink-400" />
                <span className="text-sm text-ink-600 truncate">{selected.email}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-ink-50">
                <Calendar className="w-4 h-4 text-ink-400" />
                <span className="text-sm text-ink-600">{formatDate(selected.date_joined)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-ink-100">
              <span className="text-sm font-semibold text-ink-700">Statut du compte</span>
              <StatusBadge status={selected.is_active ? 'ACTIVE' : 'CLOSED'} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toggleUser}
        onClose={() => setToggleUser(null)}
        onConfirm={handleToggle}
        title={toggleUser?.is_active ? 'Désactiver le compte' : 'Réactiver le compte'}
        message={toggleUser?.is_active
          ? `Voulez-vous vraiment désactiver le compte de ${toggleUser?.email} ? L'utilisateur ne pourra plus se connecter.`
          : `Voulez-vous réactiver le compte de ${toggleUser?.email} ?`}
        confirmText={toggleUser?.is_active ? 'Désactiver' : 'Réactiver'}
        variant={toggleUser?.is_active ? 'danger' : 'accent'}
        loading={toggling}
      />
    </div>
  );
}
