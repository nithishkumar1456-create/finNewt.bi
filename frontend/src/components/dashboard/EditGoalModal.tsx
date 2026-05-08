import React, { useState, useEffect } from 'react';
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
import { Goal } from '@/types/api.types';

const safeDateInputValue = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().substring(0, 10);
};

export function EditGoalModal({ children, goal }: { children: React.ReactNode, goal: Goal }) {
  const { updateGoal, deleteGoal } = useGoalStore();
  const { fetchDashboardData } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: goal.title || '',
    targetAmount: String(goal.targetAmount ?? ''),
    deadline: safeDateInputValue(goal.deadline),
    category: goal.category || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: goal.title || '',
        targetAmount: String(goal.targetAmount ?? ''),
        deadline: safeDateInputValue(goal.deadline),
        category: goal.category || '',
      });
    }
  }, [open, goal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const targetAmount = Number(formData.targetAmount);
      if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
        throw new Error('Enter a valid target amount');
      }

      await updateGoal(goal.id, {
        title: formData.title,
        targetAmount,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        category: formData.category,
      });
      await fetchDashboardData();
      setOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    setLoading(true);
    try {
      await deleteGoal(goal.id);
      await fetchDashboardData();
      setOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete goal');
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
          <DialogTitle>Edit Goal</DialogTitle>
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
            />
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
            <Button type="button" variant="ghost" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
              Delete Goal
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
