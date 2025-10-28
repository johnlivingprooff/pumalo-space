# 🚀 Phase 2 Implementation Plan - Property Features

## Overview
This document outlines the systematic approach to implementing Phase 2 of the Pumalo Space project, focusing on property browsing, search, filtering, and detailed property views.

---

## 📋 Implementation Checklist

### **Task 1: Property Listings Page** ⏱️ Est. 4-6 hours
Create a comprehensive property listings page with grid layout and basic filtering.

#### Subtasks:
- [ ] **1.1** Create `/app/properties/page.tsx` - Main listings page
  - Fetch properties from database
  - Display in responsive grid (1/2/3/4 columns based on screen size)
  - Add loading states and error handling
  - Implement pagination (show 12 properties per page)

- [ ] **1.2** Create filter components
  - `src/components/properties/PropertyFilters.tsx`
    - Property type filter (Rent, Buy, Lodge)
    - Price range slider
    - Bedrooms/Bathrooms selector
    - Amenities checkboxes
  - `src/components/properties/PropertySort.tsx`
    - Sort by: Price (low to high), Price (high to low), Rating, Newest

- [ ] **1.3** Add URL state management
  - Use Next.js `searchParams` for filters
  - Enable shareable URLs with filter state
  - Example: `/properties?type=rent&city=nairobi&bedrooms=2`

**Files to create:**
```
src/app/properties/
  ├── page.tsx
  └── loading.tsx
src/components/properties/
  ├── PropertyFilters.tsx
  ├── PropertySort.tsx
  └── PropertyGrid.tsx
```

**API needed:**
- GET `/api/properties` - Fetch properties with filters

---

### **Task 2: Property Detail Page** ⏱️ Est. 6-8 hours
Create a rich property detail page with all information and booking capability.

#### Subtasks:
- [ ] **2.1** Create `/app/properties/[id]/page.tsx`
  - Fetch single property with all details
  - Image gallery (main image + thumbnails)
  - Property information section
  - Host profile card
  - Amenities list
  - Location map placeholder
  - Reviews section

- [ ] **2.2** Create detail page components
  - `src/components/properties/PropertyGallery.tsx`
    - Full-screen image viewer
    - Thumbnail navigation
    - Image carousel
  - `src/components/properties/PropertyDetails.tsx`
    - Description, specs, amenities
  - `src/components/properties/BookingCard.tsx`
    - Price display
    - Date picker
    - Guest selector
    - Total price calculation
    - "Book Now" button
  - `src/components/properties/HostCard.tsx`
    - Host avatar, name, verification badge
    - Join date, response time
    - Contact host button
  - `src/components/properties/ReviewsList.tsx`
    - Individual review cards
    - Rating breakdown
    - Review filters

- [ ] **2.3** Add sharing & favorites
  - Share button (copy link, social media)
  - Add to favorites (heart icon)
  - Report listing option

**Files to create:**
```
src/app/properties/[id]/
  ├── page.tsx
  ├── loading.tsx
  └── not-found.tsx
src/components/properties/
  ├── PropertyGallery.tsx
  ├── PropertyDetails.tsx
  ├── BookingCard.tsx
  ├── HostCard.tsx
  ├── ReviewsList.tsx
  └── ShareButton.tsx
```

**API needed:**
- GET `/api/properties/[id]` - Fetch single property
- POST `/api/favorites` - Add/remove favorite

---

### **Task 3: Search Functionality** ⏱️ Est. 4-5 hours
Implement comprehensive search across the platform.

#### Subtasks:
- [ ] **3.1** Enhance search bar
  - Connect landing page search to properties page
  - Add autocomplete for locations
  - Search suggestions as user types
  - Recent searches

- [ ] **3.2** Create search results page
  - `/app/search/page.tsx`
  - Display search results in grid
  - Show search query and result count
  - "No results" state with suggestions

- [ ] **3.3** Implement search logic
  - Search by: location, property title, description
  - Filter by property type, price range
  - Sort results by relevance

**Files to create:**
```
src/app/search/
  ├── page.tsx
  └── loading.tsx
src/components/search/
  ├── SearchBar.tsx (enhanced)
  ├── SearchSuggestions.tsx
  └── SearchResults.tsx
```

