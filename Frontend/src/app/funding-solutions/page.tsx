import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/layout/footer"
import StructuredData from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  PiggyBank, 
  Building, 
  CheckCircle, 
  Clock, 
  Users, 
  Target,
  ArrowRight,
  Banknote
} from "lucide-react"

export const metadata: Metadata = {
  title: "Funding Solutions | DiveSeeks - Business Finance & Broker Services",
  description: "Expert business funding solutions including loans, asset finance, and invoice finance. Professional broker services to secure the best funding for your business growth.",
  keywords: ["business funding", "business loans", "asset finance", "invoice finance", "broker services", "business finance"],
  openGraph: {
    title: "Funding Solutions | DiveSeeks",
    description: "Unlock your business potential with strategic funding solutions",
    type: "website",
  },
}

interface FundingOption {
  type: string
  description: string
  requirements: string[]
  benefits: string[]
  amount: string
  timeframe: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const fundingOptions: FundingOption[] = [
  {
    type: "Business Loans",
    description: "Traditional and alternative business loans with competitive rates and flexible terms to support your business growth and expansion plans.",
    requirements: ["12+ months trading", "Good credit history", "Business plan", "Financial statements", "Collateral (if required)"],
    benefits: ["Competitive interest rates", "Flexible repayment terms", "Quick approval process", "No early repayment fees", "Expert guidance"],
    amount: "£5K - £500K",
    timeframe: "7-14 days",
    icon: <Building className="h-8 w-8" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    type: "Asset Finance",
    description: "Equipment and asset financing solutions to help you acquire the tools and machinery needed to grow your business without large upfront costs.",
    requirements: ["Asset valuation", "Business registration", "Credit assessment", "Insurance coverage", "Maintenance agreement"],
    benefits: ["Preserve cash flow", "Tax advantages", "Latest equipment access", "Flexible terms", "End-of-term options"],
    amount: "£1K - £1M",
    timeframe: "3-7 days",
    icon: <PiggyBank className="h-8 w-8" />,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    type: "Invoice Finance",
    description: "Unlock cash tied up in unpaid invoices with our invoice financing solutions, improving your cash flow and working capital management.",
    requirements: ["Outstanding invoices", "Customer credit checks", "Invoice verification", "Business registration", "Trading history"],
    benefits: ["Immediate cash flow", "Up to 90% advance", "Credit protection", "Debt collection service", "Flexible facility"],
    amount: "£10K - £2M",
    timeframe: "24-48 hours",
    icon: <FileText className="h-8 w-8" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  }
]

const brokerServices = [
  {
    title: "Expert Consultation",
    description: "Professional advice on the best funding options for your specific business needs and circumstances.",
    icon: <Users className="h-6 w-6" />
  },
  {
    title: "Application Support",
    description: "Complete assistance with application preparation, documentation, and submission to maximize approval chances.",
    icon: <FileText className="h-6 w-6" />
  },
  {
    title: "Lender Network",
    description: "Access to our extensive network of trusted lenders and financial institutions for the best rates and terms.",
    icon: <Building className="h-6 w-6" />
  },
  {
    title: "Ongoing Support",
    description: "Continued support throughout the funding process and beyond to ensure your business success.",
    icon: <Target className="h-6 w-6" />
  }
]

export default function FundingSolutionsPage() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CreditCard className="h-4 w-4" />
                Business Funding
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gray-900 dark:text-white">Unlock Your Business Potential</span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-green-500 bg-clip-text text-transparent">
                  with Strategic Funding
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Expert broker services connecting you with the right funding solutions to fuel your business growth and success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Get Funding Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Speak to Broker
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Funding Stats */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">£50M+</div>
                <div className="text-gray-600 dark:text-gray-300">Funding Secured</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
                <div className="text-gray-600 dark:text-gray-300">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24hrs</div>
                <div className="text-gray-600 dark:text-gray-300">Fastest Approval</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Businesses Funded</div>
              </div>
            </div>
          </div>
        </section>

        {/* Broker Services Overview */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Professional Broker Services
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Our experienced team provides comprehensive broker services to help you navigate the funding landscape and secure the best deals.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {brokerServices.map((service, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <div className="text-orange-600">
                          {service.icon}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Funding Options */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Funding Solutions for Every Business
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From startup capital to expansion funding, we have the right solution for your business needs.
              </p>
            </div>
            
            <div className="space-y-16">
              {fundingOptions.map((option, index) => (
                <div key={option.type} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
                      <CardHeader className="pb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-xl ${option.bgColor} flex items-center justify-center`}>
                            <div className={option.color}>
                              {option.icon}
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                              {option.type}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                              {option.description}
                            </CardDescription>
                          </div>
                        </div>
                        
                        {/* Key Info */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Amount</span>
                            </div>
                            <div className="text-lg font-bold text-green-600">{option.amount}</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">Timeframe</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">{option.timeframe}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Requirements */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                          <div className="space-y-2">
                            {option.requirements.map((requirement, reqIndex) => (
                              <div key={reqIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300 text-sm">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Benefits */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Benefits</h4>
                          <div className="flex flex-wrap gap-2">
                            {option.benefits.map((benefit, benefitIndex) => (
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
                        
                        <div className="pt-4">
                          <Button className="w-full sm:w-auto">
                            Apply Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Visual/Stats */}
                  <div className="flex-1">
                    <div className={`${option.bgColor} rounded-2xl p-8 h-full min-h-[400px] flex flex-col justify-center`}>
                      <div className="text-center space-y-6">
                        <div className={`w-24 h-24 mx-auto rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg`}>
                          <div className={`${option.color} scale-150`}>
                            {option.icon}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {option.type}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Fast, flexible funding solutions designed to accelerate your business growth.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                            <div className={`text-2xl font-bold ${option.color}`}>{option.amount.split(' - ')[0]}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">From</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                            <div className={`text-2xl font-bold ${option.color}`}>{option.timeframe.split('-')[0]}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Fast Track</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Simple 4-Step Process
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Getting funding for your business has never been easier with our streamlined process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Consultation", description: "Free consultation to understand your funding needs" },
                { step: "2", title: "Application", description: "Complete application with our expert guidance" },
                { step: "3", title: "Approval", description: "Fast-track approval from our lender network" },
                { step: "4", title: "Funding", description: "Receive funds and grow your business" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Fund Your Growth?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Don't let funding hold back your business potential. Get a free consultation and discover your funding options today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Call Broker Now
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}