# Canadian Policyholder Portal

Self-service portal for Canadian auto insurance policyholders to manage their accounts and claims.

This repo is a **local demo** implementation (no database) with **mock/in-memory data**.

## Tech stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express (JSON API)
- Testing: Vitest (client + server)
- Lint/format: ESLint + Prettier

## Repository layout

Monorepo with:

- `client/`: React (Vite) frontend (port 3000)
- `server/`: Express.js backend API (port 5000)

## Current application state (demo)

Implemented user-facing flows:

- Sign in (email/password), optional MFA prompt
- Policy dashboard (view policy details + download proof-of-insurance PDF)
- File a claim (FNOL) with basic validation + file attachments (client-side)
- View/update profile (address/phone/driver’s license)
- Change password (API)

Implemented API routes (Express):

- `POST /api/auth/signin`
- `POST /api/auth/verify-mfa` (demo MFA code: `123456`)
- `POST /api/auth/change-password`
- `GET /api/users/profile`, `PUT /api/users/profile`
- `GET /api/policies/:policyNumber`
- `GET /api/policies/:policyNumber/proof` (PDF download)
- `POST /api/claims` (submit FNOL)

Demo login accounts (sample usernames):

- `policyholder@example.com` / `password123`
- `mfa@example.com` / `password123` (MFA required; code `123456`)
- `multi@example.com` / `password123` (multiple policies)
- `expired@example.com` / `password123` (policy `POLEXPIRED`)

## Prerequisites

- Node.js 18+

## Setup

```bash
npm install
```

### Environment variables

- Root: `./.env.example`
- Server: `./server/.env.example`
- Client: `./client/.env.example`

## Run (dev)

### Both (recommended)

```bash
npm run dev
```

### Server

```bash
npm -w server run dev
```

### Client

```bash
npm -w client run dev
```

## Lint / Test / Build

```bash
npm run lint
npm run test
npm run build
```

## Contributing

- Keep changes focused and avoid unrelated refactors.
- Run `npm run lint` and `npm run test` before opening a PR.
- Do not commit secrets (API keys, tokens, credentials).

## License

No license file is currently provided in this repository. If a license is required, add a `LICENSE` file at the repo root and update this section.

## Links

- React: https://react.dev/
- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/
- Express: https://expressjs.com/
- Vitest: https://vitest.dev/
- ESLint: https://eslint.org/
- Prettier: https://prettier.io/
