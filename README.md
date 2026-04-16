# Service Request Management System (SRMS)

A full-stack web application for managing service requests across departments with role-based access control.

---

## 🏗️ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Node.js, Express.js, MongoDB, Mongoose  |
| Auth     | JWT (JSON Web Tokens), bcryptjs         |
| Frontend | React 18, Vite, Tailwind CSS, Axios     |
| State    | React Context API                       |

---

## 👥 Roles & Access

| Role        | Capabilities                                                       |
|-------------|--------------------------------------------------------------------|
| **ADMIN**   | Full access — all masters, all requests, user management          |
| **HOD**     | Approve/reject requests, assign technicians, manage masters       |
| **TECHNICIAN** | View assigned requests, post replies/updates                   |
| **USER**    | Raise requests, view own requests, post replies                   |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

---

### 1. Clone / Extract the project

```bash
cd srm-project
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (already included, update as needed):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/service_request_management
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
npm run dev       # development (nodemon)
npm start         # production
```

The backend runs on **http://localhost:5000**

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 📁 Project Structure

```
srm-project/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Business logic (10 controllers)
│   │   ├── middlewares/     # Auth, Role, Error handlers
│   │   ├── models/          # Mongoose schemas (8 models)
│   │   ├── routes/          # Express routes (10 route files)
│   │   ├── helper/          # Request number generator
│   │   └── utils/           # ApiError, ApiResponse, asyncHandler
│   ├── .env
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/             # Axios client + all API service functions
        ├── components/
        │   ├── layout/      # Sidebar, Navbar
        │   └── ui/          # Modal, ConfirmDialog, Spinner, EmptyState
        ├── context/         # Auth, Toast, MasterData, ServiceRequest
        └── pages/
            ├── auth/        # Login, Register
            ├── dashboards/  # Requestor, HOD, Technician
            └── masters/     # Status, Department, Person, ServiceType,
                             # RequestType, PersonMapping, Users
```

---

## 🌐 API Endpoints

| Module                  | Base Path                         |
|-------------------------|-----------------------------------|
| Auth                    | `/api/v1/auth`                    |
| Users                   | `/api/v1/users`                   |
| Service Departments     | `/api/v1/service-departments`     |
| Dept Person Mapping     | `/api/v1/service-dept-persons`    |
| Service Types           | `/api/v1/service-types`           |
| Request Types           | `/api/v1/service-request-types`   |
| Type-Person Mapping     | `/api/v1/request-type-persons`    |
| Request Statuses        | `/api/v1/service-statuses`        |
| Service Requests        | `/api/v1/service-requests`        |
| Replies                 | `/api/v1/service-request-replies` |

---

## 🔑 First-Time Setup

1. Register your first user via `/auth/register` or the Register page
2. Use role `ADMIN` to get full access
3. From the Admin panel, create:
   - Service Statuses (e.g. Pending, In Progress, Completed)
   - Departments (e.g. IT, Maintenance, HR)
   - Service Types (e.g. Technical, Facility)
   - Request Types (e.g. Computer Issue, AC Repair)
4. Create technician users and assign them to departments
5. Users can now raise requests through the Requestor Dashboard

---

## 📦 Build for Production

```bash
# Frontend
cd frontend && npm run build
# Outputs to frontend/dist/

# Backend — serve dist as static files or deploy separately
cd backend && npm start
```
