import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user, magasins, token, setBaseUrl, logout } = useAuth();
  const [moduleParam, setModuleParam] = useState('ANDROID_UPDATE_APP');
  const [params, setParams] = useState<any>();
  const [apiUrl, setApiUrl] = useState<string>(()=> localStorage.getItem('API_BASE_URL') || 'http://localhost:8080');

  useEffect(() => {
    api.getParam({ module: moduleParam })
      .then(setParams)
      .catch((e)=> toast.error(e.message));
  }, [moduleParam]);

  const saveUrl = () => {
    setBaseUrl(apiUrl);
    toast.success('Base URL mise à jour');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Profil | SofiSoft</title>
        <meta name="description" content="Profil utilisateur et paramètres" />
        <link rel="canonical" href="/profile" />
      </Helmet>
      <section className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Utilisateur</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify({ user, magasins, token }, null, 2)}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Paramètres (getParam)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm">Module</label>
              <Input value={moduleParam} onChange={(e)=>setModuleParam(e.target.value)} />
            </div>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(params, null, 2)}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Configuration API</CardTitle></CardHeader>
          <CardContent className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-sm">Base URL</label>
              <Input value={apiUrl} onChange={(e)=>setApiUrl(e.target.value)} placeholder="http://host:port" />
            </div>
            <Button onClick={saveUrl}>Enregistrer</Button>
            <Button variant="destructive" onClick={logout}>Déconnexion</Button>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Profile;
