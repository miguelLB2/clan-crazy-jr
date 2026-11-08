import { db, isFirebaseConfigured } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { initialClanSettings, initialMembers, initialWeeks, initialAwards } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'crazy_junior_clan_data_v2';

// Helper de LocalStorage
function getLocalData() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    const initial = {
      settings: initialClanSettings,
      members: initialMembers,
      weeks: initialWeeks,
      awards: initialAwards
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error al parsear datos locales:", e);
    return {
      settings: initialClanSettings,
      members: initialMembers,
      weeks: initialWeeks,
      awards: initialAwards
    };
  }
}

function saveLocalData(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// ==================== CONFIGURACIÓN DEL CLAN ====================
export async function getClanSettings() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'clan_settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Inicializar si no existe
        await setDoc(docRef, initialClanSettings);
        return initialClanSettings;
      }
    } catch (err) {
      console.warn("Fallo al leer Firestore, usando fallback local:", err);
    }
  }
  return getLocalData().settings || initialClanSettings;
}

export async function saveClanSettings(settings) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'clan_settings', 'general');
    await setDoc(docRef, settings, { merge: true });
  }
  const data = getLocalData();
  data.settings = { ...data.settings, ...settings };
  saveLocalData(data);
  return data.settings;
}

// ==================== MIEMBROS ====================
export async function getMembers() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'members'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Fallo al leer miembros de Firestore:", err);
    }
  }
  return getLocalData().members || [];
}

export async function addMember(member) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'members'), {
      ...member,
      createdAt: new Date().toISOString()
    });
    const newMember = { id: docRef.id, ...member };
    // Actualizar también local
    const data = getLocalData();
    data.members.push(newMember);
    saveLocalData(data);
    return newMember;
  }
  const data = getLocalData();
  const newMember = { ...member, id: 'm_' + Date.now() };
  data.members.push(newMember);
  saveLocalData(data);
  return newMember;
}

export async function updateMember(id, member) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, member);
  }
  const data = getLocalData();
  data.members = data.members.map(m => m.id === id ? { ...m, ...member } : m);
  saveLocalData(data);
  return { id, ...member };
}

export async function deleteMember(id) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'members', id);
    await deleteDoc(docRef);
  }
  const data = getLocalData();
  data.members = data.members.filter(m => m.id !== id);
  // Limpiar también su registro en semanas
  data.weeks = data.weeks.map(w => ({
    ...w,
    records: (w.records || []).filter(r => r.memberId !== id)
  }));
  saveLocalData(data);
  return true;
}

// ==================== SEMANAS Y HONORES ====================
export async function getWeeks() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'weeks'));
      if (!snapshot.empty) {
        const weeks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Ordenar por fecha descendente
        return weeks.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
      }
    } catch (err) {
      console.warn("Fallo al leer semanas de Firestore:", err);
    }
  }
  const localWeeks = getLocalData().weeks || [];
  return localWeeks.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
}

export async function addWeek(weekData) {
  // weekData: { title, startDate, endDate, isCurrent, records: [{ memberId, memberName, honors }] }
  // Ordenar records de mayor a menor honor automáticamente
  const sortedRecords = [...(weekData.records || [])].sort((a, b) => (Number(b.honors) || 0) - (Number(a.honors) || 0));
  const newWeekPayload = {
    ...weekData,
    records: sortedRecords
  };

  if (isFirebaseConfigured && db) {
    // Si esta semana es marcada como actual, desmarcar las demás
    if (newWeekPayload.isCurrent) {
      const allWeeksSnap = await getDocs(collection(db, 'weeks'));
      for (const d of allWeeksSnap.docs) {
        if (d.data().isCurrent) {
          await updateDoc(doc(db, 'weeks', d.id), { isCurrent: false });
        }
      }
    }

    const docRef = await addDoc(collection(db, 'weeks'), {
      ...newWeekPayload,
      createdAt: new Date().toISOString()
    });
    const saved = { id: docRef.id, ...newWeekPayload };
    
    const data = getLocalData();
    if (newWeekPayload.isCurrent) {
      data.weeks = data.weeks.map(w => ({ ...w, isCurrent: false }));
    }
    data.weeks.unshift(saved);
    saveLocalData(data);
    return saved;
  }

  const data = getLocalData();
  if (newWeekPayload.isCurrent) {
    data.weeks = data.weeks.map(w => ({ ...w, isCurrent: false }));
  }
  const saved = { ...newWeekPayload, id: 'w_' + Date.now() };
  data.weeks.unshift(saved);
  saveLocalData(data);
  return saved;
}

