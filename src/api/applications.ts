import { api } from './client';
import type { Application, ApplicationListResponse, ApplicationFormData, ApplicationStatus } from '@/types';

export const applicationsApi = {
  list: (params?: { scope?: 'student' | 'company' | 'admin'; status?: string; page?: number }) =>
    api.request<ApplicationListResponse>('/applications/', { params }),

  get: (id: number) => api.request<Application>(`/applications/${id}/`),

  create: (data: ApplicationFormData) =>
    api.request<Application>('/applications/', { method: 'POST', body: data }),

  updateStatus: (id: number, status: ApplicationStatus) =>
    api.request<Application>(`/applications/${id}/`, { method: 'PATCH', body: { status } }),
};
