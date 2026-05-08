import { motion } from 'motion/react';
import { Shield, Smartphone, Zap, BrainCircuit } from 'lucide-react';

export const Trust = () => {
  const trustItems = [
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption for all your financial data.',
      color: 'blue'
    },
    {
      icon: Smartphone,
      title: 'OTP Verification',
      description: 'Multi-factor authentication via secure email OTP.',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Instant processing of transactions and trends.',
      color: 'cyan'
    },
    {
      icon: BrainCircuit,
      title: 'Smart AI Insights',
      description: 'Personalized advice to optimize your spending.',
      color: 'indigo'
    }
  ];

  return (
    <section className="py-20 bg-[#050816] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl group hover:shadow-2xl hover:shadow-blue-500/5 transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
