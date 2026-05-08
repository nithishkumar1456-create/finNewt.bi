import { DashboardLayout } from '@/layouts/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ArrowUpRight, 
  MoreVertical,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTransactionStore } from '@/store/transaction.store';
import { exportApi } from '@/services/export.api';
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal';

export default function TransactionsPage() {
  const { transactions, fetchTransactions, isLoading, page, limit, total } = useTransactionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [range, setRange] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTransactions({ page: 1, limit: 10, range, type });
  }, [fetchTransactions, range, type]);

  const handleExport = async () => {
    try {
      await exportApi.downloadCSV();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions({ search: searchTerm, page: 1, limit: 10, range, type });
  };

  const getIcon = (category: string, type: string) => {
    if (type === 'INCOME') return ArrowUpRight;
    return ShoppingBag; // fallback
  };

  const toggleRange = () => {
    setRange(prev => prev === '30d' ? undefined : '30d');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
              <p className="text-gray-500">Manage and track your cash flow with precision.</p>
           </div>
           <div className="flex gap-3">
              <Button onClick={handleExport} variant="outline" className="h-11 border-white/10 hover:bg-white/5 text-white">
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <AddTransactionModal>
                <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Transaction
                </Button>
              </AddTransactionModal>
           </div>
        </div>

        {/* Filters and Search */}
        <form onSubmit={handleSearch} className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <Input 
                 placeholder="Search by name, category, or amount..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white/5 border-white/10 pl-11 h-12 rounded-2xl w-full text-white"
               />
               <button type="submit" className="hidden"></button>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <Button 
                 type="button" 
                 variant={range === '30d' ? 'default' : 'outline'} 
                 onClick={toggleRange}
                 className={`flex-1 md:flex-none h-12 rounded-2xl border-white/10 transition-all ${range === '30d' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-white'}`}
               >
                  <Calendar className="w-4 h-4 mr-2" /> Last 30 Days
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl border-white/10 hover:bg-white/5 text-white">
                        <Filter className="w-4 h-4 mr-2" /> {type ? type : 'All Types'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0F172A] border-white/10 text-white">
                    <DropdownMenuItem onClick={() => setType(undefined)} className="focus:bg-white/5 focus:text-white cursor-pointer">All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setType('INCOME')} className="focus:bg-white/5 focus:text-white cursor-pointer">Income</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setType('EXPENSE')} className="focus:bg-white/5 focus:text-white cursor-pointer">Expense</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setType('TRANSFER')} className="focus:bg-white/5 focus:text-white cursor-pointer">Transfer</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
        </form>

        {/* Transactions Table */}
        <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5 bg-white/2">
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Transaction</th>
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Category</th>
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Date</th>
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Amount</th>
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {transactions.length > 0 ? transactions.map((txn) => {
                       const Icon = getIcon(txn.category, txn.type);
                       return (
                       <tr key={txn.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${txn.type === 'INCOME' ? 'text-green-400' : 'text-blue-400'}`}>
                                   <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-white font-bold">{txn.note || txn.category}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <Badge variant="outline" className="bg-white/5 border-white/10 text-gray-400">
                                {txn.category}
                             </Badge>
                          </td>
                          <td className="px-8 py-6 text-gray-500 text-sm">
                             {new Date(txn.date).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6">
                             <span className={`font-bold ${txn.type === 'INCOME' ? 'text-green-400' : 'text-white'}`}>
                                {txn.type === 'INCOME' ? '+' : ''}₹{Number(txn.amount).toLocaleString()}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger className="text-gray-500 hover:text-white transition-colors p-2 focus:outline-none">
                                   <MoreVertical size={20} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0F172A] border-white/10 text-white">
                                   <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">View Details</DropdownMenuItem>
                                   <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">Edit Transaction</DropdownMenuItem>
                                   <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer text-red-400 focus:text-red-400">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </td>
                       </tr>
                    )}) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                          {isLoading ? 'Loading transactions...' : 'No transactions found.'}
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-gray-500 text-xs">Showing {transactions.length} of {total} transactions</p>
              <div className="flex gap-2">
                 <Button onClick={() => fetchTransactions({ page: page - 1, limit })} disabled={page <= 1 || isLoading} variant="outline" className="h-9 border-white/10 glass text-white hover:bg-white/10">Previous</Button>
                 <Button onClick={() => fetchTransactions({ page: page + 1, limit })} disabled={transactions.length < limit || isLoading} variant="outline" className="h-9 border-white/10 glass text-white hover:bg-white/10">Next</Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
