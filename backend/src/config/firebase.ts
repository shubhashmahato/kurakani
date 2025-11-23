import admin from 'firebase-admin';

const initializeFirebase = () => {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }

    console.log('✅ Firebase initialized');
    return admin;
  } catch (error) {
    console.error('❌ Firebase init error:', error);
    throw error;
  }
};

export default initializeFirebase;
export const firebaseAuth = admin.auth();
export const firebaseDb = admin.firestore();