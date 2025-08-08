import Navbar from "@/components/navbar"
import HeroSection from "@/components/sections/hero"
import ServicesOverview from "@/components/sections/services-overview"
import About from "@/components/sections/about"
import Contact from "@/components/sections/contact"
import Footer from "@/components/layout/footer"
import StructuredData from "@/components/structured-data"

export default function Home() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Services Overview */}
        <ServicesOverview />
        
        {/* About Section */}
        <About />
        
        {/* Contact Section */}
        <Contact />
        
        {/* Footer with Navigation */}
        <Footer />
      </div>
    </>
  )
}
