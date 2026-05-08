import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoalStore } from '@/store/goals.store';
import { useDashboardStore } from '@/store/dashboard.store';

export function AddGoalModal({ children }: { children: React.ReactNode }) {
  const { addGoal } = useGoalStore();
  const { fetchDashboardData } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const targetAmount = Number(formData.targetAmount);
      const currentAmount = Number(formData.currentAmount);
      if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
        throw new Error('Enter a valid target amount');
      }
      if (!Number.isFinite(currentAmount) || currentAmount < 0) {
        throw new Error('Enter a valid current amount');
      }

      await addGoal({
        title: formData.title,
        targetAmount,
        currentAmount,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        category: formData.category,
      });
      await fetchDashboardData(); // Refresh dashboard stats
      setOpen(false);
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        category: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0F172A] text-white border-white/10">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-400">Goal Title</Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. New Car, Emergency Fund"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-gray-400">Target Amount</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              min="1"
              required
              value={formData.targetAmount}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. 10000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAmount" className="text-gray-400">Current Amount (Starting Balance)</Label>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              min="0"
              required
              value={formData.currentAmount}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. 0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-gray-400">Deadline (Optional)</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-400">Category (Optional)</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. Savings, Travel"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Creating...' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
