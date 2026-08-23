# StageConnect Sénégal — Documentation API Django REST Framework

Ce document décrit tous les endpoints Django REST Framework attendus par le frontend React.
Le frontend est conçu pour communiquer avec `http://127.0.0.1:8000/api/` (configurable via `VITE_API_URL` dans `.env`).

## Configuration

### Variable d'environnement
```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_USE_MOCK=true   # Passer à false quand Django est prêt
```

### Authentification JWT
- Header: `Authorization: Bearer <access_token>`
- Le refresh token est automatiquement renouvelé par le client HTTP (`src/api/client.ts`)
- Tokens stockés dans `localStorage` sous les clés `sc_access_token` et `sc_refresh_token`

### Structure des applications Django recommandée
```
accounts/      — User, auth, JWT
students/      — StudentProfile, favorites
companies/     — CompanyProfile
offers/        — Offer CRUD
applications/  — Application CRUD
notifications/ — Notification CRUD
core/          — Statistics, utilitaires
```

---

## 1. AUTHENTIFICATION

### POST /api/auth/login/
- **Auth:** Aucune
- **Body:** `{ "email": string, "password": string }`
- **Response 200:** `{ "access": string, "refresh": string, "user": User }`
- **Response 401:** `{ "detail": "Email ou mot de passe incorrect." }`

### POST /api/auth/register/student/
- **Auth:** Aucune
- **Body:** `{ "email", "password", "password2", "first_name", "last_name", "phone", "city", "school", "education" }`
- **Response 201:** `{ "access": string, "refresh": string, "user": User }`

### POST /api/auth/register/company/
- **Auth:** Aucune
- **Body:** `{ "email", "password", "password2", "name", "sector", "location", "phone" }`
- **Response 201:** `{ "access": string, "refresh": string, "user": User }`

### POST /api/auth/token/refresh/
- **Auth:** Aucune
- **Body:** `{ "refresh": string }`
- **Response 200:** `{ "access": string }`

### GET /api/auth/me/
- **Auth:** Bearer token
- **Response 200:** `User`

### POST /api/auth/logout/
- **Auth:** Bearer token
- **Response 204:** No content

---

## 2. PROFIL ÉTUDIANT

### GET /api/students/profile/
- **Auth:** Bearer token (STUDENT)
- **Response 200:** `StudentProfile`

### PUT /api/students/profile/
- **Auth:** Bearer token (STUDENT)
- **Body:** `Partial<StudentProfile>`
- **Response 200:** `StudentProfile`

### GET /api/students/dashboard/
- **Auth:** Bearer token (STUDENT)
- **Response 200:** `StudentDashboardStats`

### GET /api/students/favorites/
- **Auth:** Bearer token (STUDENT)
- **Response 200:** `{ "count": int, "results": Offer[] }`

### POST /api/students/favorites/
- **Auth:** Bearer token (STUDENT)
- **Body:** `{ "offer": int }`
- **Response 201:** `{ "success": true }`

### DELETE /api/students/favorites/
- **Auth:** Bearer token (STUDENT)
- **Body:** `{ "offer": int }`
- **Response 200:** `{ "success": true }`

---

## 3. PROFIL ENTREPRISE

### GET /api/companies/profile/
- **Auth:** Bearer token (COMPANY)
- **Response 200:** `CompanyProfile`

### PUT /api/companies/profile/
- **Auth:** Bearer token (COMPANY)
- **Body:** `Partial<CompanyProfile>`
- **Response 200:** `CompanyProfile`

### GET /api/companies/dashboard/
- **Auth:** Bearer token (COMPANY)
- **Response 200:** `CompanyDashboardStats`

### GET /api/companies/me/offers/
- **Auth:** Bearer token (COMPANY)
- **Response 200:** `{ "count": int, "results": Offer[] }`

### GET /api/companies/
- **Auth:** Aucune (public)
- **Params:** `search`, `sector`, `page`
- **Response 200:** `{ "count": int, "results": CompanyProfile[] }`

---

