const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Only initialize if real credentials are provided (not placeholders)
const firebaseConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id' &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_CLIENT_EMAIL !== 'firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com';

let firebaseApp = null;

if (firebaseConfigured) {
  try {
    // Avoid re-initializing if already initialized (e.g. hot-reload)
    firebaseApp = getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        })
      : getApps()[0];
    console.log('✅ Firebase Admin initialized');
  } catch (err) {
    console.warn('⚠️  Firebase Admin initialization failed:', err.message);
  }
} else {
  console.warn('⚠️  Firebase Admin not configured — Google auth disabled. Only JWT (email/password) auth is active.');
}

/**
 * Returns the Firebase Auth instance, or null if not configured.
 */
const getFirebaseAuth = () => {
  if (!firebaseConfigured || !firebaseApp) return null;
  return getAuth(firebaseApp);
};

module.exports = { firebaseConfigured, getFirebaseAuth };
