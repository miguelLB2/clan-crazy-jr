import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase obtenida de variables de entorno (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validar si el usuario ya configuró sus variables de entorno reales
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "TU_API_KEY_AQUI" &&
  firebaseConfig.projectId !== "tu-proyecto-freefire"
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase inicializado correctamente.");
  } catch (error) {
    console.warn("⚠️ Error al inicializar Firebase, usando modo de almacenamiento local:", error);
  }
} else {
  console.log("ℹ️ Firebase no configurado en .env. La web está funcionando en 'Modo Demostración / Local' con datos de ejemplo.");
}

export { app, auth, db };
