import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, Code, Brain, Megaphone, DollarSign, Radio,
  Users, Database, Shield, Globe, GraduationCap, Building2, FileText,
  TrendingUp, ArrowRight, CheckCircle2, Sparkles, Target, Zap, Heart,
  Star, Quote, Award, Send, Play, ChevronRight,
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { useAsync } from '@/hooks/useAsync';
import { offersApi } from '@/api/offers';
import { companiesApi } from '@/api/companies';
import { adminApi } from '@/api/admin';
import { OfferCard } from '@/components/offers/OfferCard';
import { CompanyLogo } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { senegalImages, senegalAvatars } from '@/lib/senegal-images';

const domains = [
  { label: 'Informatique', icon: Code, color: 'from-primary-500 to-primary-600' },
  { label: 'Intelligence Artificielle', icon: Brain, color: 'from-accent-400 to-accent-500' },
  { label: 'Marketing', icon: Megaphone, color: 'from-warm-400 to-warm-500' },
  { label: 'Finance', icon: DollarSign, color: 'from-primary-400 to-primary-600' },
  { label: 'Communication', icon: Radio, color: 'from-secondary-400 to-secondary-500' },
  { label: 'Ressources Humaines', icon: Users, color: 'from-primary-500 to-accent-500' },
  { label: 'Réseaux & Télécoms', icon: Globe, color: 'from-ink-600 to-ink-800' },
  { label: 'Data Science', icon: Database, color: 'from-accent-500 to-accent-600' },
  { label: 'Cybersécurité', icon: Shield, color: 'from-secondary-500 to-secondary-600' },
  { label: 'Énergie', icon: Zap, color: 'from-warm-400 to-accent-500' },
];

