import { motion } from 'motion/react';
import { Target, TrendingUp, Calendar } from 'lucide-react';

export const Goals = () => {
  const goals = [
    { title: "Dream Home", target: 4500000, current: 1200000, color: "#3B82F6" },
    { title: "Tesla Model S", target: 8000000, current: 3500000, color: "#8B5CF6" },
    { title: "Europe Trip", target: 500000, current: 420000, color: "#06B6D4" },
  ];

  return (
    <section id="goals" className="py-24 bg-[#050816]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-2xl">
              <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Financial Freedom</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
                Turn your dreams into <br /> reachable targets.
              </h3>
           </div>
           <p className="text-gray-400 max-w-sm">
             Set ambitious goals and track them with precision. We calculate estimated completion dates based on your current savings velocity.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-6 group"
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                   <h4 className="text-xl font-bold text-white mb-1">{goal.title}</h4>
                   <p className="text-gray-500 text-sm">Target: ₹{goal.target.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-gray-400">{progress.toFixed(0)}% Completed</span>
                      <span className="text-white">₹{goal.current.toLocaleString()}</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ backgroundColor: goal.color }}
                      />
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Est. Completion: Dec 2025
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};
