# Replit.md

## Overview

This is a full-stack travel booking application built with React and Express.js that allows users to search for flights, view deals, and manage bookings. The application features a modern airline booking interface with support for group travel deals and marketplace functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components and Ant Design
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds
- **UI Components**: Combination of custom shadcn/ui components and Ant Design components

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Data Storage**: PostgreSQL database with Drizzle ORM (migrated from in-memory storage)

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Database migration files

## Key Components

### Frontend Components
1. **Layout Components**
   - Header with navigation and user menu
   - Responsive design with mobile support

2. **Booking Components**
   - Quick booking form with trip type selection
   - Search functionality for flights
   - Form validation with React Hook Form

3. **Deals Components**
   - Hot deals section with flash sales
   - Discount badges and pricing display
   - Group travel options

4. **Marketplace Components**
   - Package search and filtering
   - Travel package listings
   - Booking functionality

5. **Bookings Components**
   - Recent bookings table
   - Booking status management
   - Booking history display

### Backend API Endpoints
1. **GET /api/deals** - Retrieve all available deals
2. **GET /api/packages** - Search travel packages (with optional destination filter)
3. **GET /api/bookings** - Get bookings (with optional user filter)
4. **POST /api/search** - Create search requests for flights

### Database Schema

**Core User & Authentication:**
- **users** - User authentication and profile data

**Flight Management:**
- **flights** - Flight inventory with schedules, pricing, and availability
- **flightBookings** - Complete flight booking records with status tracking
- **passengers** - Detailed passenger information for each booking

**Deals & Packages:**
- **deals** - Flight deals with pricing and availability (legacy)
- **packages** - Travel packages with features and pricing

**Bidding System:**
- **bids** - User bids on flights with status management and expiration

**Payment Processing:**
- **payments** - Payment transactions with gateway integration
- **refunds** - Refund processing and tracking

**Legacy & Analytics:**
- **bookings** - Legacy booking system (maintained for compatibility)
- **searchRequests** - User search history and preferences

**Key Features:**
- Complete flight booking workflow from search to payment
- Bid creation and management system
- Comprehensive payment and refund tracking
- Passenger manifest management
- Multi-status booking lifecycle (pending → confirmed → completed)
- Payment integration ready (Stripe, PayPal, Square)

## Data Flow

1. **Search Flow**: User submits search → API validates request → Returns search results
2. **Booking Flow**: User selects deal/package → Creates booking record → Updates availability
3. **Deal Display**: Frontend fetches deals → Displays with pricing and availability → Real-time updates

The application uses React Query for efficient data fetching and caching, with optimistic updates for better user experience.

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle with PostgreSQL dialect
- **UI Libraries**: Radix UI primitives, Ant Design components
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation
- **Styling**: Tailwind CSS with CSS variables for theming

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server with HMR
- **ESBuild**: Production bundling for backend
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with proxy to Express backend
- Express server runs on separate port with automatic restart
- Shared TypeScript configuration for consistent types

### Production Build
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Static Serving**: Express serves frontend bundle in production
4. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Development: Local development with file watching
- Production: Single Node.js process serving both API and static files
- Database: PostgreSQL connection via DATABASE_URL environment variable

The application is structured as a monorepo with clear separation between client and server code, making it easy to develop and deploy as a single unit while maintaining code organization.