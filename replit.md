# CounselSync - Local Counselling CRM

## Overview

CounselSync is a privacy-first, offline counselling practice management system designed for mental health professionals. The application emphasizes local-only data storage with no cloud synchronization, providing counselors with a secure, encrypted environment to manage client records, session notes, and treatment frameworks. The system features AI-powered note generation using local LLM models (Ollama) and audio transcription capabilities (Whisper), all while maintaining complete data sovereignty and HIPAA-like privacy standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing an accessible and customizable component library. The design system follows a "New York" style variant with Tailwind CSS for styling.

**State Management**: 
- TanStack Query (React Query) for server state management and data fetching
- React hooks for local component state
- No global state management library - data flows through React Query's cache

**Routing**: Wouter for lightweight client-side routing, providing a minimal alternative to React Router.

**Design Philosophy**: 
- System-based approach inspired by Linear, Notion, and professional EMR systems
- Prioritizes trust, clarity, and efficient workflows
- Offline-first visual indicators throughout the UI
- Clear information hierarchy distinguishing client data, session notes, and AI-generated content

**Typography**: Uses Google Fonts (Inter for UI/body, JetBrains Mono for technical data) with a defined hierarchy for headers, body text, labels, and timestamps.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with resource-based endpoints:
- `/api/clients` - Client CRUD operations
- `/api/sessions` - Session management
- `/api/notes` - Session notes
- `/api/frameworks` - Treatment frameworks
- `/api/chat` - AI assistant interactions

**Storage Layer**: Abstract storage interface (`IStorage`) allowing for pluggable storage implementations. Currently uses an in-memory storage implementation, but designed to support database backends (likely PostgreSQL via Drizzle ORM based on configuration).

**Database ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless driver. Schema includes:
- `clients` - Client demographic and contact information
- `sessions` - Session records with date, duration, type, status, audio file paths, and transcriptions
- `notes` - Session notes with AI-generated flag
- `frameworks` - Treatment frameworks and therapeutic approaches
- `framework_files` - Associated framework documentation
- `chat_messages` - AI assistant conversation history

**Data Validation**: Zod schemas generated from Drizzle table definitions ensure type-safe data validation across the application.

### Local AI Integration

**LLM Service**: Designed to integrate with Ollama running locally (llama3.1:8b model) for:
- AI-powered clinical note generation from session transcriptions
- Treatment framework suggestions
- Chat-based clinical assistant for therapeutic guidance

**Audio Transcription**: Planned integration with Whisper (local model) for converting session audio recordings to text transcriptions.

**Privacy Rationale**: All AI processing occurs locally to maintain complete data privacy and avoid sending sensitive client information to external services.

### Authentication & Security

**Current State**: No authentication system implemented (designed for single-user, local-only deployment).

**Data Protection**: 
- All data stored locally on the user's machine
- No cloud synchronization or external API calls with client data
- Encryption at rest planned (mentioned in design guidelines)
- Application explicitly designed to operate offline

### Development & Build System

**Development**: 
- Vite dev server with HMR for frontend
- tsx for running TypeScript server code in development
- Replit-specific plugins for development environment integration

**Build Process**:
- Vite builds the React frontend to `dist/public`
- esbuild bundles the Express server to `dist/index.js`
- Separate build commands for client and server

**Type Safety**: Shared TypeScript types between frontend and backend via `@shared` path alias, ensuring consistent data structures across the stack.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless UI component primitives for accessibility (@radix-ui/* packages)
- **shadcn/ui**: Pre-built component library using Radix primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library
- **class-variance-authority & clsx**: Utility for conditional CSS class composition

### Data Management
- **TanStack Query v5**: Server state management and caching
- **React Hook Form**: Form state management with Zod validation
- **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL
- **Zod**: Schema validation and TypeScript type inference

### Database
- **PostgreSQL**: Primary database (via Neon serverless driver @neondatabase/serverless)
- **Drizzle Kit**: Database migration tool configured with `drizzle.config.ts`

### Planned Local Services
- **Ollama**: Local LLM runtime for AI-powered features (llama3.1:8b)
- **Whisper**: Local audio transcription model

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side bundler
- **TypeScript**: Type safety across the stack
- **Wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (configured but session management not yet implemented)

### Styling & Theming
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- Custom CSS variables for light/dark theme support
- Theme toggle component for user preference