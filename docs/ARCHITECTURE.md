# Pumalo Space - Structural Architecture

## 🏗️ Project Overview
Pumalo Space is a modern rental property platform inspired by Airbnb and Expedia, built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 📁 Folder Structure

```
pumalo-space/
├── public/                          # Static assets
│   ├── images/
│   │   ├── logos/                   # Brand logos
│   │   ├── properties/              # Property images
│   │   └── icons/                   # UI icons
│   └── fonts/                       # Custom fonts
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth group route
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/                  # Main app group route
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx        # Property listings
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Property details
│   │   │   ├── rent/
│   │   │   │   └── page.tsx        # Rent filter page
│   │   │   ├── buy/
│   │   │   │   └── page.tsx        # Buy filter page
│   │   │   ├── lodge/
│   │   │   │   └── page.tsx        # Lodge filter page
│   │   │   └── profile/
│   │   │       └── page.tsx        # User profile
│   │   │
│   │   ├── host/                    # Host/listing management
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── create-listing/
│   │   │       └── page.tsx
│   │   │
│   │   ├── help/                    # Help center
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── error.tsx               # Error boundary
│   │
│   ├── components/                  # Reusable components
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   └── Footer/
│   │   │       ├── Footer.tsx
│   │   │       ├── FooterLinks.tsx
│   │   │       └── FooterSection.tsx
│   │   │
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyList.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── PropertyGallery.tsx
│   │   │   └── FeaturedProperties.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchSuggestions.tsx
│   │   │   └── AdvancedSearch.tsx
│   │   │
│   │   ├── filters/
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterButton.tsx
│   │   │   ├── FilterModal.tsx
│   │   │   ├── PriceFilter.tsx
│   │   │   ├── LocationFilter.tsx
│   │   │   └── DateFilter.tsx
│   │   │
│   │   ├── user/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserAvatar.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   │
│   │   ├── ui/                      # Generic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/                         # Utility functions & configs
│   │   ├── utils.ts                # Helper functions
│   │   ├── constants.ts            # App constants
│   │   ├── validation.ts           # Form validation
│   │   └── api/                    # API clients
│   │       ├── properties.ts
│   │       ├── users.ts
│   │       └── auth.ts
│   │
│   ├── types/                       # TypeScript types
│   │   ├── property.ts
│   │   ├── user.ts
│   │   ├── filter.ts
│   │   ├── booking.ts
│   │   └── index.ts
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useSearch.ts
│   │   ├── useFilters.ts
│   │   ├── useProperties.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── contexts/                    # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── SearchContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── styles/                      # Additional styles
│   │   ├── theme.ts                # Theme configuration
│   │   └── animations.css          # Custom animations
│   │
│   └── data/                        # Mock data (for development)
│       ├── properties.json
│       └── users.json
│
├── .env.local                       # Environment variables
├── .env.example                     # Example env file
├── biome.json                       # Biome config
├── next.config.ts                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
└── README.md                        # Project documentation
```

## 🎨 Design System

### Color Palette (Blue Theme)
```
Primary Blue:     #0066CC (Links, CTAs)
Light Blue:       #E6F2FF (Backgrounds)
Dark Blue:        #003D7A (Headers, Text)
Accent Blue:      #00A3FF (Hover states)
White:            #FFFFFF
Gray:             #F5F5F5, #E0E0E0, #757575
```

### Typography
- Headings: Geist Sans (Bold)
- Body: Geist Sans (Regular)
- Code/Mono: Geist Mono

## 🧩 Component Architecture

### 1. Header Component
**Location:** `src/components/layout/Header/`

**Structure:**
- Logo (left-aligned)
- Primary Navigation (Rent | Buy | Lodge)
- Search Bar (center)
- User Menu (right-aligned)
  - Login/Signup buttons (unauthenticated)
  - User Avatar + Dropdown (authenticated)

**Features:**
- Sticky on scroll
- Responsive mobile menu
- Search autocomplete
- User dropdown menu

### 2. Property Card Component
**Location:** `src/components/properties/PropertyCard.tsx`

**Props:**
```typescript
{
  id: string
  title: string
  location: string
  price: number
  images: string[]
  rating: number
  propertyType: 'rent' | 'buy' | 'lodge'
  amenities: string[]
}
```

**Features:**
- Image carousel
- Favorite/heart icon
- Quick view modal
- Responsive design
- Hover effects

### 3. Filter Bar Component
**Location:** `src/components/filters/FilterBar.tsx`

