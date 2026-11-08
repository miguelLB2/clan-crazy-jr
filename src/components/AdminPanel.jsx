import React, { useState, useEffect } from 'react';
import AdminTournaments from './AdminTournaments';
import { 
  Lock, LogOut, Plus, Edit2, Trash2, Save, Calendar, Trophy, Users, 
  Settings, Award, Flame, Check, AlertCircle, RefreshCw, ExternalLink,
  ChevronDown, Crown, Shield, Eye, UserCheck, Key
} from 'lucide-react';
import { loginAdmin, logoutAdmin } from '../supabase/authService';
import { isSupabaseConfigured } from '../supabase/client';
import { 
  addMember, updateMember, deleteMember,
  addWeek, updateWeek, deleteWeek,
  addAward, updateAward, deleteAward,
  saveClanSettings
} from '../supabase/dataService';
import AwardIcon from './AwardIcon';

export default function AdminPanel({
  currentUser,
  setCurrentUser,
  clanSettings,
  setClanSettings,
  members,
  setMembers,
  weeks,
  setWeeks,
  awards,
  setAwards,
  onExitAdmin
}) {
  // Estado de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Pestaña activa del Panel
  const [activeTab, setActiveTab] = useState('torneos'); // 'honores', 'miembros', 'premios', 'config', 'firebase', 'torneos'

  // Mensaje de éxito / notificación temporal
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ==================== ESTADOS PARA SEMANAS Y HONORES ====================
  // Semana seleccionada para capturar honores
  const [captureWeekId, setCaptureWeekId] = useState('');
  // Mapa de honores en edición: { [memberId]: honorsValue }
  const [honorInputs, setHonorInputs] = useState({});
  const [isSavingHonors, setIsSavingHonors] = useState(false);

  // Formulario para Crear / Editar Semana
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [weekForm, setWeekForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  // ==================== ESTADOS PARA MIEMBROS ====================
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    gameId: '',
    role: 'Miembro',
    avatarUrl: ''
  });

  // ==================== ESTADOS PARA PREMIOS ====================
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [awardForm, setAwardForm] = useState({
    title: '',
    description: '',
    winnerName: '',
    icon: 'Trophy',
    dateOrPeriod: ''
  });

  // ==================== ESTADOS PARA CONFIGURACIÓN ====================
  const [settingsForm, setSettingsForm] = useState({
    clanName: clanSettings?.clanName || '',
    motto: clanSettings?.motto || '',
    logoUrl: clanSettings?.logoUrl || '/assets/logo.png',
    whatsappUrl: clanSettings?.whatsappUrl || '',
    discordUrl: clanSettings?.discordUrl || '',
    requirements: clanSettings?.requirements || ''
  });

  // ==================== ESTADOS PARA LÍDERES Y DECANOS (STAFF) ====================
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('crazy_junior_staff_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 's1', name: 'CJ_APOCALIPSIS', email: 'lider@crazyjunior.com', role: 'Líder General', notes: 'Acceso total y fundador' },
      { id: 's2', name: 'CJ_VULCANO', email: 'decano1@crazyjunior.com', role: 'Decano', notes: 'Captura de honores y torneos' },
      { id: 's3', name: 'CJ_VALKIRIA', email: 'decano2@crazyjunior.com', role: 'Decana', notes: 'Reclutamiento y salas' }
    ];
  });
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'Decano', notes: '' });

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffForm.email.trim() || !staffForm.name.trim()) return;
    const newStaff = {
      id: 's_' + Date.now(),
      name: staffForm.name.trim(),
      email: staffForm.email.trim().toLowerCase(),
      role: staffForm.role,
      notes: staffForm.notes.trim()
    };
    const updated = [newStaff, ...staffList];
    setStaffList(updated);
    localStorage.setItem('crazy_junior_staff_accounts', JSON.stringify(updated));
    setShowStaffModal(false);
    showToast(`Cuenta de ${staffForm.role} registrada con éxito`);
  };

  const handleDeleteStaff = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta cuenta de staff autorizada?')) return;
    const updated = staffList.filter(s => s.id !== id);
    setStaffList(updated);
    localStorage.setItem('crazy_junior_staff_accounts', JSON.stringify(updated));
    showToast('Cuenta de staff eliminada');
  };

  // Sincronizar formularios al recibir cambios
  useEffect(() => {
    if (clanSettings) {
      setSettingsForm({
        clanName: clanSettings.clanName || '',
        motto: clanSettings.motto || '',
        logoUrl: clanSettings.logoUrl || '/assets/logo.png',
        whatsappUrl: clanSettings.whatsappUrl || '',
        discordUrl: clanSettings.discordUrl || '',
        requirements: clanSettings.requirements || ''
      });
    }
  }, [clanSettings]);

  // Inicializar semana de captura con la semana activa
  useEffect(() => {
    if (weeks && weeks.length > 0) {
      const active = weeks.find(w => w.isCurrent) || weeks[0];
      if (active && (!captureWeekId || !weeks.some(w => w.id === captureWeekId))) {
        setCaptureWeekId(active.id);
      }
    }
  }, [weeks]);

  // Cargar inputs de honores cuando cambia la semana seleccionada
  useEffect(() => {
    if (!captureWeekId || !weeks) return;
    const currentWeekObj = weeks.find(w => w.id === captureWeekId);
    if (currentWeekObj) {
      const inputs = {};
      // Llenar con lo que ya tenga la semana
      (currentWeekObj.records || []).forEach(r => {
        inputs[r.memberId] = r.honors;
      });
      // Asegurar que los miembros que no estén en records tengan 0
      (members || []).forEach(m => {
        if (inputs[m.id] === undefined) {
          inputs[m.id] = 0;
        }
      });
      setHonorInputs(inputs);
    }
  }, [captureWeekId, weeks, members]);

  // ==================== MANEJADORES DE LOGIN / LOGOUT ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    const result = await loginAdmin(email, password);
    setIsLoggingIn(false);
    if (result.success) {
      setCurrentUser(result.user);
      showToast('¡Bienvenido al Panel de Administrador!');
    } else {
      setAuthError(result.error);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
  };

  // ==================== MANEJADORES DE SEMANAS ====================
  const handleOpenWeekModal = (week = null) => {
    if (week) {
      setEditingWeek(week);
      setWeekForm({
        title: week.title || '',
        startDate: week.startDate || '',
        endDate: week.endDate || '',
        isCurrent: Boolean(week.isCurrent)
      });
    } else {
      setEditingWeek(null);
      const today = new Date().toISOString().split('T')[0];
      setWeekForm({
        title: `Semana ${weeks.length + 1}`,
        startDate: today,
        endDate: today,
        isCurrent: weeks.length === 0
      });
    }
    setShowWeekModal(true);
  };

  const handleSaveWeek = async (e) => {
    e.preventDefault();
    if (!weekForm.title.trim()) return;

    if (editingWeek) {
      const updated = await updateWeek(editingWeek.id, {
        ...editingWeek,
        title: weekForm.title,
        startDate: weekForm.startDate,
        endDate: weekForm.endDate,
        isCurrent: weekForm.isCurrent
      });
      setWeeks(prev => prev.map(w => w.id === updated.id ? updated : (weekForm.isCurrent ? { ...w, isCurrent: false } : w)));
      showToast('Semana actualizada con éxito');
    } else {
      // Crear nueva semana con records iniciales en 0 para cada miembro actual
      const initialRecords = (members || []).map(m => ({
        memberId: m.id,
        memberName: m.name,
        honors: 0
      }));
      const created = await addWeek({
        title: weekForm.title,
        startDate: weekForm.startDate,
        endDate: weekForm.endDate,
        isCurrent: weekForm.isCurrent,
        records: initialRecords
      });
      setWeeks(prev => {
        const list = weekForm.isCurrent ? prev.map(w => ({ ...w, isCurrent: false })) : [...prev];
        return [created, ...list];
      });
      setCaptureWeekId(created.id);
      showToast('Nueva semana creada con éxito');
    }

    setShowWeekModal(false);
  };

  const handleDeleteWeek = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta semana y todos sus honores registrados?')) return;
    await deleteWeek(id);
    setWeeks(prev => prev.filter(w => w.id !== id));
    showToast('Semana eliminada');
  };

  const handleToggleCurrentWeek = async (week) => {
    const updated = await updateWeek(week.id, { ...week, isCurrent: true });
    setWeeks(prev => prev.map(w => w.id === updated.id ? { ...w, isCurrent: true } : { ...w, isCurrent: false }));
    setCaptureWeekId(week.id);
    showToast(`"${week.title}" establecida como semana actual`);
  };

  // ==================== MANEJADOR DE CAPTURA DE HONORES ====================
  const handleSaveAllHonors = async () => {
    if (!captureWeekId) return;
    const currentWeekObj = weeks.find(w => w.id === captureWeekId);
    if (!currentWeekObj) return;

    setIsSavingHonors(true);

    // Crear lista de records combinando miembros con los honores capturados
    const records = (members || []).map(m => {
      const value = honorInputs[m.id];
      const honorsNumber = Number(value) || 0;
      return {
        memberId: m.id,
        memberName: m.name,
        honors: honorsNumber
      };
    });

    // Ordenar de mayor a menor honor automáticamente
    records.sort((a, b) => b.honors - a.honors);

    const updated = await updateWeek(captureWeekId, {
      ...currentWeekObj,
      records
    });

    setWeeks(prev => prev.map(w => w.id === updated.id ? updated : w));
    setIsSavingHonors(false);
    showToast('¡Honores guardados y ranking calculado con éxito!');
  };

  // ==================== MANEJADORES DE MIEMBROS ====================
  const handleOpenMemberModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        name: member.name || '',
        gameId: member.gameId || '',
        role: member.role || 'Miembro',
        avatarUrl: member.avatarUrl || ''
      });
    } else {
      setEditingMember(null);
      setMemberForm({
        name: '',
        gameId: '',
        role: 'Miembro',
        avatarUrl: ''
      });
    }
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;

    if (editingMember) {
      const updated = await updateMember(editingMember.id, memberForm);
      setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
      // Actualizar nombre también en records de semanas en memoria
      setWeeks(prev => prev.map(w => ({
        ...w,
        records: (w.records || []).map(r => r.memberId === updated.id ? { ...r, memberName: updated.name } : r)
      })));
      showToast('Miembro actualizado');
    } else {
      const created = await addMember(memberForm);
      setMembers(prev => [...prev, created]);
      // Añadir al formulario de honores activo
      setHonorInputs(prev => ({ ...prev, [created.id]: 0 }));
      showToast('Miembro agregado');
    }

    setShowMemberModal(false);
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este miembro del clan?')) return;
    await deleteMember(id);
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast('Miembro eliminado');
  };

  // ==================== MANEJADORES DE PREMIOS ====================
  const handleOpenAwardModal = (award = null) => {
    if (award) {
      setEditingAward(award);
      setAwardForm({
        title: award.title || '',
        description: award.description || '',
        winnerName: award.winnerName || '',
        icon: award.icon || 'Trophy',
        dateOrPeriod: award.dateOrPeriod || ''
      });
    } else {
      setEditingAward(null);
      setAwardForm({
        title: '',
        description: '',
        winnerName: members?.[0]?.name || '',
        icon: 'Trophy',
        dateOrPeriod: 'Semana Actual'
      });
    }
    setShowAwardModal(true);
  };

  const handleSaveAward = async (e) => {
    e.preventDefault();
    if (!awardForm.title.trim()) return;

    if (editingAward) {
      const updated = await updateAward(editingAward.id, awardForm);
      setAwards(prev => prev.map(a => a.id === updated.id ? updated : a));
      showToast('Premio actualizado');
    } else {
      const created = await addAward(awardForm);
      setAwards(prev => [created, ...prev]);
      showToast('Premio agregado');
    }

    setShowAwardModal(false);
  };

  const handleDeleteAward = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este premio del Muro de Honor?')) return;
    await deleteAward(id);
    setAwards(prev => prev.filter(a => a.id !== id));
    showToast('Premio eliminado');
  };

  // ==================== MANEJADOR DE CONFIGURACIÓN ====================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updated = await saveClanSettings(settingsForm);
    setClanSettings(updated);
    showToast('Configuración del clan guardada');
  };

  // ==================== RENDERIZADO: PANTALLA DE LOGIN ====================
  if (!currentUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
        <div className="w-full max-w-md">
          
          <div className="gamer-card p-8 rounded-3xl border-clan-orange/40 relative shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-clan-surface border border-clan-orange/60 flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-clan-orange" />
              </div>
              <h2 className="text-2xl font-orbitron font-black text-white">
                Panel de Administración
              </h2>
              <p className="text-xs font-rajdhani text-slate-400 mt-1 font-semibold">
                Acceso exclusivo para el administrador del clan
              </p>
            </div>

            {/* Aviso de Modo */}
            {!isSupabaseConfigured && (
              <div className="mb-6 p-3 rounded-xl bg-clan-surface border border-amber-500/30 text-amber-300 text-xs font-rajdhani flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Modo Demostración Activo:</span>
                  Supabase aún no está conectado. Puedes ingresar con cualquier correo y contraseña (mínimo 6 caracteres) para probar todas las funciones inmediatamente.
                </div>
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-clan-red/20 border border-clan-red/40 text-clan-red text-xs font-rajdhani font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@clan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-clan-orange font-rajdhani font-medium transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-clan-orange font-rajdhani font-medium transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider text-black btn-fire flex items-center justify-center gap-2 transition-all mt-6"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verificando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Entrar al Panel
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-clan-border/60 text-center">
              <button
                onClick={onExitAdmin}
                className="text-xs font-rajdhani font-bold text-slate-400 hover:text-clan-orange transition-colors"
              >
                ← Volver a la Web Pública
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==================== RENDERIZADO: PANEL DASHBOARD ====================
  const currentWeekObj = weeks.find(w => w.id === captureWeekId);

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Barra Superior del Panel */}
        <div className="gamer-card p-4 sm:p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-clan-border">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-clan-surface border border-clan-orange/50 flex items-center justify-center text-clan-orange shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <h1 className="font-orbitron font-black text-xl text-white">
                  Panel de Control del Clan
                </h1>
                {isSupabaseConfigured ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-green-500/20 text-green-400 border border-green-500/40">
                    ⚡ Supabase Conectado
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    ℹ️ Modo Local / Demo
                  </span>
                )}
              </div>
              <p className="text-xs font-rajdhani text-slate-400 font-semibold">
                Sesión: <span className="text-slate-200">{currentUser.email || 'Admin'}</span>
              </p>
            </div>
          </div>

          {/* Botones de Acción Global */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-xl text-xs font-rajdhani font-bold bg-clan-surface border border-clan-border hover:border-clan-orange text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Ver Web
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-rajdhani font-bold bg-clan-red/20 border border-clan-red/40 hover:bg-clan-red hover:text-black text-clan-red transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>

        {/* Notificación Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-clan-orange to-clan-red text-black px-5 py-3 rounded-xl font-orbitron font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 stroke-[3]" />
            {toastMessage}
          </div>
        )}

        {/* Pestañas de Navegación del Panel */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0a0d14] rounded-2xl border border-clan-border mb-8 overflow-x-auto">
          {[
            { id: 'honores', label: 'Honores y Semanas', icon: Trophy },
            { id: 'miembros', label: 'Miembros', icon: Users },
            { id: 'premios', label: 'Muro de Premios', icon: Award },
            { id: 'staff', label: 'Líderes y Decanos', icon: UserCheck },
            { id: 'config', label: 'Configuración del Clan', icon: Settings },
            { id: 'torneos', label: 'Torneos y Dinámicas', icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-clan-orange text-black shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-clan-surface/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
{activeTab === 'torneos' && (
  <div>
    <AdminTournaments />
  </div>
)}

        {/* ==================== PESTAÑA 1: HONORES Y SEMANAS ==================== */}
        {activeTab === 'honores' && (
          <div className="space-y-8">
            
            {/* Sección de Captura Rápida de Honores */}
            <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-clan-border/60">
                <div>
                  <span className="text-xs font-orbitron font-bold text-clan-orange uppercase tracking-wider block mb-1">
                    Captura Rápida de Honores
                  </span>
                  <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white">
                    Registrar Honores de la Semana
                  </h2>
                  <p className="text-xs font-rajdhani text-slate-400 font-semibold mt-1">
                    Ingresa el número de honores de cada miembro. El ranking se recalcula solo automáticamente.
                  </p>
                </div>

                {/* Selector de qué semana capturar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={captureWeekId}
                      onChange={(e) => setCaptureWeekId(e.target.value)}
                      className="bg-[#090c12] border border-clan-orange/50 text-white rounded-xl px-4 py-2 font-rajdhani font-bold text-sm focus:outline-none focus:border-clan-orange cursor-pointer appearance-none pr-9"
                    >
                      {weeks.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.title} {w.isCurrent ? '★ (Activa)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-clan-orange absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => handleOpenWeekModal()}
                    className="p-2.5 rounded-xl bg-clan-orange/20 hover:bg-clan-orange text-clan-orange hover:text-black border border-clan-orange/50 transition-all"
                    title="Crear Nueva Semana"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Formulario / Tabla de Miembros para capturar honores */}
              {members.length > 0 ? (
                <div className="mt-6">
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {members.map((member, idx) => (
                      <div
                        key={member.id}
                        className="p-3 sm:p-4 rounded-xl bg-[#0a0d14] border border-clan-border hover:border-clan-orange/40 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-orbitron font-bold text-slate-500 w-6">
                            #{idx + 1}
                          </span>
                          <div className="w-9 h-9 rounded-lg bg-clan-surface border border-clan-border flex items-center justify-center font-orbitron font-bold text-xs text-clan-orange shrink-0">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-orbitron font-bold text-sm text-white truncate block">
                              {member.name}
                            </span>
                            <span className="text-[11px] font-rajdhani text-slate-400 font-semibold">
                              {member.role} {member.gameId ? `• ID: ${member.gameId}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Input de Honores */}
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={honorInputs[member.id] !== undefined ? honorInputs[member.id] : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHonorInputs(prev => ({ ...prev, [member.id]: val }));
                            }}
                            className="w-28 sm:w-36 bg-[#121722] border border-clan-border rounded-xl px-3 py-2 text-right font-orbitron font-black text-sm text-yellow-300 focus:outline-none focus:border-clan-orange focus:ring-1 focus:ring-clan-orange"
                          />
                          <span className="text-xs font-rajdhani uppercase font-bold text-slate-500 hidden sm:inline">
                            pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón de Guardar Honores */}
                  <div className="mt-6 pt-4 border-t border-clan-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-rajdhani text-slate-400 font-medium">
                      Los honores se ordenarán de mayor a menor automáticamente al guardar.
                    </p>
                    <button
                      onClick={handleSaveAllHonors}
                      disabled={isSavingHonors}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider text-black btn-fire flex items-center justify-center gap-2"
                    >
                      {isSavingHonors ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Guardar Todos los Honores
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-rajdhani text-slate-400 mb-4">
                    Primero debes registrar miembros en el clan para poder capturar sus honores.
                  </p>
                  <button
                    onClick={() => setActiveTab('miembros')}
                    className="px-4 py-2 rounded-xl font-orbitron font-bold text-xs bg-clan-orange text-black"
                  >
                    Ir a Agregar Miembros
                  </button>
                </div>
              )}
            </div>

            {/* Listado y Administración de Semanas Registradas */}
            <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-orbitron font-bold text-lg text-white">
                    Semanas Registradas
                  </h3>
                  <p className="text-xs font-rajdhani text-slate-400">
                    Crea nuevas semanas, activa la semana en curso o elimina semanas anteriores.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenWeekModal()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-orbitron font-bold text-xs bg-clan-orange text-black hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4" /> Nueva Semana
                </button>
              </div>

              <div className="space-y-3">
                {weeks.map(w => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-[#0a0d14] border border-clan-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-orbitron font-bold text-base text-white">
                          {w.title}
                        </h4>
                        {w.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-black">
                            ★ ACTIVA
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-rajdhani text-slate-400 font-semibold block mt-0.5">
                        {w.startDate && w.endDate ? `${w.startDate} al ${w.endDate}` : 'Sin fechas especificadas'} • {(w.records || []).length} miembros con honores
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!w.isCurrent && (
                        <button
                          onClick={() => handleToggleCurrentWeek(w)}
                          className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold bg-clan-surface hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-clan-border transition-colors"
                        >
                          Marcar Activa
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenWeekModal(w)}
                        className="p-2 rounded-lg bg-clan-surface hover:bg-clan-surface/80 text-slate-300 hover:text-clan-orange border border-clan-border"
                        title="Editar Fechas / Título"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWeek(w.id)}
                        className="p-2 rounded-lg bg-clan-surface hover:bg-clan-red/20 text-slate-400 hover:text-clan-red border border-clan-border"
                        title="Eliminar Semana"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== PESTAÑA 2: MIEMBROS ==================== */}
        {activeTab === 'miembros' && (
          <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white">
                  Gestión de Miembros ({members.length})
                </h2>
                <p className="text-xs font-rajdhani text-slate-400">
                  Agrega, modifica o elimina jugadores del clan.
                </p>
              </div>

              <button
                onClick={() => handleOpenMemberModal()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs bg-clan-orange text-black hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Agregar Miembro
              </button>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members && members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl bg-[#0e0d14] border border-clan-border flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-clan-surface border border-clan-border flex items-center justify-center font-bold text-slate-300 text-xs">
                            {m?.fecha ? m.fecha.substring(0, 10) : 'S/F'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-orbitron font-bold text-sm text-white truncate">
                              {m.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-orbitron font-semibold uppercase px-1.5 py-0.5 rounded bg-clan-surface border border-clan-border text-slate-300">
                                {m.role}
                              </span>
                              {m.gameId && (
                                <span className="text-xs font-rajdhani text-slate-400 truncate">
                                  ID: {m.gameId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenMemberModal(m)}
                            className="p-1.5 rounded-lg bg-clan-surface hover:bg-clan-surface/80 text-slate-300 hover:text-clan-orange transition-all"
                            title="Editar Miembro"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1.5 rounded-lg bg-clan-surface hover:bg-clan-red/20 text-slate-400 hover:text-clan-red transition-all"
                            title="Eliminar Miembro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center bg-[#0e0d14] rounded-xl border border-clan-border">
                      <p className="text-slate-400 text-sm font-rajdhani">
                        No hay miembros registrados todavía. ¡Haz clic en "+ Agregar Miembro" para empezar!
                      </p>
                    </div>
                  )}
                </div>
            </div>
        )}

        {/* ==================== PESTAÑA 3: PREMIOS ==================== */}
        {activeTab === 'premios' && (
          <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white">
                  Muro de Premios ({awards.length})
                </h2>
                <p className="text-xs font-rajdhani text-slate-400">
                  Crea y administra los reconocimientos especiales del clan.
                </p>
              </div>

              <button
                onClick={() => handleOpenAwardModal()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs bg-clan-orange text-black hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Nuevo Premio
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map(a => (
                <div
                  key={a.id}
                  className="p-5 rounded-xl bg-[#0a0d14] border border-clan-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-clan-surface border border-clan-orange/40 flex items-center justify-center text-clan-orange">
                        <AwardIcon name={a.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenAwardModal(a)}
                          className="p-1.5 rounded-lg bg-clan-surface text-slate-300 hover:text-clan-orange"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAward(a.id)}
                          className="p-1.5 rounded-lg bg-clan-surface text-slate-400 hover:text-clan-red"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <span className="text-[10px] font-orbitron uppercase text-clan-orange font-bold block mb-1">
                      {a.dateOrPeriod}
                    </span>
                    <h4 className="font-orbitron font-bold text-base text-white mb-1">
                      {a.title}
                    </h4>
                    <p className="text-xs font-rajdhani text-slate-400 font-medium line-clamp-2 mb-3">
                      {a.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-clan-border/60">
                    <span className="text-[10px] font-rajdhani uppercase text-slate-500 font-bold block">
                      Ganador:
                    </span>
                    <span className="font-orbitron font-bold text-sm text-yellow-300">
                      {a.winnerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PESTAÑA 4: CONFIGURACIÓN GENERAL ==================== */}
        {activeTab === 'config' && (
          <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white mb-2">
              Configuración General del Clan
            </h2>
            <p className="text-xs font-rajdhani text-slate-400 mb-6">
              Modifica los textos principales, enlaces de reclutamiento y requisitos de la web.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Nombre del Clan
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.clanName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, clanName: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-orbitron"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Lema / Slogan del Clan
                </label>
                <input
                  type="text"
                  value={settingsForm.motto}
                  onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani font-semibold text-base"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Ruta del Logo del Clan
                </label>
                <input
                  type="text"
                  value={settingsForm.logoUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-mono text-xs"
                />
                <p className="text-[11px] font-rajdhani text-slate-400 mt-1">
                  Por defecto utiliza <code className="text-clan-orange">/assets/logo.png</code> guardado en la carpeta del proyecto.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                    Enlace de Invitación de WhatsApp
                  </label>
                  <input
                    type="url"
                    value={settingsForm.whatsappUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappUrl: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani"
                  />
                </div>

                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                    Enlace de Invitación de Discord
                  </label>
                  <input
                    type="url"
                    value={settingsForm.discordUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, discordUrl: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                  Requisitos de Ingreso al Clan
                </label>
                <textarea
                  rows="3"
                  value={settingsForm.requirements}
                  onChange={(e) => setSettingsForm({ ...settingsForm, requirements: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani font-medium"
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider text-black btn-fire flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== PESTAÑA: LÍDERES Y DECANOS (STAFF) ==================== */}
        {activeTab === 'staff' && (
          <div className="gamer-card p-5 sm:p-7 rounded-2xl border-clan-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-orbitron font-black text-white">
                    Cuentas de Líderes y Decanos
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-clan-orange/20 text-clan-orange border border-clan-orange/40">
                    {staffList.length} autorizados
                  </span>
                </div>
                <p className="text-xs font-rajdhani text-slate-400 mt-1 font-semibold">
                  Gestiona las cuentas de correo autorizadas para capturar honores y administrar el clan.
                </p>
              </div>

              <button
                onClick={() => {
                  setStaffForm({ name: '', email: '', role: 'Decano', notes: '' });
                  setShowStaffModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs bg-clan-orange text-black hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Registrar Líder / Decano
              </button>
            </div>

            {/* Tarjeta explicativa de acceso */}
            <div className="mb-6 p-4 rounded-xl bg-[#090d14] border border-cyan-500/30 flex items-start gap-3">
              <Key className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs font-rajdhani text-slate-300">
                <span className="font-bold text-cyan-300 block mb-0.5 font-orbitron text-[11px]">
                  ¿Cómo entran los líderes y decanos?
                </span>
                Cada líder y decano puede ingresar a <code className="text-clan-orange font-bold font-mono">/admin</code> con su propio correo y contraseña desde su celular o PC. En Firebase Authentication puedes registrar sus cuentas en segundos, o agregarlos aquí para autorizarlos en el sistema.
              </div>
            </div>

            {/* Grid de Cuentas Autorizadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="p-5 rounded-2xl bg-[#0a0d14] border border-clan-border hover:border-clan-orange/50 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-clan-surface border border-clan-border flex items-center justify-center font-orbitron font-black text-sm text-clan-orange">
                        {staff.role === 'Líder General' ? '👑' : '⚔️'}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold uppercase ${
                        staff.role === 'Líder General' 
                          ? 'bg-clan-red/20 text-clan-red border border-clan-red/40' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {staff.role}
                      </span>
                    </div>

                    <h4 className="font-orbitron font-black text-base text-white truncate mb-1">
                      {staff.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs font-rajdhani text-slate-400 mb-2">
                      <span className="text-slate-500 font-bold">Correo:</span>
                      <span className="text-slate-200 font-mono text-[11px] truncate">{staff.email}</span>
                    </div>

                    {staff.notes && (
                      <p className="text-[11px] font-rajdhani text-slate-400 bg-clan-surface/60 p-2 rounded-lg border border-clan-border/40">
                        {staff.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-clan-border/60 flex items-center justify-between">
                    <span className="text-[10px] font-orbitron font-semibold text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Acceso Habilitado
                    </span>

                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="p-1.5 rounded-lg bg-clan-surface hover:bg-clan-red/20 text-slate-400 hover:text-clan-red transition-colors"
                      title="Eliminar cuenta de staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL: CREAR / EDITAR SEMANA ==================== */}
      {showWeekModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gamer-card p-6 rounded-2xl max-w-md w-full border-clan-orange/50">
            <h3 className="font-orbitron font-black text-lg text-white mb-4">
              {editingWeek ? 'Editar Semana' : 'Crear Nueva Semana'}
            </h3>

            <form onSubmit={handleSaveWeek} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Título de la Semana
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Semana 45 (04 Nov - 10 Nov)"
                  value={weekForm.title}
                  onChange={(e) => setWeekForm({ ...weekForm, title: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={weekForm.startDate}
                    onChange={(e) => setWeekForm({ ...weekForm, startDate: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                  />
                </div>
                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={weekForm.endDate}
                    onChange={(e) => setWeekForm({ ...weekForm, endDate: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={weekForm.isCurrent}
                  onChange={(e) => setWeekForm({ ...weekForm, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#0a0d14] border-clan-border text-clan-orange focus:ring-clan-orange"
                />
                <span className="text-xs font-rajdhani font-bold text-slate-200">
                  Establecer como semana actual en curso
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-clan-border/60">
                <button
                  type="button"
                  onClick={() => setShowWeekModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-rajdhani font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs text-black btn-fire"
                >
                  Guardar Semana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CREAR / EDITAR MIEMBRO ==================== */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gamer-card p-6 rounded-2xl max-w-md w-full border-clan-orange/50">
            <h3 className="font-orbitron font-black text-lg text-white mb-4">
              {editingMember ? 'Editar Miembro' : 'Agregar Nuevo Miembro'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Nombre / Nickname en Free Fire
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: BF_APOCALIPSIS"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-orbitron"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  ID de Free Fire
                </label>
                <input
                  type="text"
                  placeholder="Ej: 2984719284"
                  value={memberForm.gameId}
                  onChange={(e) => setMemberForm({ ...memberForm, gameId: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Rol en el Clan
                </label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                >
                  <option value="Miembro">Miembro</option>
                  <option value="Sublíder">Sublíder</option>
                  <option value="Líder">Líder</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  URL de Avatar (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={memberForm.avatarUrl}
                  onChange={(e) => setMemberForm({ ...memberForm, avatarUrl: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-clan-border/60">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-rajdhani font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs text-black btn-fire"
                >
                  Guardar Miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CREAR / EDITAR PREMIO ==================== */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gamer-card p-6 rounded-2xl max-w-md w-full border-clan-orange/50">
            <h3 className="font-orbitron font-black text-lg text-white mb-4">
              {editingAward ? 'Editar Premio' : 'Nuevo Reconocimiento'}
            </h3>

            <form onSubmit={handleSaveAward} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Nombre del Premio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MVP de la Semana, Mejor Novato..."
                  value={awardForm.title}
                  onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-orbitron"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Descripción
                </label>
                <textarea
                  rows="2"
                  placeholder="Razón por la cual se otorga el reconocimiento..."
                  value={awardForm.description}
                  onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Ganador
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nickname del ganador"
                    value={awardForm.winnerName}
                    onChange={(e) => setAwardForm({ ...awardForm, winnerName: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-orbitron text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Ícono Gamer
                  </label>
                  <select
                    value={awardForm.icon}
                    onChange={(e) => setAwardForm({ ...awardForm, icon: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                  >
                    <option value="Trophy">Trofeo (Trophy)</option>
                    <option value="Flame">Fuego (Flame)</option>
                    <option value="Crown">Corona (Crown)</option>
                    <option value="Star">Estrella (Star)</option>
                    <option value="Medal">Medalla (Medal)</option>
                    <option value="Target">Diana (Target)</option>
                    <option value="Shield">Escudo (Shield)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Semana o Mes de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ej: Semana 44 o Noviembre 2026"
                  value={awardForm.dateOrPeriod}
                  onChange={(e) => setAwardForm({ ...awardForm, dateOrPeriod: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-clan-border/60">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-rajdhani font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs text-black btn-fire"
                >
                  Guardar Premio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: REGISTRAR LÍDER / DECANO ==================== */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="gamer-card p-6 rounded-2xl max-w-md w-full border-clan-orange/50">
            <h3 className="font-orbitron font-black text-lg text-white mb-4">
              Registrar Cuenta de Líder o Decano
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Nombre / Nickname del Jugador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: CJ_VULCANO"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-orbitron"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Correo Electrónico de Acceso
                </label>
                <input
                  type="email"
                  required
                  placeholder="decano@crazyjunior.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Cargo de Staff
                </label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani font-bold"
                >
                  <option value="Decano">Decano</option>
                  <option value="Decana">Decana</option>
                  <option value="Líder General">Líder General</option>
                  <option value="Sublíder">Sublíder</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Responsabilidad / Notas (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Captura de honores semanales"
                  value={staffForm.notes}
                  onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-clan-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-clan-orange font-rajdhani"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-clan-border/60">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-rajdhani font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs text-black btn-fire"
                >
                  Habilitar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
