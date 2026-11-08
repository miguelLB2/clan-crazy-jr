import React, { useState } from 'react';
import { Menu, X, Shield, Flame, Trophy, Users, History, Award, UserCheck, Lock } from 'lucide-react';

export default function Navbar({ clanSettings, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '#inicio', icon: Flame },
    { label: 'Honores', href: '#honores', icon: Trophy },
    { label: 'Historial', href: '#historial', icon: History },
    { label: 'Premios', href: '#premios', icon: Award },
    { label: 'Miembros', href: '#miembros', icon: Users },
    { label: 'Únete', href: '#unete', icon: UserCheck },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080a0f]/90 backdrop-blur-md border-b border-clan-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo y Nombre del Clan */}
          <button 
            onClick={() => { setCurrentView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-clan-orange to-clan-red opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
              <img 
                src={clanSettings?.logoUrl || "/assets/logo.png"} 
                alt="Logo del Clan" 
                className="relative w-12 h-12 rounded-full object-cover border border-clan-orange/60 shadow-lg"
                onError={(e) => { e.target.src = "/assets/logo.png"; }}
              />
            </div>
            <div>
              <span className="font-orbitron font-black text-lg sm:text-xl tracking-wider text-flame-gradient block leading-tight">
                {clanSettings?.clanName || "CRAZY JR"}
              </span>
              <span className="text-[10px] font-rajdhani uppercase tracking-[0.2em] text-clan-orange/80 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-clan-red animate-pulse inline" /> Free Fire Clan
              </span>
            </div>
          </button>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-rajdhani font-semibold tracking-wide text-slate-300 hover:text-clan-orange hover:bg-clan-surface/60 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-clan-orange/70" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Botón Admin Panel */}
          <div className="hidden md:flex items-center">
            {currentView === 'admin' ? (
              <button
                onClick={() => setCurrentView('public')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-rajdhani font-bold bg-clan-surface border border-clan-border hover:border-clan-orange text-slate-200 hover:text-white transition-all shadow-md"
              >
                Volver a la Web
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-rajdhani font-bold bg-gradient-to-r from-clan-surface to-clan-card border border-clan-orange/40 hover:border-clan-orange text-slate-200 hover:text-clan-orange transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,103,0,0.3)]"
              >
                <Lock className="w-4 h-4 text-clan-orange" />
                Panel Admin
              </button>
            )}
          </div>

          {/* Botón Hamburguesa Móvil */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
              className="p-2 rounded-lg bg-clan-surface border border-clan-border text-clan-orange text-xs font-rajdhani font-bold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              {currentView === 'admin' ? 'Web' : 'Admin'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-clan-surface border border-clan-border text-slate-200 hover:text-clan-orange focus:outline-none"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-clan-red" /> : <Menu className="w-6 h-6 text-clan-orange" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d14]/98 border-b border-clan-border px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-rajdhani font-bold tracking-wide text-slate-200 hover:text-white bg-clan-surface/50 hover:bg-clan-orange/20 border border-clan-border/50 transition-all text-left"
              >
                <Icon className="w-5 h-5 text-clan-orange" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
