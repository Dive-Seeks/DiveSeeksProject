import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Monitor, 
  ShoppingCart, 
  Smartphone, 
  Database, 
  CreditCard, 
  BarChart3, 
  Users, 
  Globe, 
  Zap, 
  CheckCircle,
  ArrowRight
} from "lucide-react"

interface SoftwareService {
  name: string
  description: string
  features: string[]
  benefits: string[]
  technologies: string[]
  icon: React.ReactNode
  color: string
  bgColor: string
}

const softwareServices: SoftwareService[] = [
  {
    name: "POS System",
    description: "Comprehensive point-of-sale solutions with inventory management, sales tracking, and customer management capabilities.",
    features: [
      "Real-time inventory tracking",
      "Sales analytics & reporting",
      "Customer management",
      "Multi-payment processing",
      "Staff management",
      "Cloud synchronization"
    ],
    benefits: [
      "Streamlined operations",
      "Reduced human error",
      "Better inventory control",
      "Improved customer service",
      "Data-driven insights"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "Cloud Storage"],
    icon: <Monitor className="h-8 w-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    name: "Online Ordering Website",
    description: "Custom e-commerce platforms with seamless ordering experience, payment integration, and order management systems.",
    features: [
      "Responsive web design",
      "Shopping cart functionality",
      "Secure payment gateway",
      "Order tracking system",
      "Admin dashboard",
      "SEO optimization"
    ],
    benefits: [
      "Increased online presence",
      "24/7 order acceptance",
      "Reduced operational costs",
      "Better customer reach",
      "Automated order processing"
    ],
    technologies: ["Next.js", "Tailwind CSS", "Stripe", "MongoDB", "Vercel"],
    icon: <ShoppingCart className="h-8 w-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    name: "React Native App",
    description: "Cross-platform mobile applications for iOS and Android with native performance and seamless user experience.",
    features: [
      "Cross-platform compatibility",
      "Push notifications",
      "Offline functionality",
      "Real-time updates",
      "User authentication",
      "In-app purchases"
    ],
    benefits: [
      "Wider market reach",
      "Cost-effective development",
      "Native performance",
      "Faster time to market",
      "Single codebase maintenance"
    ],
    technologies: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
    icon: <Smartphone className="h-8 w-8" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  }
]

export default function SoftwareServices() {
  return (
    <section id="software-details" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Monitor className="h-4 w-4" />
            Software Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Custom Software Solutions</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Built for Your Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We develop cutting-edge software solutions tailored to your business needs, from point-of-sale systems to mobile applications.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-16">
          {softwareServices.map((service, index) => (
            <div key={service.name} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
              {/* Content */}
              <div className="flex-1">
                <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
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
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Business Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <Badge 
                            key={benefitIndex} 
                            variant="secondary" 
                            className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Technologies */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex} 
                            variant="outline" 
                            className="text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
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
                    {service.name === "POS System" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Uptime</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Faster Processing</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Support</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Integrations</div>
                        </div>
                      </div>
                    )}
                    
                    {service.name === "Online Ordering Website" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">300%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Sales Increase</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt;2s</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Load Time</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Mobile Optimized</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">SEO</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Optimized</div>
                        </div>
                      </div>
                    )}
                    
                    {service.name === "React Native App" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">iOS</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">&amp; Android</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">60fps</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Performance</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Cost Savings</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Native</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Performance</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Business with Custom Software?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss your specific requirements and create a tailored software solution that drives your business forward.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}