import React, { useState } from 'react';
import { Trophy, Medal, Search, Flame, Crown, Copy, Check, Shield } from 'lucide-react';

export default function WeeklyHonors({ currentWeek, members }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Mapa de miembros para obtener Free Fire ID y Rol rápidamente
  const memberMap = new Map((members || []).map(m => [m.id, m]));

  const records = Array.isArray(currentWeek?.records) ? currentWeek.records : [];

  // Filtrar por término de búsqueda
  const filteredRecords = records.filter(r => {
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5 text-clan-red" /> Tabla de Clasificación
            </div>
            <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
              Honores de la Semana
            </h2>
            <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-1">
              {currentWeek?.title || "Semana actual activa"}
            </p>
          </div>

          {/* Buscador de miembros */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por apodo o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0d14] border border-clan-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-clan-orange font-rajdhani font-medium transition-colors"
            />
          </div>
        </div>

        {/* Tabla / Lista de Honores */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record, index) => {
              const member = memberMap.get(record.memberId);
              const isTopThree = index < 3;

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

                  {/* Honores de la Semana (Número Único) */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-clan-border/50">
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold sm:hidden">
                      Honores Semanales:
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold hidden sm:block">
                        Honores
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
              {searchTerm ? "No hay miembros que coincidan con la búsqueda." : "El administrador aún no ha cargado honores para esta semana."}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
