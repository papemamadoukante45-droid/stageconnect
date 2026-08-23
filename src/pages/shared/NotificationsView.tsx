import { useState } from 'react';
import { Bell, CheckCheck, FileText, Briefcase, Info, AlertCircle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { notificationsApi } from '@/api/notifications';
import { useToast } from '@/context/ToastContext';
import type { Notification } from '@/types';

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 7) return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `Il y a ${hours}h`;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins > 0) return `Il y a ${mins}min`;
  return 'À l\'instant';
}

const typeIcons: Record<string, { icon: typeof FileText; color: string }> = {
  application: { icon: FileText, color: 'bg-primary-50 text-primary-600' },
  offer: { icon: Briefcase, color: 'bg-accent-50 text-accent-600' },
  candidature: { icon: AlertCircle, color: 'bg-secondary-50 text-secondary-600' },
  system: { icon: Info, color: 'bg-ink-100 text-ink-600' },
};

export function NotificationsView() {
  const toast = useToast();
  const { data, loading, error, refetch } = useAsync(() => notificationsApi.list(), []);
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de marquer comme lu.');
    }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await notificationsApi.markAllRead();
      toast.success('Tout marqué comme lu');
      refetch();
    } catch {
      toast.error('Erreur', 'Impossible de marquer les notifications.');
    } finally {
      setMarkingAll(false);
    }
  };

  const unread = data?.results.filter((n: Notification) => !n.is_read).length || 0;

  if (loading) return <Card><CardBody><SkeletonList count={5} /></CardBody></Card>;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display flex items-center gap-2">
            Notifications
            {unread > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-warm-500 text-white rounded-full">{unread}</span>}
          </h1>
          <p className="text-ink-500 mt-1">Restez informé de votre activité</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={handleMarkAll} loading={markingAll} leftIcon={<CheckCheck className="w-4 h-4" />}>
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {data && data.results.length > 0 ? (
        <div className="space-y-3">
          {data.results.map((notif: Notification) => {
            const tc = typeIcons[notif.type || 'system'] || typeIcons.system;
            const Icon = tc.icon;
            return (
              <Card key={notif.id} className={`p-4 ${notif.is_read ? '' : 'border-primary-200 bg-primary-50/30'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${tc.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink-900">{notif.title}</p>
                      <span className="text-xs text-ink-400 flex-shrink-0">{timeAgo(notif.created_at)}</span>
                    </div>
                    <p className="text-sm text-ink-600 mt-0.5">{notif.message}</p>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="w-2.5 h-2.5 rounded-full bg-primary-500 hover:bg-primary-700 transition-colors flex-shrink-0 mt-2"
                      aria-label="Marquer comme lu"
                      title="Marquer comme lu"
                    />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            type="empty"
            icon={<Bell className="w-8 h-8" />}
            title="Aucune notification"
            message="Vous n'avez pas de notification pour le moment."
          />
        </Card>
      )}
    </div>
  );
}

