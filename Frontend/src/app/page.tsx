import HeroSection from "@/components/sections/hero"
import ServicesOverview from "@/components/sections/services-overview"
import SoftwareServices from "@/components/sections/software-services"
import SecurityServices from "@/components/sections/security-services"
import BusinessFunding from "@/components/sections/business-funding"
import About from "@/components/sections/about"
import Contact from "@/components/sections/contact"
import Footer from "@/components/layout/footer"
import StructuredData from "@/components/structured-data"

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Services Overview */}
        <ServicesOverview />
        
        {/* Software Services Detail */}
        <SoftwareServices />
        
        {/* Security Services Detail */}
        <SecurityServices />
        
        {/* Business Funding Detail */}
        <BusinessFunding />
        
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
