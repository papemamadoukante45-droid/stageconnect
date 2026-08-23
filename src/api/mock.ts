// ============================================================================
// MOCK REQUEST HANDLER — Simule les réponses de l'API Django REST Framework
// ----------------------------------------------------------------------------
// Ce fichier intercepte les requêtes quand VITE_USE_MOCK=true.
// Il simule la latence réseau et renvoie des données au format attendu par
// Django. SUPPRIMABLE: passez VITE_USE_MOCK=false pour utiliser le vrai Django.
// ============================================================================
import type {
  AuthResponse, User, StudentProfile, CompanyProfile, Offer, Application,
  Notification, Statistics, StudentDashboardStats, CompanyDashboardStats,
  ApplicationStatus, OfferStatus, OfferListResponse, ApplicationListResponse,
} from '@/types';
import * as mock from './mock-data';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(items: T[], page = 1, pageSize = 6): { count: number; results: T[] } {
  const start = (page - 1) * pageSize;
  return { count: items.length, results: items.slice(start, start + pageSize) };
}

export async function mockRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  await delay(350 + Math.random() * 300);
  const method = opts.method || 'GET';
  const body = opts.body as Record<string, unknown> | undefined;
  const params = opts.params || {};
  const page = Number(params.page || 1);

  // Strip query string
  const cleanPath = path.split('?')[0];

  // --- AUTH ---
  if (cleanPath === '/auth/login/' && method === 'POST') {
    const email = String(body?.email || '');
    const password = String(body?.password || '');
    const user = mock.mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw { status: 401, message: 'Email ou mot de passe incorrect.' };
    const { password: _pw, ...safeUser } = user;
    return {
      access: `mock-access-${user.id}-${Date.now()}`,
      refresh: `mock-refresh-${user.id}`,
      user: safeUser,
    } as unknown as T;
  }

  if (cleanPath === '/auth/register/student/' && method === 'POST') {
    const newUser: User = { id: 99, email: String(body?.email), role: 'STUDENT', is_active: true, date_joined: new Date().toISOString() };
    return { access: 'mock-access-new', refresh: 'mock-refresh-new', user: newUser } as unknown as T;
  }
  if (cleanPath === '/auth/register/company/' && method === 'POST') {
    const newUser: User = { id: 100, email: String(body?.email), role: 'COMPANY', is_active: true, date_joined: new Date().toISOString() };
    return { access: 'mock-access-new', refresh: 'mock-refresh-new', user: newUser } as unknown as T;
  }
  if (cleanPath === '/auth/me/' && method === 'GET') {
    const token = localStorage.getItem('sc_access_token') || '';
    const userId = Number(token.split('-')[2] || '1');
    const user = mock.mockUsers.find(u => u.id === userId) || mock.mockUsers[0];
    const { password: _pw, ...safeUser } = user;
    return safeUser as unknown as T;
  }
  if (cleanPath === '/auth/logout/' && method === 'POST') {
    return undefined as unknown as T;
  }

  // --- STUDENT PROFILE ---
  if (cleanPath === '/students/profile/' && method === 'GET') {
    return mock.mockStudent as unknown as T;
  }
  if (cleanPath === '/students/profile/' && method === 'PUT') {
    Object.assign(mock.mockStudent, body);
    return mock.mockStudent as unknown as T;
  }

  // --- COMPANY PROFILE ---
  if (cleanPath === '/companies/profile/' && method === 'GET') {
    return mock.mockCompanyProfile as unknown as T;
  }
  if (cleanPath === '/companies/profile/' && method === 'PUT') {
    Object.assign(mock.mockCompanyProfile, body);
    return mock.mockCompanyProfile as unknown as T;
  }

  // --- COMPANIES LIST (public) ---
  if (cleanPath === '/companies/' && method === 'GET') {
    return { count: mock.mockCompanies.length, results: mock.mockCompanies } as unknown as T;
  }

  // --- OFFERS ---
  if (cleanPath === '/offers/' && method === 'GET') {
    let offers = [...mock.mockOffers].filter(o => o.status === 'ACTIVE');
    if (params.search) {
      const q = String(params.search).toLowerCase();
      offers = offers.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.company_name.toLowerCase().includes(q) ||
        o.required_skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (params.domain && params.domain !== 'all') {
      offers = offers.filter(o => o.sector.toLowerCase().includes(String(params.domain).toLowerCase()));
    }
    if (params.location && params.location !== 'all') {
      offers = offers.filter(o => o.location.toLowerCase().includes(String(params.location).toLowerCase()));
    }
    if (params.type && params.type !== 'all') {
      offers = offers.filter(o => o.internship_type.toLowerCase().includes(String(params.type).toLowerCase()));
    }
    if (params.ordering === 'deadline') {
      offers.sort((a, b) => a.deadline.localeCompare(b.deadline));
    } else if (params.ordering === '-publication_date' || !params.ordering) {
      offers.sort((a, b) => b.publication_date.localeCompare(a.publication_date));
    }
    return paginate(offers, page, 6) as unknown as T;
  }

  if (cleanPath === '/offers/' && method === 'POST') {
    const newId = Math.max(...mock.mockOffers.map(o => o.id)) + 1;
    const newOffer: Offer = {
      id: newId,
      company: mock.mockCompanyProfile.id,
      company_name: mock.mockCompanyProfile.name,
      company_logo: mock.mockCompanyProfile.logo,
      publication_date: new Date().toISOString().split('T')[0],
      applications_count: 0,
      ...body as object,
    } as Offer;
    if (newOffer.status === 'ACTIVE') mock.addOffer(newOffer);
    else mock.addOffer(newOffer);
    return newOffer as unknown as T;
  }

  // --- OFFER DETAIL ---
  const offerMatch = cleanPath.match(/^\/offers\/(\d+)\/$/);
  if (offerMatch && method === 'GET') {
    const id = Number(offerMatch[1]);
    const offer = mock.mockOffers.find(o => o.id === id);
    if (!offer) throw { status: 404, message: 'Offre introuvable.' };
    return offer as unknown as T;
  }
  if (offerMatch && method === 'PUT') {
    const id = Number(offerMatch[1]);
    mock.updateOffer(id, body as Partial<Offer>);
    return mock.mockOffers.find(o => o.id === id) as unknown as T;
  }
  if (offerMatch && method === 'DELETE') {
    const id = Number(offerMatch[1]);
    mock.removeOffer(id);
    return undefined as unknown as T;
  }

  // --- COMPANY OFFERS ---
  if (cleanPath === '/companies/me/offers/' && method === 'GET') {
    const offers = mock.mockOffers.filter(o => o.company === mock.mockCompanyProfile.id);
    return { count: offers.length, results: offers } as unknown as T;
  }

  // --- APPLICATIONS ---
  if (cleanPath === '/applications/' && method === 'GET') {
    const token = localStorage.getItem('sc_access_token') || '';
    const userId = Number(token.split('-')[2] || '1');
    let apps: Application[];
    if (params.scope === 'company') {
      apps = mock.mockApplications.filter(a =>
        mock.mockOffers.some(o => o.id === a.offer && o.company === mock.mockCompanyProfile.id)
      );
    } else if (params.scope === 'admin') {
      apps = [...mock.mockApplications];
    } else {
      apps = mock.mockApplications.filter(a => a.student === userId || a.student === 1);
    }
    if (params.status && params.status !== 'all') {
      apps = apps.filter(a => a.status === params.status);
    }
    return { count: apps.length, results: apps } as unknown as T;
  }
  if (cleanPath === '/applications/' && method === 'POST') {
    const newId = Math.max(...mock.mockApplications.map(a => a.id)) + 1;
    const offer = mock.mockOffers.find(o => o.id === Number(body?.offer));
    const newApp: Application = {
      id: newId,
      student: 1,
      student_name: `${mock.mockStudent.first_name} ${mock.mockStudent.last_name}`,
      student_photo: mock.mockStudent.photo,
      student_education: mock.mockStudent.education,
      student_school: mock.mockStudent.school,
      offer: Number(body?.offer),
      offer_title: offer?.title || '',
      company_name: offer?.company_name || '',
      cv: mock.mockStudent.cv,
      cover_letter: String(body?.cover_letter || ''),
      application_date: new Date().toISOString().split('T')[0],
      status: 'EN_ATTENTE',
    };
    mock.addApplication(newApp);
    return newApp as unknown as T;
  }

  // --- APPLICATION DETAIL ---
  const appMatch = cleanPath.match(/^\/applications\/(\d+)\/$/);
  if (appMatch && method === 'GET') {
    const id = Number(appMatch[1]);
    const app = mock.mockApplications.find(a => a.id === id);
    if (!app) throw { status: 404, message: 'Candidature introuvable.' };
    return app as unknown as T;
  }
  if (appMatch && method === 'PATCH') {
    const id = Number(appMatch[1]);
    if (body?.status) mock.setApplicationStatus(id, body.status as ApplicationStatus);
    return mock.mockApplications.find(a => a.id === id) as unknown as T;
  }

  // --- FAVORITES ---
  if (cleanPath === '/students/favorites/' && method === 'GET') {
    const favs = mock.mockFavorites.map(fid => mock.mockOffers.find(o => o.id === fid)).filter(Boolean) as Offer[];
    return { count: favs.length, results: favs } as unknown as T;
  }
  if (cleanPath === '/students/favorites/' && method === 'POST') {
    const offerId = Number(body?.offer);
    if (!mock.mockFavorites.includes(offerId)) mock.mockFavorites.push(offerId);
    return { success: true } as unknown as T;
  }
  if (cleanPath === '/students/favorites/' && method === 'DELETE') {
    const offerId = Number(body?.offer);
    const idx = mock.mockFavorites.indexOf(offerId);
    if (idx >= 0) mock.mockFavorites.splice(idx, 1);
    return { success: true } as unknown as T;
  }

  // --- NOTIFICATIONS ---
  if (cleanPath === '/notifications/' && method === 'GET') {
    const token = localStorage.getItem('sc_access_token') || '';
    const userId = Number(token.split('-')[2] || '1');
    const notifs = mock.mockNotifications.filter(n => n.user === userId);
    return { count: notifs.length, results: notifs } as unknown as T;
  }
  const notifMatch = cleanPath.match(/^\/notifications\/(\d+)\/read\/$/);
  if (notifMatch && method === 'PATCH') {
    mock.markNotificationRead(Number(notifMatch[1]));
    return { success: true } as unknown as T;
  }
  if (cleanPath === '/notifications/read-all/' && method === 'PATCH') {
    const token = localStorage.getItem('sc_access_token') || '';
    const userId = Number(token.split('-')[2] || '1');
    mock.markAllNotificationsRead(userId);
    return { success: true } as unknown as T;
  }

  // --- DASHBOARDS ---
  if (cleanPath === '/students/dashboard/' && method === 'GET') {
    return mock.mockStudentDashboard as unknown as T;
  }
  if (cleanPath === '/companies/dashboard/' && method === 'GET') {
    return mock.mockCompanyDashboard as unknown as T;
  }

  // --- ADMIN ---
  if (cleanPath === '/admin/statistics/' && method === 'GET') {
    return mock.mockStatistics as unknown as T;
  }
  if (cleanPath === '/admin/users/' && method === 'GET') {
    const users = mock.mockUsers.map(({ password, ...u }) => u);
    const enriched = users.map(u => {
      if (u.role === 'STUDENT') return { ...u, profile: mock.mockStudent };
      if (u.role === 'COMPANY') return { ...u, profile: mock.mockCompanies.find(c => c.user === u.id) || mock.mockCompanyProfile };
      return { ...u, profile: null };
    });
    return { count: enriched.length, results: enriched } as unknown as T;
  }
  if (cleanPath === '/admin/offers/' && method === 'GET') {
    return { count: mock.mockOffers.length, results: mock.mockOffers } as unknown as T;
  }
  if (cleanPath === '/admin/applications/' && method === 'GET') {
    return { count: mock.mockApplications.length, results: mock.mockApplications } as unknown as T;
  }

  // --- FALLBACK ---
  console.warn(`[MOCK] Endpoint non implémenté: ${method} ${cleanPath}`);
  return { count: 0, results: [] } as unknown as T;
}
