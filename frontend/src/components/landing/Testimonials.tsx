import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Aryan Sharma",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/150?u=aryan",
      content: "FinNewt has completely changed how I look at my monthly expenses. The AI insights are scary accurate!",
      rating: 5
    },
    {
      name: "Sneha Kapoor",
      role: "Product Designer",
      avatar: "https://i.pravatar.cc/150?u=sneha",
      content: "The UI is just gorgeous. It's the first finance app I actually enjoy opening every day.",
      rating: 5
    },
    {
      name: "Vikram Malhotra",
      role: "Entrepreneur",
      avatar: "https://i.pravatar.cc/150?u=vikram",
      content: "Managing multiple business and personal accounts was a nightmare until I found FinNewt. Highly recommended.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#050816]">
      <div className="container mx-auto px-6">
         <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Loved by thousands of wealth builders.</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="glass p-8 rounded-[2rem] border border-white/5 relative group"
               >
                 <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5 transition-colors group-hover:text-blue-500/10" />
                 
                 <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                       <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                    ))}
                 </div>

                 <p className="text-gray-300 text-lg mb-8 italic leading-relaxed">
                   "{t.content}"
                 </p>

                 <div className="flex items-center gap-4">
                    <img src={t.avatar} className="w-12 h-12 rounded-full border border-white/20" alt={t.name} />
                    <div>
                       <h4 className="text-white font-bold">{t.name}</h4>
                       <p className="text-gray-500 text-sm">{t.role}</p>
                    </div>
                 </div>
               </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
};
