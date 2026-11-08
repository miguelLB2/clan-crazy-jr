import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WeeklyHonors from './components/WeeklyHonors';
import HistorySection from './components/HistorySection';
import AwardsSection from './components/AwardsSection';
import MembersSection from './components/MembersSection';
import JoinSection from './components/JoinSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

import { getClanSettings, getMembers, getWeeks, getAwards } from './supabase/dataService';
import { initialClanSettings } from './data/initialData';
import { subscribeToAuth, getInitialCurrentUser } from './supabase/authService';
import { isSupabaseConfigured } from './supabase/client';
import { Flame, RefreshCw } from 'lucide-react';

export default function App() {
  // Vista actual: 'public' o 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash === '#admin') {
      return 'admin';
    }
    return 'public';
  });

  const [currentUser, setCurrentUser] = useState(getInitialCurrentUser());
  const [clanSettings, setClanSettings] = useState(initialClanSettings);
  const [members, setMembers] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios de URL para soportar ruta /admin o #admin
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.pathname.includes('/admin') || window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Actualizar URL al cambiar vista
  const handleSetView = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState(null, '', '#admin');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [settingsData, membersData, weeksData, awardsData] = await Promise.all([
          getClanSettings(),
          getMembers(),
          getWeeks(),
          getAwards()
        ]);

        if (settingsData) {
          setClanSettings(prev => ({ ...prev, ...settingsData }));
        }
        setMembers(membersData);
        setWeeks(weeksData);
        setAwards(awardsData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();

    // Suscribir a Auth
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Semana actual activa
  const currentWeek = weeks.find(w => w.isCurrent) || weeks[0];

  // Pantalla de Carga Gamer
  if (loading) {
    return (
      <div className="min-h-screen bg-clan-bg flex flex-col items-center justify-center p-4">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-clan-border border-t-clan-orange animate-spin"></div>
          <Flame className="w-8 h-8 text-clan-red absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <span className="font-orbitron font-black text-lg text-white tracking-widest uppercase">
          Cargando Clan...
        </span>
        <span className="font-rajdhani text-xs text-clan-orange mt-1 font-semibold tracking-wider">
          PREPARANDO SALA DE GUERRA
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clan-bg text-slate-100 font-sans selection:bg-clan-orange selection:text-black gamer-grid-bg">
      {/* Barra de Navegación Superior */}
      <Navbar 
        clanSettings={clanSettings} 
        currentView={currentView} 
        setCurrentView={handleSetView} 
      />

      <main>
        {currentView === 'admin' ? (
          <AdminPanel
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            clanSettings={clanSettings}
            setClanSettings={setClanSettings}
            members={members}
            setMembers={setMembers}
            weeks={weeks}
            setWeeks={setWeeks}
            awards={awards}
            setAwards={setAwards}
            onExitAdmin={() => handleSetView('public')}
          />
        ) : (
          <>
            <Hero 
              clanSettings={clanSettings} 
              currentWeek={currentWeek} 
              awards={awards} 
            />

            <WeeklyHonors 
              currentWeek={currentWeek} 
              members={members} 
            />

            <HistorySection 
              weeks={weeks} 
              members={members} 
            />

            <AwardsSection 
              awards={awards} 
            />

            <MembersSection 
              members={members} 
            />

            <JoinSection 
              clanSettings={clanSettings} 
            />
          </>
        )}
      </main>

      {/* Pie de Página */}
      <Footer 
        clanSettings={clanSettings} 
        setCurrentView={handleSetView} 
      />
    </div>
  );
}
