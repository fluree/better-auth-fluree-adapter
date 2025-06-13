# Better Auth with Fluree Adapter

A complete authentication system built with [Next.js 15](https://nextjs.org), [Better Auth](https://better-auth.com), and [Fluree](https://flur.ee) JSON-LD database. This project demonstrates how to create a custom database adapter for Better Auth using Fluree as the backend database.

## Features

- 🔐 Email/password authentication
- 🌐 OAuth login support (Google OAuth implemented, extensible to others)
- 📊 User dashboard with profile information
- 🗄️ Fluree JSON-LD database integration
- 🔧 TypeScript support
- ⚡ Built with Bun for fast performance

## What's Included

This project extends a basic Next.js application with:

### Authentication System
- **Better Auth configuration** (`auth.ts`) - Central auth configuration with Fluree adapter
- **Custom Fluree adapter** (`lib/auth/adapters/fluree-adapter.ts`) - Complete database adapter implementation
- **API routes** (`app/api/auth/[...all]/route.ts`) - Auth endpoint handlers
- **Auth components** (`components/auth/`) - Login/signup forms and user interface

### Database Integration
- **Fluree setup script** (`scripts/setup-fluree.js`) - Database initialization
- **JSON-LD data modeling** - Semantic data storage and querying
- **CRUD operations** - Full adapter implementation with create, read, update, delete

### UI Components
- **Authentication forms** - shadcn/ui based login/signup interface
- **User dashboard** - Profile display with session management
- **Navigation** - App navigation with auth state handling

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- [Fluree](https://docs.flur.ee/overview/getting_started/installation) database server

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd try-better-auth
bun install
```

### 2. Start Fluree Database

Download and start Fluree server:

```bash
# Download Fluree (if not already installed)
# Follow instructions at: https://docs.flur.ee/overview/getting_started/installation

# Start Fluree server
fluree_start.sh
```

Fluree will be available at `http://localhost:58090`

### 3. Environment Setup

Create `.env.local` file:

```env
# Fluree Configuration
FLUREE_URL=http://localhost:58090
FLUREE_LEDGER=better-auth

# Better Auth Secret (generate a random string)
BETTER_AUTH_SECRET=your-secret-key-here

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Initialize Database

```bash
bun run setup:fluree
```

### 5. Start Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/
│   ├── api/auth/[...all]/route.ts    # Auth API endpoints
│   ├── dashboard/                    # Protected dashboard pages
│   └── page.tsx                      # Home page
├── components/
│   ├── auth/                         # Authentication components
│   └── ui/                           # shadcn/ui components
├── lib/
│   └── auth/adapters/
│       └── fluree-adapter.ts         # Custom Fluree adapter
├── scripts/
│   └── setup-fluree.js               # Database setup script
├── auth.ts                           # Better Auth configuration
└── package.json
```

## Fluree Adapter Implementation

The custom Fluree adapter (`lib/auth/adapters/fluree-adapter.ts`) implements all required Better Auth database operations:

- **create()** - Insert new records with JSON-LD format
- **findOne()** - Query single records with semantic search
- **findMany()** - Query multiple records with filtering/sorting
- **update()** - Update existing records using upsert operations
- **delete()** - Remove records from the database

### Key Features

- **JSON-LD Context** - Semantic data modeling with proper namespacing
- **Singleton Client** - Efficient connection management
- **Error Handling** - Comprehensive error logging and recovery
- **Type Safety** - Full TypeScript support with proper typing

## Testing Authentication

### Email/Password
1. Visit `/` and click "Sign Up"
2. Create account with email/password
3. Sign in with credentials
4. Access protected dashboard

### Google OAuth
1. Create a Google OAuth application in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Add credentials to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
4. Sign in with Google button on the login page

## Database Schema

The adapter uses semantic JSON-LD format for data storage:

```json
{
  "@context": {
    "user": "https://schema.better-auth.com/user/"
  },
  "@id": "user:123",
  "@type": "user",
  "user:email": "user@example.com",
  "user:name": "John Doe",
  "user:createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Customization

### Adding New Fields
Modify the adapter's data transformation functions to handle additional user fields.

### OAuth Providers
Add new providers in `auth.ts` configuration following Better Auth documentation.

### UI Styling
Customize components in `components/` directory using Tailwind CSS classes.

## Development

### Running Tests
```bash
bun test
```

### Type Checking
```bash
bun run type-check
```

### Linting
```bash
bun run lint
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production.

### Database
Deploy Fluree database server and update `FLUREE_URL` accordingly.

### Application
Deploy to Vercel, Netlify, or your preferred platform:

```bash
bun run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## Resources

- [Better Auth Documentation](https://better-auth.com)
- [Fluree Documentation](https://docs.flur.ee)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## License

MIT License - see LICENSE file for details.