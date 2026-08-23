import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const footerLinks = {
  navigation: [
    { label: 'Accueil', to: '/' },
    { label: 'Offres de stage', to: '/offres' },
    { label: 'Entreprises', to: '/entreprises' },
    { label: 'Comment ça marche', to: '/comment-ca-marche' },
    { label: 'À propos', to: '/a-propos' },
  ],
  legal: [
    { label: "Conditions d'utilisation", to: '/conditions' },
    { label: 'Politique de confidentialité', to: '/confidentialite' },
    { label: 'Contact', to: '/contact' },
  ],
};

const socials = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="relative bg-ink-900 text-ink-300 mt-auto overflow-hidden">
      <div className="h-1 bg-senegal-stripe w-full" />
      <div className="absolute inset-0 dot-pattern opacity-[0.04]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px]" />
      <div className="relative container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Logo light />
            <p className="mt-4 text-sm text-ink-400 leading-relaxed max-w-xs">
              La plateforme de référence pour la recherche et la gestion de stages au Sénégal. Connecter les talents aux opportunités professionnelles.
            </p>
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-ink-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-glow"
                >
                  <s.icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ink-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ink-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ink-400">
                <MapPin className="w-4 h-4 mt-0.5 text-accent-400 flex-shrink-0" />
                <span>Dakar, Sénégal<br />Plateforme numérique de stages</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-400">
                <Mail className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <a href="mailto:contact@stageconnect.sn" className="hover:text-white transition-colors">contact@stageconnect.sn</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-400">
                <Phone className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <span>+221 33 800 00 00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-ink-500">© 2026 StageConnect Sénégal. Tous droits réservés.</p>
          <p className="text-sm text-ink-500">Fait avec passion au Sénégal</p>
        </div>
      </div>
    </footer>
  );
}
