import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { AntiGravityCanvas, ParticleHeroNavigation } from '@/components/ui/particle-effect-for-hero';
import { ChevronRight, Play, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <AntiGravityCanvas />
      <ParticleHeroNavigation />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block animate-fade-in-up"
            >
                <span className="py-1 px-3 border border-white/20 rounded-full text-xs font-mono text-white/60 tracking-widest uppercase bg-white/5 backdrop-blur-sm">
                    Premium Financial Intelligence
                </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter mix-blend-difference leading-[0.9]"
            >
                Fin<br/>Newt
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed"
            >
                Experience the fluidity of your assets. A next-generation simulation of financial data running with frictionless intelligence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
                <button 
                  onClick={() => navigate('/register')}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">Start Experience</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out opacity-10"></div>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-5 text-white/80 hover:text-white font-bold tracking-wide transition-all hover:bg-white/5 rounded-full border border-white/10"
                >
                    View Dashboard
                </button>
            </motion.div>
        </div>

        {/* Floating Dashboard Preview (Subtle) */}
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-32 max-w-5xl mx-auto relative group"
        >
            <div className="glass rounded-[3rem] p-4 scale-95 origin-bottom transition-all group-hover:scale-100 group-hover:opacity-100">
               <img 
                 src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                 alt="Experience Preview" 
                 className="rounded-[2.5rem] w-full h-auto grayscale brightness-50"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[2.5rem]" />
            </div>
        </motion.div>
      </div>

      {/* Scroll/Interaction Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-pulse pointer-events-none">
         <span className="text-[10px] uppercase tracking-[0.2em]">Interact</span>
         <MousePointer2 size={16} />
      </div>
    </section>
  );
};
