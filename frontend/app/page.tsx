'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { IntelligenceSidebar } from '@/components/IntelligenceSidebar';
import { PatientExplorer } from '@/components/PatientExplorer';

const API_BASE = 'http://localhost:8000/api';

export default function Home() {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await fetch(`${API_BASE}/analytics/summary`);
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        const trendsRes = await fetch(`${API_BASE}/analytics/trends`);
        const trendsData = await trendsRes.json();
        setTrends(trendsData);

        const specialtiesRes = await fetch(`${API_BASE}/analytics/specialties`);
        const specialtiesData = await specialtiesRes.json();
        setSpecialties(Array.isArray(specialtiesData) ? specialtiesData : []);

        const benchmarksRes = await fetch(`${API_BASE}/analytics/benchmarks`);
        const benchmarksData = await benchmarksRes.json();
        setBenchmarks(Array.isArray(benchmarksData) ? benchmarksData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading Medical Tourism Intelligence...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0A1628] px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              🏥 Medical Tourism Intelligence
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time insights for GCC medical tourism market
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Data updated: {new Date().toLocaleDateString()}</div>
            <div className="text-cyan-400/60">v1.0 • PoC 13</div>
          </div>
        </div>
      </header>

      {/* 70/30 Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Main Content - 70% */}
        <div className="flex-1 lg:w-7/10 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Card className="bg-[#1E293B] border-cyan-500/20">
              <CardHeader className="pb-1">
                <CardTitle className="text-[10px] text-gray-400 uppercase tracking-wider">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">{summary?.total_patients?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-green-400">↑ {summary?.growth_pct || 0}% YoY</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-cyan-500/20">
              <CardHeader className="pb-1">
                <CardTitle className="text-[10px] text-gray-400 uppercase tracking-wider">Avg Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">${summary?.avg_cost_usd?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-gray-400">USD</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-cyan-500/20">
              <CardHeader className="pb-1">
                <CardTitle className="text-[10px] text-gray-400 uppercase tracking-wider">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">{summary?.avg_satisfaction || 0} ★</div>
                <div className="text-[10px] text-gray-400">out of 5.0</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-cyan-500/20">
              <CardHeader className="pb-1">
                <CardTitle className="text-[10px] text-gray-400 uppercase tracking-wider">Top Origin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">{summary?.top_origin || 'N/A'}</div>
                <div className="text-[10px] text-gray-400">Country</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-cyan-500/20">
              <CardHeader className="pb-1">
                <CardTitle className="text-[10px] text-gray-400 uppercase tracking-wider">Top Specialty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">{summary?.top_specialty || 'N/A'}</div>
                <div className="text-[10px] text-gray-400">Procedure</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="bg-[#1E293B] border border-cyan-500/20">
              <TabsTrigger value="trends" className="data-[state=active]:bg-cyan-500/20 text-xs">
                Revenue Trends
              </TabsTrigger>
              <TabsTrigger value="specialties" className="data-[state=active]:bg-cyan-500/20 text-xs">
                Top Specialties
              </TabsTrigger>
              <TabsTrigger value="benchmarks" className="data-[state=active]:bg-cyan-500/20 text-xs">
                Cost Benchmarks
              </TabsTrigger>
              <TabsTrigger value="patients" className="data-[state=active]:bg-cyan-500/20 text-xs">
                Patient Explorer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="mt-4">
              <Card className="bg-[#1E293B] border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Revenue & Patient Volume Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart 
                      data={trends?.months?.map((month: string, i: number) => ({
                        month,
                        revenue: trends?.revenue?.[i] || 0,
                        patients: trends?.patients?.[i] || 0,
                      })) || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                      <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #38BDF8' }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#38BDF8" name="Revenue ($)" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="patients" stroke="#F59E0B" name="Patients" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specialties" className="mt-4">
              <Card className="bg-[#1E293B] border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Top 10 Specialties by Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={specialties} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                      <YAxis dataKey="specialty" type="category" stroke="#94A3B8" fontSize={10} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #38BDF8' }} />
                      <Bar dataKey="patients" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benchmarks" className="mt-4">
              <Card className="bg-[#1E293B] border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Cost Benchmarks vs Competitor Markets</CardTitle>
                </CardHeader>
                <CardContent>
                  {benchmarks.length === 0 ? (
                    <div className="text-gray-400 text-center py-8 text-sm">No benchmark data available</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-2 text-gray-400">Specialty</th>
                            <th className="text-right py-2 text-gray-400">India</th>
                            <th className="text-right py-2 text-gray-400">Thailand</th>
                            <th className="text-right py-2 text-gray-400">Turkey</th>
                            <th className="text-right py-2 text-gray-400">Singapore</th>
                          </tr>
                        </thead>
                        <tbody>
                          {benchmarks.slice(0, 8).map((item: any, i: number) => (
                            <tr key={i} className="border-b border-gray-800">
                              <td className="py-2 text-white">{item.specialty}</td>
                              {['India', 'Thailand', 'Turkey', 'Singapore'].map((market) => {
                                const match = benchmarks.find((b: any) => b.specialty === item.specialty && b.market === market);
                                return (
                                  <td key={market} className="text-right py-2 text-white">
                                    ${match?.cost_usd?.toLocaleString() || '-'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="mt-4">
              <PatientExplorer />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 30% */}
        <div className="lg:w-3/10">
          <IntelligenceSidebar summary={summary} specialties={specialties} />
        </div>
      </div>
    </div>
  );
}