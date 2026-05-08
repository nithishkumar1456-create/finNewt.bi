import { Navbar } from '@/components/ui/navbar';
import { Hero } from '@/components/landing/Hero';
import { Trust } from '@/components/landing/Trust';
import { Features } from '@/components/landing/Features';
import { AnalyticsPreview } from '@/components/landing/AnalyticsPreview';
import { Insights } from '@/components/landing/Insights';
import { Goals } from '@/components/landing/Goals';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { WavePath } from '@/components/ui/wave-path';
import { RadialOrbitalTimelineDemo } from '@/components/ui/radial-orbital-timeline-demo';

import NeuralBackground from '@/components/ui/flow-field-background';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      <main>
        <Hero />
        
        <div className="relative">
          <WavePath className="absolute -top-10 left-0 w-full text-[#050816] rotate-180" height={60} />
          <Trust />
        </div>

        <Features />
        
        <div className="relative">
           <WavePath className="text-blue-500/5 absolute top-0 left-0" height={40} />
           <AnalyticsPreview />
        </div>

        <Insights />
        
        <div className="relative">
           <WavePath className="text-[#0F172A] rotate-180" height={30} />
           <Goals />
        </div>

        <Testimonials />
        
        <div id="journey" className="relative">
           <RadialOrbitalTimelineDemo />
        </div>
        
        <div className="relative">
          <NeuralBackground 
            className="absolute inset-0 opacity-40" 
            particleCount={300}
            trailOpacity={0.08}
          />
          <CTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}
