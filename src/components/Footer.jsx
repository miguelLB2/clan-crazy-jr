import React from 'react';
import { Flame, Lock, Heart, Shield } from 'lucide-react';

export default function Footer({ clanSettings, setCurrentView }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070a] border-t border-clan-border py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-clan-border/60">
          
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <img 
              src={clanSettings?.logoUrl || "/assets/logo.png"} 
              alt="Logo del Clan" 
              className="w-12 h-12 rounded-full object-cover border border-clan-orange/50 shadow-md"
              onError={(e) => { e.target.src = "/assets/logo.png"; }}
            />
            <div>
              <span className="font-orbitron font-black text-lg text-white block">
                {clanSettings?.clanName || "CRAZY JR"}
              </span>
              <span className="text-xs font-rajdhani text-slate-400 font-semibold">
                "{clanSettings?.motto || "¡Dominando las salas con pura adrenalina y honor!"}"
              </span>
            </div>
          </div>

          {/* Enlace al Panel Admin */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron font-bold text-slate-300 hover:text-clan-orange bg-clan-surface border border-clan-border hover:border-clan-orange transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-clan-orange" />
              Acceso a Administración
            </button>
          </div>

        </div>

        {/* Disclaimer y Créditos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-rajdhani text-slate-500 text-center sm:text-left">
          <p>
            © {currentYear} <span className="text-slate-300 font-semibold">{clanSettings?.clanName || "CRAZY JR"}</span>. Todos los derechos reservados.
          </p>
          <p className="max-w-md text-[11px] leading-relaxed">
            Página oficial administrada de manera independiente por los líderes del clan. Free Fire es una marca registrada de Garena International.
          </p>
        </div>

      </div>
    </footer>
  );
}
