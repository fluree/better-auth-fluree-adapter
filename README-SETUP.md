# Better Auth with Fluree Adapter Setup

This project demonstrates Better Auth with a custom Fluree JSON-LD database adapter.

## Prerequisites

1. **Fluree Database**: You need a running Fluree instance. You can:
   - Run Fluree locally using Docker: `docker run -p 58090:58090 fluree/fluree:latest`
   - Or download and run Fluree directly from https://flur.ee/

2. **Environment Variables**: Copy `.env.local.example` to `.env.local` and configure:
   ```
   FLUREE_URL=http://localhost:58090
   FLUREE_LEDGER=better-auth
   BETTER_AUTH_SECRET=your-secret-key-here
   ```

## Setup Instructions

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start Fluree (if not already running):
   ```bash
   docker run -p 58090:58090 fluree/fluree:latest
   ```

3. Create the Fluree ledger:
   ```bash
   bun run setup:fluree
   ```

4. Generate a secret for Better Auth:
   ```bash
   openssl rand -base64 32
   ```
   Add this to your `.env.local` as `BETTER_AUTH_SECRET`

5. Start the development server:
   ```bash
   bun dev
   ```

6. Open http://localhost:3000

## Testing Authentication

### Email/Password Authentication
1. Click "Sign up" to create a new account
2. Enter your name, email, and password
3. After signup, you'll be redirected to the dashboard
4. Sign out and try signing in again

### OAuth Authentication (Optional)
To test GitHub/Google login:

1. **GitHub OAuth**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
   - Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env.local`

2. **Google OAuth**:
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`

## How the Fluree Adapter Works

The custom Fluree adapter (`lib/auth/adapters/fluree-adapter.ts`) implements the Better Auth adapter interface:

- **Data Storage**: User, session, and account data are stored as JSON-LD documents
- **Querying**: Uses Fluree's query syntax to find and filter records
- **Transactions**: All create/update/delete operations use Fluree's transaction API
- **ID Management**: Records are stored with `@id` in format `model:uuid`

## Debugging

Enable debug logs by setting `NODE_ENV=development`. This will log all Fluree queries and transactions.

To inspect the Fluree data directly:
```bash
curl -X POST http://localhost:58090/fluree/query \
  -H "Content-Type: application/json" \
  -d '{
    "from": "better-auth",
    "select": {"?s": ["*"]},
    "where": {"@type": "user", "@id": "?s"}
  }'
```