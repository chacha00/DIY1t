import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Categories } from "@/components/landing/Categories";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Examples } from "@/components/landing/Examples";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { CtaBanner } from "@/components/landing/CtaBanner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Categories />
        <Examples />
        <PricingTeaser />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
