import React, { useState } from 'react';
import { Users, Shield, Copy, Check, Search, UserCheck } from 'lucide-react';

export default function MembersSection({ members }) {
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMembers = (members || []).filter((m) => {
    const matchesRole = roleFilter === 'Todos' || m.role === roleFilter;
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      m.name?.toLowerCase().includes(search) || 
      m.gameId?.toLowerCase().includes(search);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Líder':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-orbitron font-extrabold bg-clan-red/20 text-clan-red border border-clan-red/50 shadow-sm">
            👑 LÍDER
          </span>
        );
      case 'Sublíder':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-orbitron font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm">
            ⚔️ SUBLÍDER
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-orbitron font-medium bg-slate-800 text-slate-300 border border-slate-700">
            🛡️ MIEMBRO
          </span>
        );
    }
  };

  return (
    <section id="miembros" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clan-orange/10 border border-clan-orange/30 text-clan-orange text-xs font-rajdhani font-bold uppercase tracking-widest mb-2">
            <Users className="w-3.5 h-3.5" /> Escuadrón Oficial
          </div>
          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white">
            Miembros del Clan
          </h2>
          <p className="text-sm font-rajdhani text-slate-400 font-semibold mt-2">
            Conoce a cada integrante de nuestra comunidad, sus roles y sus identificadores de juego.
          </p>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Filtro por Rol */}
          <div className="flex items-center gap-1.5 p-1 bg-clan-surface/80 rounded-xl border border-clan-border w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Líder', 'Sublíder', 'Miembro'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold tracking-wider transition-all whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-clan-orange text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'Todos' ? 'Todos' : role + 's'}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0d14] border border-clan-border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-clan-orange font-rajdhani font-medium transition-colors"
            />
          </div>
        </div>

        {/* Cuadrícula de Miembros */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="gamer-card p-5 rounded-2xl border-clan-border hover:border-clan-orange/60 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Avatar o Iniciales */}
                    <div className="relative">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-xl object-cover border border-clan-orange/50 shadow-md"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clan-surface to-[#161d2b] border border-clan-border flex items-center justify-center font-orbitron font-black text-clan-orange text-base shadow-inner group-hover:border-clan-orange transition-colors">
                          {member.name ? member.name.substring(0, 2).toUpperCase() : 'FF'}
                        </div>
                      )}
                    </div>

                    {/* Insignia de Rol */}
                    <div>{getRoleBadge(member.role)}</div>
                  </div>

                  {/* Nombre del Jugador */}
                  <h3 className="font-orbitron font-black text-base text-white truncate mb-1">
                    {member.name}
                  </h3>
                </div>

                {/* Free Fire ID con Botón de Copiar */}
                <div className="mt-4 pt-3 border-t border-clan-border/60 flex items-center justify-between gap-2 bg-[#0a0e17] px-3 py-2 rounded-xl">
                  <div>
                    <span className="text-[10px] font-rajdhani uppercase tracking-wider text-slate-500 font-bold block">
                      ID Free Fire
                    </span>
                    <span className="font-orbitron font-bold text-xs text-slate-200">
                      {member.gameId || "Sin ID"}
                    </span>
                  </div>

                  {member.gameId && (
                    <button
                      onClick={() => handleCopyId(member.gameId)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-clan-surface hover:bg-clan-orange/20 border border-clan-border hover:border-clan-orange text-slate-300 hover:text-clan-orange text-xs font-rajdhani font-bold transition-all"
                      title="Copiar ID al portapapeles"
                    >
                      {copiedId === member.gameId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400 text-[10px]">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 gamer-card rounded-2xl max-w-md mx-auto">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-rajdhani font-semibold text-slate-400">
              No se encontraron miembros con los filtros seleccionados.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
