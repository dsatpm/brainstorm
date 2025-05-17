
## File & Module Naming

- **File Names:** Use kebab-case (lowercase with hyphens) for filenames, ending in `.ts` or `.tsx` for React components.
  - Examples: `user-service.ts`, `order-list.component.tsx`
- **Directory Structure:** Organize by feature or domain rather than file type.
  - Example:
    ```
    src/
      users/
        user-service.ts
        user-repository.ts
        user.component.tsx
      orders/
        order-service.ts
    ```

## Export & Import Conventions

- **Prefer named exports** over default exports for clarity and easier refactoring.
  ```ts
  // good
  export function calculateTotal() {}

  // avoid
  export default function calculateTotal() {}
  ```
- **Index files** (`index.ts`) may re-export modules:
  ```ts
  // users/index.ts
  export * from './user-service';
  export * from './user.component';
  ```
- **Import ordering:**
  1. External modules (npm packages)
  2. Absolute imports (project aliases)
  3. Relative imports

## Naming Conventions

- **Types & Interfaces:** Use `PascalCase` and prefix interfaces with `I` only if interfacing with external or legacy code.
  - Example: `interface User { ... }`
- **Classes:** Use `PascalCase` and nouns.
  - Example: `class UserService { ... }`
- **Enums:** Use `PascalCase` and singular form.
  - Example: `enum UserStatus { Active, Inactive }`
- **Constants:** Use `UPPER_SNAKE_CASE`.
  - Example: `const MAX_RETRY = 3;`
- **Variables & Functions:** Use `camelCase`.
  - Example: `function fetchUsers(): Promise<User[]> {}`

## Type Definitions

- **Explicit return types** for all exported functions and public methods.
  ```ts
  export function getUser(id: string): Promise<User | null> {}
  ```
- **Use union types** for values that can be multiple types.
  ```ts
  type ID = string | number;
  ```
- **Leverage type inference** for local variables when the type is obvious.

## Interfaces vs. Types

- **Interfaces** for object shapes and public API definitions.
- **Type aliases** for complex unions, intersections, and mapped types.
  ```ts
  type PartialUser = Partial<User>;
  ```

## Generics

- **Name type parameters** clearly (e.g., `T`, `U`, or domain-specific like `Entity`, `DTO`).
  ```ts
  function identity<T>(value: T): T {
    return value;
  }
  ```
- **Constrain generics** where appropriate.
  ```ts
  function getById<T extends { id: string }>(item: T): T { ... }
  ```

## Async & Promises

- **Use `async/await`** for readability.
  ```ts
  async function fetchData(): Promise<Data> {
    const resp = await fetch(url);
    return resp.json();
  }
  ```
- **Handle errors** with `try/catch` and avoid unhandled promise rejections.

## Null & Undefined Handling

- **Enable `strictNullChecks`** in `tsconfig.json`.
- **Use optional chaining** and nullish coalescing.
  ```ts
  const street = user.address?.street ?? 'Unknown';
  ```

## Linting & Formatting

- **ESLint + TypeScript plugin:** Enforce coding standards and catch type errors.
- **Prettier:** Auto-format code. Configure in `.prettierrc` and disable conflicting ESLint rules.

## Comments & Documentation

- **Use JSDoc** for public APIs.
  ```ts
  /**
   * Fetches a user by ID.
   * @param id - The user's unique identifier.
   * @returns The user object or null.
   */
  export async function getUser(id: string): Promise<User | null> { ... }
  ```
- **Avoid commented-out code**; remove dead code promptly.

## Advanced Types

- **Mapped types** for DRY definitions.
  ```ts
  type ReadonlyUser = Readonly<User>;
  ```
- **Conditional types** for transforming types.
  ```ts
  type ElementType<T> = T extends Array<infer U> ? U : T;
  ```

*Consistent styling, clear naming, and leveraging TypeScript’s type system will lead to more robust and maintainable codebases.*

