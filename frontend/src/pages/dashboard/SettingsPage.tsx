import React, { useState, useEffect } from 'react';
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
import { userApi } from '@/services/user.api';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success'|'error', text: string } | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [toggles, setToggles] = useState({
    darkMode: user?.settings?.theme === 'dark' || true,
    notificationEmail: user?.settings?.notificationEmail ?? true,
    notificationPush: user?.settings?.notificationPush ?? true,
  });

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName });
      setToggles({
        darkMode: user.settings?.theme === 'dark' || true,
        notificationEmail: user.settings?.notificationEmail ?? true,
        notificationPush: user.settings?.notificationPush ?? true,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await userApi.updateProfile({ fullName: formData.fullName });
      if (res.data.success && res.data.data) {
        setUser(res.data.data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await userApi.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToggles = async (updates: any) => {
    try {
      const res = await userApi.updateProfile(updates);
      if (res.data.success && res.data.data) {
        setUser(res.data.data.user);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const navItems = [
    { icon: User, label: 'General' },
    { icon: Lock, label: 'Security' },
    { icon: Bell, label: 'Notifications' },
    { icon: Palette, label: 'Appearance' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-gray-500">Manage your profile, preferences, and account security.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
           {/* Navigation tabs */}
           <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveTab(item.label); setMessage(null); }}
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
                               value={formData.fullName}
                               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                               className="bg-white/5 border-white/10 h-11 rounded-xl text-white"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">Email Address</Label>
                             <Input 
                               value={user?.email || ''}
                               disabled
                               className="bg-white/5 border-white/10 h-11 rounded-xl text-gray-500 opacity-60"
                             />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <Label className="text-gray-400 ml-1">Currency</Label>
                             <div className="relative">
                                <Input 
                                  value={user?.settings?.currency || 'USD'} 
                                  className="bg-white/5 border-white/10 h-11 rounded-xl opacity-60 text-white"
                                  disabled
                                />
                                <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 font-bold hover:bg-white/5">Change</Button>
                             </div>
                          </div>
                       </div>
                       <div className="mt-8 flex justify-end">
                          <Button 
                            onClick={handleSaveProfile} 
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold text-white"
                          >
                            {isSaving ? 'Saving...' : 'Update Profile'}
                          </Button>
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
                               value={passwordData.currentPassword}
                               onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                               className="bg-white/5 border-white/10 h-11 rounded-xl text-white"
                               placeholder="••••••••"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-gray-400 ml-1">New Password</Label>
                             <Input 
                               type="password"
                               value={passwordData.newPassword}
                               onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                               className="bg-white/5 border-white/10 h-11 rounded-xl text-white"
                               placeholder="••••••••"
                             />
                          </div>
                          <div className="flex justify-end pt-4">
                             <Button onClick={handleSavePassword} disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword} className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold text-white">
                               Update Password
                             </Button>
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
                         <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                               <Label className="text-white text-base">Push Notifications</Label>
                               <p className="text-sm text-gray-500">Alerts sent directly to your mobile device</p>
                            </div>
                            <Switch checked={toggles.notificationPush} onCheckedChange={(v) => { setToggles({...toggles, notificationPush: v}); handleSaveToggles({ notificationPush: v }); }} />
                         </div>
                         <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                               <Label className="text-white text-base">Email Alerts</Label>
                               <p className="text-sm text-gray-500">Critical security and transaction updates via email</p>
                            </div>
                            <Switch checked={toggles.notificationEmail} onCheckedChange={(v) => { setToggles({...toggles, notificationEmail: v}); handleSaveToggles({ notificationEmail: v }); }} />
                         </div>
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
                             <Label className="text-white text-base">Dark Mode Theme</Label>
                             <p className="text-sm text-gray-500">Enable high-contrast dark theme</p>
                          </div>
                          <Switch checked={toggles.darkMode} onCheckedChange={(v) => { setToggles({...toggles, darkMode: v}); handleSaveToggles({ theme: v ? 'dark' : 'light' }); }} />
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

              </AnimatePresence>

              {/* Danger Zone - Always show at bottom for visibility */}
              <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-3xl">
                 <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
                 <p className="text-sm text-gray-500 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <Button onClick={logout} variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 h-11 px-8 rounded-xl font-bold">Logout Immediately</Button>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
