import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { motion } from 'motion/react';
import { Plus, Target, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budget.store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BudgetsPage() {
  const { budgets, fetchBudgets, addBudget, isLoading } = useBudgetStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 10),
  });

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addBudget({
        category: formData.category,
        limit: Number(formData.limit),
        period: formData.period,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      setOpen(false);
      setFormData({
        category: '',
        limit: '',
        period: 'monthly',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 10),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Budgets</h1>
              <p className="text-gray-500">Track and manage category spending limits.</p>
           </div>
           <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                 <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4 mr-2" /> Create Budget
                 </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#0F172A] text-white border-white/10">
                <DialogHeader>
                  <DialogTitle>Create Budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                  <div className="space-y-2">
                    <Label className="text-gray-400">Category</Label>
                    <Input
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g. Food, Entertainment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Limit Amount</Label>
                    <Input
                      name="limit"
                      type="number"
                      required
                      value={formData.limit}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Start Date</Label>
                    <Input
                      name="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">End Date</Label>
                    <Input
                      name="endDate"
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? 'Creating...' : 'Create Budget'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
           </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {budgets.map((budget, i) => {
             const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#F43F5E'];
             const randomColor = colors[i % colors.length];
             const spent = Number(budget.spent || 0);
             const limit = Number(budget.limit || 0);
             const isOver = spent > limit;
             
             return (
               <Card key={budget.id} className="bg-[#0F172A] border-white/5 rounded-3xl overflow-hidden relative group">
                  <CardHeader className="p-6 pb-2">
                     <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-xl">{budget.category}</CardTitle>
                        {isOver && <AlertCircle className="text-red-500 w-5 h-5" />}
                     </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                     <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-400">₹{Number(budget.spent).toLocaleString()} spent</span>
                        <span className="text-gray-400">₹{Number(budget.limit).toLocaleString()} limit</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(budget.usagePercentage || 0, 100)}%` }}
                          className={`h-full rounded-full ${isOver ? 'bg-red-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : ''}`}
                          style={{ backgroundColor: !isOver ? randomColor : undefined, boxShadow: !isOver ? `0 0 15px ${randomColor}66` : undefined }}
                        />
                     </div>
                     <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(budget.endDate).toLocaleDateString()}</span>
                        <span className={isOver ? 'text-red-500 font-bold' : 'text-white'}>
                           {Math.round(budget.usagePercentage || 0)}% Used
                        </span>
                     </div>
                  </CardContent>
               </Card>
             );
           })}
           {budgets.length === 0 && (
              <div className="col-span-full p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">No budgets found</h3>
                <p className="text-gray-600">Create a budget to start tracking your spending limits.</p>
              </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
