import { motion } from 'motion/react';
import { 
  CreditCard, 
  BarChart3, 
  Lightbulb, 
  Trophy, 
  TrendingUp, 
  RotateCcw 
} from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Expense Tracking',
      description: 'Effortlessly log and categorize every single transaction in seconds.'
    },
    {
      icon: BarChart3,
      title: 'Budget Monitoring',
      description: 'Set monthly limits and get notified before you overspend.'
    },
    {
      icon: Lightbulb,
      title: 'Smart Insights',
      description: 'AI-driven suggestions based on your unique spending behavior.'
    },
    {
      icon: Trophy,
      title: 'Savings Goals',
      description: 'Visualize your progress towards houses, cars, or early retirement.'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analytics',
      description: 'Deep dive into historical data to understand your financial journey.'
    },
    {
      icon: RotateCcw,
      title: 'Recurring Payments',
      description: 'Never miss a subscription or utility bill with smart reminders.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#050816]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tighter"
          >
            Everything you need for <br /> financial mastery.
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-[#0F172A] to-transparent hover:border-blue-500/20 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
