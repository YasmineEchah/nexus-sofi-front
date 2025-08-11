import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ login: '', password: '' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.login, form.password);
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Échec de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>SofiSoft Login</title>
        <meta name="description" content="Connectez-vous pour accéder au dashboard SofiSoft" />
        <link rel="canonical" href="/login" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login">Identifiant</Label>
                <Input id="login" value={form.login} onChange={(e)=>setForm(f=>({...f, login:e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={form.password} onChange={(e)=>setForm(f=>({...f, password:e.target.value}))} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
