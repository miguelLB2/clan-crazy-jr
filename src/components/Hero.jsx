import React from 'react';
import { Flame, Trophy, Award, ChevronRight, Shield, Medal, Star, Sparkles, Crown } from 'lucide-react';
import AwardIcon from './AwardIcon';

export default function Hero({ clanSettings, currentWeek, awards }) {
  // Obtener top 3 de la semana actual
  const topRecords = (currentWeek?.records || []).slice(0, 3);
  const first = topRecords[0];
  const second = topRecords[1];
  const third = topRecords[2];

  // Últimos 3 premios para vista previa
  const recentAwards = (awards || []).slice(0, 3);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Luces y resplandores de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-clan-orange/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-clan-red/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera Principal */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          
          {/* Logo Hero con Resplandor */}
          <div className="relative inline-block mb-6 group">
            <div className="absolute -inset-3 bg-gradient-to-r from-clan-orange via-clan-red to-amber-500 rounded-3xl opacity-75 blur-xl group-hover:opacity-100 transition duration-500 animate-flame-pulse"></div>
            <div className="relative p-2 bg-gradient-to-b from-[#1c2436] to-[#0c1018] rounded-3xl border-2 border-clan-orange/50 shadow-2xl">
              <img 
                src={clanSettings?.logoUrl || "/assets/logo.png"} 
                alt="Logo Clan" 
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-2xl transform group-hover:scale-105 transition duration-300"
                onError={(e) => { e.target.src = "/assets/logo.png"; }}
              />
            </div>
            {/* Insignia Oficial */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-clan-orange to-clan-red text-black font-orbitron font-black text-[11px] rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 fill-black" /> Clan Oficial
            </div>
          </div>

          {/* Nombre y Lema */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-orbitron font-black uppercase tracking-tight text-white mt-4 mb-4">
            <span className="text-flame-gradient block">{clanSettings?.clanName || "CRAZY JR"}</span>
          </h1>

          <p className="text-base sm:text-xl font-rajdhani font-semibold text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            "{clanSettings?.motto || "¡Dominando las salas con pura adrenalina y honor!"}"
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('unete')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-orbitron font-black text-sm uppercase tracking-wider text-black btn-fire flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 fill-black" />
              ¡Únete al Clan!
            </button>
            <button
              onClick={() => scrollToSection('honores')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider text-slate-200 bg-clan-surface/80 hover:bg-clan-surface border border-clan-border hover:border-clan-orange transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-clan-gold" />
              Ver Honores de la Semana
            </button>
          </div>
        </div>

        {/* ==================== PODIO TOP 3 DE LA SEMANA ==================== */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Podio de Honor
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white">
              Top 3 de la Semana
            </h2>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-400 mt-1">
              {currentWeek?.title || "Semana Actual"}
            </p>
          </div>

          {topRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end max-w-4xl mx-auto">
              
              {/* PUESTO 2 - PLATA */}
              {second && (
                <div className="order-2 md:order-1 gamer-card p-6 rounded-2xl border-slate-400/40 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/10 rounded-full blur-2xl"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-800 border-2 border-slate-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Medal className="w-8 h-8 text-slate-200" />
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-orbitron font-bold bg-slate-700/80 text-slate-200 border border-slate-500/50 mb-2">
                    #2 PUESTO
                  </span>
                  <h3 className="font-orbitron font-black text-lg text-white truncate px-2">
                    {second.memberName}
                  </h3>
                  <div className="mt-3 py-2 px-3 bg-clan-surface/80 rounded-xl border border-clan-border">
                    <span className="text-[11px] font-rajdhani uppercase tracking-wider text-slate-400 block font-semibold">Honores Semanales</span>
                    <span className="text-xl font-orbitron font-black text-slate-100">
                      {Number(second.honors).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              )}

              {/* PUESTO 1 - ORO (ELEVADO Y CENTRADO) */}
              {first && (
                <div className="order-1 md:order-2 gamer-card p-7 rounded-2xl border-amber-400/60 bg-gradient-to-b from-[#221c13] to-[#0f141f] text-center relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_35px_rgba(245,158,11,0.25)] group">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
                  
                  {/* Corona de Ganador */}
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-yellow-200 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform animate-bounce duration-1000">
                    <Crown className="w-9 h-9 text-black fill-black" />
                  </div>

                  <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-orbitron font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-black shadow-md mb-2">
                    <Sparkles className="w-3 h-3" /> #1 CAMPEÓN
                  </span>

                  <h3 className="font-orbitron font-black text-xl text-yellow-300 truncate px-2">
                    {first.memberName}
                  </h3>

                  <div className="mt-4 py-2.5 px-4 bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-xl border border-amber-400/40">
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-amber-200 block font-bold">Máximo Honor</span>
                    <span className="text-2xl sm:text-3xl font-orbitron font-black text-yellow-300">
                      {Number(first.honors).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              )}

              {/* PUESTO 3 - BRONCE */}
              {third && (
                <div className="order-3 gamer-card p-6 rounded-2xl border-amber-700/50 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-800/10 rounded-full blur-2xl"></div>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-950/80 border-2 border-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Medal className="w-8 h-8 text-amber-500" />
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-orbitron font-bold bg-amber-900/60 text-amber-300 border border-amber-700/60 mb-2">
                    #3 PUESTO
                  </span>
                  <h3 className="font-orbitron font-black text-lg text-white truncate px-2">
                    {third.memberName}
                  </h3>
                  <div className="mt-3 py-2 px-3 bg-clan-surface/80 rounded-xl border border-clan-border">
                    <span className="text-[11px] font-rajdhani uppercase tracking-wider text-slate-400 block font-semibold">Honores Semanales</span>
                    <span className="text-xl font-orbitron font-black text-slate-100">
                      {Number(third.honors).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center p-8 gamer-card rounded-2xl max-w-md mx-auto border-dashed border-clan-border">
              <Trophy className="w-10 h-10 text-clan-orange/50 mx-auto mb-2" />
              <p className="font-rajdhani font-semibold text-slate-400">
                Aún no hay honores capturados para esta semana. El administrador los ingresará pronto.
              </p>
            </div>
          )}
        </div>

        {/* ==================== VISTA PREVIA DE ÚLTIMOS PREMIOS ==================== */}
        {recentAwards.length > 0 && (
          <div className="border-t border-clan-border/60 pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="font-orbitron font-bold text-lg text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-clan-orange" />
                  Muro de Honor • Últimos Premios
                </h3>
                <p className="text-xs font-rajdhani text-slate-400">
                  Reconocimientos otorgados por el liderazgo del clan
                </p>
              </div>
              <button
                onClick={() => scrollToSection('premios')}
                className="text-xs font-rajdhani font-bold text-clan-orange hover:text-clan-red flex items-center gap-1 transition-colors uppercase tracking-wider"
              >
                Ver todos los premios <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAwards.map((award) => (
                <div 
                  key={award.id} 
                  className="gamer-card p-4 rounded-xl flex items-center gap-3.5 border-clan-border/80 hover:border-clan-orange/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-clan-surface border border-clan-orange/40 flex items-center justify-center shrink-0 text-clan-orange shadow-inner">
                    <AwardIcon name={award.icon} className="w-6 h-6 text-clan-orange" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-orbitron font-semibold uppercase px-2 py-0.5 rounded bg-clan-orange/15 text-clan-orange border border-clan-orange/30">
                        {award.dateOrPeriod || "Reciente"}
                      </span>
                    </div>
                    <h4 className="font-orbitron font-bold text-sm text-white truncate mt-1">
                      {award.title}
                    </h4>
                    <p className="text-xs font-rajdhani text-slate-300 flex items-center gap-1 font-semibold truncate">
                      <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                      Ganador: <span className="text-yellow-300 font-bold">{award.winnerName}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
