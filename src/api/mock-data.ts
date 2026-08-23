// ============================================================================
// COUCHE DE DONNÉES TEMPORAIRE (MOCK)
// ----------------------------------------------------------------------------
// AVERTISSEMENT: Ce fichier contient des données fictives pour permettre la
// visualisation des interfaces tant que le backend Django n'est pas disponible.
// Il est CLAIREMENT SÉPARÉ de la logique applicative et peut être supprimé
// facilement en passant VITE_USE_MOCK=false dans le fichier .env
// ============================================================================
import type {
  User, StudentProfile, CompanyProfile, Offer, Application,
  Notification, Statistics, StudentDashboardStats, CompanyDashboardStats,
  ApplicationStatus, OfferStatus,
} from '@/types';

// --- Utilisateurs (JWT simulé) ----------------------------------------------
export const mockUsers: (User & { password: string })[] = [
  { id: 1, email: 'etudiant@stageconnect.sn', password: 'etudiant123', role: 'STUDENT', is_active: true, date_joined: '2026-01-15T10:00:00Z' },
  { id: 2, email: 'entreprise@stageconnect.sn', password: 'entreprise123', role: 'COMPANY', is_active: true, date_joined: '2026-01-10T10:00:00Z' },
  { id: 3, email: 'admin@stageconnect.sn', password: 'admin123', role: 'ADMIN', is_active: true, date_joined: '2026-01-01T10:00:00Z' },
];

// --- Profils étudiant -------------------------------------------------------
export const mockStudent: StudentProfile = {
  id: 1,
  user: 1,
  first_name: 'Aminata',
  last_name: 'Diop',
  email: 'etudiant@stageconnect.sn',
  phone: '+221 77 123 45 67',
  city: 'Dakar',
  school: 'Université Cheikh Anta Diop (UCAD)',
  education: 'Licence en Informatique',
  level: 'Licence 3',
  bio: 'Étudiante en informatique passionnée par le développement web et l\'intelligence artificielle. À la recherche d\'un stage pour mettre en pratique mes compétences.',
  skills: ['JavaScript', 'React', 'Python', 'Django', 'Git', 'SQL', 'Machine Learning'],
  languages: ['Français (natif)', 'Anglais (B2)', 'Wolof (natif)'],
  photo: 'https://images.pexels.com/photos/37118089/pexels-photo-37118089.jpeg?auto=compress&cs=tinysrgb&w=400',
  cv: 'cv_aminata_diop.pdf',
  experiences: [
    { id: 1, title: 'Projet de fin d\'année — Plateforme e-commerce', company: 'UCAD', start_date: '2026-02-01', end_date: '2026-06-30', description: 'Développement d\'une plateforme e-commerce avec React et Django.' },
  ],
};

// --- Profils entreprise -----------------------------------------------------
export const mockCompanies: CompanyProfile[] = [
  {
    id: 1, user: 2, name: 'Sonatel Digital Solutions', logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Leader des solutions numériques au Sénégal, filiale du Groupe Sonatel. Nous accompagnons la transformation digitale des entreprises.',
    sector: 'Télécommunications & IT', location: 'Dakar', phone: '+221 33 823 45 67', email: 'contact@sonatel-digital.sn', website: 'https://sonatel-digital.sn',
    address: 'Building administratif, Route de laéroport, Dakar', offers_count: 8,
    socials: { linkedin: '#', twitter: '#', facebook: '#' },
  },
  {
    id: 2, user: 4, name: 'Gaindé 2000', logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Entreprise leader dans la dématérialisation et les solutions de paiement électronique au Sénégal.',
    sector: 'FinTech & Services', location: 'Dakar', phone: '+221 33 821 00 00', email: 'contact@gainde2000.sn', website: 'https://gainde2000.sn',
    address: 'Sacré-Cœur 3, Dakar', offers_count: 5,
    socials: { linkedin: '#', facebook: '#' },
  },
  {
    id: 3, user: 5, name: 'InnovTech Africa', logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Startup innovante spécialisée dans l\'intelligence artificielle et l\'analyse de données pour le marché africain.',
    sector: 'IA & Data Science', location: 'Dakar', phone: '+221 77 555 12 34', email: 'hello@innovtech.africa', website: 'https://innovtech.africa',
    address: 'Cité Keur Gorgui, Dakar', offers_count: 4,
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    id: 4, user: 6, name: 'Sénégalaise de l\'Électricité (SELEA)', logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Société de production et distribution d\'électricité engagée dans la transition énergétique.',
    sector: 'Énergie', location: 'Thiès', phone: '+221 33 950 11 22', email: 'rh@selea.sn', website: 'https://selea.sn',
    address: 'Zone Industrielle, Thiès', offers_count: 3,
    socials: { linkedin: '#' },
  },
  {
    id: 5, user: 7, name: 'BICIS Banque', logo: 'https://images.pexels.com/photos/3184391/pexels-photo-3184391.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Banque universelle présente dans tous les métiers de la banque et de l\u2019assurance.',
    sector: 'Banque & Finance', location: 'Dakar', phone: '+221 33 823 89 00', email: 'recrutement@bicis.sn', website: 'https://bicis.sn',
    address: 'Avenue Léopold Sédar Senghor, Dakar', offers_count: 6,
    socials: { linkedin: '#', facebook: '#' },
  },
  {
    id: 6, user: 8, name: 'Maeedia Communication', logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Agence de communication 360° spécialisée en stratégie de marque et digital marketing.',
    sector: 'Communication & Marketing', location: 'Dakar', phone: '+221 77 222 33 44', email: 'contact@maeedia.sn', website: 'https://maeedia.sn',
    address: 'Mermoz Py-Technopôle, Dakar', offers_count: 3,
    socials: { linkedin: '#', twitter: '#', facebook: '#' },
  },
];

