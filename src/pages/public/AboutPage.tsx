import { Target, Eye, Heart, Zap, Users, Building2, GraduationCap, TrendingUp, Globe, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { senegalImages, senegalAvatars } from '@/lib/senegal-images';

const values = [
  { icon: Heart, title: 'Accessibilité', desc: 'Une plateforme gratuite et accessible à tous les étudiants sénégalais, quelles que soient leur formation et leur origine.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: Zap, title: 'Innovation', desc: 'Des outils modernes et une expérience utilisateur pensée pour la nouvelle génération de talents.', color: 'bg-primary-50 text-primary-600' },
  { icon: Users, title: 'Inclusion', desc: 'Connecter toutes les régions du Sénégal et tous les secteurs d\'activité dans une même plateforme.', color: 'bg-accent-50 text-accent-600' },
  { icon: Target, title: 'Excellence', desc: 'Des offres de qualité et des entreprises vérifiées pour garantir la meilleure expérience.', color: 'bg-primary-50 text-primary-600' },
];

const stats = [
  { icon: GraduationCap, value: '+1000', label: 'Étudiants inscrits' },
  { icon: Building2, value: '+200', label: 'Entreprises partenaires' },
  { icon: TrendingUp, value: '+300', label: 'Stages pourvus' },
  { icon: Globe, value: '12', label: 'Villes couvertes' },
];

const team = [
  { name: 'Aminata Diop', role: 'Fondatrice & CEO', avatar: senegalAvatars.womanSmiling },
  { name: 'Moussa Ndiaye', role: 'Directeur Technique', avatar: senegalAvatars.manConfident },
  { name: 'Fatou Sarr', role: 'Responsable Produit', avatar: senegalAvatars.womanGreen },
  { name: 'Cheikh Fall', role: 'Lead Développeur', avatar: senegalAvatars.manBlueSuit },
];

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-900 py-20 lg:py-28 overflow-hidden">
        <img src={senegalImages.dakarCoastal} alt="Côte sénégalaise" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/75 to-ink-900/95" />
        <div className="absolute inset-0 dot-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="container-page relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-6">
              <Heart className="w-4 h-4 text-accent-400" /> À propos de StageConnect Sénégal
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] font-display text-balance">
              Connecter les talents sénégalais aux <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">opportunités</span>
            </h1>
            <p className="mt-5 text-lg text-ink-300 leading-relaxed">
              StageConnect Sénégal est une plateforme web moderne qui facilite l'accès aux stages et rapproche les étudiants des entreprises sénégalaises. Notre mission est de briser les barrières entre l'éducation et l'emploi.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink-900">Notre Mission</h2>
            <p className="mt-2 text-ink-600 leading-relaxed">
              Faciliter l'accès aux stages et rapprocher les étudiants des entreprises sénégalaises. Nous croyons que chaque étudiant mérite une opportunité de mettre en pratique ses connaissances et de construire son avenir professionnel au Sénégal.
            </p>
          </Card>
          <Card className="p-8">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink-900">Notre Vision</h2>
            <p className="mt-2 text-ink-600 leading-relaxed">
              Devenir la plateforme de référence pour la recherche de stages en Afrique de l'Ouest, en créant un écosystème numérique qui connecte les talents, les entreprises et les institutions éducatives autour d'un même objectif: l'employabilité des jeunes.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats — Dark */}
      <section className="relative bg-gradient-dark py-16 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-[0.06]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
        <div className="container-page relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="mt-4 text-3xl lg:text-4xl font-extrabold text-white font-display">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-3">
            <Heart className="w-4 h-4" /> Nos valeurs
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Les principes qui nous guident</h2>
          <p className="mt-2 text-ink-500 text-lg">Au quotidien, dans chaque décision que nous prenons</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <Card key={i} hover className="p-6">
              <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center`}>
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-semibold mb-3">
              <Users className="w-4 h-4" /> Notre équipe
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 font-display">Une équipe passionnée</h2>
            <p className="mt-2 text-ink-500 text-lg">Des talents sénégalais au service de votre réussite</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="bg-white rounded-2xl border border-ink-100/80 shadow-card p-6 text-center card-hover-lift hover:shadow-elevated">
                  <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-2xl object-cover mx-auto ring-2 ring-white shadow-soft" />
                  <h3 className="mt-4 font-bold text-ink-900">{member.name}</h3>
                  <p className="text-sm text-primary-600 font-semibold mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-ink-900 font-display">Une technologie moderne</h2>
            <p className="mt-3 text-ink-600 leading-relaxed">
              StageConnect Sénégal est construit avec les technologies web les plus récentes pour offrir une expérience fluide, rapide et sécurisée. Notre architecture frontend-backend séparée garantit performance et évolutivité.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {['React + TypeScript', 'Tailwind CSS', 'Django REST Framework', 'JWT Authentication', 'PostgreSQL', 'Design Responsive'].map((tech) => (
                <div key={tech} className="flex items-center gap-2 text-sm font-semibold text-ink-700">
                  <span className="w-2 h-2 rounded-full bg-accent-500" /> {tech}
                </div>
              ))}
            </div>
          </div>
          <Card className="p-8 bg-gradient-to-br from-primary-600 to-accent-500 text-white">
            <h3 className="text-xl font-bold">L'impact en chiffres</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <span className="text-white/80">Taux de placement en stage</span>
                <span className="text-2xl font-extrabold font-display">68%</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <span className="text-white/80">Satisfaction étudiants</span>
                <span className="text-2xl font-extrabold font-display">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Satisfaction entreprises</span>
                <span className="text-2xl font-extrabold font-display">88%</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-10 lg:p-14 text-white text-center shadow-glow-lg">
          <div className="absolute inset-0 dot-pattern opacity-[0.08]" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold text-ink-900 font-display">Rejoignez l'aventure StageConnect</h2>
            <p className="mt-3 text-ink-600">Faites partie de la communauté qui transforme l'accès aux stages au Sénégal.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <LinkButton to="/register/student" size="lg" className="shine">Créer un compte étudiant</LinkButton>
              <LinkButton to="/register/company" size="lg" variant="outline">Créer un compte entreprise</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