**API needed:**
- GET `/api/search` - Search properties
- GET `/api/search/suggestions` - Autocomplete

---

### **Task 4: Filter System** ⏱️ Est. 3-4 hours
Advanced filtering and sorting capabilities.

#### Subtasks:
- [ ] **4.1** Create filter components
  - Price range slider with min/max inputs
  - Property type multi-select
  - Location filter (city/region)
  - Room count selectors
  - Amenities multi-select
  - Guest count filter
  - Availability date filter

- [ ] **4.2** Filter state management
  - Use URL search params
  - Clear all filters button
  - Active filter badges
  - Filter count indicator

- [ ] **4.3** Mobile filter modal
  - Bottom sheet on mobile
  - Apply/Clear buttons
  - Responsive design

**Files to create:**
```
src/components/filters/
  ├── FilterContainer.tsx
  ├── PriceRangeFilter.tsx
  ├── PropertyTypeFilter.tsx
  ├── LocationFilter.tsx
  ├── RoomCountFilter.tsx
  ├── AmenitiesFilter.tsx
  └── MobileFilterModal.tsx
```

---

### **Task 5: Category Pages** ⏱️ Est. 2-3 hours
Create dedicated pages for Rent, Buy, and Lodge.

#### Subtasks:
- [ ] **5.1** Create category pages
  - `/app/rent/page.tsx` - Properties for rent
  - `/app/buy/page.tsx` - Properties for sale
  - `/app/lodge/page.tsx` - Lodging properties

- [ ] **5.2** Customize each category
  - Category-specific hero images
  - Tailored descriptions
  - Pre-filtered property listings
  - Category-specific filters (e.g., "Night" for rent vs "Total" for buy)

**Files to create:**
```
src/app/rent/page.tsx
src/app/buy/page.tsx
src/app/lodge/page.tsx
```

---

### **Task 6: Map Integration** ⏱️ Est. 4-5 hours
Add interactive map for property locations.

#### Subtasks:
- [ ] **6.1** Install map library
  ```bash
  npm install react-leaflet leaflet
  npm install -D @types/leaflet
  ```

- [ ] **6.2** Create map components
  - `src/components/map/PropertyMap.tsx`
    - Display single property location
  - `src/components/map/PropertiesMap.tsx`
    - Show multiple properties with markers
    - Cluster markers when zoomed out
    - Click marker to view property card

- [ ] **6.3** Add map view toggle
  - List view / Map view toggle
  - Split view (list + map side by side on desktop)
  - Mobile: full-screen map with bottom sheet

**Files to create:**
```
src/components/map/
  ├── PropertyMap.tsx
  ├── PropertiesMap.tsx
  └── MapMarker.tsx
```

**Packages needed:**
- `react-leaflet` - Map component
- `leaflet` - Mapping library

---

## 🗂️ API Routes to Create

### 1. Properties API
**File:** `src/app/api/properties/route.ts`
```typescript
// GET /api/properties
// Query params: type, city, minPrice, maxPrice, bedrooms, bathrooms, amenities
```

### 2. Single Property API
**File:** `src/app/api/properties/[id]/route.ts`
```typescript
// GET /api/properties/[id]
```

### 3. Search API
**File:** `src/app/api/search/route.ts`
```typescript
// GET /api/search?q=nairobi&type=rent
```

### 4. Favorites API
**File:** `src/app/api/favorites/route.ts`
```typescript
// GET /api/favorites - Get user's favorites
// POST /api/favorites - Add favorite
// DELETE /api/favorites/[id] - Remove favorite
```

---

## 📦 Required Packages

### Core Dependencies
```bash
# Already installed
npm install prisma @prisma/client
npm install @stackframe/stack  # Authentication

# New for Phase 2
npm install react-leaflet leaflet  # Maps
npm install date-fns  # Date utilities
npm install react-datepicker  # Date picker
npm install @headlessui/react  # Accessible UI components
npm install react-icons  # Icon library
```

### Dev Dependencies
```bash
npm install -D @types/leaflet
npm install -D @types/react-datepicker
```

