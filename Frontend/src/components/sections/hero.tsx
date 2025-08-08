"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Shield, CreditCard } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Comprehensive Business Solutions
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900 dark:text-white">Empowering Your Business with</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Integrated Solutions
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              DiveSeeks Ltd delivers comprehensive business solutions through our three core services: 
              cutting-edge software development, professional security services, and strategic business funding.
            </p>
            
            {/* Service Highlights */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Software Services</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Security Services</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Business Funding</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-600 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get In Touch
              </Button>
            </div>
          </div>
          
          {/* Hero Image/Logo */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src="/DiveSeek-Logo-1.png"
                    alt="DiveSeeks Ltd Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-1/2 -left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '2s' }}>
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Successful Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Security Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">£2M+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Funding Facilitated</div>
          </div>
        </div>
      </div>
    </section>
  )
}