import React, { useMemo, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { magasins } = useAuth();
  const [magasinId, setMagasinId] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [mouvementId, setMouvementId] = useState<string>('');
  const [productCode, setProductCode] = useState<string>('');

  const params = useMemo(() => ({ magasinId: magasinId || undefined, dateStart, dateEnd }), [magasinId, dateStart, dateEnd]);

  const { data: kpis } = useQuery({
    queryKey: ['dashboardMagasins', params],
    queryFn: () => api.dashboardMagasins(params),
    enabled: !!dateStart && !!dateEnd,
  });

  const { data: evo } = useQuery({
    queryKey: ['evolutionCA', params],
    queryFn: () => api.evolutionCA({ magasinId: params.magasinId, dateStart, dateEnd }),
    enabled: !!dateStart && !!dateEnd,
  });

  const { data: best } = useQuery({
    queryKey: ['bestSalesPrds', params],
    queryFn: () => api.bestSalesPrds({ magasinId: (params.magasinId as any) || 'ALL', dateStart, dateEnd }),
    enabled: !!dateStart && !!dateEnd,
  });

  const { data: infosByDate } = useQuery({
    queryKey: ['getInfosByDate', magasinId, dateStart, dateEnd],
    queryFn: () => api.getInfosByDate({ magasinId, dateStart, dateEnd }),
    enabled: !!dateStart && !!dateEnd,
  });

  const { data: prdsVendus } = useQuery({
    queryKey: ['getPrdsVendus', magasinId, dateStart, dateEnd],
    queryFn: () => api.getPrdsVendus({ magasinId, dateStart, dateEnd }),
    enabled: !!magasinId && !!dateStart && !!dateEnd,
  });

  const [day, setDay] = useState<string>('');
  const { data: infosDay } = useQuery({
    queryKey: ['getInfosDay', magasinId, day],
    queryFn: () => api.getInfosDay({ magasinId, date: day }),
    enabled: !!magasinId && !!day,
  });

  const { data: lineVentes } = useQuery({
    queryKey: ['getLineVentes', magasinId, mouvementId],
    queryFn: () => api.getLineVentes({ magasinId, mouvementId }),
    enabled: !!magasinId && !!mouvementId,
  });

  const { data: dimsPrdVendus } = useQuery({
    queryKey: ['getDimsPrdVendus', magasinId, productCode, dateStart, dateEnd],
    queryFn: () => api.getDimsPrdVendus({ magasinId, productCode, dateStart, dateEnd }),
    enabled: !!magasinId && !!productCode && !!dateStart && !!dateEnd,
  });

  return (
    <AppLayout>
      <Helmet>
        <title>Dashboard SofiSoft</title>
        <meta name="description" content="KPIs, évolution du CA et meilleures ventes" />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      <section className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <label className="text-sm">Magasin</label>
            <Select onValueChange={setMagasinId}>
              <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                {(magasins||[]).map((m:any)=> (
                  <SelectItem key={m.id || m.code || m} value={(m.id || m.code || m).toString()}>
                    {m.name || m.libelle || m.designation || m.code || m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm">Début</label>
            <Input type="date" value={dateStart} onChange={(e)=>setDateStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Fin</label>
            <Input type="date" value={dateEnd} onChange={(e)=>setDateEnd(e.target.value)} />
          </div>
          <Button type="button" onClick={()=>{ /* Queries auto-update via state */ }}>Actualiser</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>KPIs</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(kpis, null, 2)}</pre>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Évolution CA</CardTitle></CardHeader>
            <CardContent className="h-64">
              {Array.isArray(evo) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evo as any[]}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="montant" stroke="hsl(var(--primary))" fill="hsl(var(--accent))" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(evo, null, 2)}</pre>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Meilleures ventes</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(best, null, 2)}</pre>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Produits vendus (période)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {magasinId && dateStart && dateEnd ? (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(prdsVendus, null, 2)}</pre>
              ) : (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify({ hint: 'Sélectionnez un magasin et une période' }, null, 2)}</pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ventes par heure (jour)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm">Jour</label>
                <Input type="date" value={day} onChange={(e)=>setDay(e.target.value)} />
              </div>
              {magasinId && day ? (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(infosDay, null, 2)}</pre>
              ) : (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify({ hint: 'Choisissez un magasin et un jour' }, null, 2)}</pre>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Lignes de vente (mouvement)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Magasin ID</label>
                  <Input value={magasinId} onChange={(e)=>setMagasinId(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Mouvement ID</label>
                  <Input placeholder="Numéro mouvement" value={mouvementId} onChange={(e)=>setMouvementId(e.target.value)} />
                </div>
              </div>
              {magasinId && mouvementId ? (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(lineVentes, null, 2)}</pre>
              ) : (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify({ hint: 'Renseignez un mouvement pour appeler getLineVentes' }, null, 2)}</pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Dimensions produit vendu</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Code produit</label>
                  <Input placeholder="REF…" value={productCode} onChange={(e)=>setProductCode(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Magasin ID</label>
                  <Input value={magasinId} onChange={(e)=>setMagasinId(e.target.value)} />
                </div>
              </div>
              {magasinId && productCode && dateStart && dateEnd ? (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(dimsPrdVendus, null, 2)}</pre>
              ) : (
                <pre className="text-xs overflow-auto max-h-64">{JSON.stringify({ hint: 'Renseignez code produit et période pour appeler getDimsPrdVendus' }, null, 2)}</pre>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
