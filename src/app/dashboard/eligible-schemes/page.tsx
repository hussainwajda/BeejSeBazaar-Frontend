'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, ExternalLink, Filter, Info, MapPin, IndianRupee, Shield } from 'lucide-react';

type Scheme = {
  id: string;
  name: string;
  ministry: string;
  category: 'Subsidy' | 'Insurance' | 'Credit' | 'Support' | 'Training';
  target: 'Small & Marginal' | 'All Farmers' | 'Women Farmers' | 'Youth';
  benefits: string[];
  eligibility: string[];
  state?: string;
  link: string;
};

export default function EligibleSchemesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [state, setState] = useState<string>('all');

  const schemes: Scheme[] = useMemo(() => [
    {
      id: 'pm-kisan',
      name: 'PM-KISAN',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      category: 'Support',
      target: 'All Farmers',
      benefits: ['Direct income support of ₹6,000/year in three installments', 'DBT to farmer bank accounts'],
      eligibility: ['Valid landholding records', 'Active bank account linked with Aadhaar'],
      link: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    },
    {
      id: 'pmfby',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      category: 'Insurance',
      target: 'All Farmers',
      benefits: ['Low premium crop insurance', 'Coverage for prevented sowing, post-harvest losses'],
      eligibility: ['Cultivating notified crops in notified areas', 'Insured within enrollment window'],
      link: 'https://pmfby.gov.in/',
    },
    {
      id: 'kcc',
      name: 'Kisan Credit Card (KCC)',
      ministry: 'Department of Financial Services',
      category: 'Credit',
      target: 'All Farmers',
      benefits: ['Short-term credit for cultivation needs', 'Interest subvention for timely repayment'],
      eligibility: ['Active cultivator/tenant farmer', 'KYC and land details'],
      link: 'https://www.mygov.in/campaigns/kcc/',
    },
    {
      id: 'smam',
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      category: 'Subsidy',
      target: 'Small & Marginal',
      benefits: ['40%-80% subsidy on farm machinery', 'Custom hiring center support'],
      eligibility: ['Small & marginal farmer status', 'Purchase of eligible machinery'],
      link: 'https://agrimachinery.nic.in/',
    },
    {
      id: 'pmksy',
      name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY) - Micro Irrigation',
      ministry: 'Ministry of Jal Shakti & MoA&FW',
      category: 'Subsidy',
      target: 'Small & Marginal',
      benefits: ['Subsidy for drip and sprinkler irrigation', 'Improved water use efficiency'],
      eligibility: ['Farmers adopting micro-irrigation systems', 'As per state guidelines'],
      link: 'https://pmksy.gov.in/',
    },
  ], []);

  const filtered = schemes.filter((s) => {
    const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.benefits.join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'all' || s.category.toLowerCase() === category;
    const matchesState = state === 'all' || (s.state?.toLowerCase() === state);
    return matchesQuery && matchesCategory && matchesState;
  });

  return (
    <div className="min-h-screen">
      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold">Eligible Schemes</h1>
            <p className="text-sm text-muted-foreground mt-1">Schemes tailored for your profile (showing popular schemes for small & marginal farmers).</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Search</label>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scheme or benefit..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="subsidy">Subsidy</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <Card key={s.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                    <Badge variant="secondary">{s.category}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {s.ministry}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {s.state || 'All India'}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {s.target}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Key Benefits</div>
                    <ul className="text-sm space-y-1">
                      {s.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" /> <span>{b}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Eligibility</div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {s.eligibility.map((e, i) => (
                        <li key={i} className="flex items-start gap-2"><Info className="h-4 w-4 text-primary mt-0.5" /> <span>{e}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Button asChild className="w-full">
                      <Link href={s.link} target="_blank" rel="noopener noreferrer">
                        Apply / Know More <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


