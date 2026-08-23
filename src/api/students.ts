import { api } from './client';
import type { StudentProfile, StudentDashboardStats } from '@/types';

export const studentsApi = {
  getProfile: () => api.request<StudentProfile>('/students/profile/'),
  updateProfile: (data: Partial<StudentProfile>) =>
    api.request<StudentProfile>('/students/profile/', { method: 'PUT', body: data }),
  getDashboard: () => api.request<StudentDashboardStats>('/students/dashboard/'),

  // Favoris
  getFavorites: () => api.request<{ count: number; results: import('@/types').Offer[] }>('/students/favorites/'),
  addFavorite: (offer: number) =>
    api.request('/students/favorites/', { method: 'POST', body: { offer } }),
  removeFavorite: (offer: number) =>
    api.request('/students/favorites/', { method: 'DELETE', body: { offer } }),
};
