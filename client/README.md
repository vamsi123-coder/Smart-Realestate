# 🏡 SmartRE – Frontend Client

The frontend client for **SmartRE**, a zero-brokerage real estate web application built with **React 19**, **Vite**, and **Vanilla CSS**.

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Authentication**: [Firebase Web SDK v12](https://firebase.google.com/) (Google OAuth) + JWT
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Typography & Styling**: Google Font *Outfit*, Custom Modern Glassmorphic CSS Design System

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or edit `.env` in the `client/` folder:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api

# Firebase Web App Credentials (from Firebase Console -> Project Settings -> General)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at **http://localhost:5173**.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Source Code Structure

```text
src/
├── components/          # Reusable UI components
│   ├── FilterPanel.jsx  # Search filters (property type, price, bedrooms, furnishing)
│   ├── Footer.jsx       # Global footer
│   ├── Navbar.jsx       # Navigation header with auth state & user menu
│   └── PropertyCard.jsx # Property listing card with badges, price formatting & owner contact
├── context/
│   └── AuthContext.jsx  # Global authentication state, JWT storage, login/signup/logout
├── firebase/
│   └── firebase.js      # Firebase app initialization & Google Auth provider
├── pages/
│   ├── Home.jsx           # Landing page with hero banner & featured listings
│   ├── ListProperty.jsx   # Multi-step property posting form with image upload
│   ├── Login.jsx          # Email/Password & Google Sign-In
│   ├── Profile.jsx        # User profile, phone update & user's posted listings
│   ├── PropertyDetail.jsx # Detailed property view, image gallery & direct owner WhatsApp
│   ├── Search.jsx         # Search results with interactive filters
│   └── SignUp.jsx         # New user registration (Google & Email/Password)
├── App.jsx              # Application router & layout
└── index.css            # Complete design system tokens, typography, utilities & animations
```

---

## 🎨 Design System

- **Font Family**: `'Outfit', sans-serif`
- **Primary Color**: `#FF6B35` (Sunset Orange)
- **Secondary Accent**: `#1A3C6E` (Navy Blue)
- **Background**: `#FFFAF5` (Warm Cream White)
- **UI Style**: Modern Glassmorphism, smooth micro-interactions, responsive mobile-first grid
