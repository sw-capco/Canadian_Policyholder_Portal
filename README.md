# Canadian Policyholder Portal

A responsive self-service web portal for Canadian auto insurance policyholders to manage policy details, download proof-of-insurance documents, submit first notice of loss (FNOL) claims, upload supporting claim documents, and maintain personal information.

The project is a local demo monorepo with a React client and an Express.js API. It currently uses mock and in-memory data so the team can validate policy retrieval, claim intake, authentication, and profile management workflows before connecting production integrations.

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Express.js, Node.js, JSON Web Tokens
- **Testing:** Vitest, React Testing Library, Supertest
- **Quality:** ESLint, Prettier, Husky, lint-staged
- **Workspace:** npm workspaces for `client/` and `server/`

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [npm](https://docs.npmjs.com/) 10 or newer is recommended

## Installation

Install dependencies from the repository root:

```bash
npm install
```

Optional environment setup:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

The checked-in `.env.example` files contain only local placeholders. Do not commit real API keys, tokens, credentials, or production secrets.

## Running Locally

Start both the Express API and React development server:

```bash
npm run dev
```

Default local URLs:

- Client: `http://localhost:3000`
- API: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`

You can also run each workspace separately:

```bash
npm -w server run dev
npm -w client run dev
```

## Demo Accounts

Use these sample policyholder accounts for local sign-in:

| Scenario | Email | Password | Notes |
| --- | --- | --- | --- |
| Standard policyholder | `policyholder@example.com` | `password123` | Single active auto policy |
| MFA policyholder | `mfa@example.com` | `password123` | MFA code is `123456` |
| Multiple policies | `multi@example.com` | `password123` | More than one policy |
| Expired policy | `expired@example.com` | `password123` | Policy `POLEXPIRED` |

## Available Scripts

Run commands from the repository root unless noted otherwise.

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server and client concurrently |
| `npm run lint` | Runs ESLint for both workspaces |
| `npm run test` | Runs client and server test suites |
| `npm run build` | Builds the client and validates the server entry point |
| `npm -w client run dev` | Starts only the Vite client on port 3000 |
| `npm -w server run dev` | Starts only the Express API on port 5000 |
| `npm -w client run preview` | Serves the built client locally |
| `npm -w server run start` | Starts the API without watch mode |

## Project Structure

```text
.
|-- client/                 # React/Vite policyholder portal
|   |-- src/
|   |   |-- components/     # Shared UI components
|   |   |-- mocks/          # Client-side scenario data
|   |   |-- pages/          # Route-level pages for sign-in, dashboard, FNOL, profile
|   |   |-- test/           # Test setup
|   |   `-- utils/          # API, auth, and validation helpers
|   `-- package.json
|-- server/                 # Express.js API
|   |-- src/
|   |   |-- controllers/    # Request controllers for claim intake flows
|   |   |-- lib/            # Shared backend libraries
|   |   |-- middleware/     # Authentication middleware
|   |   |-- mock/           # Mock policyholder, policy, and claim data
|   |   |-- routes/         # Thin route definitions
|   |   |-- services/       # Business logic for claims, documents, and policies
|   |   `-- utils/          # Claim number and utility helpers
|   `-- package.json
|-- .github/                # GitHub project configuration
|-- .husky/                 # Git hooks
|-- package.json            # Root workspace scripts and shared dev tooling
`-- package-lock.json
```

## Implemented Workflows

- Sign in with email and password, including an optional MFA challenge
- View policy coverage, limits, deductibles, and policy status
- Download proof-of-insurance documents
- Submit FNOL claim intake details with supporting document attachments
- View and update contact and driver's license information
- Change account password through the API

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/signin` | Policyholder sign-in |
| `POST` | `/api/auth/verify-mfa` | MFA verification for sign-in |
| `POST` | `/api/auth/change-password` | Password change |
| `GET` | `/api/users/profile` | Retrieve policyholder profile |
| `PUT` | `/api/users/profile` | Update policyholder profile |
| `GET` | `/api/policies/:policyNumber` | Retrieve policy details |
| `GET` | `/api/policies/:policyNumber/proof` | Download proof-of-insurance PDF |
| `POST` | `/api/claims` | Submit FNOL claim intake |

## Testing

Run the complete test suite:

```bash
npm run test
```

Run workspace-specific tests:

```bash
npm -w client run test
npm -w server run test
```

The client suite covers React policyholder workflows with React Testing Library. The server suite covers Express routes and claim intake behavior with Vitest and Supertest.

## Contributing

- Keep changes focused and reviewable.
- Separate frontend UI/state/API concerns from backend route/controller/service concerns.
- Use insurance claims terminology consistently for FNOL, policy retrieval, claim intake, documents, notifications, fraud, finance, and integrations.
- Add or update tests when behavior changes.
- Run `npm run lint`, `npm run test`, and `npm run build` before opening a pull request when practical.
- Never commit secrets, production credentials, or sensitive policyholder data.

## Relevant Documentation

- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/guide/)
- [React Router documentation](https://reactrouter.com/)
- [Express documentation](https://expressjs.com/)
- [Vitest documentation](https://vitest.dev/)
- [Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [npm workspaces documentation](https://docs.npmjs.com/cli/using-npm/workspaces)

## License

No license file is currently included in this repository. Add a `LICENSE` file before distributing, publishing, or reusing this code outside the project team.
