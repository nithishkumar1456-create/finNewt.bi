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
import { useTransactionStore } from '@/store/transaction.store';
import { useDashboardStore } from '@/store/dashboard.store';

export function AddTransactionModal({ children }: { children: React.ReactNode }) {
  const { addTransaction } = useTransactionStore();
  const { fetchDashboardData } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().substring(0, 10),
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addTransaction({
        amount: Number(formData.amount),
        type: formData.type as 'EXPENSE' | 'INCOME' | 'TRANSFER',
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        note: formData.note,
      });
      await fetchDashboardData(); // Refresh dashboard stats
      setOpen(false);
      setFormData({
        amount: '',
        type: 'EXPENSE',
        category: '',
        date: new Date().toISOString().substring(0, 10),
        note: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add transaction');
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
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-400">Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#0F172A] border-white/10 text-white"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-400">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. 50.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-400">Category</Label>
            <Input
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. Food, Salary, Rent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-400">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note" className="text-gray-400">Note (Optional)</Label>
            <Input
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="e.g. Grocery shopping"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
