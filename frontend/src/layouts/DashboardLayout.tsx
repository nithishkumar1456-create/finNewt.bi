import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Wallet, 
  Target, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  LayoutDashboard,
  ArrowRightLeft,
  Bell,
  Search,
  User
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#050816] flex">
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 bottom-0 bg-[#0F172A] border-r border-white/5 z-50 flex flex-col transition-all overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between mb-8">
           {!isCollapsed && (
             <Link to="/" className="flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <Wallet className="text-white w-5 h-5" />
               </div>
               <span className="text-xl font-bold text-white tracking-tighter">FinNewt</span>
             </Link>
           )}
           {isCollapsed && (
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
               <Wallet className="text-white w-5 h-5" />
             </div>
           )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
           {[
             { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
             { icon: ArrowRightLeft, label: 'Transactions', href: '/transactions' },
             { icon: BarChart3, label: 'Analytics', href: '/analytics' },
             { icon: Target, label: 'Budgets', href: '/budgets' },
             { icon: Target, label: 'Goals', href: '/goals' },
             { icon: Settings, label: 'Settings', href: '/settings' },
           ].map((item) => {
             const isActive = location.pathname === item.href;
             return (
               <Link
                 key={item.href}
                 to={item.href}
                 className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                   isActive 
                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                     : 'text-gray-500 hover:text-white hover:bg-white/5'
                 }`}
               >
                 <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                 {!isCollapsed && <span className="font-medium">{item.label}</span>}
               </Link>
             );
           })}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button
             onClick={logout}
             className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all overflow-hidden"
           >
             <LogOut className="w-5 h-5 flex-shrink-0" />
             {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
           </button>
           
           <button
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="absolute -right-4 top-24 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-[#050816] hover:scale-110 transition-all shadow-lg shadow-blue-600/40 z-[60]"
             title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
           >
             {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
           </button>
        </div>
      </motion.aside>

      <main 
        className="flex-1 flex flex-col transition-all min-h-screen"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#050816]/80 backdrop-blur-md z-40">
           <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                placeholder="Search transactions, goals..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
           </div>

           <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050816]" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 p-1 px-2 rounded-xl hover:bg-white/5 transition-colors focus:outline-none">
                     <div className="text-right hidden sm:block pointer-events-none">
                        <p className="text-sm font-bold text-white">{user?.fullName || 'User'}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Premium Plan</p>
                     </div>
                     <Avatar className="w-9 h-9 border border-white/10 pointer-events-none">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=3B82F6&color=fff`} />
                        <AvatarFallback><User /></AvatarFallback>
                     </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0F172A] border-white/10 text-white">
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="focus:bg-white/5 focus:text-white cursor-pointer">Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">Security</DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer border-t border-white/5 text-red-400 focus:text-red-400" onClick={logout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
           </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">
           {children}
        </div>
      </main>
    </div>
  );
};
