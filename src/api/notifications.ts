import { api } from './client';
import type { Notification, Paginated } from '@/types';

export const notificationsApi = {
  list: () => api.request<Paginated<Notification>>('/notifications/'),
  markRead: (id: number) => api.request(`/notifications/${id}/read/`, { method: 'PATCH' }),
  markAllRead: () => api.request('/notifications/read-all/', { method: 'PATCH' }),
};
