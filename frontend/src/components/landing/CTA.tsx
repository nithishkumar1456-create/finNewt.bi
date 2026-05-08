import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-400/20 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-[3rem] p-12 md:p-20 text-center border border-white/10 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles className="w-4 h-4" /> Ready to ascend?
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
              Start Building Better <br className="hidden md:block" />
              Financial Habits Today.
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Join 50,000+ users who have taken back control of their money. Get started in less than 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-500/30 group"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/5 px-10 py-7 text-lg rounded-2xl border border-white/10"
              >
                Explore Dashboard
              </Button>
            </div>
          </div>

          {/* Decorative lines */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
