# 🏠 SmartRE – Zero Brokerage Real Estate Platform

A full-stack MERN (MongoDB, Express, React, Node.js) real estate platform where buyers and sellers connect **directly** — no brokerage, no middlemen.

## ✨ Features

- **Zero Brokerage** — direct owner contact on every listing
- **Google OAuth + Email/Password** authentication via Firebase
- **Advanced Property Search** — filter by type, price, area, bedrooms, city, furnishing, and more
- **Multi-step Property Listing** — list flats, villas, land, or commercial spaces with images
- **Cloudinary Image Upload** — up to 10 photos per listing
- **WhatsApp Integration** — contact owners via WhatsApp directly
- **Responsive Design** — works on mobile, tablet, and desktop
- **Bright Modern UI** — Outfit font, orange-blue theme, glassmorphism, micro-animations

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Firebase project
- Cloudinary account

---

### 1. Clone & Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Configure Server Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_realestate

# Firebase Admin SDK
# Download from: Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_super_secret_jwt_key
```

---

### 3. Configure Client Environment

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Web Config
# Get from: Firebase Console → Project Settings → General → Your Apps → Add Web App
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods → enable **Email/Password** and **Google**
4. Go to Project Settings → **General** → copy Web App config to `client/.env`
5. Go to Project Settings → **Service Accounts** → Generate new private key → copy values to `server/.env`

---

### 5. Run the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev   # uses nodemon for hot reload

# Terminal 2: Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

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
    ├── config/          # MongoDB & Firebase Admin configuration (firebaseAdmin.js, db.js)
    ├── controllers/     # Auth, User, Property
    ├── middleware/      # Token verification (Firebase + JWT)
    ├── models/          # User, Property (Mongoose)
    └── routes/          # API routes
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Email/password registration |
| POST | `/api/auth/login` | No | Email/password login |
| POST | `/api/auth/google` | No | Google OAuth |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/properties` | No | Get all with filters |
| GET | `/api/properties/:id` | No | Get single property |
| POST | `/api/properties` | ✅ | Create listing |
| PUT | `/api/properties/:id` | ✅ | Update listing |
| DELETE | `/api/properties/:id` | ✅ | Delete listing |
| GET | `/api/properties/me` | ✅ | Get my listings |
| POST | `/api/properties/upload/image` | ✅ | Upload image to Cloudinary |

---

## 🎨 Design System

- **Font**: Outfit (Google Fonts)
- **Primary**: `#FF6B35` (Vivid Orange)
- **Accent**: `#1A3C6E` (Deep Blue)
- **Background**: `#FFFAF5` (Warm White)

---

## 📝 Notes

- Owner **name and phone** are automatically synced from your profile to all your listings
- You must add your **phone number** in Profile before listing a property
- Property contact is only visible to **logged-in users** (to prevent spam)
