import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Monitor, 
  ShoppingCart, 
  Smartphone, 
  Shield, 
  Users, 
  Lock, 
  CreditCard, 
  TrendingUp, 
  FileText,
  ArrowRight 
} from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
  bgColor: string
}

const services: Service[] = [
  {
    id: "software",
    title: "Software Services",
    description: "Custom software solutions including POS systems, online ordering platforms, and mobile applications to streamline your business operations.",
    icon: <Monitor className="h-8 w-8" />,
    features: ["POS Systems", "Online Ordering", "React Native Apps", "Custom Development"],
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    id: "security",
    title: "Security Services",
    description: "Professional security solutions with SIA-licensed staff, comprehensive cybersecurity audits, and complete business protection services.",
    icon: <Shield className="h-8 w-8" />,
    features: ["SIA Licensed Staff", "Cybersecurity Audits", "Business Protection", "Risk Assessment"],
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    id: "funding",
    title: "Business Funding",
    description: "Expert broker services to help secure business funding, with access to multiple funding options and streamlined application processes.",
    icon: <CreditCard className="h-8 w-8" />,
    features: ["Broker Services", "Multiple Funding Options", "Application Support", "Financial Guidance"],
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  }
]

const serviceIcons = {
  software: [Monitor, ShoppingCart, Smartphone],
  security: [Shield, Users, Lock],
  funding: [CreditCard, TrendingUp, FileText]
}

export default function ServicesOverview() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Comprehensive Solutions for</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Your Business Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We provide integrated business solutions across three key areas to help your business thrive in today's competitive landscape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponents = serviceIcons[service.id as keyof typeof serviceIcons]
            
            return (
              <Card 
                key={service.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800"
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={service.color}>
                      {service.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Feature Icons */}
                  <div className="flex justify-center gap-4 mb-6">
                    {IconComponents.map((IconComponent, iconIndex) => (
                      <div 
                        key={iconIndex}
                        className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center`}
                      >
                        <IconComponent className={`h-5 w-5 ${service.color}`} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="secondary" 
                        className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    className={`w-full group-hover:shadow-lg transition-all duration-300 ${
                      service.id === 'software' ? 'bg-blue-600 hover:bg-blue-700' :
                      service.id === 'security' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-orange-600 hover:bg-orange-700'
                    } text-white`}
                    onClick={() => scrollToSection(`${service.id}-details`)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Ready to transform your business with our integrated solutions?
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => scrollToSection('contact')}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}