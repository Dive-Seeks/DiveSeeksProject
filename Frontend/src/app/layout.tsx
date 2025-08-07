import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DiveSeeks Ltd | Software, Security & Business Funding Solutions",
  description:
    "DiveSeeks Ltd offers comprehensive business solutions through Software Services (POS systems, online ordering), Security Services (SIA-licensed staff, cybersecurity), and Business Funding services.",
  keywords: "business solutions, software services, POS system, online ordering, security services, SIA licensed, cybersecurity, business funding, broker services, React Native app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://diveseeks.com",
    title: "DiveSeeks Ltd | Comprehensive Business Solutions",
    description:
      "Multi-service company offering Software Services, Security Services, and Business Funding solutions for small to medium businesses.",
    siteName: "DiveSeeks Ltd",
    images: [
      {
        url: "https://diveseeks.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DiveSeeks Ltd - Business Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiveSeeks Ltd | Software, Security & Business Funding",
    description: "Comprehensive business solutions including software development, security services, and funding assistance.",
    images: ["https://diveseeks.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
