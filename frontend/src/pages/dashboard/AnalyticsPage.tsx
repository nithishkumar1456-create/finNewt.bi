import { DashboardLayout } from '@/layouts/DashboardLayout';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart2, 
  Calendar, 
  Download,
  Info,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { useAnalyticsStore } from '@/store/analytics.store';
import { useTransactionStore } from '@/store/transaction.store';
import { exportApi } from '@/services/export.api';

const toFiniteNumber = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const isRecord = (value: unknown): value is Record<string, any> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

export default function AnalyticsPage() {
  const { summary, trends, categories, isLoading, error, fetchAllAnalytics } = useAnalyticsStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [range, setRange] = useState<string | undefined>(undefined);
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeSummary = {
    totalIncome: toFiniteNumber(summary?.totalIncome),
    totalExpense: toFiniteNumber(summary?.totalExpense),
    savings: toFiniteNumber(summary?.savings),
    spendingRatio: toFiniteNumber(summary?.spendingRatio),
  };

  useEffect(() => {
    fetchAllAnalytics(range ? { range } : {});
  }, [fetchAllAnalytics, range]);

  useEffect(() => {
    fetchTransactions({ limit: 100, range });
  }, [fetchTransactions, range]);

  const toggleRange = () => {
    setRange(prev => prev === '30d' ? undefined : '30d');
  };

  const handleExport = async () => {
    try {
      await exportApi.downloadCSV();
    } catch (e) {
      console.error(e);
    }
  };

  const areaData = useMemo(() => {
    if (!isRecord(trends)) return [];
    return Object.entries(trends).map(([name, data]: any) => ({
      name,
      income: toFiniteNumber(data?.income),
      expense: toFiniteNumber(data?.expense),
    }));
  }, [trends]);

  const pieData = useMemo(() => {
    const safeCategories = Array.isArray(categories) ? categories : [];
    const catMap: Record<string, number> = {};
    if (!safeCategories.length) {
      safeTransactions.forEach(t => {
        if (t.type === 'EXPENSE') {
          const category = t.category || 'Uncategorized';
          catMap[category] = (catMap[category] || 0) + toFiniteNumber(t.amount);
        }
      });
    }
    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1', '#F472B6'];
    const sourceData = safeCategories.length ? safeCategories : Object.entries(catMap).map(([name, value]) => ({ name, value }));

    return sourceData.map((item, i) => ({
      name: item.name || 'Uncategorized',
      value: toFiniteNumber(item.value),
      color: colors[i % colors.length]
    })).filter((item) => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [categories, safeTransactions]);

  const barData = useMemo(() => {
    if (!isRecord(trends)) return [];
    // Convert trends to a simplified format for bar chart
    return Object.entries(trends).map(([name, data]: any) => ({
      name,
      amount: toFiniteNumber(data?.expense),
    }));
  }, [trends]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Analytics</h1>
              <p className="text-gray-500">Uncover deep patterns and optimize your wealth.</p>
           </div>
           <div className="flex gap-3">
              <Button 
                variant={range === '30d' ? 'default' : 'outline'} 
                onClick={toggleRange}
                className={`h-11 border-white/10 transition-all ${range === '30d' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-white'}`}
              >
                <Calendar className="w-4 h-4 mr-2" /> {range === '30d' ? 'Last 30 Days' : 'Recent Period'}
              </Button>
              <Button onClick={handleExport} className="h-11 bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" /> Generate Report
              </Button>
           </div>
        </div>

        {/* Top summary cards */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading && !areaData.length && !pieData.length && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
            Loading analytics...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
                       <TrendingUp size={24} />
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">Savings Rate</p>
                 <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-white">{safeSummary.spendingRatio > 0 ? Math.max(0, 100 - safeSummary.spendingRatio).toFixed(1) : 100}%</h3>
                 </div>
              </CardContent>
           </Card>
           
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400">
                       <Target size={24} />
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">Disposable Income</p>
                 <h3 className="text-3xl font-bold text-white">₹{safeSummary.savings.toLocaleString()}</h3>
              </CardContent>
           </Card>

           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-400">
                       <BarChart2 size={24} />
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">OpEx Efficiency</p>
                 <h3 className="text-3xl font-bold text-white">{safeSummary.spendingRatio.toFixed(1)}%</h3>
              </CardContent>
           </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Area Chart: Income vs Expense */}
           <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
              <CardHeader className="px-8 py-6 border-b border-white/5">
                 <CardTitle className="text-white flex items-center gap-2">
                    <ArrowUpRight className="w-5 h-5 text-blue-500" />
                    Income vs Expenses
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                       <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis hide />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                         itemStyle={{ color: '#F8FAFC' }}
                       />
                       <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                       <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>

           {/* Pie Chart: Expense Breakdown */}
           <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
              <CardHeader className="px-8 py-6 border-b border-white/5">
                 <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-violet-500" />
                    Expense Distribution
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                 <div className="h-[250px] w-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                             {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                            itemStyle={{ color: '#F8FAFC' }}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex-1 space-y-4">
                    {pieData.map((item) => (
                       <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                             <span className="text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                          </div>
                          <span className="text-white font-bold">₹{item.value.toLocaleString()}</span>
                       </div>
                    ))}
                    {pieData.length === 0 && <span className="text-gray-500">No expenses recorded yet.</span>}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Weekly heatmap or Bar chart */}
        <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
           <CardHeader className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-white">Spending Volume Trend</CardTitle>
           </CardHeader>
           <CardContent className="p-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)', radius: [10, 10, 0, 0] }}
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[10, 10, 0, 0]}>
                       {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.amount > 5000 ? '#3B82F6' : '#1D4ED8'} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        {/* Meta Info */}
        <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
           <Info size={14} />
           All financial data is calculated in real-time based on your connected bank feeds and manual entries.
        </div>
      </div>
    </DashboardLayout>
  );
}
