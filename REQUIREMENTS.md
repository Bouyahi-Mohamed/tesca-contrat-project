# Project Requirements

## System Prerequisites

Before running this project you must have the following software installed on your machine.

### Required Software

| Software | Minimum Version | Download |
|----------|----------------|---------|
| **Node.js** | v18.x or higher | https://nodejs.org/ |
| **npm** | v9.x or higher (comes with Node.js) | — |
| **MongoDB Community Server** | v6.x or higher | https://www.mongodb.com/try/download/community |
| **Git** | Any recent version | https://git-scm.com/ |

> **Tip:** After installing Node.js, verify your versions by running:
> ```bash
> node -v
> npm -v
> ```

---

## Backend Dependencies

Located in `backend/package.json`. Install with `npm install` inside the `backend/` folder.

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21.2 | HTTP server / REST API framework |
| `mongoose` | ^8.18.0 | MongoDB ODM |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `dotenv` | ^16.6.0 | Environment variable loader |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `helmet` | ^8.1.0 | HTTP security headers |
| `compression` | ^1.7.4 | Gzip response compression |
| `morgan` | ^1.10.0 | HTTP request logger |
| `multer` | ^2.2.0 | File/PDF upload handling |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.10 | Auto-restart server on file changes |

---

## Frontend Dependencies

Located in `frontend/package.json`. Install with `npm install` inside the `frontend/` folder.

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.1.1 | UI library |
| `react-dom` | ^19.1.1 | React DOM renderer |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `axios` | ^1.11.0 | HTTP client for API calls |
| `jwt-decode` | ^4.0.0 | Decode JWT tokens on the client |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.1.2 | Build tool / dev server |
| `@vitejs/plugin-react` | ^5.0.0 | React support for Vite |
| `tailwindcss` | ^3.4.17 | Utility-first CSS framework |
| `postcss` | ^8.5.6 | CSS post-processor |
| `autoprefixer` | ^10.4.21 | Automatic CSS vendor prefixes |

---

## Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/contract_management
JWT_SECRET=your_strong_secret_here
RENEWAL_CHECK_INTERVAL_MS=3600000
RENEWAL_ALERT_DAYS=15
RENEWAL_EXTENSION_MONTHS=12
NODE_ENV=development
```

> **Important:** `JWT_SECRET` is not in the `.env.example` — you must add it manually with a strong random string.

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Quick Install (all platforms)

Run these commands after cloning the repository:

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

Or use the provided helper scripts at the project root:

- **Windows** — run `install.bat` (created automatically)
- **Mac / Linux** — run `bash install.sh` (created automatically)

---

## Port Usage

| Service | Default Port |
|---------|-------------|
| MongoDB | 27017 |
| Backend API (Express) | 5000 |
| Frontend Dev Server (Vite) | 5173 |

Make sure none of these ports are blocked by a firewall or used by another process.