---

## 🎯 Implementation Order (Priority)

### Week 1: Core Property Pages
1. ✅ **Day 1-2**: Seed database with Unsplash images
2. **Day 2-3**: Property Listings Page (Task 1)
3. **Day 4-5**: Property Detail Page (Task 2)
4. **Day 5-6**: Basic Search (Task 3.1, 3.2)
5. **Day 7**: Category Pages (Task 5)

### Week 2: Advanced Features
6. **Day 1-2**: Filter System (Task 4)
7. **Day 3**: Advanced Search (Task 3.3)
8. **Day 4-5**: Map Integration (Task 6)
9. **Day 6-7**: Testing, refinement, bug fixes

---

## 🎨 Design Specifications

### Property Listings Page
- **Grid**: 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- **Filters**: Sticky sidebar on desktop, bottom sheet on mobile
- **Sort**: Dropdown in top-right
- **Pagination**: 12 properties per page

### Property Detail Page
- **Layout**: 
  - Image gallery (60% width)
  - Booking card sticky on right (40% width)
  - Full-width description below
  - Reviews at bottom
- **Mobile**: Stack vertically

### Color Consistency
- Primary: `#0066CC` (Blue)
- Accent: `#00A3FF` (Light Blue)
- Use existing theme from `src/styles/theme.ts`

---

## 🧪 Testing Checklist

After each task:
- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Test with no data
- [ ] Test with large datasets
- [ ] Test filter combinations
- [ ] Test error states
- [ ] Test loading states

---

## 📊 Success Metrics

### Phase 2 Complete When:
- ✅ All 6 properties from seed show on landing page
- ✅ Property listings page displays all properties
- ✅ Filters work and update URL
- ✅ Property detail page shows all information
- ✅ Search returns relevant results
- ✅ Category pages (Rent/Buy/Lodge) work correctly
- ✅ Maps display property locations
- ✅ Mobile responsive on all pages
- ✅ All images load from Unsplash
- ✅ No console errors

---

## 🚀 Quick Start Guide

### Step 1: Seed the Database
```bash
# Push schema to database
npx prisma db push

# Run seed script
npx prisma db seed
```

### Step 2: Verify Data
```bash
# Open Prisma Studio
npx prisma studio

# Check that 6 properties exist
# Check that images are Unsplash URLs
```

### Step 3: Start Development
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Verify landing page shows 6 properties
```

### Step 4: Begin Implementation
Start with Task 1 (Property Listings Page)

---

## 📝 Development Notes

### Database Queries
- Use Prisma's `findMany` with `where` for filtering
- Use `orderBy` for sorting
- Use `skip` and `take` for pagination
- Include relations: `include: { host: true, reviews: true }`

### URL State Management
```typescript
// Read filters from URL
const searchParams = useSearchParams();
const propertyType = searchParams.get('type');

// Update URL with new filters
const router = useRouter();
router.push(`/properties?type=${type}&city=${city}`);
```

### Image Optimization
- All Unsplash images use optimized params: `w=1200&h=800&fit=crop&q=80`
- Next.js Image component for automatic optimization
- Remote patterns already configured in `next.config.ts`

---

## 🔄 Next Steps After Phase 2

### Phase 3: Authentication & User Features
- User profiles
- Booking system
- Favorites management
- User reviews

### Phase 4: Host Dashboard
- Property management
- Booking management
- Analytics

### Phase 5: Advanced Features
- Payment integration
- Real-time chat
- Email notifications
- Mobile app

---

## 💡 Tips for Success

1. **Build Incrementally**: Complete one task at a time
2. **Test Often**: Run `npm run dev` frequently
3. **Mobile First**: Design for mobile, enhance for desktop
4. **Reuse Components**: Leverage existing UI components
5. **Keep It Simple**: Start with basic features, enhance later
6. **Document as You Go**: Add comments to complex logic
7. **Git Commits**: Commit after each completed subtask

---

## 📞 Help & Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Leaflet**: https://react-leaflet.js.org
- **Unsplash API**: https://unsplash.com/developers

---

**Ready to build! Start with seeding the database, then move to Task 1. Good luck! 🚀**
