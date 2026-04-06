import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Demo from "@/components/landing/Demo";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <Pricing />
      <Footer />
    </main>
  );
}
