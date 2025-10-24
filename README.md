# Godatin Hotel Booking & Management System

A modern, luxury hotel booking and management system built with Next.js, TypeScript, and MongoDB.

## Features

### Public Website
- **Homepage**: Beautiful hero section with hotel imagery and animations
- **Rooms**: Display all room types with pricing, amenities, and booking options
- **Gallery**: Interactive photo gallery with filtering by category
- **Contact**: Contact form and hotel information
- **Booking Flow**: Multi-step booking process with date selection and guest details

### Admin Dashboard
- **Overview**: Dashboard with key metrics and recent bookings
- **Booking Management**: View, search, and manage all bookings
- **Guest Management**: Manage guest information and booking history
- **Reports**: Occupancy and revenue analytics

### Room Types & Pricing
- **Alcove**: ₦15,000 per night
- **Deluxe**: ₦20,000 per night
- **Special Deluxe**: ₦25,000 per night
- **Executive Suite**: ₦35,000 per night
- **Diplomatic Suite**: ₦50,000 per night

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS with custom luxury theme
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **UI Components**: Custom components with Lucide React icons
- **Date Handling**: React DatePicker, date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GHMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://jabpa87_db_user:zHrL6SCTEdO5SGxK@godatin.ypscnoo.mongodb.net/?retryWrites=true&w=majority&appName=godatin
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   JWT_SECRET=your-jwt-secret-key-here
   PAYSTACK_PUBLIC_KEY=your-paystack-public-key
   PAYSTACK_SECRET_KEY=your-paystack-secret-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Initialize Database**
   ```bash
   # Start the development server
   npm run dev
   
   # In another terminal, initialize the database
   curl -X POST http://localhost:3000/api/init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Public Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin/login
   - Demo Credentials: `admin` / `password`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── bookings/      # Booking management
│   │   ├── rooms/         # Room management
│   │   └── init/          # Database initialization
│   ├── admin/             # Admin pages
│   ├── booking/           # Booking flow
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   ├── rooms/             # Rooms page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AdminDashboard.tsx
│   ├── BookingFlow.tsx
│   ├── ContactForm.tsx
│   ├── FeaturedRooms.tsx
│   ├── GalleryGrid.tsx
│   ├── Hero.tsx
│   ├── Navigation.tsx
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── models/            # MongoDB models
│   ├── mongodb.ts         # Database connection
│   └── init-db.ts         # Database initialization
├── data/                  # Static data
│   └── rooms.ts           # Room types and pricing
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Features Overview

### Public Website
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Luxury Theme**: Gold and navy color scheme with elegant typography
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Image Gallery**: High-quality hotel photos with filtering
- **Booking System**: Multi-step booking process with validation

### Admin Dashboard
- **Real-time Metrics**: Occupancy rates, revenue, and booking statistics
- **Booking Management**: Search, filter, and manage reservations
- **Guest Information**: Complete guest profiles and booking history
- **Responsive Interface**: Works on desktop and mobile devices

### Database Schema
- **Users**: Admin and staff accounts
- **Rooms**: Room types, pricing, and availability
- **Guests**: Guest information and booking history
- **Bookings**: Reservation details and status
- **Payments**: Payment records and transaction history

## API Endpoints

- `GET /api/rooms` - Fetch available rooms
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Fetch bookings with filters
- `POST /api/init` - Initialize database with room data

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Vercel Functions, Railway, or DigitalOcean
- **Database**: MongoDB Atlas (already configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact:
- Email: info@godatinhotel.com
- Phone: +234 123 456 7890

---

**Godatin Hotel** - Experience luxury and comfort in Warri, Delta State, Nigeria.



# GHMS


