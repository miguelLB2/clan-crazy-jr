import React, { useEffect, useState } from 'react';
import { getTournaments, registerForTournament, getTournamentRegistrations } from '../supabase/dataService';

export default function TournamentsSection() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  
  // Datos del formulario
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    const data = await getTournaments();
    setTournaments(data);
    if (data.length > 0) selectTournament(data[0]);
  }

  async function selectTournament(t) {
    setSelectedTournament(t);
    const regs = await getTournamentRegistrations(t.id);
    setRegistrations(regs);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return;

    if (registrations.length >= selectedTournament.max_slots) {
      setMessage('❌ El torneo ya alcanzó el cupo máximo.');
      return;
    }

    const { error } = await registerForTournament(selectedTournament.id, playerName, gameId, contactInfo);
    if (error) {
      setMessage('❌ Error al registrarte. Revisa tus datos.');
    } else {
      setMessage('✅ ¡Inscripción exitosa!');
      setPlayerName('');
      setGameId('');
      setContactInfo('');
      // Recargar inscritos
      selectTournament(selectedTournament);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>🏆 Torneos y Dinámicas del Clan</h2>

      {tournaments.length === 0 ? (
        <p>No hay torneos activos en este momento.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Lista de torneos */}
          <div>
            <h3>Próximos Torneos</h3>
            {tournaments.map((t) => (
              <div 
                key={t.id} 
                onClick={() => selectTournament(t)}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: selectedTournament?.id === t.id ? '2px solid #f97316' : '1px solid #333',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#1e1e1e'
                }}
              >
                <h4>{t.title}</h4>
                <p>{t.description}</p>
                <small>Modo: {t.game_mode} | Estado: {t.status}</small>
              </div>
            ))}
          </div>

          {/* Formulario e Inscritos */}
          {selectedTournament && (
            <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
              <h3>Inscribirme a: {selectedTournament.title}</h3>
              <p>Cupos libres: {selectedTournament.max_slots - registrations.length} / {selectedTournament.max_slots}</p>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Nombre de Usuario / Clan" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="ID de Free Fire" 
                  value={gameId} 
                  onChange={(e) => setGameId(e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="WhatsApp o Discord de contacto" 
                  value={contactInfo} 
                  onChange={(e) => setContactInfo(e.target.value)} 
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#f97316', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  Confirmar Inscripción
                </button>
              </form>

              {message && <p style={{ marginTop: '10px' }}>{message}</p>}

              <hr style={{ margin: '20px 0', borderColor: '#333' }} />

              <h4>Inscritos ({registrations.length})</h4>
              <ul>
                {registrations.map((r) => (
                  <li key={r.id}>{r.player_name} (ID: {r.game_id})</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}