// ============================================================================
// StageConnect Sénégal — Types & Interfaces TypeScript
// Ces interfaces correspondent aux modèles Django REST Framework attendus.
// ============================================================================

export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// ---------------------------------------------------------------------------
// Étudiant
// ---------------------------------------------------------------------------
export interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface StudentProfile {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  school: string;
  education: string;
  level: string;
  bio: string;
  skills: string[];
  languages: string[];
  photo: string | null;
  cv: string | null;
  experiences: Experience[];
}

// ---------------------------------------------------------------------------
// Entreprise
// ---------------------------------------------------------------------------
export interface CompanyProfile {
  id: number;
  user: number;
  name: string;
  logo: string | null;
  description: string;
  sector: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  offers_count?: number;
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

// ---------------------------------------------------------------------------
// Offre de stage
// ---------------------------------------------------------------------------
export type OfferStatus = 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'EXPIRED';

export interface Offer {
  id: number;
  company: number;
  company_name: string;
  company_logo: string | null;
  title: string;
  description: string;
  missions: string[];
  required_skills: string[];
  location: string;
  internship_type: string;
  duration: string;
  education_level: string;
  sector: string;
  publication_date: string;
  deadline: string;
  status: OfferStatus;
  applications_count?: number;
}

export interface OfferListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Offer[];
}

// ---------------------------------------------------------------------------
// Candidature
// ---------------------------------------------------------------------------
export type ApplicationStatus = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface Application {
  id: number;
  student: number;
  student_name: string;
  student_photo: string | null;
  student_education: string;
  student_school: string;
  offer: number;
  offer_title: string;
  company_name: string;
  cv: string | null;
  cover_letter: string;
  application_date: string;
  status: ApplicationStatus;
}

export interface ApplicationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Application[];
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: 'application' | 'offer' | 'system' | 'candidature';
}

// ---------------------------------------------------------------------------
// Statistiques (Admin)
// ---------------------------------------------------------------------------
export interface Statistics {
  students: number;
  companies: number;
  offers: number;
  applications: number;
  accepted: number;
  refused: number;
  pending: number;
  monthly_evolution: { month: string; offers: number; applications: number }[];
  top_domains: { domain: string; count: number }[];
  top_cities: { city: string; count: number }[];
}

// ---------------------------------------------------------------------------
// Dashboard (Étudiant / Entreprise)
// ---------------------------------------------------------------------------
export interface StudentDashboardStats {
  sent: number;
  pending: number;
  accepted: number;
  refused: number;
  favorites: number;
  recommended: Offer[];
}

export interface CompanyDashboardStats {
  published: number;
  total_applications: number;
  pending: number;
  accepted: number;
  refused: number;
  monthly_applications: { month: string; count: number }[];
  recent_applications: Application[];
}

// ---------------------------------------------------------------------------
// Filtres & pagination
// ---------------------------------------------------------------------------
export interface OfferFilters {
  search?: string;
  domain?: string;
  location?: string;
  type?: string;
  page?: number;
  ordering?: string;
}

export interface Paginated<T> {
  count: number;
  results: T[];
}

export interface ApiError {
  detail: string;
  code?: string;
}

// ---------------------------------------------------------------------------
// Données de formulaire
// ---------------------------------------------------------------------------
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterStudentFormData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  school: string;
  education: string;
}

export interface RegisterCompanyFormData {
  email: string;
  password: string;
  password2: string;
  name: string;
  sector: string;
  location: string;
  phone: string;
}

export interface OfferFormData {
  title: string;
  description: string;
  missions: string[];
  required_skills: string[];
  location: string;
  internship_type: string;
  duration: string;
  education_level: string;
  sector: string;
  deadline: string;
  status?: OfferStatus;
}

export interface ApplicationFormData {
  offer: number;
  cv: string | null;
  cover_letter: string;
}
