import { useState } from 'react';
import { User, Mail, Phone, MapPin, School, BookOpen, FileText, Camera, Upload, Save, Star, Languages, Briefcase } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { TagInput } from '@/components/ui/TagInput';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { studentsApi } from '@/api/students';
import { useToast } from '@/context/ToastContext';
import type { StudentProfile } from '@/types';

export function StudentProfilePage() {
  const toast = useToast();
  const { data, loading, error, refetch } = useAsync(() => studentsApi.getProfile(), []);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StudentProfile | null>(null);

  const startEdit = () => {
    if (data) { setForm({ ...data }); setEditing(true); }
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await studentsApi.updateProfile(form);
      toast.success('Profil mis à jour', 'Vos modifications ont été enregistrées.');
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid lg:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const profile = editing && form ? form : data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Mon profil</h1>
          <p className="text-ink-500 mt-1">Gérez vos informations personnelles et professionnelles</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Annuler</Button>
            <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>Enregistrer</Button>
          </div>
        ) : (
          <Button onClick={startEdit}>Modifier le profil</Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Photo & CV */}
        <div className="space-y-6">
          <Card>
            <CardBody className="text-center">
              <div className="relative inline-block">
                <Avatar src={profile.photo} name={`${profile.first_name} ${profile.last_name}`} size="xl" />
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-soft hover:bg-primary-700 transition-colors" aria-label="Changer la photo">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{profile.first_name} {profile.last_name}</h3>
              <p className="text-sm text-ink-500">{profile.education}</p>
              <p className="text-sm text-ink-400">{profile.school}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-accent-600" />
                <h3 className="font-bold text-ink-900">Mon CV</h3>
              </div>
              <div className="p-3 rounded-xl bg-ink-50 border border-ink-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warm-100 text-warm-700 flex items-center justify-center text-xs font-bold">PDF</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{profile.cv || 'Aucun CV'}</p>
                  <p className="text-xs text-ink-400">Téléversé</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Upload className="w-4 h-4" />}>Remplacer</Button>
                <Button variant="ghost" size="sm" className="flex-1">Télécharger</Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h3 className="font-bold text-ink-900 mb-4">Informations personnelles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Prénom" leftIcon={<User className="w-4 h-4" />} value={profile.first_name} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, first_name: e.target.value })} />
                <Input label="Nom" leftIcon={<User className="w-4 h-4" />} value={profile.last_name} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, last_name: e.target.value })} />
                <Input label="Email" type="email" leftIcon={<Mail className="w-4 h-4" />} value={profile.email} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, email: e.target.value })} />
                <Input label="Téléphone" leftIcon={<Phone className="w-4 h-4" />} value={profile.phone} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, phone: e.target.value })} />
                <Input label="Ville" leftIcon={<MapPin className="w-4 h-4" />} value={profile.city} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, city: e.target.value })} />
                <Input label="Établissement" leftIcon={<School className="w-4 h-4" />} value={profile.school} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, school: e.target.value })} />
                <Select label="Niveau d'étude" value={profile.level} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, level: e.target.value })}>
                  <option>Licence 1</option><option>Licence 2</option><option>Licence 3</option>
                  <option>Master 1</option><option>Master 2</option><option>Doctorat</option>
                </Select>
                <Input label="Formation" leftIcon={<BookOpen className="w-4 h-4" />} value={profile.education} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, education: e.target.value })} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-bold text-ink-900 mb-4">À propos de moi</h3>
              <Textarea
                rows={4}
                value={profile.bio}
                disabled={!editing}
                placeholder="Décrivez votre parcours, vos objectifs et vos motivations..."
                onChange={(e) => editing && setForm({ ...form!, bio: e.target.value })}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-secondary-500" />
                <h3 className="font-bold text-ink-900">Compétences</h3>
              </div>
              {editing ? (
                <TagInput
                  values={form?.skills || []}
                  onChange={(skills) => setForm({ ...form!, skills })}
                  placeholder="Ex: JavaScript, Python..."
                  hint="Appuyez sur Entrée pour ajouter une compétence"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold">{s}</span>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-accent-600" />
                <h3 className="font-bold text-ink-900">Langues</h3>
              </div>
              {editing ? (
                <TagInput
                  values={form?.languages || []}
                  onChange={(languages) => setForm({ ...form!, languages })}
                  placeholder="Ex: Français (natif), Anglais (B2)..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((l) => (
                    <span key={l} className="px-3 py-1.5 rounded-lg bg-accent-50 text-accent-700 text-sm font-semibold">{l}</span>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {profile.experiences.length > 0 && (
            <Card>
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-ink-900">Expériences</h3>
                </div>
                <div className="space-y-4">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="pl-4 border-l-2 border-primary-100">
                      <p className="font-semibold text-ink-900">{exp.title}</p>
                      <p className="text-sm text-ink-500">{exp.company}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{exp.start_date} → {exp.end_date || 'En cours'}</p>
                      <p className="text-sm text-ink-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
