import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  CreditCard,
  ShoppingBag,
  Home,
  Coffee,
  Globe
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

const transactions = [
  { id: 1, name: 'Apple One', category: 'Tech', date: 'May 06, 2026', amount: -199.00, status: 'Completed', icon: Globe },
  { id: 2, name: 'Salary Credit', category: 'Income', date: 'May 05, 2026', amount: 85000.00, status: 'Completed', icon: ArrowUpRight },
  { id: 3, name: 'Uber Monthly', category: 'Travel', date: 'May 04, 2026', amount: -1250.00, status: 'Completed', icon: CreditCard },
  { id: 4, name: 'Grocery Store', category: 'Food', date: 'May 03, 2026', amount: -4500.00, status: 'Processing', icon: ShoppingBag },
  { id: 5, name: 'Rent Payment', category: 'Home', date: 'May 01, 2026', amount: -25000.00, status: 'Completed', icon: Home },
  { id: 6, name: 'Starbucks', category: 'Food', date: 'Apr 30, 2026', amount: -450.00, status: 'Completed', icon: Coffee },
  { id: 7, name: 'Netflix', category: 'Entertainment', date: 'Apr 28, 2026', amount: -799.00, status: 'Completed', icon: Globe },
  { id: 8, name: 'Amazon Shopping', category: 'Shopping', date: 'Apr 25, 2026', amount: -3200.00, status: 'Completed', icon: ShoppingBag },
];

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
              <p className="text-gray-500">Manage and track your cash flow with precision.</p>
           </div>
           <div className="flex gap-3">
              <Button variant="outline" className="h-11 border-white/10 hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Transaction
              </Button>
           </div>
        </div>

        {/* Filters and Search */}
        <div className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <Input 
                 placeholder="Search by name, category, or amount..." 
                 className="bg-white/5 border-white/10 pl-11 h-12 rounded-2xl w-full"
               />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl border-white/10 hover:bg-white/5">
                  <Calendar className="w-4 h-4 mr-2" /> Last 30 Days
               </Button>
               <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl border-white/10 hover:bg-white/5">
                  <Filter className="w-4 h-4 mr-2" /> More Filters
               </Button>
            </div>
        </div>

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
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Status</th>
                       <th className="px-8 py-5 text-gray-500 font-bold uppercase text-[10px] tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {transactions.map((txn) => (
                       <tr key={txn.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                   <txn.icon className="w-5 h-5" />
                                </div>
                                <span className="text-white font-bold">{txn.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <Badge variant="outline" className="bg-white/5 border-white/10 text-gray-400">
                                {txn.category}
                             </Badge>
                          </td>
                          <td className="px-8 py-6 text-gray-500 text-sm">
                             {txn.date}
                          </td>
                          <td className="px-8 py-6">
                             <span className={`font-bold ${txn.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${txn.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="text-sm text-gray-400 font-medium">{txn.status}</span>
                             </div>
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
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-gray-500 text-xs">Showing 8 of 145 transactions</p>
              <div className="flex gap-2">
                 <Button variant="outline" disabled className="h-9 border-white/10 glass">Previous</Button>
                 <Button variant="outline" className="h-9 border-white/10 glass">Next</Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
