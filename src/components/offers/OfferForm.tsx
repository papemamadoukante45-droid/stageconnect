import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FileText, MapPin, Briefcase, Clock, Calendar, BookOpen, Building2 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { TagInput } from '@/components/ui/TagInput';
import { offersApi } from '@/api/offers';
import { useToast } from '@/context/ToastContext';
import type { OfferFormData, Offer } from '@/types';

interface OfferFormProps {
  initialData?: Offer;
  onSubmit: (data: OfferFormData) => Promise<void>;
  submitLabel?: string;
}

export function OfferForm({ initialData, onSubmit, submitLabel = 'Publier l\'offre' }: OfferFormProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<OfferFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    missions: initialData?.missions || [''],
    required_skills: initialData?.required_skills || [],
    location: initialData?.location || 'Dakar',
    internship_type: initialData?.internship_type || 'Stage',
    duration: initialData?.duration || '6 mois',
    education_level: initialData?.education_level || 'Licence 3',
    sector: initialData?.sector || 'Informatique',
    deadline: initialData?.deadline || '',
    status: initialData?.status || 'ACTIVE',
  });

  const handleSubmit = async (status: 'ACTIVE' | 'DRAFT') => {
    if (!form.title.trim()) { toast.warning('Titre requis', 'Veuillez saisir un titre.'); return; }
    if (!form.description.trim()) { toast.warning('Description requise', 'Veuillez saisir une description.'); return; }
    setSaving(true);
    try {
      await onSubmit({ ...form, status });
    } catch (err) {
      toast.error('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <h3 className="font-bold text-ink-900 mb-4">Informations principales</h3>
          <div className="space-y-4">
            <Input
              label="Titre de l'offre"
              placeholder="Ex: Développeur Full-Stack Junior"
              leftIcon={<Briefcase className="w-4 h-4" />}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              label="Description du poste"
              rows={5}
              placeholder="Décrivez le poste, le contexte et les objectifs du stage..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-bold text-ink-900 mb-4">Missions</h3>
          <div className="space-y-3">
            {form.missions.map((mission, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-8 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                <Input
                  placeholder={`Mission ${i + 1}`}
                  value={mission}
                  onChange={(e) => {
                    const missions = [...form.missions];
                    missions[i] = e.target.value;
                    setForm({ ...form, missions });
                  }}
                />
                {form.missions.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, missions: form.missions.filter((_, idx) => idx !== i) })}>×</Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setForm({ ...form, missions: [...form.missions, ''] })}>
              + Ajouter une mission
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-bold text-ink-900 mb-4">Compétences recherchées</h3>
          <TagInput
            values={form.required_skills}
            onChange={(required_skills) => setForm({ ...form, required_skills })}
            placeholder="Ex: JavaScript, Python, React..."
            hint="Appuyez sur Entrée pour ajouter une compétence"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-bold text-ink-900 mb-4">Détails du stage</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Localisation" leftIcon={<MapPin className="w-4 h-4" />} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Select label="Type de stage" value={form.internship_type} onChange={(e) => setForm({ ...form, internship_type: e.target.value })}>
              <option>Stage</option>
              <option>Stage de fin d'études</option>
              <option>Stage académique</option>
              <option>Stage pré-embauche</option>
            </Select>
            <Select label="Durée" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
              <option>1 mois</option><option>2 mois</option><option>3 mois</option>
              <option>4 mois</option><option>6 mois</option><option>12 mois</option>
            </Select>
            <Select label="Niveau d'étude requis" value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })}>
              <option>Licence 2</option><option>Licence 3</option><option>Master 1</option>
              <option>Master 2</option><option>Doctorat</option>
            </Select>
            <Select label="Secteur" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })}>
              {['Informatique', 'Intelligence Artificielle', 'Marketing', 'Finance', 'Communication', 'Ressources humaines', 'Réseaux', 'Développement web', 'Data', 'Cybersécurité'].map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Input label="Date limite de candidature" type="date" leftIcon={<Calendar className="w-4 h-4" />} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate('/company/offers')}>Annuler</Button>
        <Button variant="secondary" onClick={() => handleSubmit('DRAFT')} loading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Enregistrer comme brouillon
        </Button>
        <Button onClick={() => handleSubmit('ACTIVE')} loading={saving} leftIcon={<FileText className="w-4 h-4" />}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
