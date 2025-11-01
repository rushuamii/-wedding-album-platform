import Navbar from "@/components/marketing/navbar";
import Hero from "@/components/marketing/hero";
import Features from "@/components/marketing/features";
import Pricing from "@/components/marketing/pricing";
import Testimonials from "@/components/marketing/testomonials";
import CTA from "@/components/marketing/cta";
import Footer from "@/components/marketing/footer";
import GalleryShowcase from "@/components/marketing/gallery-showcase";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <GalleryShowcase />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
