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

export default function BusinessFunding() {
  return (
    <section id="funding-details" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CreditCard className="h-4 w-4" />
            Business Funding
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Unlock Your Business Potential</span>
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-green-500 bg-clip-text text-transparent">
              with Strategic Funding
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert broker services connecting you with the right funding solutions to fuel your business growth and success.
          </p>
        </div>

        {/* Broker Services Overview */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Professional Broker Services
                </h3>
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

        {/* Funding Options */}
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
                    
                    {/* Option-specific stats */}
                    {option.type === "Business Loans" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.5%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">From APR</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Approval Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5 Years</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Max Term</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">No Fees</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Early Repayment</div>
                        </div>
                      </div>
                    )}
                    
                    {option.type === "Asset Finance" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Asset Financing</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">Tax</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Efficient</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">Flexible</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Terms</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">Latest</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Equipment</div>
                        </div>
                      </div>
                    )}
                    
                    {option.type === "Invoice Finance" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">90%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Advance Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24hrs</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Fast Access</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Credit</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Protection</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">No Limit</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Facility Size</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Success Stats */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Funding Success Record
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We've helped hundreds of businesses secure the funding they need to grow and succeed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">£2M+</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Funding Secured</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">200+</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Businesses Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">48hrs</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">Average Approval</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Secure Funding for Your Business?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Get expert advice on the best funding options for your business and start your application today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Funding Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-orange-300 hover:border-orange-600 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}