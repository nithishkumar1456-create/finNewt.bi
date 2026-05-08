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

export function AddFundsModal({ children, goalId, goalTitle }: { children: React.ReactNode, goalId: string, goalTitle: string }) {
  const { addFunds } = useGoalStore();
  const { fetchDashboardData } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error('Enter a valid amount');
      }

      await addFunds(goalId, numericAmount);
      await fetchDashboardData(); // Refresh dashboard stats
      setOpen(false);
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add funds');
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
          <DialogTitle>Add Funds to {goalTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-400">Amount to Add</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. 500"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Adding...' : 'Add Funds'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