## 4. OFFRES

### GET /api/offers/
- **Auth:** Aucune (public)
- **Params:** `search`, `domain`, `location`, `type`, `ordering`, `page`
- **Response 200:** `OfferListResponse` (paginé, 6 par page)

### POST /api/offers/
- **Auth:** Bearer token (COMPANY)
- **Body:** `OfferFormData`
- **Response 201:** `Offer`

### GET /api/offers/{id}/
- **Auth:** Aucune (public)
- **Response 200:** `Offer`

### PUT /api/offers/{id}/
- **Auth:** Bearer token (COMPANY, propriétaire)
- **Body:** `Partial<OfferFormData>`
- **Response 200:** `Offer`

### DELETE /api/offers/{id}/
- **Auth:** Bearer token (COMPANY, propriétaire)
- **Response 204:** No content

---

## 5. CANDIDATURES

### GET /api/applications/
- **Auth:** Bearer token (STUDENT/COMPANY/ADMIN)
- **Params:** `scope` (student|company|admin), `status`, `page`
- **Response 200:** `ApplicationListResponse`

### POST /api/applications/
- **Auth:** Bearer token (STUDENT)
- **Body:** `{ "offer": int, "cv": string|null, "cover_letter": string }`
- **Response 201:** `Application`

### GET /api/applications/{id}/
- **Auth:** Bearer token
- **Response 200:** `Application`

