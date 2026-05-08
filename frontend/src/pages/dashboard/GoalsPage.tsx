import { DashboardLayout } from '@/layouts/DashboardLayout';
import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Plus, 
  ChevronRight, 
  Trophy, 
  Calendar, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalStore } from '@/store/goals.store';
import { AddGoalModal } from '@/components/dashboard/AddGoalModal';
import { AddFundsModal } from '@/components/dashboard/AddFundsModal';
import { EditGoalModal } from '@/components/dashboard/EditGoalModal';

const toFiniteNumber = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const calculateProgress = (currentAmount: unknown, targetAmount: unknown, progressPercentage?: number) => {
  if (Number.isFinite(progressPercentage)) {
    return Math.max(0, Math.min(progressPercentage as number, 100));
  }

  const current = toFiniteNumber(currentAmount);
  const target = toFiniteNumber(targetAmount);
  return target > 0 ? Math.max(0, Math.min((current / target) * 100, 100)) : 0;
};

export default function GoalsPage() {
  const { goals, isLoading, error, fetchGoals } = useGoalStore();
  const safeGoals = Array.isArray(goals) ? goals : [];

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const { totalTarget, totalCurrent, avgProgress } = useMemo(() => {
    if (!safeGoals.length) return { totalTarget: 0, totalCurrent: 0, avgProgress: 0 };
    const totalTarget = safeGoals.reduce((sum, g) => sum + toFiniteNumber(g?.targetAmount), 0);
    const totalCurrent = safeGoals.reduce((sum, g) => sum + toFiniteNumber(g?.currentAmount), 0);
    const avgProgress = safeGoals.reduce((sum, g) => {
      return sum + calculateProgress(g?.currentAmount, g?.targetAmount, g?.progressPercentage);
    }, 0) / safeGoals.length;
    return { totalTarget, totalCurrent, avgProgress };
  }, [safeGoals]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Savings Goals</h1>
              <p className="text-gray-500">Visualize and achieve your life aspirations.</p>
           </div>
           <AddGoalModal>
             <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                <Plus className="w-4 h-4 mr-2" /> Create New Goal
             </Button>
           </AddGoalModal>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl p-6">
              <div className="flex gap-4">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <Trophy size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Goals Value</p>
                    <h3 className="text-2xl font-bold text-white">₹{totalTarget.toLocaleString()}</h3>
                 </div>
              </div>
           </Card>
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl p-6">
              <div className="flex gap-4">
                 <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Savings</p>
                    <h3 className="text-2xl font-bold text-white">₹{totalCurrent.toLocaleString()}</h3>
                 </div>
              </div>
           </Card>
           <Card className="bg-[#0F172A] border-white/5 rounded-3xl p-6">
              <div className="flex gap-4">
                 <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                    <Target size={24} />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Average Progress</p>
                    <h3 className="text-2xl font-bold text-white">{avgProgress.toFixed(1)}%</h3>
                 </div>
              </div>
           </Card>
        </div>

        {/* Goals Grid */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading && !safeGoals.length && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
            Loading goals...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {safeGoals.map((goal, i) => {
             const progress = calculateProgress(goal?.currentAmount, goal?.targetAmount, goal?.progressPercentage);
             const currentAmount = toFiniteNumber(goal?.currentAmount);
             const targetAmount = toFiniteNumber(goal?.targetAmount);
             const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1'];
             const randomColor = colors[i % colors.length];
             
             return (
               <motion.div
                 key={goal?.id || `goal-${i}`}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-8 group relative overflow-hidden"
               >
                 <div className="flex justify-between items-start z-10">
                    <div className="flex gap-4">
                       <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                          <Target size={32} style={{ color: randomColor }} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-white mb-2">{goal?.title || 'Untitled Goal'}</h4>
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            goal?.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                            goal?.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {goal?.status || 'active'}
                          </span>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white rounded-full">
                       <ArrowUpRight size={20} />
                    </Button>
                 </div>

                 <div className="space-y-4 z-10">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500 font-medium">₹{currentAmount.toLocaleString()} saved</span>
                       <span className="text-white font-bold">₹{targetAmount.toLocaleString()} target</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                         style={{ backgroundColor: randomColor }}
                       />
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          {goal?.deadline && !Number.isNaN(new Date(goal.deadline).getTime())
                            ? new Date(goal.deadline).toLocaleDateString()
                            : 'No deadline'}
                       </div>
                       <span className="text-2xl font-bold text-white leading-none">{progress.toFixed(0)}%</span>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/5 z-10 flex gap-4">
                    <AddFundsModal goalId={goal.id} goalTitle={goal?.title || 'Goal'}>
                      <Button className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 h-11 rounded-xl text-white">Add Funds</Button>
                    </AddFundsModal>
                    <EditGoalModal goal={goal}>
                      <Button variant="outline" className="flex-1 border-white/10 h-11 rounded-xl text-white">Edit Goal</Button>
                    </EditGoalModal>
                 </div>

                 {/* Subtle gradient background */}
                 <div 
                   className="absolute -right-20 -bottom-20 w-64 h-64 blur-3xl opacity-5 pointer-events-none rounded-full" 
                   style={{ backgroundColor: randomColor }}
                 />
               </motion.div>
             )
           })}
           
           <AddGoalModal>
             <button className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-20 hover:border-blue-500/30 hover:bg-white/2 transition-all group w-full">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-gray-600 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-transparent group-hover:border-blue-500/20">
                   <Plus size={32} />
                </div>
                <h4 className="text-gray-400 font-bold text-xl group-hover:text-white transition-colors">Start a new project</h4>
                <p className="text-gray-600 text-sm mt-1">What are you building towards?</p>
             </button>
           </AddGoalModal>
        </div>
      </div>
    </DashboardLayout>
  );
}
