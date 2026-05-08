import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AntiGravityCanvas } from '@/components/ui/particle-effect-for-hero';
import axios from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      await axios.post('/auth/forgot-password', { email });
      setMessage({ type: 'success', text: 'If an account exists with this email, you will receive a reset link shortly.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong. Please try again.' });
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your email and we'll send you a recovery link</p>
        </div>

        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          {message?.type === 'success' ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
                <Mail size={32} />
              </div>
              <p className="text-gray-300 leading-relaxed">{message.text}</p>
              <Link to="/login">
                <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl font-bold border border-white/10 transition-all">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {message?.type === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 transition-colors text-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group transition-all"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors font-medium text-sm">
                 <ChevronLeft size={16} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>

      <div className="absolute -top-40 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
