"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  Calendar,
  Globe,
  Linkedin,
  Twitter,
  Facebook
} from "lucide-react"

interface ContactInfo {
  icon: React.ReactNode
  title: string
  details: string[]
  color: string
}

interface ServiceInquiry {
  value: string
  label: string
  description: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone",
    details: ["+44 (0) 20 7123 4567", "+44 (0) 7890 123456"],
    color: "text-green-600"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: ["info@diveseeks.co.uk", "support@diveseeks.co.uk"],
    color: "text-blue-600"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Address",
    details: ["123 Business Park", "London, UK EC1A 1BB"],
    color: "text-orange-600"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Business Hours",
    details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    color: "text-purple-600"
  }
]

const serviceInquiries: ServiceInquiry[] = [
  {
    value: "software",
    label: "Software Services",
    description: "POS Systems, Online Ordering, Mobile Apps"
  },
  {
    value: "security",
    label: "Security Services",
    description: "SIA Staff, Cybersecurity, Business Protection"
  },
  {
    value: "funding",
    label: "Business Funding",
    description: "Loans, Asset Finance, Invoice Finance"
  },
  {
    value: "consultation",
    label: "General Consultation",
    description: "Strategic advice and planning"
  },
  {
    value: "other",
    label: "Other",
    description: "Custom requirements or partnerships"
  }
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: ""
      })
    }, 3000)
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquare className="h-4 w-4" />
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Ready to Transform</span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your Business?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get in touch with our expert team to discuss your software, security, or funding needs. 
            We're here to help you achieve your business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Reach out to us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>
              
              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-md bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className={info.color}>
                            {info.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {info.title}
                          </h4>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Social Links */}
              <Card className="border-0 shadow-md bg-gray-50 dark:bg-gray-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Follow Us
                  </h4>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 dark:text-white font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900 dark:text-white font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                    
                    {/* Phone and Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-900 dark:text-white font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-900 dark:text-white font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Enter your company name"
                          className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                    
                    {/* Service Interest */}
                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-gray-900 dark:text-white font-medium">
                        Service Interest *
                      </Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select a service</option>
                        {serviceInquiries.map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                      {formData.service && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {serviceInquiries.find(s => s.value === formData.service)?.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-900 dark:text-white font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                        required
                        rows={6}
                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our quick action options for faster service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Call Us Now
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Speak directly with our experts
                </p>
                <Button variant="outline" className="w-full">
                  +44 (0) 20 7123 4567
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Book a Meeting
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Schedule a consultation
                </p>
                <Button variant="outline" className="w-full">
                  Schedule Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Live Chat
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Chat with our support team
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}