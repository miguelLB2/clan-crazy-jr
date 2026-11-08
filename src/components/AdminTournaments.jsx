import React, { useState, useEffect } from 'react';
import { 
  getTournaments, 
  saveTournament, 
  deleteTournament, 
  getTournamentRegistrations 
} from '../supabase/dataService';

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameMode, setGameMode] = useState('Escuadra');
  const [maxSlots, setMaxSlots] = useState(16);
  const [status, setStatus] = useState('Abierto');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getTournaments();
    setTournaments(data);
    setLoading(false);
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    await saveTournament({
      title,
      description,
      game_mode: gameMode,
      max_slots: Number(maxSlots),
      status
    });

    setTitle('');
    setDescription('');
    setGameMode('Escuadra');
    setMaxSlots(16);
    setStatus('Abierto');
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este torneo y sus inscritos?')) {
      await deleteTournament(id);
      if (selectedTournament?.id === id) {
        setSelectedTournament(null);
        setRegistrations([]);
      }
      loadData();
    }
  };

  const handleViewRegistrations = async (t) => {
    setSelectedTournament(t);
    const regs = await getTournamentRegistrations(t.id);
    setRegistrations(regs);
  };

  return (
    <div className="p-4 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800">
      <h2 className="text-xl font-bold mb-4 text-orange-500">🏆 Gestión de Torneos y Dinámicas</h2>

      <form onSubmit={handleCreateTournament} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800/80 p-4 rounded-lg border border-slate-700">
        <input 
          type="text" 
          placeholder="Nombre del Torneo / Dinámica" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-orange-500" 
          required 
        />
        <select 
          value={gameMode} 
          onChange={(e) => setGameMode(e.target.value)} 
          className="p-2 rounded bg-slate-700 text-white border border-slate-600"
        >
          <option value="Solo">Solo</option>
          <option value="Dúo">Dúo</option>
          <option value="Escuadra">Escuadra</option>
          <option value="4v4">4v4 Gladiadores</option>
        </select>
        <input 
          type="number" 
          placeholder="Cupos Máximos (Ej: 16)" 
          value={maxSlots} 
          onChange={(e) => setMaxSlots(e.target.value)} 
          className="p-2 rounded bg-slate-700 text-white border border-slate-600" 
          required 
        />
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="p-2 rounded bg-slate-700 text-white border border-slate-600"
        >
          <option value="Abierto">Abierto</option>
          <option value="En Curso">En Curso</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        <textarea 
          placeholder="Reglas / Detalles del torneo / Premios..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="p-2 rounded bg-slate-700 text-white border border-slate-600 md:col-span-2" 
          rows="2"
        />
        <button type="submit" className="md:col-span-2 p-2 bg-orange-600 hover:bg-orange-700 font-bold rounded transition-all">
          + Crear Nuevo Torneo
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-300">Torneos Activos</h3>
          {loading ? (
            <p className="text-sm text-slate-400">Cargando...</p>
          ) : tournaments.length === 0 ? (
            <p className="text-sm text-slate-400">No hay torneos creados aún.</p>
          ) : (
            tournaments.map((t) => (
              <div key={t.id} className="bg-slate-800 p-3 rounded mb-2 flex justify-between items-center border border-slate-700">
                <div>
                  <h4 className="font-bold text-orange-400">{t.title}</h4>
                  <p className="text-xs text-slate-300">{t.game_mode} | Cupos: {t.max_slots} | Estado: {t.status}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewRegistrations(t)} 
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs rounded font-bold transition-all"
                  >
                    Ver Inscritos
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)} 
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-xs rounded font-bold transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-3 text-slate-300">
            {selectedTournament ? `Jugadores Inscritos: ${selectedTournament.title}` : 'Detalles de Inscritos'}
          </h3>
          {selectedTournament ? (
            registrations.length === 0 ? (
              <p className="text-xs text-slate-400">Nadie se ha inscrito a este torneo todavía.</p>
            ) : (
              <ul className="divide-y divide-slate-700 max-h-60 overflow-y-auto">
                {registrations.map((r, i) => (
                  <li key={r.id} className="py-2 text-sm flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200">{i + 1}. {r.player_name}</span>
                      <span className="text-xs text-slate-400 block">ID Juego: {r.game_id}</span>
                    </div>
                    <span className="text-xs bg-orange-950 text-orange-300 px-2 py-1 rounded border border-orange-800">
                      {r.contact_info || 'Sin contacto'}
                    </span>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-xs text-slate-400">Selecciona "Ver Inscritos" en cualquier torneo para consultar la lista de participantes y sus contactos.</p>
          )}
        </div>
      </div>
    </div>
  );
}