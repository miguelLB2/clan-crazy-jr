import React from 'react';
import { MessageSquare, ExternalLink, ShieldCheck, Flame, UserPlus } from 'lucide-react';

export default function JoinSection({ clanSettings }) {
  const whatsappUrl = clanSettings?.whatsappUrl || "https://chat.whatsapp.com/";
  const discordUrl = clanSettings?.discordUrl || "https://discord.gg/";
  const requirements = clanSettings?.requirements || "Nivel 50+, actividad constante en salas de clan los fines de semana, cumplir con los honores semanales y respeto mutuo entre compañeros.";

  return (
    <section id="unete" className="py-16 sm:py-24 relative bg-clan-surface/40 border-t border-clan-border/70 overflow-hidden">
      {/* Luz ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-clan-orange/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
            <UserPlus className="w-3.5 h-3.5 text-clan-orange" /> Reclutamiento Abierto
          </div>
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
            Únete a la Familia {clanSettings?.clanName || "CRAZY JR"}
          </h2>
          <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-2">
            ¿Tienes lo necesario para combatir junto a los mejores y dominar las salas? Contáctanos por nuestros canales oficiales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Tarjeta de Requisitos */}
          <div className="gamer-card p-6 sm:p-7 rounded-2xl border-clan-border flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-clan-surface border border-clan-border flex items-center justify-center text-clan-orange mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-3">
                Requisitos del Clan
              </h3>
              <p className="text-sm font-rajdhani text-slate-300 leading-relaxed font-medium">
                {requirements}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-clan-border/60">
              <span className="text-xs font-orbitron font-semibold text-clan-orange flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-clan-red" /> Compromiso y Lealtad
              </span>
            </div>
          </div>

          {/* Tarjeta de WhatsApp */}
          <div className="gamer-card p-6 sm:p-7 rounded-2xl border-emerald-500/30 hover:border-emerald-500/70 bg-gradient-to-b from-[#0e1d16] to-[#0a120f] flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-orbitron font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                Canal Principal
              </span>
              <h3 className="font-orbitron font-black text-xl text-white mb-2">
                Grupo de WhatsApp
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 leading-relaxed font-medium mb-6">
                Ingresa a nuestro grupo de reclutamiento oficial para realizar tu prueba de ingreso y coordinar salas.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all"
            >
              Unirse por WhatsApp <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Tarjeta de Discord */}
          <div className="gamer-card p-6 sm:p-7 rounded-2xl border-indigo-500/30 hover:border-indigo-500/70 bg-gradient-to-b from-[#131629] to-[#0b0d18] flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-orbitron font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                Servidor de Voz
              </span>
              <h3 className="font-orbitron font-black text-xl text-white mb-2">
                Servidor de Discord
              </h3>
              <p className="text-xs font-rajdhani text-slate-300 leading-relaxed font-medium mb-6">
                Conéctate a nuestras llamadas de voz durante torneos, salas privadas y entrenamientos competitivos.
              </p>
            </div>

            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all"
            >
              Entrar a Discord <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
