# DiveSeeks Ltd Homepage - Component Specifications

## 1. Component Library Strategy

### 1.1 Primary UI Library: shadcn/ui

All core UI components will be built using shadcn/ui as the foundation, ensuring consistency, accessibility, and maintainability. The following shadcn/ui components will be utilized:

* **Button**: For all call-to-action elements and interactive buttons

* **Card**: For service cards, testimonials, and content sections

* **Input**: For contact form fields and user input elements

* **Form**: For structured form layouts with validation

* **Badge**: For service tags and feature highlights

* **Separator**: For visual content division

* **Avatar**: For team member photos and testimonials

* **Dialog**: For modal interactions and detailed service information

### 1.2 Enhanced Components from Aceternity UI

Selective integration of Aceternity UI components for advanced animations and visual effects:

* **Hero sections with animated backgrounds**

* **Card hover effects and transitions**

* **Scroll-triggered animations**

* **Interactive service showcases**

## 2. Homepage Section Components

### 2.1 Header Component

```typescript
// components/layout/header.tsx
interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
}

// Uses shadcn/ui components:
// - Button (for contact CTA)
// - Navigation menu structure
// - Mobile responsive hamburger menu
```

**Features:**

* Sticky navigation with transparency effect

* Company logo (left-aligned)

* Navigation menu (center-aligned): Home, Services, About, Contact

* Contact button (right-aligned)

* Mobile hamburger menu with slide-out navigation

* Smooth scroll-to-section functionality

### 2.2 Hero Section Component

```typescript
// components/sections/hero.tsx
interface HeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundImage?: string;
}

// Uses shadcn/ui components:
// - Button (primary CTA)
// - Card (for content container)
```

**Features:**

* Large, compelling headline with gradient text effect

* Supporting subheadline explaining company value proposition

* Primary call-to-action button with hover animations

* Background with subtle animation or gradient

* Responsive typography scaling

* Scroll indicator for content below

### 2.3 Services Overview Component

```typescript
// components/sections/services-overview.tsx
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

interface ServicesOverviewProps {
  services: Service[];
}

// Uses shadcn/ui components:
// - Card (for each service)
// - Button (for service CTAs)
// - Badge (for feature tags)
```

**Features:**

* Three-column grid layout (responsive to single column on mobile)

* Service cards with hover effects and animations

* Service icons and titles

* Brief descriptions with key features

* "Learn More" buttons for each service

* Consistent card styling and spacing

### 2.4 Service Detail Components

#### Software Services Detail

```typescript
// components/sections/software-services.tsx
interface SoftwareService {
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  technologies: string[];
}

// Uses shadcn/ui components:
// - Card (for service breakdown)
// - Badge (for technology tags)
// - Separator (for content division)
```

**Services Included:**

* **POS System**: Point-of-sale solutions with inventory management

* **Online Ordering Website**: Custom e-commerce platforms

* **React Native App**: Mobile ordering applications

#### Security Services Detail

```typescript
// components/sections/security-services.tsx
interface SecurityService {
  name: string;
  description: string;
  certifications: string[];
  coverage: string[];
}

// Uses shadcn/ui components:
// - Card (for service breakdown)
// - Badge (for certifications)
// - Avatar (for team credentials)
```

**Services Included:**

* **SIA-Licensed Staff**: Professional security personnel

* **Cybersecurity Audits**: Comprehensive security assessments

* **Business Protection**: Physical and digital security solutions

#### Business Funding Detail

```typescript
// components/sections/business-funding.tsx
interface FundingOption {
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

// Uses shadcn/ui components:
// - Card (for funding options)
// - Form (for application process)
// - Button (for application CTAs)
```

**Services Included:**

* **Funding Brokerage**: Connecting businesses with lenders

* **Application Support**: Guidance through funding processes

* **Financial Consultation**: Expert advice on funding options

### 2.5 About Section Component

```typescript
// components/sections/about.tsx
interface AboutSectionProps {
  companyStats: CompanyStat[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
}

// Uses shadcn/ui components:
// - Card (for stats and testimonials)
// - Avatar (for team photos)
// - Badge (for credentials)
```

**Features:**

* Company statistics and achievements

* Key team member profiles

* Client testimonials with photos

* Trust indicators and certifications

* Company timeline or milestones

### 2.6 Contact Section Component

```typescript
// components/sections/contact.tsx
interface ContactSectionProps {
  businessInfo: BusinessInfo;
  onFormSubmit: (data: ContactFormData) => void;
}

// Uses shadcn/ui components:
// - Form (contact form structure)
// - Input (form fields)
// - Button (submit button)
// - Card (contact information)
```

**Features:**

* Contact form with validation (name, email, phone, message, service interest)

* Business contact information (address, phone, email)

* Office hours and availability

* Social media links

* Map integration (optional)

* Multiple contact methods

### 2.7 Footer Component

```typescript
// components/layout/footer.tsx
interface FooterProps {
  companyInfo: CompanyInfo;
  serviceLinks: ServiceLink[];
  legalLinks: LegalLink[];
  socialLinks: SocialLink[];
}

// Uses shadcn/ui components:
// - Separator (for section division)
// - Button (for social links)
```

**Features:**

* Multi-column layout with service categories

* Company information and contact details

* Legal pages links (Privacy Policy, Terms of Service)

* Social media icons and links

* Copyright information

* Newsletter signup (optional)

## 3. Reusable Component Library

### 3.1 ServiceCard Component

```typescript
// components/common/service-card.tsx
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  ctaAction: () => void;
  variant?: 'default' | 'featured';
}

// Uses shadcn/ui Card as base with custom styling
```

### 3.2 CTAButton Component

```typescript
// components/common/cta-button.tsx
interface CTAButtonProps {
  text: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

// Extends shadcn/ui Button with custom variants
```

### 3.3 ContactForm Component

```typescript
// components/common/contact-form.tsx
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  serviceOptions: string[];
  loading?: boolean;
}

// Uses shadcn/ui Form components with validation
```

### 3.4 AnimatedSection Component

```typescript
// components/common/animated-section.tsx
interface AnimatedSectionProps {
  children: React.ReactNode;
  animation: 'fade-in' | 'slide-up' | 'slide-in-left' | 'slide-in-right';
  delay?: number;
  threshold?: number;
}

// Wrapper component for scroll-triggered animations
```

## 4. Responsive Design Specifications

### 4.1 Breakpoint Strategy

* **Mobile**: 320px - 767px (single column layouts)

* **Tablet**: 768px - 1023px (two-column layouts)

* **Desktop**: 1024px+ (multi-column layouts)

### 4.2 Component Responsiveness

* **Header**: Hamburger menu on mobile, full navigation on desktop

* **Hero**: Stacked content on mobile, side-by-side on desktop

* **Services**: Single column on mobile, three columns on desktop

* **Contact**: Stacked form and info on mobile, side-by-side on desktop

* **Footer**: Single column on mobile, multi-column on desktop

## 5. Animation and Interaction Guidelines

### 5.1 Micro-interactions

* Button hover effects with scale and color transitions

* Card hover effects with subtle lift and shadow

* Form field focus states with border color changes

* Loading states for form submissions

### 5.2 Page Animations

* Scroll-triggered fade-in animations for sections

* Staggered animations for service cards

* Smooth scroll navigation between sections

* Page transition effects (if implementing multi-page)

### 5.3 Performance Considerations

* Use CSS transforms for animations (GPU acceleration)

* Implement intersection observer for scroll animations

* Lazy load heavy animation components

* Optimize animation timing for 60fps performance

