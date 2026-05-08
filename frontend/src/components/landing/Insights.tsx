import { motion } from 'motion/react';
import { Brain, Bell, AlertCircle, TrendingDown, ArrowUpRight, Sparkles } from 'lucide-react';

export const Insights = () => {
  const insights = [
    {
      icon: TrendingDown,
      title: "Spending increased 18%",
      desc: "Your shopping expenses are higher than your 3-month average.",
      color: "red"
    },
    {
      icon: Brain,
      title: "Weekend Pattern Detected",
      desc: "You tend to spend 45% more on Saturdays. Consider a budget cap.",
      color: "blue"
    },
    {
      icon: Sparkles,
      title: "Target Achieved",
      desc: "You saved ₹12,000 this month! You are 15 days ahead of your goal.",
      color: "green"
    }
  ];

  return (
    <section className="py-24 bg-[#050816] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" /> AI Insights
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6">
            Intelligent eyes on your <br /> financial habits.
          </h3>
          <p className="text-gray-400 text-lg">
            Our engine analyzes thousands of data points to surface actionable tips. No more guessing—just pure, calculated intelligence.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl text-left border border-white/10 hover:border-blue-500/30 transition-all max-w-sm group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform`}>
                  <insight.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="p-1 px-2 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold uppercase">
                  Active
                </div>
              </div>
              <h4 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{insight.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{insight.desc}</p>
              <button className="mt-4 text-xs font-bold text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
