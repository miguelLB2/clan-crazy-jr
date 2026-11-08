import React, { useState } from 'react';
import { History, Calendar, Trophy, Medal, ChevronDown, Flame } from 'lucide-react';

export default function HistorySection({ weeks, members }) {
  // Filtrar semanas pasadas o permitir ver cualquiera
  const [selectedWeekId, setSelectedWeekId] = useState(weeks && weeks.length > 1 ? weeks[1].id : (weeks?.[0]?.id || ''));

  // Asegurar que si cambia la lista de semanas, se seleccione una válida
  const currentSelectedWeek = (weeks || []).find(w => w.id === selectedWeekId) || weeks?.[0];

  const memberMap = new Map((members || []).map(m => [m.id, m]));

  const records = currentSelectedWeek?.records || [];

  return (
    <section id="historial" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
            <History className="w-3.5 h-3.5" /> Archivo del Clan
          </div>
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
            Historial de Semanas
          </h2>
          <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-2">
            Consulta los honores y rankings obtenidos por nuestros guerreros en semanas anteriores.
          </p>
        </div>

        {/* Selector de Semanas */}
        {weeks && weeks.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            
            {/* Control del Selector */}
            <div className="gamer-card p-4 sm:p-6 rounded-2xl mb-8 border-clan-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-clan-surface border border-clan-border flex items-center justify-center text-clan-orange shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <label htmlFor="weekSelector" className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold block">
                    Seleccionar Semana
                  </label>
                  <span className="font-orbitron font-bold text-sm text-slate-200">
                    {currentSelectedWeek?.title || "Elige una semana"}
                  </span>
                </div>
              </div>

              <div className="relative">
                <select
                  id="weekSelector"
                  value={currentSelectedWeek?.id || ''}
                  onChange={(e) => setSelectedWeekId(e.target.value)}
                  className="w-full sm:w-72 bg-[#090c12] border border-clan-orange/50 text-white rounded-xl px-4 py-2.5 font-rajdhani font-bold text-sm focus:outline-none focus:border-clan-orange focus:ring-1 focus:ring-clan-orange cursor-pointer appearance-none pr-10"
                >
                  {weeks.map((w) => (
                    <option key={w.id} value={w.id} className="bg-[#0f141f] text-slate-200 py-1">
                      {w.title} {w.isCurrent ? '★ (Actual)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-clan-orange absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Resumen y Tabla de la Semana Seleccionada */}
            {currentSelectedWeek ? (
              <div>
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-xs font-orbitron font-bold uppercase tracking-wider text-clan-orange">
                    {currentSelectedWeek.startDate && currentSelectedWeek.endDate ? (
                      `Período: ${currentSelectedWeek.startDate} al ${currentSelectedWeek.endDate}`
                    ) : (
                      currentSelectedWeek.title
                    )}
                  </span>
                  <span className="text-xs font-rajdhani font-bold text-slate-400">
                    {records.length} miembros registrados
                  </span>
                </div>

                <div className="space-y-2.5">
                  {records.map((record, index) => {
                    const member = memberMap.get(record.memberId);
                    return (
                      <div
                        key={record.memberId || index}
                        className="gamer-card p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 border-clan-border/70 hover:border-clan-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs shrink-0 ${
                            index === 0 ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/40' :
                            index === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40' :
                            index === 2 ? 'bg-amber-800/20 text-amber-500 border border-amber-700/40' :
                            'bg-clan-surface text-slate-400 border border-clan-border'
                          }`}>
                            #{index + 1}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-orbitron font-bold text-sm text-slate-100 truncate">
                              {record.memberName}
                            </h4>
                            {member?.gameId && (
                              <span className="text-[11px] font-rajdhani text-slate-400 font-semibold block">
                                ID: {member.gameId}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-rajdhani uppercase tracking-wider text-slate-400 font-bold block">
                            Honores
                          </span>
                          <span className={`font-orbitron font-bold text-base sm:text-lg ${
                            index === 0 ? 'text-yellow-300' : index === 1 ? 'text-slate-200' : index === 2 ? 'text-amber-400' : 'text-clan-orange'
                          }`}>
                            {Number(record.honors || 0).toLocaleString('es-MX')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

          </div>
        ) : (
          <div className="text-center py-10 gamer-card rounded-2xl max-w-md mx-auto">
            <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-rajdhani font-semibold text-slate-400">
              No hay historial de semanas previas disponible en este momento.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
