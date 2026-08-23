import { api } from './client';
import type { Offer, OfferListResponse, OfferFormData, OfferFilters } from '@/types';

export const offersApi = {
  list: (filters: OfferFilters = {}) =>
    api.request<OfferListResponse>('/offers/', { params: filters as Record<string, string | number | undefined> }),

  get: (id: number) => api.request<Offer>(`/offers/${id}/`),

  create: (data: OfferFormData) =>
    api.request<Offer>('/offers/', { method: 'POST', body: data }),

  update: (id: number, data: Partial<OfferFormData>) =>
    api.request<Offer>(`/offers/${id}/`, { method: 'PUT', body: data }),

  remove: (id: number) => api.request<void>(`/offers/${id}/`, { method: 'DELETE' }),
};
