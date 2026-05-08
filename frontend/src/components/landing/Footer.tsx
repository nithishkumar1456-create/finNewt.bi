import { Wallet, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050816] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Wallet className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tighter">
                FinNewt<span className="text-blue-500">.bi</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
              Intelligent personal finance platform for the next generation of wealth builders. Empowering you with data and AI-driven insights.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#analytics" className="hover:text-blue-400 transition-colors">Analytics</a></li>
              <li><a href="#goals" className="hover:text-blue-400 transition-colors">Savings Goals</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-4">Stay updated with latest fintech trends.</p>
            <div className="flex gap-2">
               <input 
                 type="email" 
                 placeholder="Email address" 
                 className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
               />
               <button className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Mail className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-600 text-sm">
             &copy; {currentYear} FinNewt.bi. All rights reserved.
           </p>
           <div className="flex gap-8 text-sm text-gray-600">
             <a href="#" className="hover:text-gray-400">Privacy Policy</a>
             <a href="#" className="hover:text-gray-400">Cookie Policy</a>
             <a href="#" className="hover:text-gray-400">Security</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
