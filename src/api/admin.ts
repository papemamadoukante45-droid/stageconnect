import { api } from './client';
import type { Statistics, Offer, Application, Paginated } from '@/types';

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  profile: unknown;
}

export const adminApi = {
  getStatistics: () => api.request<Statistics>('/admin/statistics/'),
  getUsers: (params?: { search?: string; role?: string; page?: number }) =>
    api.request<Paginated<AdminUser>>('/admin/users/', { params }),
  getOffers: (params?: { search?: string; status?: string; page?: number }) =>
    api.request<Paginated<Offer>>('/admin/offers/', { params }),
  getApplications: (params?: { status?: string; page?: number }) =>
    api.request<Paginated<Application>>('/admin/applications/', { params }),
  toggleUserActive: (id: number, isActive: boolean) =>
    api.request(`/admin/users/${id}/`, { method: 'PATCH', body: { is_active: isActive } }),
};
