# Brainstorm Setup Guide

## Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- (Optional) MongoDB for persistent storage

## 1. Install Dependencies
```sh
npm install
# or
yarn install
# or
pnpm install
```

## 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your secrets:
```sh
cp .env.example .env.local
```
Edit `.env.local` and set:
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
- `NEXTAUTH_SECRET` (use `openssl rand -base64 32` to generate)
- `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
- (Optional) `MONGODB_URI` for database

## 3. Run the Development Server
```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Running Tests
```sh
npm test
# or
yarn test
# or
pnpm test
```

## 5. Production Build
```sh
npm run build && npm start
```

## 6. Linting & Formatting
```sh
npm run lint
```

---

- For more details, see the `docs/` directory for style and API guides.
- For Shadcn UI, see https://ui.shadcn.com/docs/installation
