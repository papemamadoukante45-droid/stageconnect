import { api } from './client';
import type { CompanyProfile, CompanyDashboardStats, Offer, Paginated } from '@/types';

export const companiesApi = {
  getProfile: () => api.request<CompanyProfile>('/companies/profile/'),
  updateProfile: (data: Partial<CompanyProfile>) =>
    api.request<CompanyProfile>('/companies/profile/', { method: 'PUT', body: data }),
  getDashboard: () => api.request<CompanyDashboardStats>('/companies/dashboard/'),
  getMyOffers: () => api.request<Paginated<Offer>>('/companies/me/offers/'),

  // Liste publique
  list: (params?: { search?: string; sector?: string; page?: number }) =>
    api.request<Paginated<CompanyProfile>>('/companies/', { params }),
};
