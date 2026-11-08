import { supabase, isSupabaseConfigured } from './client';

const LOCAL_AUTH_KEY = 'crazy_junior_admin_session';

export async function loginAdmin(email, password) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      return { success: true, user: data.user };
    }
    if (error) {
      let message = 'Correo o contraseña incorrectos.';
      if (error.message?.includes('Invalid login')) message = 'Correo o contraseña incorrectos.';
      if (error.message?.includes('Email not confirmed')) message = 'Debes confirmar tu correo antes de entrar.';
      return { success: false, error: message };
    }
  }

  // Modo Demo (sin Supabase configurado)
  if (email && password.length >= 6) {
    const demoUser = { email, uid: 'demo-admin', displayName: 'Admin Demo', isDemo: true };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }
  return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
}

export async function logoutAdmin() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_AUTH_KEY);
  return true;
}

export function subscribeToAuth(callback) {
  if (isSupabaseConfigured && supabase) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
    // Trigger inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }

  // Modo Demo
  const raw = localStorage.getItem(LOCAL_AUTH_KEY);
  callback(raw ? JSON.parse(raw) : null);
  return () => {};
}

export function getInitialCurrentUser() {
  if (isSupabaseConfigured && supabase) return null; // Lo maneja el suscriptor
  const raw = localStorage.getItem(LOCAL_AUTH_KEY);
  if (raw) { try { return JSON.parse(raw); } catch {} }
  return null;
}
