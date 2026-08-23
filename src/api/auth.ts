import { api } from './client';
import type { AuthResponse, LoginFormData, RegisterStudentFormData, RegisterCompanyFormData, User } from '@/types';

export const authApi = {
  login: (data: LoginFormData) =>
    api.request<AuthResponse>('/auth/login/', { method: 'POST', body: data }),

  registerStudent: (data: RegisterStudentFormData) =>
    api.request<AuthResponse>('/auth/register/student/', { method: 'POST', body: data }),

  registerCompany: (data: RegisterCompanyFormData) =>
    api.request<AuthResponse>('/auth/register/company/', { method: 'POST', body: data }),

  me: () => api.request<User>('/auth/me/'),

  logout: () => api.request('/auth/logout/', { method: 'POST' }),

  refreshToken: (refresh: string) =>
    api.request<{ access: string }>('/auth/token/refresh/', { method: 'POST', body: { refresh } }),
};