**Filters:**
- Property Type (Rent/Buy/Lodge)
- Price Range
- Location
- Check-in/Check-out dates
- Amenities
- Number of guests
- Bedrooms/Bathrooms

### 4. Search Bar Component
**Location:** `src/components/search/SearchBar.tsx`

**Features:**
- Location autocomplete
- Recent searches
- Popular destinations
- Voice search (future)

### 5. Footer Component
**Location:** `src/components/layout/Footer/`

**Sections:**
- About (Company info, Careers)
- Support (Help Center, Anti-discrimination, Cancellation)
- Hosting (List Your Property, Host Resources)
- Legal (Terms, Privacy, Policies)
- Social Media Links
- Language/Currency selector

## 📱 Page Structure

### Landing Page (`/`)
1. Hero Section
   - Full-width search bar
   - Background image/video
   - Quick filters (Rent/Buy/Lodge)

2. Featured Properties
   - Property grid (3-4 columns)
   - Filter tags

3. Popular Destinations
   - City cards with images

4. How It Works
   - Step-by-step guide

5. Testimonials
   - User reviews carousel

### Property Listings Page (`/properties`)
1. Filter sidebar (desktop) / Filter modal (mobile)
2. Property grid with cards
3. Pagination or infinite scroll
4. Map view toggle
5. Sort options (Price, Rating, Date)

### Property Details Page (`/properties/[id]`)
1. Image gallery
2. Property information
3. Amenities list
4. Location map
5. Reviews section
6. Similar properties
7. Booking widget (sticky on scroll)

## 🔄 State Management Strategy

### Client State
- React Context API for:
  - Authentication
  - Search filters
  - Theme preferences

### Server State
- React Server Components for initial data
- Consider SWR or TanStack Query for:
  - Property listings
  - User data
  - Bookings

## 🚀 Performance Optimizations

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy loading for below-fold images
   - WebP format with fallbacks

2. **Code Splitting**
   - Route-based splitting (automatic with Next.js)
   - Dynamic imports for heavy components
   - Lazy load modals and filters

3. **Caching**
   - Static generation for property pages
   - ISR (Incremental Static Regeneration)
   - API route caching

4. **SEO**
   - Metadata for each page
   - JSON-LD structured data
   - Sitemap generation
   - robots.txt

## 🔐 Authentication Flow

1. **Unauthenticated Users**
   - Can browse properties
   - Can search and filter
   - Redirected to login for bookings

2. **Authenticated Users**
   - Can book properties
   - Can save favorites
   - Can manage profile
   - Can become hosts

3. **Hosts**
   - Can list properties
   - Can manage bookings
   - Access to dashboard

## 📊 Data Models

### Property
```typescript
interface Property {
  id: string
  title: string
  description: string
  propertyType: 'rent' | 'buy' | 'lodge'
  location: {
    address: string
    city: string
    country: string
    coordinates: [number, number]
  }
  price: {
    amount: number
    currency: string
    period?: 'night' | 'month' | 'total'
  }
  images: string[]
  amenities: string[]
  rooms: {
    bedrooms: number
    bathrooms: number
    maxGuests: number
  }
  host: User
  rating: number
  reviews: Review[]
  availability: Date[]
}
```

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  verified: boolean
  isHost: boolean
  createdAt: Date
}
```

## 🎯 Development Priorities

### Phase 1: Foundation (Week 1-2)
- [ ] Set up folder structure
- [ ] Create type definitions
- [ ] Build UI component library
- [ ] Implement theme system

### Phase 2: Core Features (Week 3-4)
- [ ] Header and Footer
- [ ] Landing page
- [ ] Property listings page
- [ ] Property card component
- [ ] Search and filter functionality

### Phase 3: User Features (Week 5-6)
- [ ] Authentication
- [ ] User profile
- [ ] Favorites/Wishlist
- [ ] Basic booking flow

### Phase 4: Host Features (Week 7-8)
- [ ] Host dashboard
- [ ] Property listing creation
- [ ] Booking management

### Phase 5: Polish (Week 9-10)
- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Testing and bug fixes

## 🧪 Testing Strategy

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- E2E tests with Playwright
- Visual regression tests

## 📱 Mobile-First Approach

- Start with mobile design
- Progressive enhancement for tablets and desktops
- Touch-friendly UI elements
- Optimized for slow networks

## 🌐 Future Considerations

- PWA capabilities
- Native mobile app (React Native)
- Multi-language support (i18n)
- Real-time chat for property inquiries
- Payment integration
- Booking calendar
- Review system
- Admin dashboard

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0
