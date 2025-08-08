"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Award, 
  Clock, 
  Target, 
  CheckCircle, 
  Star, 
  Building, 
  Globe, 
  Shield, 
  TrendingUp,
  ArrowRight,
  Heart,
  Lightbulb
} from "lucide-react"

interface TeamMember {
  name: string
  role: string
  experience: string
  expertise: string[]
  image: string
}

interface Achievement {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface CoreValue {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const achievements: Achievement[] = [
  {
    title: "10+ Years Experience",
    description: "Over a decade of delivering exceptional software, security, and funding solutions to businesses across various industries.",
    icon: <Clock className="h-6 w-6" />,
    color: "text-blue-600"
  },
  {
    title: "500+ Projects Delivered",
    description: "Successfully completed hundreds of projects ranging from custom software development to comprehensive security implementations.",
    icon: <Target className="h-6 w-6" />,
    color: "text-green-600"
  },
  {
    title: "£2M+ Funding Secured",
    description: "Helped businesses secure over £2 million in funding through our expert broker services and strategic partnerships.",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "text-orange-600"
  },
  {
    title: "Industry Recognition",
    description: "Recognized for excellence in software development, cybersecurity services, and business funding solutions.",
    icon: <Award className="h-6 w-6" />,
    color: "text-purple-600"
  }
]

const coreValues: CoreValue[] = [
  {
    title: "Innovation",
    description: "We embrace cutting-edge technologies and innovative approaches to deliver solutions that drive business growth and success.",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "text-yellow-600"
  },
  {
    title: "Integrity",
    description: "We conduct business with the highest ethical standards, ensuring transparency and honesty in all our interactions.",
    icon: <Shield className="h-6 w-6" />,
    color: "text-blue-600"
  },
  {
    title: "Excellence",
    description: "We strive for excellence in every project, delivering high-quality solutions that exceed client expectations.",
    icon: <Star className="h-6 w-6" />,
    color: "text-green-600"
  },
  {
    title: "Partnership",
    description: "We build long-term partnerships with our clients, working collaboratively to achieve their business objectives.",
    icon: <Users className="h-6 w-6" />,
    color: "text-orange-600"
  }
]

const certifications = [
  "SIA Licensed Security Services",
  "ISO 27001 Cybersecurity Standards",
  "FCA Authorized Business Funding",
  "Microsoft Certified Partner",
  "AWS Solution Provider",
  "Google Cloud Partner"
]

const industries = [
  "Retail & E-commerce",
  "Healthcare & Medical",
  "Financial Services",
  "Manufacturing",
  "Hospitality & Tourism",
  "Education & Training",
  "Professional Services",
  "Technology & Startups"
]

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building className="h-4 w-4" />
            About DiveSeeks Ltd
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Empowering Businesses</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Through Innovation & Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            DiveSeeks Ltd is a leading provider of comprehensive business solutions, specializing in software development, 
            security services, and business funding. We're committed to helping businesses thrive in today's digital landscape.
          </p>
        </div>

        {/* Company Story */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Story
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p className="text-lg leading-relaxed">
                      Founded with a vision to bridge the gap between technology and business success, DiveSeeks Ltd has grown 
                      from a small startup to a trusted partner for businesses across the UK and beyond.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Our journey began with a simple belief: every business deserves access to cutting-edge technology, 
                      robust security, and the funding needed to grow. Today, we're proud to offer comprehensive solutions 
                      that address these critical business needs.
                    </p>
                    <p className="text-lg leading-relaxed">
                      With over a decade of experience and hundreds of successful projects, we continue to innovate and 
                      evolve, always putting our clients' success at the heart of everything we do.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 h-full min-h-[400px] flex flex-col justify-center">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                        <Heart className="h-10 w-10 text-red-500" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Our Mission
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        To empower businesses with innovative technology solutions, comprehensive security services, 
                        and strategic funding opportunities that drive growth and success.
                      </p>
                      
                      {/* Mission Stats */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Years Experience</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">500+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Projects Delivered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Achievements
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Milestones that reflect our commitment to excellence and our clients' success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <div className={achievement.color}>
                      {achievement.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to our clients and partners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className={value.color}>
                        {value.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications & Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Certifications */}
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Certifications & Accreditations
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Our professional certifications ensure the highest standards of service delivery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Industries */}
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-800">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-600" />
                Industries We Serve
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                We provide solutions across diverse industries and business sectors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Businesses Trust DiveSeeks Ltd
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Our track record speaks for itself. Here's what sets us apart in the industry.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">99%</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">48hrs</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">UK Based Team</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Partner with DiveSeeks Ltd?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust us with their software, security, and funding needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-300 hover:border-blue-600 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}