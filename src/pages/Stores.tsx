import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Stores: React.FC = () => {
  const { data: magasins } = useQuery({ queryKey: ['getMagasins'], queryFn: api.getMagasins });
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const { data: infos } = useQuery({
    queryKey: ['getMagasinsInfos', dateStart, dateEnd],
    queryFn: () => api.getMagasinsInfos({ dateStart, dateEnd }),
    enabled: !!dateStart && !!dateEnd,
  });

  const { data: infosByDate } = useQuery({
    queryKey: ['getMagasinsInfoByDate', dateStart, dateEnd],
    queryFn: () => api.getMagasinsInfoByDate({ dateStart: dateStart || undefined, dateEnd: dateEnd || undefined }),
  });

  return (
    <AppLayout>
      <Helmet>
        <title>Magasins | SofiSoft</title>
        <meta name="description" content="Liste des magasins et indicateurs par période" />
        <link rel="canonical" href="/stores" />
      </Helmet>
      <section className="space-y-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-sm">Début</label>
            <Input type="date" value={dateStart} onChange={(e)=>setDateStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Fin</label>
            <Input type="date" value={dateEnd} onChange={(e)=>setDateEnd(e.target.value)} />
          </div>
          <Button type="button">Actualiser</Button>
        </div>
        <Card>
          <CardHeader><CardTitle>Magasins</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(magasins, null, 2)}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Infos Magasins (période)</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(infos, null, 2)}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Infos Magasins par date</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(infosByDate, null, 2)}</pre>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Stores;
