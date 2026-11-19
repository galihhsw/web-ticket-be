<div align="center">

  <h1>🎟️ Movie Ticket Booking API</h1>
  <p><strong>Scalable, Type-Safe RESTful Backend for Cinema & Ticket Management</strong></p>

  <p>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://zod.dev/"><img src="https://img.shields.io/badge/Validation-Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" /></a>
  </p>

  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-installation--setup">Installation</a> •
  </p>

</div>

---

## 📖 Overview

**Movie Ticket Booking API** is a production-grade backend engine powering movie cataloging, cinema management, and ticket reservation. Built from the ground up using **TypeScript** and **Node.js**, this service emphasizes developer productivity, strict data contracts, and fault tolerance through automated schema validation and robust error boundary handling.

---

## ⚡ Key Features

- **Strict Type Safety**: End-to-end typing using TypeScript 5+, eliminating silent runtime bugs and accelerating maintenance.
- **Fail-Fast Schema Validation**: Centralized request interception using **Zod** schemas, ensuring zero unvalidated payloads touch controllers or database collections.
- **RESTful Architecture**: Clean HTTP status semantics (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`).
- **Separation of Concerns (SoC)**: Strict isolation across Models, Routes, Middlewares, and Controllers.
- **Persistent Data Modeling**: Seamless MongoDB schema modeling, indexing, and querying using Mongoose.

---

## 🛠️ Tech Stack & Tools

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript (v5.5+) | Type safety, static checking, and modern ECMAScript features |
| **Framework** | Express.js (v4.19+) | Lightweight and flexible HTTP server architecture |
| **Database** | MongoDB | Document-based scalable NoSQL database |
| **ODM** | Mongoose (v8.24+) | Schema validation, business logic hooks, and query abstractions |
| **Data Validation** | Zod | Runtime schema declaration and input validation |
| **Environment** | Dotenv | Secure environment variable configuration |
| **Dev Tools** | Nodemon, ts-node | Fast local development lifecycle with instant hot-reloading |

---

## 🏗️ System Architecture

```text
web-ticket-be/
├── src/
│   ├── controllers/            # Business logic and response formatting
│   │   ├── genreController.ts    # Handlers for Genre CRUD
│   │   └── theaterController.ts  # Handlers for Theater CRUD
│   ├── middlewares/            # Custom reusable middleware
│   │   └── validateRequest.ts    # Generic Zod validation pipeline
│   ├── models/                 # Data schemas & Mongoose models
│   │   ├── Genre.ts              # Genre schema definition
│   │   └── Theater.ts            # Theater schema definition
│   ├── routes/                 # Route declarations & nesting
│   │   └── adminRoutes/          # Administrative operations
│   │       ├── genresRoutes.ts
│   │       ├── theaterRoutes.ts
│   │       └── index.ts          # Admin sub-router registry
│   ├── utils/                  # Shared utilities & configurations
│   │   ├── database.ts           # MongoDB connection lifecycle handler
│   │   └── zodSchema.ts          # Centralized validation schemas
│   └── index.ts                # Application bootstrapper & entry point
├── dist/                       # Production-ready compiled JavaScript
├── tsconfig.json               # TypeScript compiler config
├── package.json                # Project dependencies and script runner
└── README.md
```

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### 🎭 Genre Management

| Method | Endpoint | Description | Validation Rule |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/genres` | List all available movie genres | — |
| `GET` | `/admin/genres/:id` | Get genre details by ObjectId | Valid MongoDB ObjectId |
| `POST` | `/admin/genres` | Register a new genre | `name`: String (min 5 chars) |
| `PUT` | `/admin/genres/:id` | Update genre information | `name`: String (min 5 chars) |
| `DELETE`| `/admin/genres/:id` | Delete genre record | Valid MongoDB ObjectId |

---

### 🏛️ Theater Management

| Method | Endpoint | Description | Validation Rule |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/theaters` | List all cinema theaters | — |
| `GET` | `/admin/theaters/:id`| Get theater details by ObjectId | Valid MongoDB ObjectId |
| `POST` | `/admin/theaters` | Register a new cinema theater | `name` (min 5 chars), `city` (required) |
| `PUT` | `/admin/theaters/:id`| Update theater details | `name` (min 5 chars), `city` (required) |
| `DELETE`| `/admin/theaters/:id`| Remove a theater | Valid MongoDB ObjectId |

---

## 🚀 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas instance)
- Git

### 2. Clone Repository
```bash
git clone https://github.com/galihhsw/web-ticket-be.git
cd web-ticket-be
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/web-ticket
```

### 5. Running the Application

* **Development mode (with hot-reload):**
  ```bash
  npm run dev
  ```
* **Build for Production:**
  ```bash
  npm run build
  ```
* **Start Production Server:**
  ```bash
  npm start
  ```

---
