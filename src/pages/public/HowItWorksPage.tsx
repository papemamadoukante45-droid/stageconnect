import {
  GraduationCap, Building2, FileText, Search, CheckCircle2, TrendingUp,
  UserPlus, Briefcase, Mail, Bell, ArrowRight, Zap,
} from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { senegalImages } from '@/lib/senegal-images';

const studentSteps = [
  { icon: UserPlus, title: 'Créer un compte', desc: 'Inscrivez-vous gratuitement avec votre adresse email en moins d\'une minute.', color: 'bg-primary-50 text-primary-600' },
  { icon: FileText, title: 'Compléter son profil', desc: 'Renseignez votre formation, vos compétences, vos expériences et téléchargez votre CV.', color: 'bg-accent-50 text-accent-600' },
  { icon: Search, title: 'Rechercher une offre', desc: 'Utilisez nos filtres avancés pour trouver le stage qui correspond à votre profil.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: CheckCircle2, title: 'Postuler', desc: 'Envoyez votre candidature avec lettre de motivation en un seul clic.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: TrendingUp, title: 'Suivre sa candidature', desc: 'Consultez le statut de vos candidatures en temps réel sur votre tableau de bord.', color: 'bg-primary-50 text-primary-600' },
];

const companySteps = [
  { icon: UserPlus, title: 'Créer un compte', desc: 'Inscrivez votre entreprise et vérifiez votre profil.', color: 'bg-accent-50 text-accent-600' },
  { icon: Building2, title: 'Créer son profil', desc: 'Ajoutez votre logo, votre description et vos informations de contact.', color: 'bg-primary-50 text-primary-600' },
  { icon: Briefcase, title: 'Publier une offre', desc: 'Créez et publiez vos offres de stage en quelques minutes.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: Mail, title: 'Recevoir des candidatures', desc: 'Consultez les profils des candidats et téléchargez leurs CV.', color: 'bg-secondary-50 text-secondary-600' },
  { icon: CheckCircle2, title: 'Sélectionner un candidat', desc: 'Acceptez ou refusez les candidatures et notifiez les étudiants.', color: 'bg-accent-50 text-accent-600' },
];

export function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-900 py-16 lg:py-20 overflow-hidden">
        <img src={senegalImages.studentsCampus} alt="Étudiants au campus" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/70 to-ink-900/90" />
        <div className="absolute inset-0 dot-pattern opacity-[0.03]" />
        <div className="container-page relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold mb-5">
            <Zap className="w-4 h-4 text-accent-400" /> Guide complet
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white font-display">Comment ça marche ?</h1>
          <p className="mt-4 text-lg text-ink-300 max-w-2xl mx-auto">
            StageConnect Sénégal simplifie la connexion entre les étudiants et les entreprises. Découvrez comment utiliser la plateforme en quelques étapes.
          </p>
        </div>
      </section>

      {/* Student Path */}
      <section className="container-page py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm">
            <GraduationCap className="w-4 h-4" /> Vous êtes étudiant
          </div>
          <h2 className="mt-4 text-2xl lg:text-3xl font-bold text-ink-900">Trouvez votre stage en 5 étapes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {studentSteps.map((step, i) => (
            <Card key={i} className="p-6 relative">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-ink-50 font-display">{i + 1}</div>
              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-ink-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <LinkButton to="/register/student" size="lg" leftIcon={<GraduationCap className="w-5 h-5" />}>
            Créer un compte étudiant
          </LinkButton>
        </div>
      </section>

      {/* Company Path */}
      <section className="bg-ink-50 py-16">
        <div className="container-page">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 text-accent-700 font-semibold text-sm">
              <Building2 className="w-4 h-4" /> Vous êtes une entreprise
            </div>
            <h2 className="mt-4 text-2xl lg:text-3xl font-bold text-ink-900">Recrutez vos stagiaires en 5 étapes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {companySteps.map((step, i) => (
              <Card key={i} className="p-6 relative">
                <div className="absolute top-4 right-4 text-4xl font-extrabold text-ink-50 font-display">{i + 1}</div>
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-bold text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <LinkButton to="/register/company" size="lg" variant="accent" leftIcon={<Building2 className="w-5 h-5" />}>
              Créer un compte entreprise
            </LinkButton>
          </div>
        </div>
      </section>

      {/* FAQ / Key points */}
      <section className="container-page py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-bold text-ink-900 text-lg">Notifications en temps réel</h3>
            <p className="mt-2 text-sm text-ink-500">Soyez alerté dès qu'une nouvelle offre correspond à votre profil ou quand une entreprise répond à votre candidature.</p>
          </Card>
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-bold text-ink-900 text-lg">Entreprises vérifiées</h3>
            <p className="mt-2 text-sm text-ink-500">Toutes les entreprises sont vérifiées pour garantir des opportunités sérieuses et de qualité.</p>
          </Card>
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-bold text-ink-900 text-lg">Recherche avancée</h3>
            <p className="mt-2 text-sm text-ink-500">Filtrez par domaine, localisation, type de stage et bien plus pour trouver exactement ce que vous cherchez.</p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand p-8 lg:p-14 text-white text-center shadow-glow-lg">
          <div className="absolute inset-0 dot-pattern opacity-[0.08]" />
          <h2 className="relative text-3xl font-extrabold font-display">Commencez dès maintenant</h2>
          <p className="relative mt-3 text-white/80 max-w-xl mx-auto">Rejoignez la communauté StageConnect Sénégal et connectez-vous aux meilleures opportunités.</p>
          <div className="relative mt-7 flex flex-wrap gap-3 justify-center">
            <LinkButton to="/register/student" size="lg" variant="secondary" className="shine">Je suis étudiant</LinkButton>
            <LinkButton to="/register/company" size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50">Je suis une entreprise</LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
