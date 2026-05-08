import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AntiGravityCanvas } from '@/components/ui/particle-effect-for-hero';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: form, 2: OTP
  const navigate = useNavigate();
  const { register, verifyOtp, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(formData);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const otpCode = otp.join('');
    try {
      await verifyOtp(formData.email, otpCode);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    // Simple auto focus next logic could go here
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 relative overflow-hidden">
      <AntiGravityCanvas />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2">Start your journey to financial freedom</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
            >
              <form onSubmit={handleRegister} className="space-y-5">
                {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">{error}</div>}
                
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 px-1 leading-relaxed">
                  By signing up, you agree to our 
                  <a href="#" className="text-blue-500 font-bold ml-1">Terms of Service</a> and 
                  <a href="#" className="text-blue-500 font-bold ml-1">Privacy Policy</a>.
                </div>

                <Button
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group"
                >
                  {isLoading ? 'Creating Account...' : 'Continue'}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              <p className="text-center text-gray-500 mt-8 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-bold hover:text-blue-400">
                  Login
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-500 mb-8 px-4">
                We've sent a 6-digit verification code to your email address.
              </p>

              <form onSubmit={handleVerify} className="space-y-8">
                {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">{error}</div>}
                
                <div className="flex justify-center gap-3">
                   {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                   ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl text-lg font-bold"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <p className="text-sm text-gray-500">
                  Didn't receive code? <button type="button" className="text-blue-500 font-bold ml-1">Resend Code</button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
