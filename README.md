# Signal Forms — Angular Portugal Meetup

Example project built for the **Angular Portugal Meetup** on **June 16th, 2026**.

It demonstrates **Angular v22 Signal Forms** (`@angular/forms/signals`) with a simple Express.js backend that mocks API calls with in-memory data and artificial delays.

## Project structure

```
signal-forms/
├── frontend/   # Angular 22 app (Signal Forms signup demo)
└── backend/    # Express.js API (email check + signup)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)

## Getting started

Install dependencies in both projects:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Run the backend and frontend in **separate terminals**.

### Backend (port 3000)

```bash
cd backend
npm start
```

For auto-restart on file changes:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/check-email?email=...` | Checks if an email exists (1s delay) |
| `POST` | `/api/check-email` | Same check via request body |
| `POST` | `/api/signup` | Accepts signup payload and logs it to the console (1s delay, no persistence) |

### Frontend (port 8000)

```bash
cd frontend
npm start
```

Open `http://localhost:8000`.

The dev server proxies `/api` requests to the backend (`frontend/proxy.conf.json`), so both apps must be running for async validation and form submission to work.

## What the demo includes

The full feature set lives on the `dynamic-and-nested-fields` branch. See [Branches](#branches) below for how each branch differs.

- Signup form using **Signal Forms** (`form`, `FormField`, `submit`, validators)
- Async email availability check (`validateHttp`, with a commented `validateAsync` alternative on `main`)
- Conditional phone validation with `required(..., { when })`
- Dynamic phone numbers array (`applyEach`) — `dynamic-and-nested-fields` only
- Nested address fields with cross-field validation (`validateTree`) — `dynamic-and-nested-fields` only
- Custom phone input using `FormValueControl`

## Branches

Each branch is a self-contained demo for a different Signal Forms topic.

### `main`

Core signup form with email, password, and a single phone number. Covers `validateHttp`, conditional validation with `when`, a reusable validation schema, and a custom phone input using `FormValueControl`.

### `dynamic-and-nested-fields`

Everything on `main`, plus dynamic phone numbers (`applyEach`), a nested address group, and `validateTree` for cross-field postal code validation based on country.

### `using-compat-form`

Shows incremental migration from Reactive Forms using `compatForm` — the password field stays as a classic `FormControl` while email and phone use Signal Forms.

## Build frontend for production

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/frontend`.