export const mockCompanyProfile: CompanyProfile = mockCompanies[0];

// --- Offres -----------------------------------------------------------------
const today = new Date('2026-07-31');
function daysFromNow(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
function daysAgo(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export const mockOffers: Offer[] = [
  {
    id: 1, company: 1, company_name: 'Sonatel Digital Solutions', company_logo: mockCompanies[0].logo,
    title: 'Développeur Full-Stack Junior',
    description: 'Nous recherchons un stagiaire développeur full-stack pour rejoindre notre équipe produit. Vous participerez au développement de notre nouvelle plateforme de gestion interne en React et Django.',
    missions: [
      'Développer des fonctionnalités frontend en React/TypeScript',
      'Implémenter des API REST en Django REST Framework',
      'Participer aux revues de code et à la documentation technique',
      'Corriger les bugs et optimiser les performances',
    ],
    required_skills: ['JavaScript', 'React', 'Python', 'Django', 'Git'],
    location: 'Dakar', internship_type: 'Stage', duration: '6 mois',
    education_level: 'Licence 3 / Master 1', sector: 'Informatique',
    publication_date: daysAgo(5), deadline: daysFromNow(25), status: 'ACTIVE', applications_count: 12,
  },
  {
    id: 2, company: 3, company_name: 'InnovTech Africa', company_logo: mockCompanies[2].logo,
    title: 'Stage en Intelligence Artificielle',
    description: 'Rejoignez notre équipe R&D pour travailler sur des modèles de machine learning appliqués à l\'analyse de données africaines. Un projet concret sur la détection de fraude bancaire vous attend.',
    missions: [
      'Préparer et nettoyer des datasets',
      'Entraîner et évaluer des modèles de classification',
      'Déployer des modèles avec FastAPI',
      'Rédiger la documentation scientifique',
    ],
    required_skills: ['Python', 'Scikit-learn', 'Pandas', 'Machine Learning', 'Data Analysis'],
    location: 'Dakar', internship_type: 'Stage de fin d\'études', duration: '6 mois',
    education_level: 'Master 2', sector: 'Intelligence Artificielle',
    publication_date: daysAgo(2), deadline: daysFromNow(30), status: 'ACTIVE', applications_count: 8,
  },
  {
    id: 3, company: 2, company_name: 'Gaindé 2000', company_logo: mockCompanies[1].logo,
    title: 'Stage Cybersécurité — Audit & Pentest',
    description: 'Stage technique en cybersécurité. Vous assisterez notre équipe dans des missions d\'audit de sécurité et de tests d\'intrusion sur des plateformes de paiement.',
    missions: [
      'Réaliser des audits de sécurité applicative',
      'Effectuer des tests d\'intrusion (pentest)',
      'Analyser les vulnérabilités et rédiger des rapports',
      'Proposer des plans de remédiation',
    ],
    required_skills: ['Linux', 'Réseaux', 'Burp Suite', 'Python', 'OWASP'],
    location: 'Dakar', internship_type: 'Stage', duration: '3 mois',
    education_level: 'Master 1', sector: 'Cybersécurité',
    publication_date: daysAgo(8), deadline: daysFromNow(15), status: 'ACTIVE', applications_count: 5,
  },
  {
    id: 4, company: 5, company_name: 'BICIS Banque', company_logo: mockCompanies[4].logo,
    title: 'Stage Analyse Financière',
    description: 'Stage au sein de la direction des études financières. Vous participerez à l\'analyse des dossiers de crédit et à la modélisation des risques.',
    missions: [
      'Analyser les états financiers des entreprises clientes',
      'Préparer des notes d\'analyse de crédit',
      'Participer à la modélisation des risques',
      'Rédiger des rapports d\'analyse',
    ],
    required_skills: ['Excel', 'Analyse financière', 'Comptabilité', 'Power BI'],
    location: 'Dakar', internship_type: 'Stage', duration: '4 mois',
    education_level: 'Master 1 / Master 2', sector: 'Finance',
    publication_date: daysAgo(10), deadline: daysFromNow(20), status: 'ACTIVE', applications_count: 15,
  },
  {
    id: 5, company: 1, company_name: 'Sonatel Digital Solutions', company_logo: mockCompanies[0].logo,
    title: 'Stage Marketing Digital',
    description: 'Nous cherchons un stagiaire marketing digital pour gérer nos campagnes sur les réseaux sociaux et analyser les performances.',
    missions: [
      'Créer et gérer des campagnes publicitaires (Meta, Google Ads)',
      'Analyser les performances et produire des reportings',
      'Animer les réseaux sociaux',
      'Participer à la stratégie de contenu',
    ],
    required_skills: ['Marketing digital', 'Google Analytics', 'Canva', 'SEO', 'Community Management'],
    location: 'Dakar', internship_type: 'Stage', duration: '3 mois',
    education_level: 'Licence 3', sector: 'Marketing',
    publication_date: daysAgo(3), deadline: daysFromNow(12), status: 'ACTIVE', applications_count: 9,
  },
  {
    id: 6, company: 3, company_name: 'InnovTech Africa', company_logo: mockCompanies[2].logo,
    title: 'Stage Data Engineer',
    description: 'Vous intégrerez notre équipe data pour construire des pipelines ETL et concevoir des entrepôts de données.',
    missions: [
      'Concevoir et maintenir des pipelines ETL',
      'Modéliser des entrepôts de données',
      'Optimiser des requêtes SQL',
      'Mettre en place des dashboards',
    ],
    required_skills: ['Python', 'SQL', 'Airflow', 'PostgreSQL', 'dbt'],
    location: 'Dakar', internship_type: 'Stage', duration: '6 mois',
    education_level: 'Master 1', sector: 'Data',
    publication_date: daysAgo(1), deadline: daysFromNow(40), status: 'ACTIVE', applications_count: 4,
  },
  {
    id: 7, company: 6, company_name: 'Maeedia Communication', company_logo: mockCompanies[5].logo,
    title: 'Stage Communication & Relations Presse',
    description: 'Stage en communication au sein d\'une agence dynamique. Vous gérerez les relations presse et la création de contenu.',
    missions: [
      'Rédiger des communiqués de presse',
      'Gérer les relations avec les journalistes',
      'Créer du contenu pour les réseaux sociaux',
      'Organiser des événements',
    ],
    required_skills: ['Rédaction', 'Relations presse', 'Adobe Creative Suite', 'Communication'],
    location: 'Dakar', internship_type: 'Stage', duration: '3 mois',
    education_level: 'Licence 3', sector: 'Communication',
    publication_date: daysAgo(7), deadline: daysFromNow(18), status: 'ACTIVE', applications_count: 6,
  },
  {
    id: 8, company: 4, company_name: 'Sénégalaise de l\'Électricité (SELEA)', company_logo: mockCompanies[3].logo,
    title: 'Stage Ingénieur Réseaux Électriques',
    description: 'Stage technique au sein du département planification. Vous travaillerez sur la modélisation et l\'optimisation des réseaux de distribution.',
    missions: [
      'Modéliser des réseaux électriques',
      'Optimiser la distribution d\'énergie',
      'Analyser les données de consommation',
      'Participer à des études de faisabilité',
    ],
    required_skills: ['MATLAB', 'AutoCAD', 'Analyse de données', 'Électrotechnique'],
    location: 'Thiès', internship_type: 'Stage de fin d\'études', duration: '6 mois',
    education_level: 'Master 2', sector: 'Réseaux',
    publication_date: daysAgo(12), deadline: daysFromNow(10), status: 'ACTIVE', applications_count: 3,
  },
  {
    id: 9, company: 5, company_name: 'BICIS Banque', company_logo: mockCompanies[4].logo,
    title: 'Stage Ressources Humaines',
    description: 'Stage au sein de la direction RH. Vous participerez au recrutement, à l\'intégration des nouveaux collaborateurs et à la gestion de la paie.',
    missions: [
      'Participer au processus de recrutement',
      'Préparer les dossiers d\'intégration',
      'Assister à la gestion administrative du personnel',
      'Contribuer aux projets RH',
    ],
    required_skills: ['Ressources Humaines', 'Office 365', 'Communication', 'Organisation'],
    location: 'Dakar, Sénégal', internship_type: 'Stage', duration: '4 mois',
    education_level: 'Licence 3 / Master 1', sector: 'Ressources humaines',
    publication_date: daysAgo(6), deadline: daysFromNow(22), status: 'ACTIVE', applications_count: 11,
  },
  {
    id: 10, company: 2, company_name: 'Gaindé 2000', company_logo: mockCompanies[1].logo,
    title: 'Stage Développement Web — React & Node.js',
    description: 'Stage en développement web. Vous développerez des interfaces utilisateur modernes et des API performantes.',
    missions: [
      'Développer des interfaces en React',
      'Créer des API en Node.js / Express',
      'Intégrer des solutions de paiement',
      'Rédiger des tests unitaires',
    ],
    required_skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
    location: 'Dakar', internship_type: 'Stage', duration: '6 mois',
    education_level: 'Licence 3', sector: 'Développement web',
    publication_date: daysAgo(4), deadline: daysFromNow(28), status: 'ACTIVE', applications_count: 7,
  },
  {
    id: 11, company: 1, company_name: 'Sonatel Digital Solutions', company_logo: mockCompanies[0].logo,
    title: 'Stage DevOps & Cloud',
    description: 'Stage DevOps pour mettre en place des pipelines CI/CD et gérer une infrastructure cloud AWS.',
    missions: [
      'Mettre en place des pipelines CI/CD',
      'Gérer l\'infrastructure avec Terraform',
      'Monitorer les applications',
      'Automatiser les déploiements',
    ],
    required_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    location: 'Dakar', internship_type: 'Stage', duration: '6 mois',
    education_level: 'Master 1', sector: 'Informatique',
    publication_date: daysAgo(14), deadline: daysFromNow(7), status: 'ACTIVE', applications_count: 2,
  },
  {
    id: 12, company: 1, company_name: 'Sonatel Digital Solutions', company_logo: mockCompanies[0].logo,
    title: '[BROUILLON] Stage Product Manager Junior',
    description: 'Brouillon — Stage en product management pour définir la roadmap produit.',
    missions: ['Définir la roadmap', 'Rédiger des user stories'],
    required_skills: ['Product Management', 'Agile', 'Figma'],
    location: 'Dakar', internship_type: 'Stage', duration: '6 mois',
    education_level: 'Master 1', sector: 'Informatique',
    publication_date: daysAgo(1), deadline: daysFromNow(60), status: 'DRAFT', applications_count: 0,
  },
];

// --- Candidatures -----------------------------------------------------------
export const mockApplications: Application[] = [
  {
    id: 1, student: 1, student_name: 'Aminata Diop', student_photo: mockStudent.photo,
    student_education: 'Licence en Informatique', student_school: 'UCAD',
    offer: 1, offer_title: 'Développeur Full-Stack Junior', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_aminata_diop.pdf', cover_letter: 'Madame, Monsieur,\n\nActuellement en Licence 3 d\'Informatique à l\'UCAD, je suis très intéressée par votre offre de stage. Mon profil technique correspond aux compétences recherchées...',
    application_date: daysAgo(4), status: 'EN_ATTENTE',
  },
  {
    id: 2, student: 1, student_name: 'Aminata Diop', student_photo: mockStudent.photo,
    student_education: 'Licence en Informatique', student_school: 'UCAD',
    offer: 2, offer_title: 'Stage en Intelligence Artificielle', company_name: 'InnovTech Africa',
    cv: 'cv_aminata_diop.pdf', cover_letter: 'Madame, Monsieur,\n\nPassionnée par l\'intelligence artificielle, je souhaite rejoindre votre équipe R&D...',
    application_date: daysAgo(2), status: 'EN_ATTENTE',
  },
  {
    id: 3, student: 1, student_name: 'Aminata Diop', student_photo: mockStudent.photo,
    student_education: 'Licence en Informatique', student_school: 'UCAD',
    offer: 10, offer_title: 'Stage Développement Web — React & Node.js', company_name: 'Gaindé 2000',
    cv: 'cv_aminata_diop.pdf', cover_letter: 'Madame, Monsieur,\n\nVotre offre correspond parfaitement à mon projet professionnel...',
    application_date: daysAgo(20), status: 'ACCEPTEE',
  },
  {
    id: 4, student: 1, student_name: 'Aminata Diop', student_photo: mockStudent.photo,
    student_education: 'Licence en Informatique', student_school: 'UCAD',
    offer: 5, offer_title: 'Stage Marketing Digital', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_aminata_diop.pdf', cover_letter: 'Madame, Monsieur,\n\nBien que ma formation soit en informatique, je m\'intéresse aussi au marketing digital...',
    application_date: daysAgo(30), status: 'REFUSEE',
  },
  // Candidatures reçues par l'entreprise (Sonatel) — autres étudiants
  {
    id: 5, student: 9, student_name: 'Moussa Ndiaye', student_photo: 'https://images.pexels.com/photos/7446948/pexels-photo-7446948.jpeg?auto=compress&cs=tinysrgb&w=400',
    student_education: 'Master 1 Informatique', student_school: 'ESP Dakar',
    offer: 1, offer_title: 'Développeur Full-Stack Junior', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_moussa_ndiaye.pdf', cover_letter: 'Étudiant à l\'ESP, je suis très motivé par cette opportunité...',
    application_date: daysAgo(3), status: 'EN_ATTENTE',
  },
  {
    id: 6, student: 10, student_name: 'Fatou Sarr', student_photo: 'https://images.pexels.com/photos/31307734/pexels-photo-31307734.jpeg?auto=compress&cs=tinysrgb&w=400',
    student_education: 'Licence 3 Informatique', student_school: 'UCAD',
    offer: 1, offer_title: 'Développeur Full-Stack Junior', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_fatou_sarr.pdf', cover_letter: 'Passionnée de développement web, je souhaite rejoindre votre équipe...',
    application_date: daysAgo(5), status: 'EN_ATTENTE',
  },
  {
    id: 7, student: 11, student_name: 'Cheikh Fall', student_photo: 'https://images.pexels.com/photos/33048698/pexels-photo-33048698.jpeg?auto=compress&cs=tinysrgb&w=400',
    student_education: 'Master 2 Génie Logiciel', student_school: 'Polytech Dakar',
    offer: 1, offer_title: 'Développeur Full-Stack Junior', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_cheikh_fall.pdf', cover_letter: 'Fort de 5 ans d\'expérience en développement, je postule à cette offre...',
    application_date: daysAgo(7), status: 'ACCEPTEE',
  },
  {
    id: 8, student: 12, student_name: 'Awa Diallo', student_photo: 'https://images.pexels.com/photos/36551042/pexels-photo-36551042.jpeg?auto=compress&cs=tinysrgb&w=400',
    student_education: 'Licence 3 Informatique', student_school: 'UGB',
    offer: 5, offer_title: 'Stage Marketing Digital', company_name: 'Sonatel Digital Solutions',
    cv: 'cv_awa_diallo.pdf', cover_letter: 'Étudiante créative, je m\'intéresse au marketing digital...',
    application_date: daysAgo(6), status: 'REFUSEE',
  },
];

// --- Notifications ----------------------------------------------------------
export const mockNotifications: Notification[] = [
  { id: 1, user: 1, title: 'Candidature acceptée', message: 'Votre candidature pour "Stage Développement Web" chez Gaindé 2000 a été acceptée.', is_read: false, created_at: daysAgo(18), type: 'candidature' },
  { id: 2, user: 1, title: 'Candidature envoyée', message: 'Votre candidature pour "Stage en Intelligence Artificielle" a été envoyée avec succès.', is_read: false, created_at: daysAgo(2), type: 'application' },
  { id: 3, user: 1, title: 'Nouvelle offre recommandée', message: 'Une nouvelle offre "Stage Data Engineer" correspond à votre profil.', is_read: true, created_at: daysAgo(1), type: 'offer' },
  { id: 4, user: 1, title: 'Candidature refusée', message: 'Votre candidature pour "Stage Marketing Digital" n\'a pas été retenue.', is_read: true, created_at: daysAgo(28), type: 'candidature' },
  { id: 5, user: 2, title: 'Nouvelle candidature', message: 'Moussa Ndiaye a postulé à votre offre "Développeur Full-Stack Junior".', is_read: false, created_at: daysAgo(3), type: 'application' },
  { id: 6, user: 2, title: 'Nouvelle candidature', message: 'Fatou Sarr a postulé à votre offre "Développeur Full-Stack Junior".', is_read: false, created_at: daysAgo(5), type: 'application' },
  { id: 7, user: 2, title: 'Offre publiée', message: 'Votre offre "Stage Marketing Digital" a été publiée avec succès.', is_read: true, created_at: daysAgo(3), type: 'offer' },
];

// --- Favoris ----------------------------------------------------------------
export const mockFavorites: number[] = [2, 6];

// --- Statistiques Admin -----------------------------------------------------
export const mockStatistics: Statistics = {
  students: 1248,
  companies: 216,
  offers: 542,
  applications: 3187,
  accepted: 312,
  refused: 1854,
  pending: 1021,
  monthly_evolution: [
    { month: 'Jan', offers: 32, applications: 120 },
    { month: 'Fév', offers: 45, applications: 180 },
    { month: 'Mar', offers: 58, applications: 240 },
    { month: 'Avr', offers: 72, applications: 310 },
    { month: 'Mai', offers: 89, applications: 420 },
    { month: 'Juin', offers: 110, applications: 510 },
    { month: 'Juil', offers: 136, applications: 590 },
  ],
  top_domains: [
    { domain: 'Informatique', count: 145 },
    { domain: 'Finance', count: 89 },
    { domain: 'Marketing', count: 76 },
    { domain: 'Data Science', count: 68 },
    { domain: 'Cybersécurité', count: 54 },
    { domain: 'Communication', count: 42 },
    { domain: 'Ressources Humaines', count: 38 },
  ],
  top_cities: [
    { city: 'Dakar', count: 312 },
    { city: 'Thiès', count: 78 },
    { city: 'Saint-Louis', count: 54 },
    { city: 'Touba', count: 42 },
    { city: 'Mbour', count: 35 },
  ],
};

// --- Dashboard étudiant -----------------------------------------------------
export const mockStudentDashboard: StudentDashboardStats = {
  sent: 4, pending: 2, accepted: 1, refused: 1, favorites: 2,
  recommended: [mockOffers[5], mockOffers[1], mockOffers[9]],
};

// --- Dashboard entreprise ---------------------------------------------------
export const mockCompanyDashboard: CompanyDashboardStats = {
  published: 4, total_applications: 12, pending: 5, accepted: 1, refused: 1,
  monthly_applications: [
    { month: 'Jan', count: 2 },
    { month: 'Fév', count: 4 },
    { month: 'Mar', count: 3 },
    { month: 'Avr', count: 5 },
    { month: 'Mai', count: 7 },
    { month: 'Juin', count: 6 },
    { month: 'Juil', count: 12 },
  ],
  recent_applications: mockApplications.filter(a => a.offer === 1).slice(0, 4),
};

// --- Helpers de mutation (simulés) -----------------------------------------
export function getApplicationsByStatus(status: ApplicationStatus): Application[] {
  return mockApplications.filter(a => a.status === status);
}

export function setApplicationStatus(id: number, status: ApplicationStatus): void {
  const app = mockApplications.find(a => a.id === id);
  if (app) app.status = status;
}

export function setOfferStatus(id: number, status: OfferStatus): void {
  const offer = mockOffers.find(o => o.id === id);
  if (offer) offer.status = status;
}

export function addOffer(offer: Offer): void {
  mockOffers.unshift(offer);
}

export function updateOffer(id: number, data: Partial<Offer>): void {
  const idx = mockOffers.findIndex(o => o.id === id);
  if (idx >= 0) mockOffers[idx] = { ...mockOffers[idx], ...data };
}

export function removeOffer(id: number): void {
  const idx = mockOffers.findIndex(o => o.id === id);
  if (idx >= 0) mockOffers.splice(idx, 1);
}

export function addApplication(app: Application): void {
  mockApplications.unshift(app);
}

export function markNotificationRead(id: number): void {
  const n = mockNotifications.find(n => n.id === id);
  if (n) n.is_read = true;
}

export function markAllNotificationsRead(userId: number): void {
  mockNotifications.filter(n => n.user === userId).forEach(n => { n.is_read = true; });
}
