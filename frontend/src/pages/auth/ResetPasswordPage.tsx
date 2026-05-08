import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AntiGravityCanvas } from '@/components/ui/particle-effect-for-hero';
import axios from '@/lib/axios';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      await axios.post('/auth/reset-password', { token, newPassword: password });
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Token is invalid or has expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 relative overflow-hidden">
      <AntiGravityCanvas />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-blue-500/20">
              <Wallet className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tighter">
              FinNewt<span className="text-blue-500">.bi</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">New Password</h1>
          <p className="text-gray-500 mt-2">Please enter your strong new password below</p>
        </div>

        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 ml-1">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 pl-12 pr-12 h-14 rounded-2xl focus:border-blue-500 transition-colors text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 ml-1">Confirm New Password</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 transition-colors text-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || message?.type === 'success'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group transition-all"
            >
              {isLoading ? 'Resetting...' : 'Update Password'}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Remembered it?{' '}
            <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute -top-40 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
