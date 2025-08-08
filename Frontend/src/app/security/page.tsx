import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/layout/footer"
import StructuredData from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Award, 
  FileCheck, 
  Zap,
  ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "Security Services | DiveSeeks - Professional Security Solutions",
  description: "Comprehensive security services including SIA-licensed staff, cybersecurity audits, and business protection. Professional security solutions for your peace of mind.",
  keywords: ["security services", "SIA licensed", "cybersecurity", "business protection", "security audit", "professional security"],
  openGraph: {
    title: "Security Services | DiveSeeks",
    description: "Professional security solutions protecting your business",
    type: "website",
  },
}

interface SecurityService {
  name: string
  description: string
  certifications: string[]
  coverage: string[]
  features: string[]
  icon: React.ReactNode
  color: string
  bgColor: string
}

const securityServices: SecurityService[] = [
  {
    name: "SIA-Licensed Staff",
    description: "Professional security personnel with full SIA licensing, providing reliable and compliant security services for your business premises.",
    certifications: ["SIA Door Supervision", "SIA Security Guarding", "SIA CCTV", "First Aid Certified", "Conflict Management"],
    coverage: ["24/7 Security Coverage", "Event Security", "Retail Security", "Corporate Security", "Emergency Response"],
    features: [
      "Fully licensed professionals",
      "Background checked staff",
      "Ongoing training programs",
      "Professional appearance",
      "Incident reporting",
      "Customer service focused"
    ],
    icon: <Users className="h-8 w-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    name: "Cybersecurity Audits",
    description: "Comprehensive cybersecurity assessments to identify vulnerabilities, ensure compliance, and strengthen your digital infrastructure.",
    certifications: ["ISO 27001", "CREST Certified", "Cyber Essentials", "GDPR Compliance", "PCI DSS"],
    coverage: ["Network Security", "Data Protection", "Compliance Audits", "Vulnerability Testing", "Risk Assessment"],
    features: [
      "Comprehensive security audits",
      "Vulnerability assessments",
      "Compliance reporting",
      "Risk mitigation strategies",
      "Security policy development",
      "Staff training programs"
    ],
    icon: <Lock className="h-8 w-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    name: "Business Protection",
    description: "Complete business protection services combining physical security, digital safeguards, and comprehensive risk management solutions.",
    certifications: ["Security Industry Authority", "British Security Industry", "Risk Management", "Emergency Planning", "Business Continuity"],
    coverage: ["Physical Security", "Digital Protection", "Asset Protection", "Business Continuity", "Emergency Response"],
    features: [
      "Integrated security solutions",
      "Risk assessment & management",
      "Emergency response planning",
      "Asset protection strategies",
      "Business continuity planning",
      "24/7 monitoring services"
    ],
    icon: <Shield className="h-8 w-8" />,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  }
]

export default function SecurityPage() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Security Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gray-900 dark:text-white">Professional Security Solutions</span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                  Protecting Your Business
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive security services with SIA-licensed professionals, advanced cybersecurity solutions, and complete business protection strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Get Security Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Certifications
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Stats */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-300">SIA Licensed Staff</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Security Coverage</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ISO</div>
                <div className="text-gray-600 dark:text-gray-300">27001 Certified</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300">Protection Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {securityServices.map((service, index) => (
                <div key={service.name} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
                      <CardHeader className="pb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                            <div className={service.color}>
                              {service.icon}
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                              {service.name}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                              {service.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Features */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Features</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Certifications */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Certifications &amp; Standards</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.certifications.map((cert, certIndex) => (
                              <Badge 
                                key={certIndex} 
                                variant="secondary" 
                                className="text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Coverage Areas */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Coverage Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.coverage.map((area, areaIndex) => (
                              <Badge 
                                key={areaIndex} 
                                variant="outline" 
                                className="text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                              >
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button className="w-full sm:w-auto">
                            Request Quote
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Visual/Stats */}
                  <div className="flex-1">
                    <div className={`${service.bgColor} rounded-2xl p-8 h-full min-h-[400px] flex flex-col justify-center`}>
                      <div className="text-center space-y-6">
                        <div className={`w-24 h-24 mx-auto rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg`}>
                          <div className={`${service.color} scale-150`}>
                            {service.icon}
                          </div>
                        </div>
                        
                        {/* Service-specific stats */}
                        {service.name === "SIA-Licensed Staff" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">SIA Licensed</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">24/7</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Coverage</div>
                            </div>
                          </div>
                        )}
                        
                        {service.name === "Cybersecurity Audits" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">ISO</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">27001 Certified</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">GDPR</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Compliant</div>
                            </div>
                          </div>
                        )}
                        
                        {service.name === "Business Protection" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-400">360°</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Protection</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-400">24/7</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Monitoring</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Secure Your Business Today
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Don't leave your business vulnerable. Get a comprehensive security assessment and protect what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Security Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Emergency Contact
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}