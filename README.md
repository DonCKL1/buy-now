# CKL TECH — Final Year T-Shirt Ordering System

A production-ready, high-fidelity T-shirt ordering platform for **Bachelor of Technology Computer Technology** final-year students. Students can order their official keepsake, select size, enter student details, and complete secure payments via Paystack with instant Arkesel SMS delivery notifications.

---

## Tech Stack

| Layer    | Technologies                              |
| -------- | ----------------------------------------- |
| Frontend | React, Vite, TypeScript, Vanilla CSS      |
| Backend  | Node.js, Express.js, TypeScript           |
| Database | MySQL (Railway Compatible)                |
| Payments | Paystack Payment Gateway API              |
| Notifications | Arkesel SMS API                      |

---

## Architecture

```text
React Frontend (Vercel)  →  REST API  →  Express Backend (Render)  →  MySQL (Railway)
                                                │
                                       ┌────────┴────────┐
                                       ▼                 ▼
                                   Paystack           Arkesel SMS
```

- Paystack **secret key** exists strictly on the backend.
- Order details & payment amounts are calculated server-side.
- Payment status is verified directly with Paystack API before orders are saved to MySQL.
- Automated SMS dispatch via Arkesel confirms delivery timelines upon successful transaction.

---

## Project Structure

```text
buy-now/
├── frontend/                 # React + Vite client app
│   ├── public/
│   │   ├── tshirt.svg        # T-Shirt preview artwork
│   │   └── logo.png          # Official brand logo
│   ├── src/
│   │   ├── components/       # UI components & Modals
│   │   ├── pages/            # Home.tsx, Admin.tsx
│   │   ├── services/         # API client layer
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css         # Custom styling
│   └── .env.example
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── db/               # MySQL Connection pool & initialization
│   │   ├── middleware/       # Auth & Rate limiting
│   │   ├── routes/           # REST endpoints
│   │   ├── services/         # Business logic (Paystack, SMS, Orders)
│   │   └── server.ts         # Express server entry point
│   ├── .env.example
│   └── tsconfig.json
│
├── database/
│   └── schema.sql            # MySQL database DDL schema
│
├── .gitignore                # Production ignore rules
└── README.md
```

---

## Production Deployment Stack

- **Source Code**: GitHub (Monorepo with `frontend/` & `backend/`)
- **Database**: Railway MySQL
- **Backend API**: Render Web Service
- **Frontend App**: Vercel
- **Payments**: Paystack API

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- A Paystack account

### 1. Create MySQL Database

```sql
CREATE DATABASE final_year_tshirt;
```

Or run the schema DDL:

```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Fill in your `.env` variables:

```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=final_year_tshirt
DATABASE_USER=root
DATABASE_PASSWORD=your_password

PAYSTACK_SECRET_KEY=sk_live_xxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxx

ARKESEL_API_KEY=your_arkesel_api_key
ARKESEL_SENDER_ID=CKLTECH

FRONTEND_URL=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

TSHIRT_PRICE=50
TSHIRT_NAME=Final Year T-Shirt
CLASS_NAME=Bachelor of Technology Computer Technology
CLASS_YEAR=2026
```

### 3. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Server starts on `http://localhost:5000`

### 4. Start Frontend Client

```bash
cd frontend
npm install
npm run dev
```

App starts on `http://localhost:5173`

---

## Admin Portal

Access route: `/admin`

Features:
- View paid orders and delivery status (`DELIVERED` / `PENDING`)
- Toggle delivery status with SweetAlert2 confirmation
- View detailed modal card for every student order
- Delete test or obsolete orders
- Export full orders list as CSV

---

## API Endpoints

| Method | Endpoint                    | Auth  | Description                      |
| ------ | --------------------------- | ----- | -------------------------------- |
| GET    | `/api/health`               | —     | Service health check             |
| GET    | `/api/config`               | —     | Get public app configuration     |
| POST   | `/api/orders`               | —     | Prepare order reference          |
| POST   | `/api/payment/initialize`   | —     | Initialize Paystack checkout     |
| GET    | `/api/payment/verify/:ref`  | —     | Verify payment & commit order    |
| POST   | `/api/admin/login`          | Basic | Admin authentication             |
| GET    | `/api/admin/orders`         | Basic | List orders                      |
| GET    | `/api/admin/stats`          | Basic | Get order statistics             |
| PATCH  | `/api/admin/orders/:id/delivery` | Basic | Toggle delivery status   |
| DELETE | `/api/admin/orders/:id`     | Basic | Delete order record              |
| GET    | `/api/admin/orders/export`  | Basic | Export CSV                       |

---

## Security Best Practices

- ✅ Server-side Paystack secret key storage
- ✅ Parameterized SQL queries preventing SQL injection
- ✅ Basic Auth protection on admin endpoints
- ✅ Environment-driven CORS policies supporting Vercel
- ✅ Rate-limiting on sensitive endpoints
- ✅ Zero secret leakage in API error outputs
