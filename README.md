# ExploreLocal — Discover Local. Experience More.

A complete, modern, responsive, production-oriented web application that connects travelers directly with authentic local homestays, indigenous tour guides, cultural workshops, and regional traditional businesses.

---

## 🌟 Key Features

1. **24 Full-Featured Application Pages**:
   - **Public Tourism & Discovery**:
     - `Home Page` (`/`) — Hero banner, smart search bar with filters, featured destinations, popular homestays, recommended guides, living traditions, local businesses, customer testimonials, why choose ExploreLocal, and provider CTA.
     - `Explore Destinations` (`/destinations`) — Regional directory with state & keyword filtering.
     - `Destination Details` (`/destinations/:id`) — Hero visual, attractions, transit logistics, interactive OpenStreetMap, and tabs for local homestays, guides, experiences, and shops.
     - `Homestays Directory` (`/homestays`) — City filter, price range slider, guest count filter, sorting (price, rating, newest).
     - `Homestay Details` (`/homestays/:id`) — Multi-photo gallery, room types selector, host profile, house rules, amenities, OpenStreetMap, guest reviews, and sticky booking engine with real-time room availability validation.
     - `Local Tour Guides` (`/guides`) — Guide directory with experience years, language filters, and daily guiding rate.
     - `Guide Profiles` (`/guides/:id`) — Bio, specializations, verified badge, spoken languages, direct booking widget, and reviews.
     - `Cultural Experiences` (`/experiences`) — Hands-on workshops, cooking classes, village walks, and fireside desert musicals.
     - `Local Businesses` (`/businesses`) — Traditional shops, weaver guilds, spice depots, and organic farm cooperatives.
     - `Business Details` (`/businesses/:id`) — Operating hours, address, phone, storefront links, and reviews.
     - `Search Results` (`/search`) — Multi-category search engine querying database records with category filter tabs.
   - **Booking & Checkout Engine**:
     - `Booking Page` (`/book`) — Server-side price calculation (base, 5% platform fee, 12% GST), lead guest information, and date adjustments.
     - `Payment Page` (`/payment/:bookingId`) — Order reference, breakdown, and clearly labeled simulated development sandbox with Card, UPI, and Netbanking tabs.
     - `Booking Confirmation Page` (`/booking-confirmation/:bookingId`) — Unique reference (`EL-2026-H...`), printable receipt, host contact details, and check-in logistics.
   - **Authentication & Roles**:
     - `User Login` (`/login`) — Tourist, Provider, and Admin login with 1-click Demo shortcuts.
     - `User Registration` (`/register`) — Register as a traveler or local host/guide.
     - `Tourist Dashboard` (`/tourist/dashboard` & `/bookings/my`) — Active reservations, cancellation workflow with reasons, and spend analytics.
     - `Provider Dashboard` (`/provider/dashboard`) — Host earnings, booking requests approval/rejection, and new homestay listing modal.
     - `Admin Dashboard` (`/admin/dashboard`) — Platform GMV telemetry, user management, and 1-click provider verification approval.
     - `User Profile` (`/profile`) — Avatar, phone, bio, and role details.
   - **Company & Compliance**:
     - `About Us` (`/about`)
     - `Contact Us` (`/contact`)
     - `Privacy Policy` (`/privacy`)
     - `Terms & Conditions` (`/terms`)

2. **Guaranteed Double-Booking Prevention**:
   - Backend prevents overlapping confirmed reservations for the exact same room using real-time date conflict analysis.
   - Real-time `/api/homestays/check-availability` endpoint feeds the frontend booking card.

3. **Role-Based Access Control (RBAC)**:
   - **TOURIST**: Browse, book, pay, cancel eligible bookings, leave reviews, view receipts.
   - **SERVICE_PROVIDER**: Register homestays, tour packages, experiences, accept/reject bookings, view guest contact details, track earnings.
   - **ADMINISTRATOR**: Supervise user roles, approve/reject provider accounts, review platform GMV metrics, and manage listings.

4. **Security & Data Integrity**:
   - bcrypt password hashing (10 salt rounds).
   - JWT authentication with Bearer tokens and 7-day expiration.
   - Zod server-side request schema validation.
   - Helmet security headers and CORS protection.
   - Rate limiting (1,000 requests per 15-minute window).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router DOM v7, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Zod, Helmet, Cors, express-rate-limit |
| **Database & ORM** | PostgreSQL (with SQLite for zero-config local development), Prisma ORM v5 |
| **Authentication** | JWT, bcryptjs, Role-based middleware |
| **Maps** | Interactive OpenStreetMap (zero API key dependency) |
| **Payment** | Sandboxed Development Gateway (UPI, Card, Netbanking) with Razorpay production test hooks |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Backend Setup
```bash
cd backend
npm install

# Push database schema (creates SQLite dev.db automatically)
npx prisma db push

# Populate database with rich realistic seed data (Destinations, Homestays, Guides, Bookings)
npx ts-node prisma/seed.ts

# Start the Backend Server (Runs on http://localhost:5001)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

Visit **http://localhost:5173** in your browser!

---

## 🔑 Demo Login Accounts

Pre-seeded accounts are provided with convenient 1-click fill buttons on the `/login` page:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@explorelocal.com` | `admin123` | Full control, approve providers, platform GMV |
| **Service Provider** | `kerala.homestay@explorelocal.com` | `provider123` | Host console, accept/reject bookings, listings |
| **Service Provider** | `himalayan.host@explorelocal.com` | `provider123` | Host console, mountain retreat management |
| **Tourist** | `tourist@explorelocal.com` | `tourist123` | Book accommodations, mock pay, reviews |

---

## 🐘 Switching to PostgreSQL in Production

ExploreLocal is built with Prisma and includes both SQLite (for zero-config local run) and production PostgreSQL schemas:

1. In `backend/.env`, set your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/explorelocal?schema=public"
   ```
2. In `backend/prisma/schema.prisma`, update the datasource block:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   *(Or copy `backend/prisma/schema.postgresql.prisma` to `schema.prisma`)*
3. Run migrations and re-seed:
   ```bash
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```

---

## 🧪 Automated Testing

ExploreLocal includes an automated end-to-end test suite (`backend/src/test-e2e.ts`) verifying:
1. API Health Check
2. Tourist Login & JWT generation
3. Admin Login & JWT generation
4. Role-based authorization barrier (Tourist rejected from admin endpoint with 403)
5. Admin dashboard telemetry metrics
6. Database destination queries
7. City-based homestay filtering
8. Booking creation and pricing breakdown (base + 5% fee + 12% tax)
9. **Collision prevention against overlapping room reservations (returns 409 Conflict)**
10. Mock payment processing and state transition to `CONFIRMED`
11. Review submission and automatic recalculation of listing star rating
12. Administrator provider approval workflow

To execute the test suite:
```bash
cd backend
npx ts-node src/test-e2e.ts
```

---

## 📦 Production Builds

```bash
# Build backend TypeScript
cd backend
npm run build

# Build frontend production bundle
cd ../frontend
npm run build
```

Both build commands complete cleanly with **0 errors**.
