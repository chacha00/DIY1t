import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Examples } from "@/components/landing/Examples";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyDiy1t } from "@/components/landing/WhyDiy1t";
import { Customization } from "@/components/landing/Customization";
import { PetProfilesTeaser } from "@/components/landing/PetProfilesTeaser";
import { SocialProof } from "@/components/landing/SocialProof";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { EmailCapture } from "@/components/landing/EmailCapture";
import { CtaBanner } from "@/components/landing/CtaBanner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Examples />
        <HowItWorks />
        <WhyDiy1t />
        <Customization />
        <PetProfilesTeaser />
        <SocialProof />
        <ComparisonTable />
        <PricingTeaser />

        {/* AI Limitations note */}
        <div className="bg-slate-50 py-6">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-xs leading-relaxed text-slate-400">
              <strong className="text-slate-500">About our AI:</strong> DIY1T generates original DIY projects inspired by uploaded photos — it does not reproduce, trace, or copy copyrighted patterns, branded product designs, or trademarked items. Every plan is an AI-created original intended for personal use. Maker Pro plans include patterns cleared for commercial use and resale.
            </p>
          </div>
        </div>

        <EmailCapture />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
