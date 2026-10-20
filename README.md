# 🏠 SmartRE – Zero Brokerage Real Estate Platform

A full-stack MERN (MongoDB, Express, React, Node.js) real estate platform where buyers and sellers connect **directly**, with no brokerage and no middlemen.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Design System](#-design-system)
- [Notes & Behavior](#-notes--behavior)
- [Troubleshooting](#-troubleshooting)
- [Security Checklist](#-security-checklist)

---

## ✨ Features

- **Zero Brokerage**: direct owner contact on every listing
- **Google OAuth + Email/Password** authentication via Firebase
- **Advanced Property Search**: filter by type, price, area, bedrooms, city, furnishing, and more
- **Multi-step Property Listing**: list flats, villas, land, or commercial spaces with images
- **Cloudinary Image Upload**: up to 10 photos per listing
- **WhatsApp Integration**: contact owners via WhatsApp directly
- **Responsive Design**: works on mobile, tablet, and desktop
- **Bright Modern UI**: Outfit font, orange-blue theme, glassmorphism, micro-animations

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | Firebase Authentication (Email/Password, Google) + JWT |
| Images | Cloudinary |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Firebase project
- Cloudinary account

### 1. Clone & Install

```bash
git clone <your-repo-url> Smart_Realestate
cd Smart_Realestate

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Configure the Server

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_realestate

# Firebase Admin SDK
# Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_super_secret_jwt_key
```

> Keep the quotes around `FIREBASE_PRIVATE_KEY` and keep the literal `\n` sequences. The key is a single line in `.env`.

### 3. Configure the Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Web Config
# Firebase Console → Project Settings → General → Your Apps → Add Web App
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Vite only exposes variables prefixed with `VITE_`. Restart the dev server after editing `.env`.

### 4. Firebase Setup

1. Open the [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Go to **Authentication → Sign-in method** and enable **Email/Password** and **Google**.
3. Go to **Project Settings → General**, add a Web App, and copy its config into `client/.env`.
4. Go to **Project Settings → Service Accounts → Generate new private key** and copy the values into `server/.env`.
5. Under **Authentication → Settings → Authorized domains**, add your production domain when you deploy.

### 5. Run the App

```bash
# Terminal 1: backend (nodemon hot reload)
cd server
npm run dev

# Terminal 2: frontend
cd client
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

---

## 📁 Project Structure

```
Smart_Realestate/
├── client/              # React + Vite frontend
│   └── src/
│       ├── components/  # Navbar, PropertyCard, FilterPanel, Footer
│       ├── context/     # AuthContext
│       ├── firebase/    # Firebase config
│       └── pages/       # Home, Login, SignUp, Search, PropertyDetail, Profile, ListProperty
│
└── server/              # Express.js backend
    ├── config/          # MongoDB & Firebase Admin setup (db.js, firebaseAdmin.js)
    ├── controllers/     # Auth, User, Property
    ├── middleware/      # Token verification (Firebase + JWT)
    ├── models/          # User, Property (Mongoose)
    └── routes/          # API routes
```

---

## 🔑 API Reference

Base URL: `http://localhost:5000/api`

Endpoints marked ✅ require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Email/password registration |
| POST | `/auth/login` | No | Email/password login |
| POST | `/auth/google` | No | Google OAuth |
| GET | `/users/profile` | ✅ | Get profile |
| PUT | `/users/profile` | ✅ | Update profile |
| GET | `/properties` | No | Get all properties (supports filters) |
| GET | `/properties/me` | ✅ | Get my listings |
| GET | `/properties/:id` | No | Get a single property |
| POST | `/properties` | ✅ | Create listing |
| PUT | `/properties/:id` | ✅ | Update listing |
| DELETE | `/properties/:id` | ✅ | Delete listing |
| POST | `/properties/upload/image` | ✅ | Upload image to Cloudinary |

> **Route order matters:** in `routes/`, define `GET /properties/me` **before** `GET /properties/:id`. Otherwise Express treats `me` as an `:id` value.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Font | Outfit (Google Fonts) |
| Primary | `#FF6B35` (Vivid Orange) |
| Accent | `#1A3C6E` (Deep Blue) |
| Background | `#FFFAF5` (Warm White) |

---

## 📝 Notes & Behavior

- Owner **name and phone** are automatically synced from your profile to all your listings.
- You must add your **phone number** in Profile before listing a property.
- Property contact details are only visible to **logged-in users** (to prevent spam).

---

## 🩹 Troubleshooting

| Problem | Likely fix |
|---------|-----------|
| `Error parsing private key` from Firebase Admin | Check that `FIREBASE_PRIVATE_KEY` is wrapped in quotes and contains `\n` sequences. If it still fails, convert them with `.replace(/\\n/g, '\n')` in `firebaseAdmin.js`. |
| MongoDB connection fails | Add your IP to the Atlas Network Access list and confirm the username/password in `MONGO_URI`. |
| CORS errors in the browser | Make sure the backend allows the frontend origin (`http://localhost:5173` in development). |
| Client can't reach the API | Check `VITE_API_URL` and restart `npm run dev` after any `.env` change. |
| Google sign-in popup blocked or fails | Add your domain to Firebase **Authorized domains** and allow popups. |
| Image upload fails | Verify the Cloudinary credentials and the 10-photo limit per listing. |

---

## 🔒 Security Checklist

- Never commit `.env` files. Make sure both `server/.env` and `client/.env` are in `.gitignore`.
- Use a long, random `JWT_SECRET` in production.
- Rotate the Firebase service account key and Cloudinary secret if they are ever exposed.
- Restrict your Firebase Web API key and Cloudinary upload settings for production.
