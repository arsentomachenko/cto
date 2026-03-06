import React from 'react';
import Header from './portfolio/Header';
import HeroSection from './portfolio/HeroSection';
import TechStackMarquee from './portfolio/TechStackMarquee';
import ProblemSection from './portfolio/ProblemSection';
import ServicesSection from './portfolio/ServicesSection';
import CaseStudiesSection from './portfolio/CaseStudiesSection';
import PhilosophySection from './portfolio/PhilosophySection';
import AIEdgeSection from './portfolio/AIEdgeSection';
import BottleneckSimulator from './portfolio/BottleneckSimulator';
import TestimonialsSection from './portfolio/TestimonialsSection';
import ContactSection from './portfolio/ContactSection';
import Footer from './portfolio/Footer';
import GradientOrbs from './portfolio/GradientOrbs';
import ScrollProgress from './portfolio/ScrollProgress';
import BackToTop from './portfolio/BackToTop';

const AppLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen noise-overlay">
      <ScrollProgress />
      <GradientOrbs />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <TechStackMarquee />
        <ProblemSection />
        <ServicesSection />
        <CaseStudiesSection />
        <PhilosophySection />
        <AIEdgeSection />
        <BottleneckSimulator />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AppLayout;