### PATCH /api/applications/{id}/
- **Auth:** Bearer token (COMPANY, propriétaire de l'offre)
- **Body:** `{ "status": "EN_ATTENTE"|"ACCEPTEE"|"REFUSEE" }`
- **Response 200:** `Application`

---

## 6. NOTIFICATIONS

### GET /api/notifications/
- **Auth:** Bearer token
- **Response 200:** `{ "count": int, "results": Notification[] }`

### PATCH /api/notifications/{id}/read/
- **Auth:** Bearer token
- **Response 200:** `{ "success": true }`

### PATCH /api/notifications/read-all/
- **Auth:** Bearer token
- **Response 200:** `{ "success": true }`

---

## 7. ADMIN

### GET /api/admin/statistics/
- **Auth:** Bearer token (ADMIN)
- **Response 200:** `Statistics`

### GET /api/admin/users/
- **Auth:** Bearer token (ADMIN)
- **Params:** `search`, `role`, `page`
- **Response 200:** `{ "count": int, "results": AdminUser[] }`

### PATCH /api/admin/users/{id}/
- **Auth:** Bearer token (ADMIN)
- **Body:** `{ "is_active": boolean }`
- **Response 200:** `User`

### GET /api/admin/offers/
- **Auth:** Bearer token (ADMIN)
- **Params:** `search`, `status`, `page`
- **Response 200:** `{ "count": int, "results": Offer[] }`

### GET /api/admin/applications/
- **Auth:** Bearer token (ADMIN)
- **Params:** `status`, `page`
- **Response 200:** `{ "count": int, "results": Application[] }`

---

## 8. MODÈLES DJANGO

### User (accounts)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK auto |
| email | string | Unique, utilisé comme username |
| password | string | Hashé |
| role | enum | STUDENT, COMPANY, ADMIN |
| is_active | bool | Compte actif |
| date_joined | datetime | Auto |

### StudentProfile (students)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK |
| user | FK→User | OneToOne |
| first_name | string | |
| last_name | string | |
| phone | string | |
| city | string | |
| school | string | |
| education | string | |
| level | string | |
| bio | text | |
| skills | array[string] | |
| languages | array[string] | |
| photo | url | Upload |
| cv | url | Upload |
| experiences | array | [{title, company, start_date, end_date, description}] |

### CompanyProfile (companies)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK |
| user | FK→User | OneToOne |
| name | string | |
| logo | url | Upload |
| description | text | |
| sector | string | |
| location | string | |
| phone | string | |
| email | string | |
| website | url | |
| address | string | |
| socials | json | {linkedin, twitter, facebook} |

### Offer (offers)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK |
| company | FK→CompanyProfile | |
| title | string | |
| description | text | |
| missions | array[string] | |
| required_skills | array[string] | |
| location | string | |
| internship_type | string | |
| duration | string | |
| education_level | string | |
| sector | string | |
| publication_date | date | Auto |
| deadline | date | |
| status | enum | ACTIVE, DRAFT, CLOSED, EXPIRED |

### Application (applications)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK |
| student | FK→StudentProfile | |
| offer | FK→Offer | |
| cv | url | |
| cover_letter | text | |
| application_date | date | Auto |
| status | enum | EN_ATTENTE, ACCEPTEE, REFUSEE |

### Notification (notifications)
| Champ | Type | Notes |
|-------|------|-------|
| id | int | PK |
| user | FK→User | |
| title | string | |
| message | text | |
| is_read | bool | Default false |
| created_at | datetime | Auto |
| type | enum | application, offer, system, candidature |

---

## 9. CORRESPONDANCE PAGE → ENDPOINT

| Page Frontend | Endpoint | Méthode | Auth | Rôle |
|--------------|----------|---------|------|------|
| Accueil (/) | /offers/, /companies/, /admin/statistics/ | GET | Public | — |
| Offres (/offres) | /offers/ | GET | Public | — |
| Détail offre (/offres/:id) | /offers/{id}/ | GET | Public | — |
| Entreprises (/entreprises) | /companies/ | GET | Public | — |
| Connexion (/login) | /auth/login/ | POST | Public | — |
| Inscription étudiant | /auth/register/student/ | POST | Public | — |
| Inscription entreprise | /auth/register/company/ | POST | Public | — |
| Dashboard étudiant | /students/dashboard/ | GET | JWT | STUDENT |
| Profil étudiant | /students/profile/ | GET/PUT | JWT | STUDENT |
| Candidatures étudiant | /applications/?scope=student | GET | JWT | STUDENT |
| Favoris étudiant | /students/favorites/ | GET/POST/DELETE | JWT | STUDENT |
| Notifications | /notifications/ | GET | JWT | Tous |
| Dashboard entreprise | /companies/dashboard/ | GET | JWT | COMPANY |
| Profil entreprise | /companies/profile/ | GET/PUT | JWT | COMPANY |
| Mes offres | /companies/me/offers/ | GET | JWT | COMPANY |
| Créer une offre | /offers/ | POST | JWT | COMPANY |
| Modifier une offre | /offers/{id}/ | PUT | JWT | COMPANY |
| Supprimer une offre | /offers/{id}/ | DELETE | JWT | COMPANY |
| Candidatures reçues | /applications/?scope=company | GET | JWT | COMPANY |
| Accepter/Refuser | /applications/{id}/ | PATCH | JWT | COMPANY |
| Dashboard admin | /admin/statistics/ | GET | JWT | ADMIN |
| Utilisateurs | /admin/users/ | GET | JWT | ADMIN |
| Désactiver/Réactiver | /admin/users/{id}/ | PATCH | JWT | ADMIN |
| Offres (admin) | /admin/offers/ | GET | JWT | ADMIN |
| Candidatures (admin) | /admin/applications/ | GET | JWT | ADMIN |
| Statistiques | /admin/statistics/ | GET | JWT | ADMIN |

---

## 10. PASSAGE EN PRODUCTION

1. Définir `VITE_USE_MOCK=false` dans `.env`
2. Démarrer le serveur Django sur `http://127.0.0.1:8000`
3. Le frontend communiquera automatiquement avec l'API Django
4. La couche mock (`src/api/mock.ts` et `src/api/mock-data.ts`) n'est plus utilisée et peut être supprimée

### Sécurité
- Les tokens JWT ne sont jamais exposés dans le code source
- Aucune clé secrète Django dans le frontend
- Les mots de passe ne sont jamais stockés en clair
- Le header `Authorization: Bearer` est géré automatiquement par le client HTTP
- Le refresh token est renouvelé automatiquement en cas d'expiration