const steps = [
  { icon: GraduationCap, title: 'Créer un compte', desc: 'Inscrivez-vous gratuitement avec votre adresse email en moins d\'une minute.', color: 'bg-primary-50 text-primary-600' },
  { icon: FileText, title: 'Compléter son profil', desc: 'Ajoutez votre CV, vos compétences et vos expériences académiques.', color: 'bg-accent-50 text-accent-600' },
  { icon: Search, title: 'Rechercher une offre', desc: 'Filtrez par domaine, ville et type de stage partout au Sénégal.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: Send, title: 'Postuler en un clic', desc: 'Envoyez votre candidature avec votre profil pré-rempli.', color: 'bg-primary-50 text-primary-600' },
  { icon: TrendingUp, title: 'Suivre sa candidature', desc: 'Suivez le statut de vos candidatures en temps réel.', color: 'bg-accent-50 text-accent-600' },
];

const features = [
  { icon: Target, title: 'Matching intelligent', desc: 'Des recommandations d\'offres adaptées à votre profil et vos compétences.', color: 'from-primary-500 to-primary-600' },
  { icon: Zap, title: 'Candidature rapide', desc: 'Postulez en un clic avec votre profil pré-rempli et votre CV.', color: 'from-accent-400 to-accent-500' },
  { icon: Heart, title: 'Favoris & suivi', desc: 'Sauvegardez vos offres préférées et suivez toutes vos candidatures.', color: 'from-secondary-400 to-secondary-500' },
  { icon: Building2, title: 'Entreprises vérifiées', desc: 'Des entreprises sénégalaises de confiance dans tous les secteurs.', color: 'from-primary-600 to-accent-500' },
];

const testimonials = [
  { name: 'Aminata Diop', role: 'Étudiante en Informatique, UCAD', text: 'Grâce à StageConnect, j\'ai trouvé mon stage en développement web à Dakar en moins de deux semaines. La plateforme est intuitive et les offres sont de qualité.', avatar: senegalAvatars.womanSmiling, rating: 5 },
  { name: 'Moussa Ndiaye', role: 'Recruteur, Sonatel Digital', text: 'Une excellente plateforme pour recruter des stagiaires. Nous avons reçu des candidatures qualifiées d\'étudiants de l\'ESP et de l\'UCAD. Le suivi est très facile.', avatar: senegalAvatars.manConfident, rating: 5 },
  { name: 'Fatou Sarr', role: 'Étudiante en Marketing, ESP', text: 'StageConnect m\'a permis de postuler à plusieurs offres en quelques clics. J\'ai été acceptée pour un stage en marketing digital à Dakar !', avatar: senegalAvatars.womanGreen, rating: 5 },
];

const partners = ['UCAD', 'ESP', 'ISM', 'SUPDECO', 'Polytech', 'UGB', 'Bordeaux', 'Sonatel', 'BICIS', 'Gaindé 2000'];

export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ keyword: '', domain: 'all', location: 'all', type: 'all' });

  const { data: offersData, loading: offersLoading } = useAsync(() => offersApi.list({ page: 1 }), []);
  const { data: companiesData } = useAsync(() => companiesApi.list(), []);
  const { data: stats } = useAsync(() => adminApi.getStatistics(), []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.keyword) params.set('search', search.keyword);
    if (search.domain !== 'all') params.set('domain', search.domain);
    if (search.location !== 'all') params.set('location', search.location);
    if (search.type !== 'all') params.set('type', search.type);
    navigate(`/offres?${params.toString()}`);
  };

  const statsDisplay = [
    { value: stats?.offers || 500, suffix: '+', label: 'Offres de stage', icon: Briefcase },
    { value: stats?.companies || 200, suffix: '+', label: 'Entreprises', icon: Building2 },
    { value: stats?.students || 1000, suffix: '+', label: 'Étudiants', icon: GraduationCap },
    { value: stats?.accepted || 300, suffix: '+', label: 'Stages pourvus', icon: TrendingUp },
  ];

  return (
    <div>
      {/* ====================== HERO ====================== */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          <img src={senegalImages.dakarStreet} alt="Rues de Dakar, Sénégal" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/70 to-ink-900/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-accent-900/20" />
        </div>
        <div className="absolute inset-0 dot-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/15 rounded-full blur-[120px]" />

        <div className="container-page relative pt-28 pb-32 lg:pt-36 lg:pb-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
              </span>
              La plateforme N°1 des stages au Sénégal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] font-display text-balance animate-slide-up">
              Trouvez votre stage
              <span className="block bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300 bg-clip-text text-transparent">
                au cœur de Dakar
              </span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-ink-300 leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: '100ms' }}>
              StageConnect Sénégal connecte les étudiants aux entreprises sénégalaises. De Dakar à Thiès, de Saint-Louis à Ziguinchor — trouvez l'opportunité qui lancera votre carrière.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <LinkButton to="/offres" size="lg" leftIcon={<Search className="w-5 h-5" />} className="shine">
                Trouver un stage
              </LinkButton>
              <LinkButton to="/register/company" size="lg" variant="outline"
                leftIcon={<Building2 className="w-5 h-5" />}
                className="bg-white/10 border-white/25 text-white hover:bg-white/20 hover:border-white/40">
                Publier une offre
              </LinkButton>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {statsDisplay.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl lg:text-3xl font-extrabold text-white font-display">
                    {typeof s.value === 'number' ? s.value.toLocaleString('fr-FR') : s.value}<span className="text-accent-400">+</span>
                  </p>
                  <p className="text-sm text-ink-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-12 lg:h-16" preserveAspectRatio="none">
            <path d="M0,80 L0,40 Q360,0 720,30 T1440,40 L1440,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ====================== SEARCH BAR ====================== */}
      <section className="container-page -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-elevated border border-ink-100/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Mot-clé"
              placeholder="Ex: Développeur, Marketing..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search.keyword}
              onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
            />
            <Select
              label="Domaine"
              value={search.domain}
              onChange={(e) => setSearch({ ...search, domain: e.target.value })}
            >
              <option value="all">Tous les domaines</option>
              {domains.map((d) => <option key={d.label} value={d.label}>{d.label}</option>)}
            </Select>
            <Select
              label="Localisation"
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
            >
              <option value="all">Toutes les villes</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Touba">Touba</option>
              <option value="Mbour">Mbour</option>
              <option value="Ziguinchor">Ziguinchor</option>
            </Select>
            <Select
              label="Type de stage"
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
            >
              <option value="all">Tous les types</option>
              <option value="Stage">Stage</option>
              <option value="Stage de fin d'études">Stage de fin d'études</option>
            </Select>
          </div>
          <div className="mt-4 flex justify-center">
            <Button size="lg" onClick={handleSearch} leftIcon={<Search className="w-5 h-5" />} className="shine w-full sm:w-auto">
              Rechercher des offres
            </Button>
          </div>
        </div>
      </section>

      {/* ====================== DOMAINS ====================== */}
      <section className="container-page py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Explorez par domaine
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Trouvez votre voie</h2>
          <p className="mt-2 text-ink-500 text-lg">Tous les secteurs porteurs du Sénégal réunis en un seul endroit</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {domains.map((domain, i) => (
            <Link key={domain.label} to={`/offres?domain=${domain.label}`} className="group">
              <div
                className="bg-white rounded-2xl border border-ink-100/80 shadow-card p-5 text-center card-hover-lift hover:shadow-elevated hover:border-primary-200/60 animate-scale-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} text-white flex items-center justify-center mx-auto shadow-soft group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <domain.icon className="w-6 h-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-700 group-hover:text-primary-700 transition-colors">{domain.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================== FEATURED OFFERS ====================== */}
      <section className="container-page py-12 lg:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" /> À la une
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Offres récentes</h2>
            <p className="mt-2 text-ink-500 text-lg">Les dernières opportunités publiées par les entreprises</p>
          </div>
          <Link to="/offres" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group">
            Voir toutes les offres <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offersLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            offersData?.results.slice(0, 6).map((offer, i) => (
              <div key={offer.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <OfferCard offer={offer} />
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-10 sm:hidden">
          <LinkButton to="/offres" variant="outline">Voir toutes les offres</LinkButton>
        </div>
      </section>

      {/* ====================== HOW IT WORKS ====================== */}
      <section className="relative bg-gradient-to-b from-ink-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="container-page relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-3">
              <Zap className="w-4 h-4" /> Simple & rapide
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Comment ça marche ?</h2>
            <p className="mt-2 text-ink-500 text-lg">Trouvez votre stage en 5 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl border border-ink-100/80 shadow-card p-6 h-full card-hover-lift hover:shadow-elevated">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="mt-4 text-xs font-bold text-primary-500 tracking-wider">ÉTAPE {i + 1}</div>
                  <h3 className="mt-1 font-bold text-ink-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 text-primary-200 z-10">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SENEGAL SHOWCASE ====================== */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-slide-in-left">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-[2rem] blur-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-[1.5rem] overflow-hidden shadow-elevated ring-1 ring-black/5 aspect-[3/4]">
                  <img src={senegalImages.dakarPikine} alt="Rues de Pikine, Dakar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent" />
                </div>
                <div className="grid gap-4 mt-8">
                  <div className="relative rounded-[1.5rem] overflow-hidden shadow-elevated ring-1 ring-black/5 aspect-square">
                    <img src={senegalImages.senegalBoats} alt="Pirogues au Sénégal" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative rounded-[1.5rem] overflow-hidden shadow-elevated ring-1 ring-black/5 aspect-square">
                    <img src={senegalImages.dakarCoast} alt="Côte de Dakar" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4">
                <MapPin className="w-4 h-4" /> Made in Senegal
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display text-balance">
                Une plateforme pensée pour le Sénégal
              </h2>
              <p className="mt-4 text-lg text-ink-600 leading-relaxed">
                De Dakar à Saint-Louis, de Thiès à Ziguinchor, StageConnect accompagne les étudiants sénégalais dans leur recherche de stage et les entreprises locales dans leur recrutement de talents.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: GraduationCap, title: 'Pour les étudiants', desc: 'UCAD, ESP, ISM, SUPDECO, Polytech, UGB et toutes les universités et écoles du Sénégal.' },
                  { icon: Building2, title: 'Pour les entreprises', desc: 'Sonatel, BICIS, Gaindé 2000, SELEA et des centaines de PME et startups locales.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center shadow-soft flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900">{item.title}</h3>
                      <p className="text-sm text-ink-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <LinkButton to="/a-propos" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  En savoir plus sur nous
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== FEATURES ====================== */}
      <section className="relative bg-gradient-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-[0.06]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]" />
        <div className="container-page relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-3">
              <Star className="w-4 h-4 text-accent-400" /> Nos atouts
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display">Pourquoi StageConnect ?</h2>
            <p className="mt-2 text-ink-300 text-lg">Une plateforme pensée pour votre réussite professionnelle</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 animate-count-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center shadow-soft group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 font-bold text-white text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TESTIMONIALS ====================== */}
      <section className="container-page py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-50 text-secondary-700 text-sm font-semibold mb-3">
            <Quote className="w-4 h-4" /> Témoignages
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Ils nous font confiance</h2>
          <p className="mt-2 text-ink-500 text-lg">Découvrez les expériences de notre communauté</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="bg-white rounded-2xl border border-ink-100/80 shadow-card p-7 h-full card-hover-lift hover:shadow-elevated">
                <Quote className="w-8 h-8 text-primary-100" />
                <p className="mt-3 text-ink-600 leading-relaxed text-sm">{t.text}</p>
                <div className="mt-5 flex items-center gap-1 text-accent-400">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="mt-5 pt-5 border-t border-ink-50 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-soft" />
                  <div>
                    <p className="font-bold text-ink-900 text-sm">{t.name}</p>
                    <p className="text-xs text-ink-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== PARTNERS ====================== */}
      <section className="bg-ink-50 py-14 overflow-hidden">
        <div className="container-page">
          <p className="text-center text-sm font-semibold text-ink-400 uppercase tracking-wider mb-8">Ils nous font confiance</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {partners.map((p) => (
              <span key={p} className="text-lg font-bold text-ink-300 hover:text-primary-600 transition-colors cursor-default font-display">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== COMPANIES ====================== */}
      {companiesData && companiesData.results.length > 0 && (
        <section className="container-page py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-3">
                <Building2 className="w-4 h-4" /> Partenaires
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Entreprises partenaires</h2>
              <p className="mt-2 text-ink-500 text-lg">Découvrez les entreprises qui recrutent</p>
            </div>
            <Link to="/entreprises" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group">
              Toutes les entreprises <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companiesData.results.slice(0, 6).map((company, i) => (
              <Link key={company.id} to="/entreprises" className="group">
                <div
                  className="bg-white rounded-2xl border border-ink-100/80 shadow-card p-5 flex flex-col items-center text-center card-hover-lift hover:shadow-elevated hover:border-primary-200/60 animate-scale-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <CompanyLogo name={company.name} logo={company.logo} size="lg" />
                  <p className="mt-3 text-sm font-bold text-ink-900 line-clamp-1 group-hover:text-primary-700 transition-colors">{company.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{company.sector}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ====================== CTA ====================== */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-10 lg:p-16 text-white text-center shadow-glow-lg">
          <div className="absolute inset-0 dot-pattern opacity-[0.08]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-5">
              <Send className="w-4 h-4" /> Rejoignez-nous
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold font-display text-balance">Prêt à démarrer votre carrière ?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Rejoignez StageConnect Sénégal et accédez à des centaines d'opportunités de stage.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <LinkButton to="/register/student" size="lg" variant="secondary" leftIcon={<GraduationCap className="w-5 h-5" />} className="shine">
                Je suis étudiant
              </LinkButton>
              <LinkButton to="/register/company" size="lg" variant="outline" leftIcon={<Building2 className="w-5 h-5" />}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50">
                Je suis une entreprise
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
