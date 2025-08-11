import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Comparateur: React.FC = () => {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [magasinIds, setMagasinIds] = useState<string>('');
  const [m1, setM1] = useState('');
  const [p1s, setP1s] = useState('');
  const [p1e, setP1e] = useState('');
  const [p2s, setP2s] = useState('');
  const [p2e, setP2e] = useState('');

  const compareMany = useQuery({
    queryKey: ['compareMagasins', dateStart, dateEnd, magasinIds],
    queryFn: () => api.compareMagasins({ dateStart, dateEnd, magasinIds: magasinIds.split(',').map(s=>s.trim()).filter(Boolean) }),
    enabled: !!dateStart && !!dateEnd && !!magasinIds,
  });

  const comparePeriode = useQuery({
    queryKey: ['getComparePeriode', m1, p1s, p1e, p2s, p2e],
    queryFn: () => api.getComparePeriode({ magasinId: m1, start1: p1s, end1: p1e, start2: p2s, end2: p2e }),
    enabled: !!m1 && !!p1s && !!p1e && !!p2s && !!p2e,
  });

  return (
    <AppLayout>
      <Helmet>
        <title>Comparateur | SofiSoft</title>
        <meta name="description" content="Comparer les performances de plusieurs magasins et périodes" />
        <link rel="canonical" href="/comparateur" />
      </Helmet>
      <section className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Comparer plusieurs magasins</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Début</label>
              <Input type="date" value={dateStart} onChange={(e)=>setDateStart(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Fin</label>
              <Input type="date" value={dateEnd} onChange={(e)=>setDateEnd(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">IDs magasins (séparés par des virgules)</label>
              <Input placeholder="1,2,3" value={magasinIds} onChange={(e)=>setMagasinIds(e.target.value)} />
            </div>
            <div className="md:col-span-4">
              <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(compareMany.data, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Comparer deux périodes (un magasin)</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm">Magasin ID</label>
              <Input value={m1} onChange={(e)=>setM1(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">P1 début</label>
              <Input type="date" value={p1s} onChange={(e)=>setP1s(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">P1 fin</label>
              <Input type="date" value={p1e} onChange={(e)=>setP1e(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">P2 début</label>
              <Input type="date" value={p2s} onChange={(e)=>setP2s(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">P2 fin</label>
              <Input type="date" value={p2e} onChange={(e)=>setP2e(e.target.value)} />
            </div>
            <div className="md:col-span-6">
              <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(comparePeriode.data, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Comparateur;
