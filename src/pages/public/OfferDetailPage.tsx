import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Briefcase, Clock, Calendar, CheckCircle2, ArrowLeft, Heart,
  Share2, Building2, Send, FileText, User,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { CompanyLogo, Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { FullPageLoader } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { offersApi } from '@/api/offers';
import { applicationsApi } from '@/api/applications';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function OfferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: offer, loading, error, refetch } = useAsync(
    () => offersApi.get(Number(id)),
    [id]
  );

  const handleApply = async () => {
    if (!user) {
      toast.info('Connexion requise', 'Connectez-vous pour postuler à cette offre.');
      navigate('/login');
      return;
    }
    if (user.role !== 'STUDENT') {
      toast.warning('Profil étudiant requis', 'Seuls les comptes étudiants peuvent postuler.');
      return;
    }
    if (!coverLetter.trim()) {
      toast.warning('Lettre de motivation requise', 'Veuillez rédiger votre lettre de motivation.');
      return;
    }
    setSubmitting(true);
    try {
      await applicationsApi.create({ offer: Number(id), cv: null, cover_letter: coverLetter });
      toast.success('Candidature envoyée', 'Votre candidature a été envoyée avec succès.');
      setApplyOpen(false);
      setCoverLetter('');
      navigate('/student/applications');
    } catch (err) {
      toast.error('Erreur', err instanceof Error ? err.message : 'Impossible d\'envoyer votre candidature.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!offer) return <ErrorState title="Offre introuvable" />;

  return (
    <div className="container-page py-8 lg:py-12">
      <Link to="/offres" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux offres
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <CompanyLogo name={offer.company_name} logo={offer.company_logo} size="lg" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-extrabold text-ink-900 font-display">{offer.title}</h1>
                    <p className="text-ink-500 mt-1">{offer.company_name}</p>
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-ink-400" /> {offer.location}</span>
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-ink-400" /> {offer.internship_type}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-ink-400" /> {offer.duration}</span>
                  <span className="inline-flex items-center gap-1.5"><Building2 className="w-4 h-4 text-ink-400" /> {offer.sector}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setApplyOpen(true)} size="lg" leftIcon={<Send className="w-5 h-5" />}>
                Postuler maintenant
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Heart className="w-5 h-5" />}>Sauvegarder</Button>
              <Button variant="ghost" size="lg" leftIcon={<Share2 className="w-5 h-5" />}>Partager</Button>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-bold text-ink-900 mb-3">Description du poste</h2>
              <p className="text-ink-600 leading-relaxed">{offer.description}</p>
            </CardBody>
          </Card>

          {/* Missions */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-bold text-ink-900 mb-4">Vos missions</h2>
              <ul className="space-y-3">
                {offer.missions.map((mission, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-ink-600 leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Required Skills */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-bold text-ink-900 mb-4">Compétences recherchées</h2>
              <div className="flex flex-wrap gap-2">
                {offer.required_skills.map((skill) => (
                  <span key={skill} className="px-3.5 py-2 rounded-xl bg-ink-50 text-ink-700 text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Offer Info */}
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-ink-900 mb-4">Informations clés</h3>
            <dl className="space-y-3">
              <InfoRow icon={<Building2 className="w-4 h-4" />} label="Secteur" value={offer.sector} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Localisation" value={offer.location} />
              <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Type" value={offer.internship_type} />
              <InfoRow icon={<Clock className="w-4 h-4" />} label="Durée" value={offer.duration} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Niveau requis" value={offer.education_level} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Publié le" value={formatDate(offer.publication_date)} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date limite" value={formatDate(offer.deadline)} urgent />
            </dl>
            <div className="mt-5 pt-5 border-t border-ink-50">
              <Button onClick={() => setApplyOpen(true)} className="w-full" size="lg" leftIcon={<Send className="w-5 h-5" />}>
                Postuler
              </Button>
            </div>
          </Card>

          {/* Company Info */}
          <Card className="p-6">
            <h3 className="font-bold text-ink-900 mb-4">À propos de l'entreprise</h3>
            <div className="flex items-center gap-3 mb-4">
              <CompanyLogo name={offer.company_name} logo={offer.company_logo} size="md" />
              <div>
                <p className="font-semibold text-ink-900">{offer.company_name}</p>
                <p className="text-sm text-ink-500">{offer.sector}</p>
              </div>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">
              Entreprise partenaire de StageConnect Sénégal, offrant des opportunités de stage aux étudiants sénégalais.
            </p>
            <LinkButton to="/entreprises" variant="outline" size="sm" className="w-full mt-4">
              Voir les offres de cette entreprise
            </LinkButton>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Postuler à cette offre"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>Annuler</Button>
            <Button onClick={handleApply} loading={submitting} leftIcon={<Send className="w-4 h-4" />}>
              Envoyer ma candidature
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
            <FileText className="w-5 h-5 text-primary-600" />
            <div className="text-sm">
              <p className="font-semibold text-ink-900">{offer.title}</p>
              <p className="text-ink-500">{offer.company_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
            <FileText className="w-5 h-5 text-accent-600" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-ink-900">CV joint</p>
              <p className="text-ink-500">Votre CV de profil sera automatiquement joint</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-accent-500" />
          </div>
          <Textarea
            label="Lettre de motivation"
            placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..."
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            hint="Minimum 100 caractères recommandé"
          />
        </div>
      </Modal>
    </div>
  );
}

function InfoRow({ icon, label, value, urgent }: { icon: React.ReactNode; label: string; value: string; urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-sm text-ink-500">
        <span className="text-ink-400">{icon}</span>
        {label}
      </dt>
      <dd className={`text-sm font-semibold ${urgent ? 'text-secondary-600' : 'text-ink-900'}`}>{value}</dd>
    </div>
  );
}
