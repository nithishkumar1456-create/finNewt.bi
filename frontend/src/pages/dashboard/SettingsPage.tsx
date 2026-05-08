import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  User, 
  Lock, 
  Bell, 
  Smartphone, 
  Globe, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth.store';

export default function SettingsPage() {
  const { user, setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [toggles, setToggles] = useState({
    darkMode: true,
    notifications: true,
    twoFactor: true,
    emailReports: false
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (activeTab === 'General' && user) {
        setAuth({ ...user, name: formData.name, email: formData.email }, localStorage.getItem('token') || '');
      }
      setIsSaving(false);
      // In a real app we'd show a toast here
    }, 1000);
  };

  const navItems = [
    { icon: User, label: 'General' },
    { icon: Lock, label: 'Security' },
    { icon: Bell, label: 'Notifications' },
    { icon: Palette, label: 'Appearance' },
    { icon: Smartphone, label: 'Connected Apps' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your profile, preferences, and account security.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           {/* Navigation tabs */}
           <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.label 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  {activeTab === item.label && <ChevronRight size={14} />}
                </button>
              ))}
           </nav>

           {/* Content */}
           <div className="lg:col-span-3 space-y-8">
              <AnimatePresence mode="wait">
                {activeTab === 'General' && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="glass p-8 rounded-3xl border border-white/5">
                       <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">Full Name</Label>
                             <Input 
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="bg-white/5 border-white/10 h-11 rounded-xl"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">Email Address</Label>
                             <Input 
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               className="bg-white/5 border-white/10 h-11 rounded-xl"
                             />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <Label className="text-gray-400 ml-1">Currency</Label>
                             <div className="relative">
                                <Input 
                                  value="Indian Rupee (INR)" 
                                  className="bg-white/5 border-white/10 h-11 rounded-xl opacity-60"
                                  disabled
                                />
                                <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 font-bold hover:bg-white/5">Change</Button>
                             </div>
                          </div>
                       </div>
                       <div className="mt-8 flex justify-end">
                          <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold"
                          >
                            {isSaving ? 'Saving...' : 'Update Profile'}
                          </Button>
                       </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                       <h2 className="text-lg font-bold text-white mb-6">Account Preferences</h2>
                       <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                <Label className="text-white text-base">Dark Mode</Label>
                                <p className="text-sm text-gray-500">Enable high-contrast dark theme</p>
                             </div>
                             <Switch 
                               checked={toggles.darkMode} 
                               onCheckedChange={(val) => setToggles({...toggles, darkMode: val})} 
                             />
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                <Label className="text-white text-base">Weekly Reports</Label>
                                <p className="text-sm text-gray-500">Get a PDF summary of your spending via email</p>
                             </div>
                             <Switch 
                               checked={toggles.emailReports} 
                               onCheckedChange={(val) => setToggles({...toggles, emailReports: val})} 
                             />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="glass p-8 rounded-3xl border border-white/5">
                       <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">Current Password</Label>
                             <Input 
                               type="password"
                               className="bg-white/5 border-white/10 h-11 rounded-xl"
                               placeholder="••••••••"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">New Password</Label>
                             <Input 
                               type="password"
                               className="bg-white/5 border-white/10 h-11 rounded-xl"
                               placeholder="••••••••"
                             />
                          </div>
                          <div className="flex justify-end pt-4">
                             <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold">Update Password</Button>
                          </div>
                       </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                       <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-bold text-white">Two-Factor Authentication</h2>
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase rounded-lg">
                             <ShieldCheck size={14} /> Active
                          </div>
                       </div>
                       <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                         Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
                       </p>
                       <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-11 px-8 rounded-xl font-bold">Manage 2FA Settings</Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Notifications' && (
                  <motion.div
                    key="notifs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                  >
                    <h2 className="text-lg font-bold text-white mb-6">Notification Channels</h2>
                    <div className="space-y-8">
                       {[
                         { title: 'Push Notifications', desc: 'Alerts sent directly to your mobile device' },
                         { title: 'Email Alerts', desc: 'Critical security and transaction updates via email' },
                         { title: 'Budget Reminders', desc: 'Get notified when you hit 80% of your budget' },
                         { title: 'Goal Milestones', desc: 'Celebrate when you reach 50% or 100% of a goal' },
                       ].map((n, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                               <Label className="text-white text-base">{n.title}</Label>
                               <p className="text-sm text-gray-500">{n.desc}</p>
                            </div>
                            <Switch defaultChecked={i < 2} />
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'Appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                  >
                    <h2 className="text-lg font-bold text-white mb-6">Visual Preferences</h2>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <Label className="text-white text-base">Glassmorphism Effect</Label>
                             <p className="text-sm text-gray-500">Enable frosted glass background animations</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <Separator className="bg-white/5" />
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <Label className="text-white text-base">Compact Mode</Label>
                             <p className="text-sm text-gray-500">Reduce padding and font sizes for high density</p>
                          </div>
                          <Switch />
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'Connected Apps' && (
                  <motion.div
                    key="apps"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                  >
                    <h2 className="text-lg font-bold text-white mb-6">External Integrations</h2>
                    <div className="space-y-6">
                       {[
                         { name: 'Google Sheets', status: 'Connected', desc: 'Sync your transactions to sheets' },
                         { name: 'Slack', status: 'Not Connected', desc: 'Get budget alerts in your Slack channels' },
                         { name: 'QuickBooks', status: 'Not Connected', desc: 'Enterprise accounting sync' },
                       ].map((app, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                               <Label className="text-white text-base">{app.name}</Label>
                               <p className="text-sm text-gray-500">{app.desc}</p>
                            </div>
                            <Button variant="outline" size="sm" className={`rounded-lg ${app.status === 'Connected' ? 'border-green-500/20 text-green-400' : 'border-white/10 text-white'}`}>
                               {app.status === 'Connected' ? 'Setup' : 'Connect'}
                            </Button>
                         </div>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Danger Zone - Always show at bottom for visibility */}
              <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-3xl">
                 <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
                 <p className="text-sm text-gray-500 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 h-11 px-8 rounded-xl font-bold">Delete Account</Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
