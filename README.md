# Enterprise Contract Management Application

A MERN stack contract management system with CRUD support, lifecycle management, an admin approval workflow, and a renewal alert flow for contracts approaching their end date.

## Project Structure

```text
project tesca/
  backend/
    config/
      db.js
    controllers/
      authController.js
      contractController.js
      referenceController.js
    models/
      Contract.js
      Fournisseur.js
      Notification.js
      User.js
    routes/
      contractRoutes.js
      referenceRoutes.js
    services/
      contractLifecycle.js
      renewalService.js
      seedService.js
    .env.example
    package.json
    seed.js
    server.js
  frontend/
    public/
    src/
      components/
        AlertBanner.jsx
        ContractBuilderForm.jsx
        ContractList.jsx
        Modal.jsx
        PdfViewerModal.jsx
        SiteFooter.jsx
        SiteHeader.jsx
        SupplierForm.jsx
        UserForm.jsx
      pages/
        Dashboard.jsx
        Login.jsx
        notFound.jsx
      services/
        api.js
      App.jsx
      index.css
      main.jsx
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
  .gitignore
  README.md
```

## Features

### Contract Management
- Create, read, update, and delete contracts
- Modal-based registry UI with separate Add Contract, Add Supplier, and Add User actions
- Contract types: `CDD renewable`, `CDD` (non-renewable), and `CDI`
- PDF document upload and inline viewer for all roles
- Automatic lifecycle status updates based on `dateFin`

### Admin Approval Workflow
- Contracts created or updated by `achat` users are set to **Pending Validation** automatically
- Admins receive in-app notifications (`Nouveau contrat à valider` / `Contrat mis à jour à valider`)
- Admin dashboard shows a **"Contracts awaiting validation"** queue with Validate / Reject actions
- Contracts are only counted in dashboard statistics once they are **Verified** by an admin
- Deleting a contract also removes its associated pending notifications

### Contract Lifecycle & Renewal Alerts
- `CDD renewable` contracts entering their last 15 days are flagged as `en_attente` and appear in the **Contract Expiring Alerts** banner
- Admin and Achat users can choose **Yes, Continue** (extends the end date by 12 months) or **No, Cancel** (converts the contract to a non-renewable CDD that ends naturally on `dateFin`)
- `CDD` contracts automatically switch to `terminer` once their end date passes
- `CDI` contracts have no end date and remain active indefinitely
- Readonly (`other`) users do not see expiring contract alerts

### Search & Filtering
- **Simple search**: Instantly filters the contract list by title, user name, or supplier name
- **Advanced search** (toggle): Filter by Status, Type, Validation status, Date de début (on or after), and Date de fin (on or before)
- Clear Filters button to reset all criteria at once
- Record counter updates dynamically (e.g. "Showing 5 of 20 records")

### Authentication & RBAC
JWT-based authentication with Role-Based Access Control. Three roles are supported:

| Role | Permissions |
|------|-------------|
| `admin` | Full access: manage contracts, users, suppliers; validate/reject contracts; see all alerts and notifications |
| `achat` | Create and edit contracts (submitted for admin approval); see expiry alerts; view PDFs |
| `other` | Read-only: view contracts and PDFs only |

The responsible user for a contract is automatically set to the currently logged-in user — no manual selection required.

On backend startup, 3 default accounts are created with password `Tesca2026!`:

1. **Admin** — `tarek.ferchichi@tescagroup.com`
2. **Achat** — `safa@tescagroup.com`
3. **Other** (read-only) — `bouyahi.mohamed@testgoup.com`

## Backend Setup

If MongoDB is not already running on your machine, start it first:

```powershell
mongod --dbpath "d:\code\github project\project tesca\database\mongo-data" --bind_ip 127.0.0.1 --port 27017
```

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

The backend automatically seeds demo data on first startup. To seed manually, run `npm run seed` from the `backend` folder.

### Backend Environment Variables (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port the API server listens on |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/contract_management` | MongoDB connection string |
| `JWT_SECRET` | *(set a strong secret)* | Secret key for signing JWT tokens |
| `RENEWAL_CHECK_INTERVAL_MS` | `3600000` | How often (ms) the renewal monitor runs |
| `RENEWAL_ALERT_DAYS` | `15` | Days before end date to trigger expiry alert |
| `RENEWAL_EXTENSION_MONTHS` | `12` | Months added when continuing a renewable contract |

## Frontend Setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

### Frontend Environment Variables (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the backend API |

## Run The Application

Run the backend and frontend in two separate terminals:

```powershell
# Terminal 1 – backend
Set-Location "d:\code\github project\project tesca\backend"
npm run dev

# Terminal 2 – frontend
Set-Location "d:\code\github project\project tesca\frontend"
npm run dev
```

Open the app in your browser at `http://localhost:5173/`.

## API Summary

### Auth
- `POST /api/auth/login`

### Contracts
- `GET /api/contracts` — List all contracts (triggers lifecycle refresh)
- `POST /api/contracts` — Create a contract
- `PUT /api/contracts/:id` — Update a contract
- `DELETE /api/contracts/:id` — Delete a contract (also removes linked notifications)
- `POST /api/contracts/check-renewals` — Manually trigger renewal check
- `PUT /api/contracts/:id/continue` — Extend a renewable contract
- `PUT /api/contracts/:id/cancel` — Convert to non-renewable CDD
- `PUT /api/contracts/:id/validate` — Admin: approve a contract *(admin only)*
- `PUT /api/contracts/:id/reject` — Admin: reject a contract *(admin only)*
- `GET /api/contracts/notifications` — Get unread admin notifications *(admin only)*

### Users & Suppliers
- `GET /api/users`
- `POST /api/users`
- `GET /api/fournisseurs`
- `POST /api/fournisseurs`
- `DELETE /api/fournisseurs/:id`

## Contract Verification Statuses

| Status | Meaning |
|--------|---------|
| `pending_validation` | Submitted by an `achat` user, awaiting admin review |
| `verified` | Approved by an admin — counts in dashboard statistics |
| `unverified` | Rejected by an admin |
