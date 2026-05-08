import { DashboardLayout } from '@/layouts/DashboardLayout';
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

const areaData = [
  { name: 'Jan', income: 45000, expense: 32000 },
  { name: 'Feb', income: 52000, expense: 34000 },
  { name: 'Mar', income: 48000, expense: 41000 },
  { name: 'Apr', income: 61000, expense: 38000 },
  { name: 'May', income: 55000, expense: 35000 },
  { name: 'Jun', income: 72000, expense: 42000 },
];

const pieData = [
  { name: 'Rent', value: 25000, color: '#3B82F6' },
  { name: 'Food', value: 8500, color: '#8B5CF6' },
  { name: 'Transport', value: 4200, color: '#06B6D4' },
  { name: 'Shopping', value: 6800, color: '#6366F1' },
  { name: 'Others', value: 3500, color: '#F472B6' },
];

const barData = [
  { name: 'Mon', amount: 2400 },
  { name: 'Tue', amount: 1398 },
  { name: 'Wed', amount: 9800 },
  { name: 'Thu', amount: 3908 },
  { name: 'Fri', amount: 4800 },
  { name: 'Sat', amount: 3800 },
  { name: 'Sun', amount: 4300 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Analytics</h1>
              <p className="text-gray-500">Uncover deep patterns and optimize your wealth.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-11 border-white/10 hover:bg-white/5">
                <Calendar className="w-4 h-4 mr-2" /> Quarter 2, 2026
              </Button>
              <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" /> Generate Report
              </Button>
           </div>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
                       <TrendingUp size={24} />
                    </div>
                    <span className="text-green-400 text-xs font-bold font-mono tracking-tight bg-green-400/10 px-2 py-1 rounded-lg">+12.5%</span>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">Savings Rate</p>
                 <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-white">32.4%</h3>
                    <span className="text-gray-600 text-sm mb-1 line-through">28.2%</span>
                 </div>
              </CardContent>
           </Card>
           
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-violet-600/10 text-violet-400">
                       <Target size={24} />
                    </div>
                    <span className="text-blue-400 text-xs font-bold font-mono tracking-tight bg-blue-400/10 px-2 py-1 rounded-lg">+₹5.2k</span>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">Disposable Income</p>
                 <h3 className="text-3xl font-bold text-white">₹42,800</h3>
              </CardContent>
           </Card>

           <Card className="bg-[#0F172A] border-white/5 rounded-3xl">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-400">
                       <BarChart2 size={24} />
                    </div>
                    <span className="text-red-400 text-xs font-bold font-mono tracking-tight bg-red-400/10 px-2 py-1 rounded-lg">-4.1%</span>
                 </div>
                 <p className="text-gray-500 text-sm font-medium mb-1">OpEx Efficiency</p>
                 <h3 className="text-3xl font-bold text-white">18.5%</h3>
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
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Weekly heatmap or Bar chart */}
        <Card className="bg-[#0F172A] border-white/5 rounded-[2.5rem]">
           <CardHeader className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-white">Daily Spending Volume</CardTitle>
              <div className="p-1 px-3 bg-white/5 rounded-full text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                 May 1 - May 7
              </div>
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
