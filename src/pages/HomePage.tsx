import { AdSlot } from '../components/ads/AdSlot';
import { Layout } from '../components/Layout';
import { SeoHead } from '../components/SeoHead';
import { useBranding } from '../hooks/useBranding';
import { HeroSection } from '../components/home/HeroSection';
import { JobTypesStrip } from '../components/home/JobTypesStrip';
import { FeaturedJobsSection } from '../components/home/FeaturedJobsSection';
import { AudiencesSection } from '../components/home/AudiencesSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { DifferentialsSection } from '../components/home/DifferentialsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';

export function HomePage() {
  const branding = useBranding();

  return (
    <Layout>
      <SeoHead />
      <HeroSection branding={branding} />
      <JobTypesStrip />
      <FeaturedJobsSection />
      <div className="mx-auto max-w-6xl px-4">
        <AdSlot slot="home_mid" className="my-6" />
      </div>
      <AudiencesSection />
      <HowItWorksSection branding={branding} />
      <DifferentialsSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </Layout>
  );
}
