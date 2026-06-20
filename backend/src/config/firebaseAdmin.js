import admin from 'firebase-admin';
import { env } from './env.js';

function getPrivateKey() {
  const key = env.FIREBASE_PRIVATE_KEY;
  if (!key) return '';
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

// In some Jest/ESM interop environments, `admin.apps` can be undefined.
const effectiveApps = Array.isArray(admin.apps) ? admin.apps : [];

const hasServiceAccount = Boolean(env.FIREBASE_CLIENT_EMAIL) && Boolean(env.FIREBASE_PRIVATE_KEY);

if (effectiveApps.length === 0 && hasServiceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey()
    })
  });
} else {
  if (!hasServiceAccount && effectiveApps.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Firebase Admin not configured: missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY');
  }
}

export const firebaseAdmin = admin;

export const getFirebaseMessaging = () => {
  const apps = Array.isArray(admin.apps) ? admin.apps : [];
  if (!apps.length) return null;
  return admin.messaging();
};

