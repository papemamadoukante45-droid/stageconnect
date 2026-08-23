import { useState } from 'react';
import { Building2, Mail, Phone, Globe, MapPin, FileText, Camera, Save, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { CompanyLogo } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { companiesApi } from '@/api/companies';
import { useToast } from '@/context/ToastContext';
import type { CompanyProfile } from '@/types';

export function CompanyProfilePage() {
  const toast = useToast();
  const { data, loading, error, refetch } = useAsync(() => companiesApi.getProfile(), []);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CompanyProfile | null>(null);

  const startEdit = () => { if (data) { setForm({ ...data }); setEditing(true); } };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await companiesApi.updateProfile(form);
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
          <h1 className="text-2xl font-extrabold text-ink-900 font-display">Mon entreprise</h1>
          <p className="text-ink-500 mt-1">Gérez les informations de votre entreprise</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Annuler</Button>
            <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>Enregistrer</Button>
          </div>
        ) : (
          <Button onClick={startEdit}>Modifier</Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Logo card */}
        <Card>
          <CardBody className="text-center">
            <div className="relative inline-block">
              <CompanyLogo name={profile.name} logo={profile.logo} size="lg" className="!w-24 !h-24 !text-3xl mx-auto" />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-soft hover:bg-primary-700 transition-colors" aria-label="Changer le logo">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">{profile.name}</h3>
            <p className="text-sm text-primary-600 font-semibold">{profile.sector}</p>
            <p className="text-sm text-ink-400 mt-1">{profile.location}</p>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold">
                <Globe className="w-4 h-4" /> {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <div className="mt-4 flex justify-center gap-2">
              {profile.socials?.linkedin && <a href={profile.socials.linkedin} className="w-8 h-8 rounded-lg bg-ink-100 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4" /></a>}
              {profile.socials?.twitter && <a href={profile.socials.twitter} className="w-8 h-8 rounded-lg bg-ink-100 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-colors"><Twitter className="w-4 h-4" /></a>}
              {profile.socials?.facebook && <a href={profile.socials.facebook} className="w-8 h-8 rounded-lg bg-ink-100 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>}
            </div>
          </CardBody>
        </Card>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody>
              <h3 className="font-bold text-ink-900 mb-4">Informations générales</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nom de l'entreprise" leftIcon={<Building2 className="w-4 h-4" />} value={profile.name} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, name: e.target.value })} />
                <Select label="Secteur d'activité" value={profile.sector} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, sector: e.target.value })}>
                  <option>Télécommunications & IT</option><option>FinTech & Services</option><option>IA & Data Science</option>
                  <option>Énergie</option><option>Banque & Finance</option><option>Communication & Marketing</option><option>Autre</option>
                </Select>
                <Input label="Email" type="email" leftIcon={<Mail className="w-4 h-4" />} value={profile.email} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, email: e.target.value })} />
                <Input label="Téléphone" leftIcon={<Phone className="w-4 h-4" />} value={profile.phone} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, phone: e.target.value })} />
                <Input label="Site web" leftIcon={<Globe className="w-4 h-4" />} value={profile.website} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, website: e.target.value })} />
                <Input label="Localisation" leftIcon={<MapPin className="w-4 h-4" />} value={profile.location} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, location: e.target.value })} />
              </div>
              <div className="mt-4">
                <Input label="Adresse complète" leftIcon={<MapPin className="w-4 h-4" />} value={profile.address} disabled={!editing} onChange={(e) => editing && setForm({ ...form!, address: e.target.value })} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-ink-900">Description de l'entreprise</h3>
              </div>
              <Textarea
                rows={5}
                value={profile.description}
                disabled={!editing}
                placeholder="Décrivez votre entreprise, son activité, sa mission..."
                onChange={(e) => editing && setForm({ ...form!, description: e.target.value })}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
