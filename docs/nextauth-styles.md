
## Installation & Setup

```bash
npm install next-auth
# or
yarn add next-auth
```

- Use the `app/api/auth/[...nextauth]/route.ts` (or `.js`) in Next.js 13+.
- Always secure your secret (`NEXTAUTH_SECRET`) via environment variables.

## File Structure & Naming

```
app/
  api/
    auth/
      [...nextauth]/
        route.ts        # NextAuth handler
        types.d.ts?     # (Optional) extend default types
```

- Keep all auth-related code under a single `[...nextauth]` route.
- Name your adapter file `adapter.ts` if using a custom database adapter.

## Provider Configuration

- Define providers in an exported `authOptions` object.
- Use clear naming for environment variables: e.g. `GITHUB_ID`, `GITHUB_SECRET`.

```ts
import GitHubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...other providers
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
```

## Callbacks & Events

- Use callbacks to enrich JWT/session, e.g., adding roles or permissions.
- Keep logic minimal and move complex code to utilities.

```ts
callbacks: {
  async jwt({ token, user }) {
    if (user) token.id = user.id;
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id;
    return session;
  },
},
```

## Session & JWT Handling

- Prefer JWT sessions for stateless performance, and database sessions for advanced session management.
- Configure `session: { strategy: 'jwt' | 'database' }` explicitly.

## Adapters & Database

- Use official adapters (e.g., Prisma, TypeORM) when possible.
- For custom schemas, extend adapter interface in `types.d.ts`.

```ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ...
};
```

## TypeScript Integration

- Enable `types.d.ts` in `tsconfig.json` for module augmentation.

```ts
// types.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
    };
  }
}
```

## Environment Variables

- Prefix all NextAuth variables with `NEXTAUTH_` or provider names.
- List required variables in `.env.example`.

```env
NEXTAUTH_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

## Custom Pages & Theming

- Override default pages via `pages` option.

```ts
pages: {
  signIn: '/auth/signin',
  error: '/auth/error',
},
```
- Use a consistent UI library/theme for all auth pages.

## Security Best Practices

- Rotate `NEXTAUTH_SECRET` periodically for security.
- Use HTTPS in production and set `cookies: { secure: true }`.
- Limit callback URLs via `NEXTAUTH_URL`.

## Error Handling & Logging

- Add custom `events` for auditing sign-ins/sign-outs.

```ts
events: {
  createUser: ({ user }) => console.log('New user:', user.id),
},
```
- Surface meaningful error messages to users and log full errors server-side.


*Following these conventions ensures a robust and secure authentication layer in your Next.js apps.*

