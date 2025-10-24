# LinkBoard - Social Links Profile Platform

## Overview

LinkBoard is a full-stack web application that enables users to create personalized landing pages with social media links and profile information. Built with React, Express, and PostgreSQL, it provides a "link in bio" solution where users can showcase multiple social media profiles and links through a single shareable URL. The platform tracks engagement metrics including profile views and link clicks, offering users insights into their audience reach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

**Design Decisions**
- **Component Library Choice**: Uses shadcn/ui for a consistent, accessible component system with the "new-york" style preset. This provides pre-built, customizable components while maintaining full control over the code.
- **Routing Strategy**: Wouter is chosen over React Router for its minimal bundle size (~1KB) while providing essential routing capabilities. The app uses dynamic routes (`:username`) to serve user profiles.
- **State Management**: TanStack Query handles all server state, eliminating the need for Redux/Context API for API data. This provides automatic caching, background refetching, and loading/error states.
- **Form Validation**: Zod schemas are shared between frontend and backend (`@shared/schema`), ensuring type safety and validation consistency across the stack.

### Backend Architecture

**Technology Stack**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Build Tool**: esbuild for production builds, tsx for development

**Design Decisions**
- **ORM Choice**: Drizzle ORM is selected for its TypeScript-first approach, minimal runtime overhead, and SQL-like syntax. The schema is defined in TypeScript and shared across the application.
- **Storage Abstraction**: An `IStorage` interface in `server/storage.ts` abstracts data operations. Currently implemented with `MemStorage` (in-memory) for development, designed to be replaced with a PostgreSQL implementation using Drizzle ORM.
- **API Design**: RESTful endpoints under `/api/*` prefix for clear separation from frontend routes. The server logs API requests with response times for monitoring.
- **Development Setup**: Uses Vite middleware in development for HMR (Hot Module Replacement) and serves static files in production.

### Data Layer

**Database Schema** (defined in `shared/schema.ts`)

**Profiles Table**
- Stores user profile information including username (unique), display name, bio, profile image URL
- Tracks engagement metrics: profile views and link clicks
- Uses PostgreSQL UUID for primary keys

**Social Links Table**
- Stores individual social media/custom links for each profile
- Supports multiple platforms: Instagram, Twitter/X, LinkedIn, TikTok, YouTube, GitHub, Website, Newsletter, Custom
- Includes ordering system for link display sequence
- Active/inactive toggle for link visibility

**Schema Validation**
- Drizzle Zod integration generates runtime validators from database schema
- Insert and update schemas strip auto-generated fields (IDs, default values)
- Shared schemas ensure frontend and backend use identical validation rules

### External Dependencies

**Database & Infrastructure**
- **Neon (@neondatabase/serverless)**: Serverless PostgreSQL database with edge runtime support and connection pooling
- **Drizzle ORM (drizzle-orm)**: Type-safe ORM for PostgreSQL with migration support via drizzle-kit

**UI Component Libraries**
- **Radix UI**: Comprehensive set of unstyled, accessible React components (accordion, dialog, dropdown, select, etc.)
- **shadcn/ui**: Component collection built on Radix UI with Tailwind CSS styling
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Touch-friendly carousel component

**Form & Validation**
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Integrates Zod validation with React Hook Form

**Styling & Utilities**
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **class-variance-authority (CVA)**: Utility for creating variant-based component styles
- **clsx & tailwind-merge**: Class name manipulation and merging utilities
- **date-fns**: Date manipulation and formatting library

**Development Tools**
- **Vite**: Frontend build tool and dev server with React plugin
- **TypeScript**: Type safety across the entire stack
- **esbuild**: Fast JavaScript bundler for backend production builds
- **tsx**: TypeScript execution for Node.js during development
- **@replit/vite-plugin-***: Replit-specific development plugins for error overlay, cartographer, and dev banner

**Session Management**
- **express-session** with **connect-pg-simple**: PostgreSQL-backed session store (dependencies referenced but implementation pending)

**Fonts**
- **Google Fonts**: Inter (sans-serif), Poppins (display), loaded via CDN with subset optimization