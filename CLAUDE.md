# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build for production with Turbopack 
- `npm start` - Start production server
- `npm run lint` - Run ESLint with TypeScript support (configured to warn on `any` types)
- `npm run build:turbo` - Alternative build with Turbopack

**Note**: No test framework configured - project uses production deployment testing

## Project Overview

This is a **GitHub Value Tracker** built with Next.js 15 that analyzes and ranks GitHub repositories based on commercial value potential. The app uses the GitHub API to fetch repository data and applies a sophisticated scoring algorithm with AI-powered analysis.

## Core Architecture

**Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS 4
**API Layer**: Next.js API routes (`/api/github`) with multiple action handlers
**Styling**: Glassmorphism design with dark mode support using Tailwind CSS and Lucide icons
**Data Sources**: GitHub API, GHArchive integration, and fallback mock data
**Analysis**: Multi-layered value scoring with AI-powered project insights

## API Architecture

The main API route (`/api/github/route.ts`) handles multiple actions:
- `projects` - Returns tracked projects with value metrics
- `discover` - Finds new high-value repositories using trending data
- `search` - Advanced search with filters (language, stars, topics)
- `trending` - Gets trending repositories from GitHub API
- `analytics` - Detailed project analytics and metrics

**Fallback Strategy**: Always degrades gracefully to mock data when GitHub token unavailable or API limits hit.

## Key Components & Libraries

### Core Business Logic
- `src/lib/github-api.ts` - GitHub API wrapper with rate limiting
- `src/lib/value-calculator.ts` - Multi-factor value scoring algorithm
- `src/lib/ai-analyzer.ts` - AI-powered project analysis with predefined templates
- `src/lib/gharchive-client.ts` - GHArchive integration for trend analysis
- `src/lib/mock-data.ts` - Comprehensive fallback data

### UI Components
- `src/components/ProjectCard.tsx` - Repository display with value metrics
- `src/components/AdvancedSearch.tsx` - Search interface with filters
- `src/components/DiscoveryPanel.tsx` - New project discovery sidebar
- `src/components/LanguageSwitcher.tsx` - Internationalization support

### Data Types
- `src/types/github.ts` - Complete TypeScript interfaces for all data structures

## Value Scoring System

The `ValueCalculator` evaluates repositories using 4 weighted criteria:
- **Growth Potential (30%)** - Star growth trends, fork ratios, project age
- **Technical Maturity (25%)** - Documentation quality, licensing, update frequency
- **Commercial Viability (25%)** - Business keywords, market relevance, popularity
- **Community Activity (20%)** - Contributors, issue resolution rates, engagement

## AI Analysis Framework

The `AIAnalyzer` provides contextual business insights using predefined templates for common project types:
- Workflow automation (n8n-style)
- Backend-as-a-Service (Supabase-style)
- Headless CMS systems
- Analytics platforms
- No-code database tools
- React frameworks

Each analysis includes market problem, user catalyst, developer retention factors, and revenue generation potential.

## Data Sources & Integration

### Primary Data Sources
1. **GitHub API** - Repository metadata, contributors, commits, releases
2. **GHArchive** - Historical GitHub event data for trend analysis
3. **Seed Projects** - Curated list of 140+ high-value repositories across categories

### Search Capabilities
- Multi-language support (TypeScript, JavaScript, Python, Go)
- Topic-based filtering (AI, SaaS, automation, productivity)
- Star count and age filtering
- Advanced GitHub search query building

## Environment Configuration

Create `.env.local`:
```
GITHUB_TOKEN=your_github_personal_access_token
```

**Demo Mode**: App automatically uses comprehensive mock data when token unavailable.

## Development Patterns

### Error Handling
- Graceful degradation to mock data on API failures
- Comprehensive try-catch blocks with detailed error logging
- Rate limiting awareness with fallback strategies

### Performance Optimization
- Parallel API calls using Promise.all()
- Selective data fetching (top 20 seed projects for fast response)
- Client-side caching through component state

### Code Organization
- Clear separation between data fetching, processing, and presentation
- Modular architecture with single-responsibility classes
- TypeScript interfaces for all data structures

## Path Aliases & Configuration

- Uses `@/*` path aliases configured in `tsconfig.json` pointing to `./src/*`
- ESLint config in `eslint.config.mjs` extends Next.js rules with `@typescript-eslint/no-explicit-any` set to warning
- Next.js 15 with App Router, Turbopack support, and strict TypeScript configuration