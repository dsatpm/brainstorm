
## Directory & File Structure

- **Use the `app/` directory** for routes, layouts, and server components by default.  
- **Page files:** Use `page.tsx` in each route folder.  
- **Layout files:** Define shared layouts in `layout.tsx` at the root of each route segment.  
- **Error & Loading States:** Include `error.tsx` and `loading.tsx` for custom error and loading UI per segment.  
- **Metadata:** Use `metadata.ts` to define per-route SEO metadata.
- **Components folder:** Create `/components` at project root for reusable components, grouping by feature when needed.
- **Styles:** Use `/styles` or colocate CSS modules next to components as `Component.module.css` or `Component.module.scss`.

## Naming Conventions

- **Folders & Files:** Use kebab-case for folders and files, except special files like `page.tsx`, `layout.tsx`.  
  - Example: `/user-profile/page.tsx`, `/blog-post/[slug]/layout.tsx`
- **Components:** Use PascalCase for component filenames.  
  - Example: `UserCard.tsx`, `NavBar.tsx`
- **API Routes:** Under `app/api`, use folder names for route segments and `route.ts` for the handler.  
  - Example: `app/api/users/route.ts`.

## Data Fetching

- **Server Components:** Fetch data directly in server components or layouts using `async` functions.  
  ```ts
  export default async function UsersPage() {
    const users = await getUsers();
    return <UserList users={users} />;
  }
  ```
- **Client Components:** Mark interactive components with `'use client'` at the top. Use client-side data libraries like SWR or React Query.  
- **Caching & Revalidation:** Use `fetch` options for caching:  
  ```ts
  const res = await fetch('/api/data', { next: { revalidate: 60 } });
  ```

## Styling

- **CSS Modules:** Prefer CSS Modules for component-scoped styles.  
- **Utility-First CSS:** Integrate Tailwind CSS for rapid styling; colocate Tailwind classes in JSX.  
- **Global Styles:** Import global CSS (e.g., resets, typography) in `app/layout.tsx` or `pages/_app.tsx`.

## Routing & Navigation

- **Dynamic Routes:** Use brackets in folder names: `/[id]`, `/[...slug]`.  
- **Linking:** Use `next/link` for client-side transitions.  
  ```tsx
  <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>Read more</Link>
  ```

## Images & Assets

- **next/image:** Always use Next.js `Image` component for optimized images.  
  ```tsx
  import Image from 'next/image';
  <Image src="/avatar.png" alt="Avatar" width={80} height={80} />
  ```
- **Static Assets:** Place public assets in `/public` and reference with absolute paths.

## Environment Variables

- **Naming:** Prefix client-exposed variables with `NEXT_PUBLIC_`.  
- **Type Safety:** Define types in `env.d.ts` or use a helper like `zod` to validate in `next.config.js`.

## Configuration

- **next.config.js:** Centralize custom webpack, redirects, rewrites, and image domains.  
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: { domains: ['example.com'] },
    experimental: { appDir: true }
  };
  module.exports = nextConfig;
  ```
- **ESLint & Prettier:** Extend `next/core-web-vitals` and integrate Prettier.  
  ```jsonc
  // .eslintrc.json
  {
    "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"]
  }
  ```

## Performance & SEO

- **Metadata API:** Use the built-in `Metadata` export (`export const metadata`) for titles, descriptions, and Open Graph data.  
- **Code Splitting:** Leverage dynamic imports for large modules:  
  ```ts
  const Chart = dynamic(() => import('../components/Chart'), { ssr: false });
  ```
- **Accessibility:** Ensure all interactive elements have ARIA labels and semantic HTML.

## Testing & Quality

- **Unit Tests:** Use Jest with React Testing Library for component tests.  
- **End-to-End Tests:** Use Playwright or Cypress; organize tests under `/tests`.  
- **Type Safety:** Enable `strict` mode in `tsconfig.json` and address all compiler errors.


*Following these conventions will help keep your Next.js projects consistent, scalable, and performant.*

