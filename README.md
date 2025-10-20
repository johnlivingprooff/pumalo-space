# 🏡 Pumalo Space

**Find Your Perfect Property** - A modern rental property platform built with Next.js 15, React 19, and TypeScript.

![Pumalo Space](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🌟 Features

### Core Functionality
- 🏠 **Property Listings** - Browse properties for rent, buy, or lodge
- 🔍 **Advanced Search** - Filter by location, price, dates, and amenities
- ❤️ **Favorites** - Save properties to your wishlist
- 👤 **User Authentication** - Secure login and signup
- 🏡 **Host Dashboard** - List and manage your properties
- 📱 **Responsive Design** - Seamless experience across all devices

### Design System
- 🎨 **Blue Color Theme** - Calming and welcoming design
- ♿ **Accessibility** - WCAG compliant components
- 🎭 **Modern UI** - Inspired by Airbnb and Expedia
- ⚡ **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pumalo-space.git
cd pumalo-space
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
pumalo-space/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (main)/              # Main application pages
│   │   ├── layout.tsx           # Root layout with Header & Footer
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/              # Reusable React components
│   │   ├── layout/              # Header, Footer
│   │   ├── properties/          # Property-related components
│   │   ├── search/              # Search components
│   │   ├── filters/             # Filter components
│   │   ├── ui/                  # Generic UI components
│   │   └── user/                # User-related components
│   │
│   ├── types/                   # TypeScript type definitions
│   ├── lib/                     # Utility functions
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React contexts
│   └── styles/                  # Theme and styles
│
├── public/                      # Static assets
└── ARCHITECTURE.md              # Detailed architecture docs
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0066CC` - Links, CTAs, primary actions
- **Light Blue**: `#E6F2FF` - Backgrounds, highlights
- **Dark Blue**: `#003D7A` - Headers, important text
- **Accent Blue**: `#00A3FF` - Hover states, accents

### Typography
- **Headings**: Geist Sans (Bold)
- **Body**: Geist Sans (Regular)
- **Monospace**: Geist Mono

## 🧩 Key Components

### Header
- Logo (left-aligned)
- Navigation (Rent | Buy | Lodge)
- Search bar (center)
- User menu (right-aligned)

### Property Card
- Image carousel
- Favorite button
- Property details (location, price, rating)
- Property type badge

### Footer
- About section
- Support links
- Hosting information
- Legal links
- Social media

## 📱 Pages

### Main Pages
- `/` - Landing page with hero and featured properties
- `/properties` - All property listings with filters
- `/properties/[id]` - Property detail page
- `/rent` - Rental properties
- `/buy` - Properties for sale
- `/lodge` - Accommodation/lodges

### User Pages
- `/login` - User login
- `/signup` - User registration
- `/profile` - User profile
- `/favorites` - Saved properties
- `/bookings` - User bookings

### Host Pages
- `/host/dashboard` - Host dashboard
- `/host/create-listing` - Create new listing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Code Quality**: Biome (Linting & Formatting)
- **Font**: Geist Sans & Geist Mono

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
```

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] Type definitions
- [x] UI component library
- [x] Theme system
- [x] Header and Footer
- [x] Landing page

### Phase 2: Core Features (In Progress)
- [ ] Property listings page
- [ ] Property detail page
- [ ] Search functionality
- [ ] Filter system
- [ ] Authentication

### Phase 3: User Features
- [ ] User profile
- [ ] Favorites/Wishlist
- [ ] Booking flow
- [ ] Review system

### Phase 4: Host Features
- [ ] Host dashboard
- [ ] Property listing creation
- [ ] Booking management
- [ ] Analytics

### Phase 5: Advanced Features
- [ ] Payment integration
- [ ] Real-time chat
- [ ] Notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Lead**: Your Name
- **Design**: Design Team
- **Development**: Dev Team

## 📞 Contact

- Website: [pumalo.space](https://pumalo.space)
- Email: support@pumalo.space
- Twitter: [@PumaloSpace](https://twitter.com/pumalospace)

## 🙏 Acknowledgments

- Inspired by Airbnb and Expedia
- Built with Next.js and React
- Icons from Heroicons
- Fonts from Vercel

---

**Built with ❤️ by the Pumalo Space Team**

