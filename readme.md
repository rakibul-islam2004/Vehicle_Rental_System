# Vehicle Rental System 

A role-based vehicle rental management platform . This system handles secure user authentication, real-time vehicle availability tracking, and automated rental calculations using **Node.js**, **Express**, and **PostgreSQL**.

**Live URL:** [https://car-rental-system.vercel.app](https://car-rental-system.vercel.app)

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full control over vehicle inventory (CRUD) and management of all system-wide bookings.
  - **Customer**: Profile management, browsing available vehicles, and personal booking/cancellation.
- **Transaction-Safe Bookings**: Uses PostgreSQL transactions (`BEGIN/COMMIT`) to ensure vehicles are never double-booked and availability status updates instantly.
- **Dynamic Pricing**: Automated `total_price` calculation based on vehicle daily rates and the total duration of the rental.
- **Secure Authentication**: Protected routes using **JWT** (JSON Web Tokens) and **Bcrypt** for secure password hashing.
- **Reliable Data Integrity**: Optimized relational database schema with foreign key constraints and SQL validation checks.

---

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Relational)
- **Authentication**: JWT (JSON Web Token), Bcrypt.js
- **Database Driver**: Node-Postgres (`pg`)
- **Environment Management**: Dotenv

---

## ⚙️ Setup & Usage Instructions

### 1. Prerequisites

- [Node.js](nodejs.org) (v18.0.0 or higher)
- [PostgreSQL](www.postgresql.org) database instance (Local or Cloud)

### 2. Installation

```bash
# Clone the repository
git clone github.com

# Enter the project directory
cd Vehicle_Rental_System

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory and add the following variables:

PORT
CONNECTION_STRING
JWT_SECRET

### 4. Database Setup
   The application is designed to auto-initialize the database schema (users, vehicles, and bookings tables) upon the first successful run. Ensure your PostgreSQL server is active and the database specified in your .env exists.

### 5. Running the Application

```bash
npm run dev
```
