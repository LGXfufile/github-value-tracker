# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build for production with Turbopack 
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

This is a **GitHub Value Tracker** built with Next.js 15 that analyzes and ranks GitHub repositories based on commercial value potential. The app uses the GitHub API to fetch repository data and applies a sophisticated scoring algorithm.

### Core Architecture

**Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS 4
**API Layer**: Next.js API routes (`/api/github`) handling GitHub API integration
**Styling**: Glassmorphism design with dark mode, using Tailwind CSS and Lucide icons
**Data Fetching**: Client-side fetch to internal API routes, with fallback to mock data

### Key Components Structure

- `src/app/page.tsx` - Main dashboard with filtering, sorting, and project display
- `src/components/` - Reusable UI components:
  - `ProjectCard.tsx` - Individual project display with metrics
  - `StatsOverview.tsx` - Dashboard statistics
  - `FilterPanel.tsx` - Search and filtering controls  
  - `DiscoveryPanel.tsx` - New project discovery sidebar

### Business Logic

- `src/lib/github-api.ts` - GitHub API wrapper (`GitHubAPI` class)
- `src/lib/value-calculator.ts` - Value scoring algorithm (`ValueCalculator` class)
- `src/lib/mock-data.ts` - Fallback data when GitHub token unavailable
- `src/types/github.ts` - TypeScript interfaces for GitHub data

### Value Scoring Algorithm

The `ValueCalculator` evaluates repositories using 4 weighted criteria:
- **Growth Potential (30%)** - Star growth, fork ratio, project age
- **Technical Maturity (25%)** - Documentation, license, recent updates
- **Commercial Viability (25%)** - Business keywords, popularity 
- **Community Activity (20%)** - Contributors, issue resolution, engagement

### API Integration

**GitHub Token**: Set `GITHUB_TOKEN` environment variable for live data
**Demo Mode**: Automatically uses mock data when token unavailable
**Endpoints**: 
- `/api/github?action=projects` - Get tracked projects with metrics
- `/api/github?action=discover` - Discover new high-value projects
- `/api/github?action=trending` - Get trending repositories

### Data Flow

1. Client fetches from internal API routes
2. API routes use GitHub API or return mock data  
3. `ValueCalculator` processes raw GitHub data into scored metrics
4. Components display filtered and sorted results

### Environment Setup

Create `.env.local`:
```
GITHUB_TOKEN=your_github_personal_access_token
```

The app gracefully degrades to demo mode with mock data when the token is missing.