export async function updateWeek(id, weekData) {
  const sortedRecords = [...(weekData.records || [])].sort((a, b) => (Number(b.honors) || 0) - (Number(a.honors) || 0));
  const updatedPayload = {
    ...weekData,
    records: sortedRecords
  };

  if (isFirebaseConfigured && db) {
    if (updatedPayload.isCurrent) {
      const allWeeksSnap = await getDocs(collection(db, 'weeks'));
      for (const d of allWeeksSnap.docs) {
        if (d.id !== id && d.data().isCurrent) {
          await updateDoc(doc(db, 'weeks', d.id), { isCurrent: false });
        }
      }
    }
    const docRef = doc(db, 'weeks', id);
    await updateDoc(docRef, updatedPayload);
  }

  const data = getLocalData();
  if (updatedPayload.isCurrent) {
    data.weeks = data.weeks.map(w => w.id === id ? { ...w, ...updatedPayload } : { ...w, isCurrent: false });
  } else {
    data.weeks = data.weeks.map(w => w.id === id ? { ...w, ...updatedPayload } : w);
  }
  saveLocalData(data);
  return { id, ...updatedPayload };
}

export async function deleteWeek(id) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'weeks', id);
    await deleteDoc(docRef);
  }
  const data = getLocalData();
  data.weeks = data.weeks.filter(w => w.id !== id);
  // Si borramos la semana actual y quedan otras, marcar la primera como actual
  if (data.weeks.length > 0 && !data.weeks.some(w => w.isCurrent)) {
    data.weeks[0].isCurrent = true;
  }
  saveLocalData(data);
  return true;
}

// ==================== PREMIOS ====================
export async function getAwards() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'awards'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn("Fallo al leer premios de Firestore:", err);
    }
  }
  return getLocalData().awards || [];
}

export async function addAward(award) {
  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'awards'), {
      ...award,
      createdAt: new Date().toISOString()
    });
    const newAward = { id: docRef.id, ...award };
    const data = getLocalData();
    data.awards.unshift(newAward);
    saveLocalData(data);
    return newAward;
  }
  const data = getLocalData();
  const newAward = { ...award, id: 'a_' + Date.now() };
  data.awards.unshift(newAward);
  saveLocalData(data);
  return newAward;
}

export async function updateAward(id, award) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'awards', id);
    await updateDoc(docRef, award);
  }
  const data = getLocalData();
  data.awards = data.awards.map(a => a.id === id ? { ...a, ...award } : a);
  saveLocalData(data);
  return { id, ...award };
}

export async function deleteAward(id) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'awards', id);
    await deleteDoc(docRef);
  }
  const data = getLocalData();
  data.awards = data.awards.filter(a => a.id !== id);
  saveLocalData(data);
  return true;
}

// ==================== RESTAURAR / SEMBRAR DATOS DE EJEMPLO ====================
export async function seedSampleData() {
  const sample = {
    settings: initialClanSettings,
    members: initialMembers,
    weeks: initialWeeks,
    awards: initialAwards
  };

  saveLocalData(sample);

  if (isFirebaseConfigured && db) {
    try {
      // Guardar settings
      await setDoc(doc(db, 'clan_settings', 'general'), initialClanSettings);

      // Guardar miembros
      for (const m of initialMembers) {
        await setDoc(doc(db, 'members', m.id), m);
      }

      // Guardar semanas
      for (const w of initialWeeks) {
        await setDoc(doc(db, 'weeks', w.id), w);
      }

      // Guardar premios
      for (const a of initialAwards) {
        await setDoc(doc(db, 'awards', a.id), a);
      }
      console.log("🔥 Datos de ejemplo cargados con éxito en Firestore!");
    } catch (e) {
      console.error("Error al sembrar en Firestore:", e);
    }
  }

  return sample;
}
