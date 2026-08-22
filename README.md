# MERN Habit Tracker

A simple, beautiful, and beginner-friendly Habit Tracker application built using the MERN (MongoDB, Express, React, Node.js) stack. Track your daily habits, maintain streaks, check completions, and build better consistency.

---

## Features

### Core API Requirements
* **Create Habit**: Add new habits with custom names and frequencies.
* **Read Habits**: Fetch all user habits or look up a single habit by ID.
* **Update Habit**: Edit existing habit details (name, frequency, streak).
* **Delete Habit**: Remove habits permanently (conditional on settings preference).
* **Mark Complete**: Check off a habit for the day, update streak counts, and record dates.

### Extra Features
* **User Accounts**: Register, Login, and secure JWT Authentication.
* **Overview Dashboard**: Display progress graphs, totals, search bars, and active habits filters.
* **Analytics Page**: View completion metrics over 7-day or 30-day ranges with habit performance bars.
* **Habit History**: Chronological calendar-like timeline showing all past completed dates.
* **Achievements**: Unlock up to 6 custom rewards (e.g., *First Habit*, *Getting Started*, *On Fire*) based on actual streak and completion data.
* **User Profile**: Edit username/email, change passwords securely, and upload profile pictures (stored locally in localStorage).
* **Custom Settings**: Adjust dark mode, select a default frequency for new habits, disable delete confirmation prompts, and toggle reminders.

---

## Tech Stack
* **Frontend**: React (Vite), React Router DOM, Axios, Vanilla CSS.
* **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), BcryptJS.
* **State Management**: React `useState` & `useEffect`.
* **Testing**: Postman.

---

## Folder Structure

```text
Habit Tracker/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Habit CRUD and completion controllers
│   ├── middleware/         # JWT Authentication protect middleware
│   ├── models/             # Mongoose Schemas (User, Habit)
│   ├── routes/             # Express Route handlers (authRoutes, habitRoutes)
│   ├── .env.example        # Environment variables template
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Layout page wrappers
│   │   ├── pages/          # Auth, Dashboard, Analytics, Settings, Profile
│   │   ├── App.css         # Main application styling
│   │   ├── App.jsx         # App router and theme initialization
│   │   ├── index.css       # Global reset styles
│   │   └── main.jsx        # Mount point
│   ├── package.json
│   └── vite.config.js
├── HabitTracker.postman_collection.json # Exported API test collection
└── README.md
```

---

## Requirements
* **Node.js** (v18 or above recommended)
* **MongoDB** (Local Community Server running on port `27017`)

---

## Installation & Setup

### 1. Database & Environment Configuration

1. Make sure your local MongoDB instance is started.
2. In the `backend` directory, create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/HabitTracker
   JWT_SECRET=your_jwt_secret_here
   ```

### 2. Launch Backend Server

Open a terminal window and run:
```bash
cd backend
npm install
npm run dev
```
The backend server will launch at `http://localhost:3000` and connect to MongoDB.

### 3. Launch Frontend App

Open another terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
Vite will start the client dev server (usually at `http://localhost:5173` or `http://localhost:5174`). Open that URL in your browser to interact with the application.

---

## REST API Endpoints

### Auth Endpoints
* `POST /api/auth/register` - Create a user account.
* `POST /api/auth/login` - Verify credentials and return a JWT token.
* `PUT /api/auth/profile` - Update user name/email (Protected).
* `PUT /api/auth/password` - Securely change passwords (Protected).

### Habit Endpoints (Protected - JWT Token required in Header as `Authorization: Bearer <token>`)
* `GET /api/habits` - Retrieve all habits belonging to the logged-in user.
* `GET /api/habits/:id` - Fetch details for a specific habit.
* `POST /api/habits` - Add a new habit.
* `PUT /api/habits/:id` - Modify habit details.
* `PUT /api/habits/:id/complete` - Mark a habit completed for today and update streaks.
* `DELETE /api/habits/:id` - Remove a habit.

---

## How to Test APIs
A pre-configured Postman Collection is located at the root of the project: [HabitTracker.postman_collection.json](./HabitTracker.postman_collection.json).
1. Import this file into Postman.
2. Run the `Register User` request to create a user.
3. Run `Login User`. The test scripts will automatically capture the returned JWT and save it to the environmental `token` variable.
4. Run subsequent Habit CRUD requests. They will use the captured token automatically for authentication.
