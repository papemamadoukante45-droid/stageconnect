import { useState } from 'react';
import { User, Lock, Bell, Globe, Shield, LogOut } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function SettingsView() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Compte', icon: User },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 font-display">Paramètres</h1>
        <p className="text-ink-500 mt-1">Gérez vos préférences et la sécurité de votre compte</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
          <button
            onClick={() => { logout(); toast.info('Déconnexion', 'Vous avez été déconnecté.'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-warm-600 hover:bg-warm-50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'account' && (
            <Card>
              <CardBody className="space-y-4">
                <h3 className="font-bold text-ink-900">Informations du compte</h3>
                <Input label="Email" value={user?.email || ''} disabled leftIcon={<User className="w-4 h-4" />} />
                <Input label="Rôle" value={user?.role || ''} disabled />
                <div>
                  <Button variant="primary" onClick={() => toast.success('Enregistré', 'Vos informations ont été mises à jour.')}>
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
          {activeTab === 'security' && (
            <Card>
              <CardBody className="space-y-4">
                <h3 className="font-bold text-ink-900">Sécurité</h3>
                <Input label="Mot de passe actuel" type="password" placeholder="••••••••" leftIcon={<Lock className="w-4 h-4" />} />
                <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" leftIcon={<Lock className="w-4 h-4" />} />
                <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" leftIcon={<Lock className="w-4 h-4" />} />
                <div>
                  <Button variant="primary" onClick={() => toast.success('Mot de passe modifié', 'Votre mot de passe a été mis à jour.')}>
                    Modifier le mot de passe
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
          {activeTab === 'notifications' && (
            <Card>
              <CardBody className="space-y-4">
                <h3 className="font-bold text-ink-900">Préférences de notifications</h3>
                {[
                  { label: 'Nouvelles offres correspondant à mon profil', defaultChecked: true },
                  { label: 'Réponses à mes candidatures', defaultChecked: true },
                  { label: 'Offres recommandées', defaultChecked: true },
                  { label: 'Newsletter StageConnect', defaultChecked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between p-3 rounded-xl border border-ink-100 cursor-pointer hover:bg-ink-50 transition-colors">
                    <span className="text-sm font-medium text-ink-700">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                  </label>
                ))}
              </CardBody>
            </Card>
          )}
          {activeTab === 'privacy' && (
            <Card>
              <CardBody className="space-y-4">
                <h3 className="font-bold text-ink-900">Confidentialité</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
                  <Globe className="w-5 h-5 text-ink-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">Profil visible par les entreprises</p>
                    <p className="text-xs text-ink-500">Les entreprises peuvent voir votre profil lors de candidatures</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
                  <Shield className="w-5 h-5 text-ink-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">Données et confidentialité</p>
                    <p className="text-xs text-ink-500">Vos données ne sont jamais partagées avec des tiers</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
