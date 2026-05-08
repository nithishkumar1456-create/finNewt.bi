import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 700 },
];

const pieData = [
  { name: 'Food', value: 400 },
  { name: 'Rent', value: 1200 },
  { name: 'Entertainment', value: 300 },
  { name: 'Travel', value: 200 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1'];

export const AnalyticsPreview = () => {
  return (
    <section id="analytics" className="py-24 bg-[#050816] relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Deep Analytics</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-8 leading-tight">
              Visualize your wealth <br /> in high definition.
            </h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We turn raw data into beautiful, interactive visualizations. Spot trends instantly, identify hidden leaks, and watch your net worth grow with our premium charting engine.
            </p>
            
            <div className="space-y-6">
               <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 glass hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <AreaChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Trend Analysis</h4>
                    <p className="text-gray-500 text-sm">Predict future spending based on history.</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 glass hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Categorical Breakdown</h4>
                    <p className="text-gray-500 text-sm">Know exactly where every rupee goes.</p>
                  </div>
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass-dark rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative"
          >
            <div className="mb-8 flex items-center justify-between">
              <h4 className="text-white font-bold text-xl">Weekly Spending</h4>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-gray-500 text-xs block mb-1 uppercase font-bold">Income</span>
                  <span className="text-green-400 font-bold text-xl">₹48,200</span>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-gray-500 text-xs block mb-1 uppercase font-bold">Expense</span>
                  <span className="text-red-400 font-bold text-xl">₹12,450</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
