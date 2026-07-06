# Enterprise Contract Management Application

A MERN stack contract management system with CRUD support, lifecycle management, and a renewal alert flow for contracts approaching their end date.

## Project Structure

```text
project tesca/
  backend/
    config/
      db.js
    controllers/
      contractController.js
      referenceController.js
    models/
      Contract.js
      Fournisseur.js
      User.js
    routes/
      contractRoutes.js
      referenceRoutes.js
    services/
      seedService.js
      renewalService.js
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
        ContractForm.jsx
        ContractList.jsx
        Modal.jsx
        SupplierForm.jsx
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

- Create, read, update, and delete contracts
- Modal-based registry UI with separate Add Contract and Add Supplier actions
- Contract type labels: `CDD renewable`, `CDD`, and `CDI`
- Automatic lifecycle updates based on `dateFin`
- Renewal scanner that marks near-expiry `CDD renewable` contracts as `en_attente`
- `CDD` contracts end automatically when `dateFin` passes
- `CDI` contracts do not require an end date
- JWT-based authentication and Role-Based Access Control (RBAC) with `admin`, `achat`, and `other` roles
- PDF Viewing for all roles
- Seeded demo users, suppliers, and contracts are created automatically on first backend start

## Authentication & RBAC

The application enforces role-based access. On backend startup, 3 default users are created with the password `Tesca2026!`:

1. **Admin** (`tarek.ferchichi@tescagroup.com`): Full access to manage contracts, users, and suppliers.
2. **Achat** (`safa@tescagroup.com`): Can view, create, and edit contracts. Cannot delete contracts, manage users, or delete suppliers.
3. **Other** (`bouyahi.mohamed@testgoup.com`): Read-only access. Can view contracts and PDFs.

## Backend Setup

If MongoDB is not already running on your machine, start it first with the local data directory bundled in this project:

```powershell
mongod --dbpath "d:\code\github project\project tesca\database\mongo-data" --bind_ip 127.0.0.1 --port 27017
```

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

The backend automatically ensures demo data exists on startup. If you want to seed manually instead, run `npm run seed` from the `backend` folder.

Set the following in `backend/.env`:

- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/contract_management`
- `RENEWAL_CHECK_INTERVAL_MS=3600000`
- `RENEWAL_ALERT_DAYS=15`
- `RENEWAL_EXTENSION_MONTHS=12`

## Frontend Setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Set the following in `frontend/.env` if needed:

- `VITE_API_URL=http://localhost:5000/api`

The contract form now loads existing users and suppliers from the API, so use the dropdowns instead of typing raw IDs. The Add Contract modal keeps Date Debut / Date Fin on one row and User / Supplier on one row.

## Run The Application

Run the backend and frontend in two separate terminals:

```powershell
# Terminal 1: backend
Set-Location "d:\code\github project\project tesca\backend"
npm run dev

# Terminal 2: frontend
Set-Location "d:\code\github project\project tesca\frontend"
npm run dev
```

Open the frontend in your browser at `http://localhost:5173/`.

## API Summary

- `POST /api/auth/login`
- `POST /api/contracts`
- `GET /api/contracts`
- `PUT /api/contracts/:id`
- `DELETE /api/contracts/:id`
- `POST /api/contracts/check-renewals`
- `PUT /api/contracts/:id/continue`
- `PUT /api/contracts/:id/cancel`
- `GET /api/users`
- `POST /api/users`
- `GET /api/fournisseurs`
- `POST /api/fournisseurs`
- `DELETE /api/fournisseurs/:id`

## Notes

- Contracts are now date-based: `CDD renewable` contracts raise an alert in the last 15 days, `CDD` contracts switch to `terminer` after the end date, and `CDI` contracts stay active without an end date.
- The renewal checker runs in the backend and can also be triggered manually from the API.
- Continuing a contract extends the end date by the configured renewal extension period.
