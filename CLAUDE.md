# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with Better Auth integration. The project uses:
- Next.js 15.3.3 with App Router and Turbopack
- React 19
- TypeScript
- Tailwind CSS v4
- Better Auth 1.2.9 for authentication
- Bun as the package manager and runtime

## Key Commands

### Development
```bash
bun dev          # Start development server with Turbopack
bun run build    # Build for production
bun start        # Start production server
bun run lint     # Run ESLint
```

## Architecture

### Authentication Setup
- Authentication is configured in `auth.ts` using Better Auth
- The auth instance is initialized but not yet fully configured

### Directory Structure
- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with fonts configuration
  - `page.tsx` - Home page (default Next.js starter)
  - `globals.css` - Global styles with Tailwind CSS
- `/public` - Static assets
- `auth.ts` - Better Auth configuration (needs implementation)

### TypeScript Configuration
- Strict mode enabled
- Path alias configured: `@/*` maps to root directory
- Module resolution set to bundler
- Target: ES2017

### Styling
- Tailwind CSS v4 with PostCSS
- Custom fonts: Geist Sans and Geist Mono from Google Fonts

## Better Auth Integration Notes

The project has Better Auth installed but the authentication system needs to be implemented. When working with Better Auth:
1. Configure the auth instance in `auth.ts` with appropriate providers and database
2. Create API routes for auth endpoints (typically `/api/auth/[...all]`)
3. Set up client-side auth hooks and components
4. Configure environment variables for auth providers

## Development Workflow

When developing features:
1. Use Turbopack for faster development builds (`bun dev`)
2. Follow Next.js App Router conventions for pages and API routes
3. Maintain TypeScript strict mode compliance
4. Run linting before commits (`bun run lint`)