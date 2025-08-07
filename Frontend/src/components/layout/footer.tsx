import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Globe,
  ArrowUp,
  Code,
  Shield,
  CreditCard,
  Building,
  Users,
  FileText,
  MessageSquare,
  ExternalLink
} from "lucide-react"

interface NavigationSection {
  title: string
  icon: React.ReactNode
  links: {
    label: string
    href: string
    description?: string
  }[]
}

interface SocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

const navigationSections: NavigationSection[] = [
  {
    title: "Services",
    icon: <Building className="h-5 w-5" />,
    links: [
      { label: "Software Services", href: "#software-details", description: "POS Systems & Mobile Apps" },
      { label: "Security Services", href: "#security-details", description: "SIA Staff & Cybersecurity" },
      { label: "Business Funding", href: "#funding-details", description: "Loans & Asset Finance" },
      { label: "All Services", href: "#services", description: "Complete service overview" }
    ]
  },
  {
    title: "Solutions",
    icon: <Code className="h-5 w-5" />,
    links: [
      { label: "POS Systems", href: "#software-details", description: "Point of sale solutions" },
      { label: "Online Ordering", href: "#software-details", description: "E-commerce platforms" },
      { label: "Mobile Apps", href: "#software-details", description: "React Native development" },
      { label: "Cybersecurity", href: "#security-details", description: "Security audits & protection" }
    ]
  },
  {
    title: "Company",
    icon: <Users className="h-5 w-5" />,
    links: [
      { label: "About Us", href: "#about", description: "Our story & mission" },
      { label: "Our Team", href: "#about", description: "Meet the experts" },
      { label: "Careers", href: "#contact", description: "Join our team" },
      { label: "Partners", href: "#about", description: "Strategic partnerships" }
    ]
  },
  {
    title: "Resources",
    icon: <FileText className="h-5 w-5" />,
    links: [
      { label: "Case Studies", href: "#about", description: "Success stories" },
      { label: "Blog", href: "#contact", description: "Industry insights" },
      { label: "Documentation", href: "#contact", description: "Technical guides" },
      { label: "Support", href: "#contact", description: "Help & assistance" }
    ]
  }
]

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/diveseeks",
    icon: <Linkedin className="h-5 w-5" />
  },
  {
    name: "Twitter",
    href: "https://twitter.com/diveseeks",
    icon: <Twitter className="h-5 w-5" />
  },
  {
    name: "Facebook",
    href: "https://facebook.com/diveseeks",
    icon: <Facebook className="h-5 w-5" />
  },
  {
    name: "Website",
    href: "https://diveseeks.co.uk",
    icon: <Globe className="h-5 w-5" />
  }
]

const quickLinks = [
  { label: "Privacy Policy", href: "#contact" },
  { label: "Terms of Service", href: "#contact" },
  { label: "Cookie Policy", href: "#contact" },
  { label: "GDPR Compliance", href: "#contact" },
  { label: "Accessibility", href: "#contact" }
]

const certifications = [
  "SIA Licensed",
  "ISO 27001",
  "FCA Authorized",
  "Microsoft Partner",
  "AWS Provider"
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DiveSeeks Ltd
                </span>
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Empowering businesses with innovative software solutions, comprehensive security services, 
                and strategic funding opportunities. Your trusted partner for digital transformation and growth.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">+44 (0) 20 7123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">info@diveseeks.co.uk</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">123 Business Park, London, UK EC1A 1BB</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <div className="text-gray-300 hover:text-blue-400">
                      {social.icon}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Sections */}
          {navigationSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-400">
                  {section.icon}
                </div>
                <h4 className="text-lg font-semibold text-white">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="group text-left w-full"
                    >
                      <div className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </div>
                      {link.description && (
                        <div className="text-gray-500 text-xs mt-1">
                          {link.description}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Certifications & Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Certifications */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                Certifications & Accreditations
              </h4>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-400" />
                Company Highlights
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">10+</div>
                  <div className="text-xs text-gray-400">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">500+</div>
                  <div className="text-xs text-gray-400">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">£2M+</div>
                  <div className="text-xs text-gray-400">Funding Secured</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">99%</div>
                  <div className="text-xs text-gray-400">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="bg-gray-800" />
      
      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DiveSeeks Ltd. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Registered in England & Wales. Company No: 12345678
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(link.href)}
                className="text-gray-400 hover:text-blue-400 text-xs transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
          
          {/* Back to Top */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </div>
      
      {/* Contact CTA Strip */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold text-sm">
                Ready to Transform Your Business?
              </h4>
              <p className="text-blue-100 text-xs">
                Get in touch with our experts today for a free consultation.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                onClick={() => handleNavClick('#contact')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                onClick={() => window.open('tel:+442071234567')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}