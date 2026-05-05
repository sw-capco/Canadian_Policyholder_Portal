# Canadian Policyholder Portal

Monorepo with:

- `client/`: React (Vite) frontend (port 3000)
- `server/`: Express.js backend API (port 5000)

## Current application state (demo)

The repo currently runs as a **fully local demo** (no database) with **mock/in-memory data**.

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

## Prereqs

- Node.js 18+

## Setup

```bash
npm install
```

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
