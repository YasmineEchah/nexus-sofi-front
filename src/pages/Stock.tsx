import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Stock: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const [productCode, setProductCode] = useState('');
  const [dims, setDims] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ZERO' | 'GT_ZERO' | 'LT_ZERO' | ''>('');

  const dimsQuery = useQuery({
    queryKey: ['getDims', barcode],
    queryFn: () => api.getDims({ barcode }),
    enabled: !!barcode,
  });

  const stockByProduct = useQuery({
    queryKey: ['stockByProduct', { barcode, productCode, dims }],
    queryFn: () => api.stockByProduct({ barcode, productCode, dims }),
    enabled: !!barcode || !!productCode,
  });

  const globalStock = useQuery({
    queryKey: ['globalStock', filter],
    queryFn: () => api.globalStock({ filter: filter || undefined }),
  });

  return (
    <AppLayout>
      <Helmet>
        <title>Stock | SofiSoft</title>
        <meta name="description" content="Consultation du stock global et par produit" />
        <link rel="canonical" href="/stock" />
      </Helmet>
      <section className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Stock par produit</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Code-barres</label>
              <Input value={barcode} onChange={(e)=>setBarcode(e.target.value)} placeholder="EAN…" />
            </div>
            <div>
              <label className="text-sm">Code produit</label>
              <Input value={productCode} onChange={(e)=>setProductCode(e.target.value)} placeholder="REF…" />
            </div>
            <div>
              <label className="text-sm">Dimensions</label>
              <Input value={dims} onChange={(e)=>setDims(e.target.value)} placeholder="Ex: XL-RED" />
            </div>
            <div className="md:col-span-4">
              <p className="text-sm mb-2">Dimensions via code-barres</p>
              <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(dimsQuery.data, null, 2)}</pre>
            </div>
            <div className="md:col-span-4">
              <p className="text-sm mb-2">Stock du produit</p>
              <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(stockByProduct.data, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stock global</CardTitle></CardHeader>
          <CardContent>
            <div className="w-60 mb-4">
              <Select onValueChange={(v)=> setFilter(v as any)}>
                <SelectTrigger><SelectValue placeholder="Filtre" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="ZERO">Stock = 0</SelectItem>
                  <SelectItem value="GT_ZERO">Stock &gt; 0</SelectItem>
                  <SelectItem value="LT_ZERO">Stock &lt; 0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(globalStock.data, null, 2)}</pre>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Stock;
