import { DashboardLayout } from '@/layouts/DashboardLayout';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Brain,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useDashboardStore } from '@/store/dashboard.store';
import { useAuthStore } from '@/store/auth.store';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';
import { AddGoalModal } from '@/components/dashboard/AddGoalModal';

export default function DashboardPage() {
  const { summary, trends, insights, recentTransactions, goals, fetchDashboardData, isLoading } = useDashboardStore();
  const { user } = useAuthStore();
  const [range, setRange] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchDashboardData(range ? { range } : {});
  }, [fetchDashboardData, range]);

  const toggleRange = () => {
    setRange(prev => prev === '30d' ? undefined : '30d');
  };

  // Transform trends object to array for chart
  const chartData = useMemo(() => {
    if (!trends) return [];
    return Object.entries(trends).map(([name, data]: any) => ({
      name,
      value: data.expense || 0,
      income: data.income || 0
    }));
  }, [trends]);

  // Transform categories from transactions
  const categories = useMemo(() => {
    if (!recentTransactions.length) return [];
    const catMap: Record<string, number> = {};
    recentTransactions.forEach(t => {
      if (t.type === 'EXPENSE') {
        catMap[t.category] = (catMap[t.category] || 0) + 1;
      }
    });
    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1'];
    return Object.entries(catMap).map(([name, count], i) => ({
      name,
      count,
      color: colors[i % colors.length]
    })).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [recentTransactions]);

  const latestInsight = insights[0] || null;

  if (isLoading && !summary) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full text-white">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500">Welcome back, {user?.fullName}! Here's what's happening with your money.</p>
           </div>
           <div className="flex gap-3">
              <Button 
                variant={range === '30d' ? 'default' : 'outline'} 
                onClick={toggleRange}
                className={`h-11 border-white/10 transition-all ${range === '30d' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-white'}`}
              >
                <Filter className="w-4 h-4 mr-2" /> {range === '30d' ? 'Last 30 Days' : 'Filter'}
              </Button>
              <Button variant="outline" className="h-11 border-white/10 hover:bg-white/5 text-white">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <AddTransactionModal>
                <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                  <Plus className="w-4 h-4 mr-2" /> New Transaction
                </Button>
              </AddTransactionModal>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Total Balance', value: `₹${(summary?.savings || 0).toLocaleString()}`, trend: '', icon: DollarSign, color: 'blue' },
             { label: 'Monthly Income', value: `₹${(summary?.totalIncome || 0).toLocaleString()}`, trend: '', icon: ArrowUpRight, color: 'green' },
             { label: 'Monthly Expense', value: `₹${(summary?.totalExpense || 0).toLocaleString()}`, trend: '', icon: ArrowDownRight, color: 'red' },
             { label: 'Spending Ratio', value: `${(summary?.spendingRatio || 0).toFixed(1)}%`, trend: '', icon: TrendingUp, color: 'purple' },
           ].map((stat, i) => (
             <motion.div
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass p-6 rounded-2xl border border-white/5 group hover:border-white/15 transition-all"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'blue' ? 'text-blue-400' : 
                        stat.color === 'green' ? 'text-green-400' :
                        stat.color === 'red' ? 'text-red-400' : 'text-violet-400'
                      }`} />
                   </div>
                   {stat.trend && <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.trend}
                   </span>}
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
             </motion.div>
           ))}
        </div>

        {/* Main Charts area */}
        <div className="grid lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 bg-[#0F172A] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 py-6">
                 <div>
                    <CardTitle className="text-white text-xl">Wealth Growth</CardTitle>
                    <p className="text-gray-500 text-xs">Expense trend</p>
                 </div>
              </CardHeader>
              <CardContent className="p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorDashboard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorDashboard)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
           </Card>

           <Card className="bg-[#0F172A] border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-white/5 px-8 py-6">
                 <CardTitle className="text-white text-xl">Top Categories</CardTitle>
                 <p className="text-gray-500 text-xs">Most frequent spending areas</p>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="space-y-8">
                    {categories.length > 0 ? categories.map((cat) => (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-gray-300 font-bold">{cat.name}</span>
                           <span className="text-gray-500 text-xs">{cat.count} txns</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(cat.count/10)*100}%` }}
                             className="h-full rounded-full"
                             style={{ backgroundColor: cat.color }}
                           />
                        </div>
                      </div>
                    )) : <div className="text-gray-500 text-sm">No recent categories found.</div>}
                 </div>
                 
                 {latestInsight && (
                 <div className="mt-12 p-6 rounded-2xl bg-blue-600/10 border border-blue-600/20 relative group">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center absolute -top-4 -left-4 shadow-lg shadow-blue-600/40">
                       <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-2">{latestInsight.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed italic">
                      "{latestInsight.description}"
                    </p>
                 </div>
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-8">
           <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
              <CardHeader className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between">
                 <CardTitle className="text-white">Recent Transactions</CardTitle>
                 <Button variant="ghost" size="sm" className="text-blue-500 text-xs font-bold">View All</Button>
              </CardHeader>
              <CardContent className="p-2">
                 <div className="divide-y divide-white/5">
                    {recentTransactions.map((txn) => (
                      <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer rounded-2xl">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'INCOME' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                               {txn.type === 'INCOME' ? <Plus size={20} /> : <ArrowDownRight size={20} />}
                            </div>
                            <div>
                               <p className="text-white font-bold text-sm">{txn.note || txn.category}</p>
                               <p className="text-gray-500 text-xs">{new Date(txn.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className={`font-bold ${txn.type === 'INCOME' ? 'text-green-400' : 'text-white'}`}>
                               {txn.type === 'INCOME' ? '+' : ''}₹{Number(txn.amount).toLocaleString()}
                            </p>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{txn.category}</span>
                         </div>
                      </div>
                    ))}
                    {recentTransactions.length === 0 && <div className="p-6 text-gray-500 text-center">No recent transactions found.</div>}
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
              <CardHeader className="px-8 py-6 border-b border-white/5">
                 <CardTitle className="text-white">Savings Goals</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {goals.map((goal) => {
                      const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1'];
                      const randomColor = colors[Math.floor(Math.random() * colors.length)];
                      return (
                      <div key={goal.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all">
                         <div className="flex justify-between mb-4">
                            <h4 className="text-white font-bold text-sm truncate pr-2">{goal.title}</h4>
                            <span className="text-gray-500 text-[10px] uppercase font-bold">{Number(goal.currentAmount)/1000}k/{Number(goal.targetAmount)/1000}k</span>
                         </div>
                         <div className="h-3 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progressPercentage}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: randomColor, boxShadow: `0 0 15px ${randomColor}66` }}
                            />
                         </div>
                         <div className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1">
                            {Math.round(goal.progressPercentage || 0)}% Done <ChevronRight size={10} />
                         </div>
                      </div>
                    )})}
                    <AddGoalModal>
                      <button className="border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center py-6 hover:border-blue-500/30 hover:bg-white/5 transition-all text-gray-500 hover:text-blue-400 min-h-[140px] w-full">
                         <Plus size={24} className="mb-2" />
                         <span className="text-xs font-bold uppercase tracking-widest">New Goal</span>
                      </button>
                    </AddGoalModal>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
