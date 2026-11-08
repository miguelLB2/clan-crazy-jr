import { auth, isFirebaseConfigured } from './config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const LOCAL_AUTH_KEY = 'bloodfire_admin_logged_in';

export async function loginAdmin(email, password) {
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error al iniciar sesión con Firebase Auth:", error);
      let message = "Credenciales incorrectas o usuario no encontrado.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = "Correo o contraseña incorrectos.";
      } else if (error.code === 'auth/user-not-found') {
        message = "No existe un usuario con este correo electrónico.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Demasiados intentos fallidos. Intenta más tarde.";
      }
      return { success: false, error: message };
    }
  }

  // Modo Local / Demo
  // Permite al usuario entrar para probar el panel antes de configurar Firebase
  if (email && password.length >= 6) {
    const demoUser = {
      email,
      uid: 'demo-admin-uid',
      displayName: 'Administrador Demo',
      isDemo: true
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  } else {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
  }
}

export async function logoutAdmin() {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error al cerrar sesión en Firebase:", e);
    }
  }
  localStorage.removeItem(LOCAL_AUTH_KEY);
  return true;
}

export function subscribeToAuth(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }

  // Local / Demo state check
  const localUserRaw = localStorage.getItem(LOCAL_AUTH_KEY);
  if (localUserRaw) {
    try {
      callback(JSON.parse(localUserRaw));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }

  // Retornar función de limpieza dummy
  return () => {};
}

export function getInitialCurrentUser() {
  if (isFirebaseConfigured && auth && auth.currentUser) {
    return auth.currentUser;
  }
  const localUserRaw = localStorage.getItem(LOCAL_AUTH_KEY);
  if (localUserRaw) {
    try {
      return JSON.parse(localUserRaw);
    } catch {
      return null;
    }
  }
  return null;
}
