import React from 'react';
import { Award, Trophy, Sparkles, Calendar } from 'lucide-react';
import AwardIcon from './AwardIcon';

export default function AwardsSection({ awards }) {
  return (
    <section id="premios" className="py-16 sm:py-20 relative bg-[#090c12]/70 border-t border-clan-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
            <Award className="w-3.5 h-3.5" /> Salón de la Fama
          </div>
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
            Muro de Honor y Premios
          </h2>
          <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-2">
            Reconocimientos especiales otorgados a los miembros más sobresalientes, leales y comprometidos del clan.
          </p>
        </div>

        {/* Malla de Tarjetas de Premios */}
        {awards && awards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {awards.map((award) => (
              <div
                key={award.id}
                className="gamer-card p-6 rounded-2xl flex flex-col justify-between border-clan-border hover:border-clan-orange/60 relative group"
              >
                {/* Resplandor decorativo al hover */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-clan-orange/5 group-hover:bg-clan-orange/15 rounded-full blur-2xl transition-all pointer-events-none"></div>

                <div>
                  {/* Cabecera con Ícono y Fecha */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-clan-surface to-[#161d2b] border border-clan-orange/40 flex items-center justify-center text-clan-orange shadow-lg group-hover:scale-110 group-hover:border-clan-orange transition-all">
                      <AwardIcon name={award.icon} className="w-7 h-7 text-clan-orange" />
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-orbitron font-bold uppercase px-2.5 py-1 rounded-full bg-clan-surface border border-clan-border text-slate-300">
                      <Calendar className="w-3 h-3 text-clan-orange" />
                      {award.dateOrPeriod || 'Honor'}
                    </span>
                  </div>

                  {/* Título y Descripción del Premio */}
                  <h3 className="font-orbitron font-black text-lg text-white mb-2 leading-snug group-hover:text-yellow-300 transition-colors">
                    {award.title}
                  </h3>

                  <p className="text-xs font-rajdhani text-slate-400 leading-relaxed font-medium mb-6">
                    {award.description}
                  </p>
                </div>

                {/* Ganador */}
                <div className="pt-4 border-t border-clan-border/60">
                  <span className="text-[10px] font-rajdhani uppercase tracking-widest text-slate-400 font-bold block mb-1">
                    Ganador Reconocido
                  </span>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-orbitron font-black text-base text-yellow-300 truncate">
                      {award.winnerName}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 gamer-card rounded-2xl max-w-md mx-auto">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-rajdhani font-semibold text-slate-400">
              Aún no se han publicado premios en el Muro de Honor.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
