import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Briefcase, Heart, ArrowRight } from 'lucide-react';
import type { Offer } from '@/types';
import { Card } from '@/components/ui/Card';
import { CompanyLogo } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OfferCardProps {
  offer: Offer;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

function daysUntil(date: string): { text: string; urgent: boolean } {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: 'Expirée', urgent: false };
  if (diff === 0) return { text: "Aujourd'hui", urgent: true };
  if (diff === 1) return { text: 'Demain', urgent: true };
  if (diff <= 7) return { text: `Dans ${diff} j`, urgent: true };
  return { text: `Dans ${diff} j`, urgent: false };
}

export function OfferCard({ offer, onToggleFavorite, isFavorite }: OfferCardProps) {
  const deadline = daysUntil(offer.deadline);

  return (
    <Card hover className="p-5 flex flex-col h-full group">
      <div className="flex items-start gap-3">
        <CompanyLogo name={offer.company_name} logo={offer.company_logo} size="md" />
        <div className="flex-1 min-w-0">
          <Link to={`/offres/${offer.id}`}>
            <h3 className="font-bold text-ink-900 text-base leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
              {offer.title}
            </h3>
          </Link>
          <p className="text-sm text-ink-500 mt-0.5 truncate">{offer.company_name}</p>
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(offer.id)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${isFavorite ? 'text-secondary-500 bg-secondary-50' : 'text-ink-300 hover:bg-ink-50 hover:text-secondary-500'} hover:scale-110`}
            aria-label="Ajouter aux favoris"
          >
            <Heart className={`w-5 h-5 transition-transform ${isFavorite ? 'scale-110' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-ink-400" /> {offer.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-ink-400" /> {offer.internship_type}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-ink-400" /> {offer.duration}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {offer.required_skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-lg bg-ink-50 text-ink-600 text-xs font-semibold border border-ink-100/50">
            {skill}
          </span>
        ))}
        {offer.required_skills.length > 3 && (
          <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-semibold">
            +{offer.required_skills.length - 3}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-ink-50/80">
        <div className="flex items-center gap-3">
          <StatusBadge status={offer.status} />
          <span className={`text-xs font-semibold inline-flex items-center gap-1 ${deadline.urgent ? 'text-secondary-600' : 'text-ink-400'}`}>
            <Calendar className="w-3.5 h-3.5" /> {deadline.text}
          </span>
        </div>
        <Link to={`/offres/${offer.id}`}>
          <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}>
            Voir
          </Button>
        </Link>
      </div>
    </Card>
  );
}
