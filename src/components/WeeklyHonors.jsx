import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Search, Flame, Crown, Copy, Check, Shield, Calendar, Sparkles, ChevronDown } from 'lucide-react';

export default function WeeklyHonors({ currentWeek, weeks = [], members = [] }) {
  const [viewMode, setViewMode] = useState('semanal'); // 'semanal' | 'mensual'
  const [selectedMonthKey, setSelectedMonthKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Mapa de miembros para obtener Free Fire ID y Rol rápidamente
  const memberMap = useMemo(() => {
    return new Map((members || []).filter(Boolean).map(m => [m.id, m]));
  }, [members]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Helper para extraer YYYY-MM de una semana
  const getWeekMonthKey = (w) => {
    if (w?.startDate && typeof w.startDate === 'string' && w.startDate.length >= 7) {
      return w.startDate.substring(0, 7);
    }
    if (w?.start_date && typeof w.start_date === 'string' && w.start_date.length >= 7) {
      return w.start_date.substring(0, 7);
    }
    if (w?.created_at && typeof w.created_at === 'string') {
      return w.created_at.substring(0, 7);
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Extraer meses disponibles únicos a partir de las semanas
  const availableMonths = useMemo(() => {
    const map = new Map();
    (weeks || []).filter(Boolean).forEach(w => {
      const key = getWeekMonthKey(w);
      const parts = key.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const label = `${monthNames[m - 1] || 'Mes ' + m} ${y}`;
        if (!map.has(key)) {
          map.set(key, { key, label, year: y, month: m });
        }
      }
    });

    if (map.size === 0) {
      const now = new Date();
      const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, { key, label: `${monthNames[now.getMonth()]} ${now.getFullYear()}`, year: now.getFullYear(), month: now.getMonth() + 1 });
    }

    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [weeks]);

  const activeMonthKey = selectedMonthKey || (availableMonths[0]?.key || '');
  const activeMonthObj = availableMonths.find(m => m.key === activeMonthKey) || availableMonths[0];

  // Semanas correspondientes al mes activo
  const weeksInActiveMonth = useMemo(() => {
    return (weeks || []).filter(Boolean).filter(w => getWeekMonthKey(w) === activeMonthKey);
  }, [weeks, activeMonthKey]);

  // Cálculo acumulado mensual (suma de todas las semanas del mes por miembro)
  const monthlyRecords = useMemo(() => {
    const totals = new Map();

    // Inicializar todos los miembros del clan con 0
    (members || []).filter(Boolean).forEach(m => {
      totals.set(m.id, {
        memberId: m.id,
        memberName: m.name,
        honors: 0,
        weeksCount: 0
      });
    });

    // Sumar los honores de cada semana del mes seleccionado
    weeksInActiveMonth.forEach(w => {
      const recs = Array.isArray(w.records) ? w.records : [];
      recs.forEach(r => {
        if (!r || !r.memberId) return;
        if (!totals.has(r.memberId)) {
          totals.set(r.memberId, {
            memberId: r.memberId,
            memberName: r.memberName || 'Miembro',
            honors: 0,
            weeksCount: 0
          });
        }
        const item = totals.get(r.memberId);
        const val = Number(r.honors) || 0;
        item.honors += val;
        if (val > 0) {
          item.weeksCount += 1;
        }
      });
    });

    return Array.from(totals.values()).sort((a, b) => b.honors - a.honors);
  }, [members, weeksInActiveMonth]);

  // Registros según el modo seleccionado
  const recordsToDisplay = viewMode === 'mensual'
    ? monthlyRecords
    : (Array.isArray(currentWeek?.records) ? currentWeek.records : []);

  // Total acumulado del clan
  const totalClanHonors = useMemo(() => {
    return recordsToDisplay.reduce((acc, r) => acc + (Number(r.honors) || 0), 0);
  }, [recordsToDisplay]);

  // Filtrar por término de búsqueda
  const filteredRecords = recordsToDisplay.filter(r => {
    if (!r) return false;
    const member = memberMap.get(r.memberId);
    const search = searchTerm.toLowerCase();
    const nameMatch = r.memberName?.toLowerCase().includes(search);
    const idMatch = member?.gameId?.toLowerCase().includes(search);
    return nameMatch || idMatch;
  });

  const handleCopyId = (gameId, e) => {
    e.stopPropagation();
    if (!gameId) return;
    navigator.clipboard.writeText(gameId);
    setCopiedId(gameId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black font-orbitron font-black text-xs shadow-md">
          <Crown className="w-3.5 h-3.5 fill-black" />
          #1 ORO
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-300 text-slate-900 font-orbitron font-black text-xs shadow-md">
          <Medal className="w-3.5 h-3.5" />
          #2 PLATA
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700 text-amber-100 font-orbitron font-black text-xs shadow-md">
          <Medal className="w-3.5 h-3.5" />
          #3 BRONCE
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-clan-surface border border-clan-border flex items-center justify-center font-orbitron font-bold text-slate-300 text-xs">
        #{index + 1}
      </div>
    );
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Líder':
        return <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold bg-clan-red/20 text-clan-red border border-clan-red/40">LÍDER</span>;
      case 'Sublíder':
        return <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">SUBLÍDER</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-medium bg-slate-800 text-slate-400 border border-slate-700">MIEMBRO</span>;
    }
  };

  return (
    <section id="honores" className="py-16 sm:py-20 relative bg-clan-surface/40 border-y border-clan-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5 text-clan-red" /> Tabla de Clasificación
            </div>
            <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
              {viewMode === 'mensual' ? 'Honores del Mes' : 'Honores de la Semana'}
            </h2>
            <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-1">
              {viewMode === 'mensual'
                ? `Acumulado total de ${activeMonthObj?.label} (${weeksInActiveMonth.length} semanas sumadas)`
                : (currentWeek?.title || 'Semana actual activa')}
            </p>
          </div>

          {/* Selector de Modo: Semanal vs Mensual + Buscador */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Pestañas de modo */}
            <div className="inline-flex p-1 bg-[#090c12] rounded-xl border border-clan-border shrink-0">
              <button
                onClick={() => setViewMode('semanal')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-orbitron font-bold text-xs transition-all ${
                  viewMode === 'semanal'
                    ? 'bg-gradient-to-r from-clan-orange to-clan-red text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                Semanal
              </button>
              <button
                onClick={() => setViewMode('mensual')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-orbitron font-bold text-xs transition-all ${
                  viewMode === 'mensual'
                    ? 'bg-gradient-to-r from-clan-orange to-clan-red text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Mensual
              </button>
            </div>

            {/* Selector de Mes (solo visible en modo mensual) */}
            {viewMode === 'mensual' && availableMonths.length > 0 && (
              <div className="relative">
                <select
                  value={activeMonthKey}
                  onChange={(e) => setSelectedMonthKey(e.target.value)}
                  className="w-full sm:w-auto bg-[#090c12] border border-clan-orange/50 text-white rounded-xl px-3.5 py-2 font-rajdhani font-bold text-xs focus:outline-none focus:border-clan-orange cursor-pointer appearance-none pr-8"
                >
                  {availableMonths.map(m => (
                    <option key={m.key} value={m.key} className="bg-[#0f141f] text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-clan-orange absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Buscador de miembros */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por apodo o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0d14] border border-clan-border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-clan-orange font-rajdhani font-medium transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Barra Informativa del Acumulado Mensual */}
        {viewMode === 'mensual' && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-clan-surface to-clan-surface border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-yellow-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-orbitron font-bold text-sm text-white block">
                  Ranking Acumulado — {activeMonthObj?.label}
                </span>
                <span className="text-xs font-rajdhani text-slate-300 font-semibold">
                  Suma automática de las {weeksInActiveMonth.length} semanas registradas en este mes.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-[#0a0d14] px-3.5 py-1.5 rounded-lg border border-clan-border">
              <span className="text-xs font-rajdhani text-slate-400 font-bold uppercase">Total del Clan:</span>
              <span className="font-orbitron font-black text-sm text-yellow-300">
                {totalClanHonors.toLocaleString('es-MX')}
              </span>
            </div>
          </div>
        )}

        {/* Tabla / Lista de Honores */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record, index) => {
              const member = memberMap.get(record.memberId);

              return (
                <div
                  key={record.memberId || index}
                  className={`gamer-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                    index === 0
                      ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-clan-card to-clan-card shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : index === 1
                      ? 'border-slate-400/40'
                      : index === 2
                      ? 'border-amber-700/40'
                      : 'border-clan-border'
                  }`}
                >
                  {/* Posición, Avatar y Datos del Miembro */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="shrink-0">
                      {getRankBadge(index)}
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-clan-surface border border-clan-border flex items-center justify-center font-orbitron font-bold text-sm text-clan-orange shrink-0 shadow-inner">
                      {record.memberName ? record.memberName.substring(0, 2).toUpperCase() : 'FF'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-orbitron font-bold text-base text-white truncate">
                          {record.memberName}
                        </span>
                        {member && getRoleBadge(member.role)}
                        {viewMode === 'mensual' && record.weeksCount !== undefined && (
                          <span className="text-[10px] font-rajdhani font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            {record.weeksCount} {record.weeksCount === 1 ? 'semana' : 'semanas'}
                          </span>
                        )}
                      </div>

                      {member?.gameId && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-rajdhani text-slate-400 font-semibold tracking-wide">
                            ID: {member.gameId}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(member.gameId, e)}
                            title="Copiar ID de Free Fire"
                            className="p-1 rounded bg-clan-surface border border-clan-border hover:border-clan-orange text-slate-400 hover:text-clan-orange transition-colors"
                          >
                            {copiedId === member.gameId ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          {copiedId === member.gameId && (
                            <span className="text-[10px] text-green-400 font-rajdhani font-bold">¡Copiado!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Honores del Miembro */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-clan-border/50">
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold sm:hidden">
                      {viewMode === 'mensual' ? 'Total Mensual:' : 'Honores Semanales:'}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold hidden sm:block">
                        {viewMode === 'mensual' ? 'Total Mes' : 'Honores'}
                      </div>
                      <div className={`font-orbitron font-black text-xl sm:text-2xl ${
                        index === 0 ? 'text-yellow-300' : index === 1 ? 'text-slate-200' : index === 2 ? 'text-amber-400' : 'text-clan-orange'
                      }`}>
                        {Number(record.honors || 0).toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 gamer-card rounded-2xl border-dashed border-clan-border">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-orbitron font-bold text-lg text-slate-300">No se encontraron registros</h3>
            <p className="text-sm font-rajdhani text-slate-500 mt-1">
              {searchTerm 
                ? "No hay miembros que coincidan con la búsqueda." 
                : (viewMode === 'mensual'
                    ? "Aún no hay semanas registradas con honores para este mes."
                    : "El administrador aún no ha cargado honores para esta semana.")}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
