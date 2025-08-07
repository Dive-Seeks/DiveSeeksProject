export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DiveSeeks Ltd",
    legalName: "DiveSeeks Limited",
    url: "https://diveseeks.co.uk",
    logo: "https://diveseeks.co.uk/logo.png",
    description: "Leading provider of software development, security services, and business funding solutions. Specializing in POS systems, cybersecurity, and strategic funding for business growth.",
    foundingDate: "2014",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Business Park",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "EC1A 1BB"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+44-20-7123-4567",
        contactType: "customer service",
        email: "info@diveseeks.co.uk",
        availableLanguage: "English"
      },
      {
        "@type": "ContactPoint",
        telephone: "+44-7890-123456",
        contactType: "technical support",
        email: "support@diveseeks.co.uk",
        availableLanguage: "English"
      }
    ],
    sameAs: [
      "https://linkedin.com/company/diveseeks",
      "https://twitter.com/diveseeks",
      "https://facebook.com/diveseeks"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "DiveSeeks Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Software Development Services",
            description: "Custom POS systems, online ordering platforms, and React Native mobile applications",
            serviceType: "Software Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Security Services",
            description: "SIA-licensed security staff, cybersecurity audits, and comprehensive business protection",
            serviceType: "Security Services"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Funding Services",
            description: "Expert broker services for business loans, asset finance, and invoice financing",
            serviceType: "Financial Services"
          }
        }
      ]
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "200",
      bestRating: "5"
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom"
    },
    knowsAbout: [
      "Software Development",
      "Cybersecurity",
      "Business Funding",
      "POS Systems",
      "Mobile App Development",
      "Security Services",
      "Financial Services"
    ]
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DiveSeeks Ltd",
    image: "https://diveseeks.co.uk/office.jpg",
    "@id": "https://diveseeks.co.uk",
    url: "https://diveseeks.co.uk",
    telephone: "+44-20-7123-4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Business Park",
      addressLocality: "London",
      addressCountry: "GB",
      postalCode: "EC1A 1BB"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00"
      }
    ],
    priceRange: "££-£££",
    servesCuisine: "Business Services"
  }

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }} 
      />
    </>
  )
}
