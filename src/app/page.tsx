import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroV2 } from "@/components/landing/HeroV2";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { SavingsShowcase } from "@/components/landing/SavingsShowcase";
import { WhyDiy1tV2 } from "@/components/landing/WhyDiy1tV2";
import { DiyVisionSection } from "@/components/landing/DiyVisionSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { DemoSection } from "@/components/landing/DemoSection";
import { FinalCtaV2 } from "@/components/landing/FinalCtaV2";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroV2 />
        <TrustedBy />
        <DemoSection />
        <SavingsShowcase />
        <WhyDiy1tV2 />
        <DiyVisionSection />
        <SocialProof />
        <PricingTeaser />

        <div className="bg-slate-50 py-6">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-xs leading-relaxed text-slate-400">
              <strong className="text-slate-500">About our AI:</strong> DIY1T generates original DIY projects inspired by uploaded photos — it does not reproduce, trace, or copy copyrighted patterns, branded product designs, or trademarked items. Every plan is an AI-created original intended for personal use. Maker Pro plans include patterns cleared for commercial use and resale.
            </p>
          </div>
        </div>

        <FinalCtaV2 />
      </main>
      <Footer />
    </>
  );
}
