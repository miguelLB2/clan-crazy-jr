import { supabase } from './client';

// ==========================================
// 1. INFORMACIÓN Y CONFIGURACIÓN DEL CLAN
// ==========================================
export const getClanSettings = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('clan_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) console.error('Error al obtener clan_settings:', error);
  if (data) {
    return {
      ...data,
      clanName: data.clanName || data.clan_name || 'CRAZY JR',
      logoUrl: data.logoUrl || data.logo_url,
      whatsappUrl: data.whatsappUrl || data.whatsapp_url,
      discordUrl: data.discordUrl || data.discord_url,
      motto: data.motto || data.slogan || '¡Dominando las salas con pura adrenalina y honor!',
      requirements: data.requirements || data.requisitos || ''
    };
  }
  return null;
};

export const updateClanSettings = async (id, updates) => {
  const { data, error } = await supabase
    .from('clan_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) console.error('Error al actualizar clan_settings:', error);
  return data;
};

export const saveClanSettings = async (settingsData) => {
  if (settingsData.id) {
    return await updateClanSettings(settingsData.id, settingsData);
  } else {
    const { data, error } = await supabase
      .from('clan_settings')
      .insert([settingsData])
      .select();
    if (error) console.error('Error al guardar clan_settings:', error);
    return data;
  }
};

// ==========================================
// 2. GESTIÓN DE MIEMBROS Y HONORES
// ==========================================
export const getMembers = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) console.error('Error al obtener miembros:', error);
  return (data || []).map(m => ({
    ...m,
    gameId: m.gameId || m.game_id || '',
    avatarUrl: m.avatarUrl || m.avatar_url || ''
  }));
};

export const addMember = async (nameOrObj, game_id, role = 'Miembro', avatar_url = '') => {
  if (!supabase) return null;
  const isObj = typeof nameOrObj === 'object' && nameOrObj !== null;
  const name = isObj ? nameOrObj.name : nameOrObj;
  const gameIdVal = isObj ? (nameOrObj.gameId || nameOrObj.game_id || '') : (game_id || '');
  const roleVal = isObj ? (nameOrObj.role || 'Miembro') : (role || 'Miembro');
  const avatarVal = isObj ? (nameOrObj.avatarUrl || nameOrObj.avatar_url || '') : (avatar_url || '');

  const payload = {
    name,
    game_id: gameIdVal,
    role: roleVal,
    avatar_url: avatarVal
  };

  const { data, error } = await supabase
    .from('members')
    .insert([payload])
    .select();

  if (error) console.error('Error al agregar miembro:', error);
  const row = (data && data[0]) ? data[0] : data;
  if (row) {
    return {
      ...row,
      gameId: row.game_id || row.gameId || '',
      avatarUrl: row.avatar_url || row.avatarUrl || ''
    };
  }
  return { id: Date.now(), ...payload, gameId: gameIdVal, avatarUrl: avatarVal };
};

export const saveMember = addMember;

export const updateMember = async (idOrGameId, updates) => {
  if (!supabase) return null;
  const dbUpdates = { ...updates };
  if (dbUpdates.gameId !== undefined) {
    dbUpdates.game_id = dbUpdates.gameId;
  }
  if (dbUpdates.avatarUrl !== undefined) {
    dbUpdates.avatar_url = dbUpdates.avatarUrl;
  }

  let { data, error } = await supabase
    .from('members')
    .update(dbUpdates)
    .eq('id', idOrGameId)
    .select();

  if ((!data || data.length === 0) && !error) {
    const res = await supabase
      .from('members')
      .update(dbUpdates)
      .eq('game_id', idOrGameId)
      .select();
    data = res.data;
    error = res.error;
  }

  if (error) console.error('Error al actualizar miembro:', error);
  const row = (data && data[0]) ? data[0] : data;
  if (row) {
    return {
      ...row,
      gameId: row.game_id || row.gameId || '',
      avatarUrl: row.avatar_url || row.avatarUrl || ''
    };
  }
  return { id: idOrGameId, ...updates };
};

export const deleteMember = async (idOrGameId) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', idOrGameId);

  if (error) {
    const res = await supabase.from('members').delete().eq('game_id', idOrGameId);
    if (res.error) console.error('Error al eliminar miembro:', res.error);
  }
};

// ==========================================
// 3. SEMANAS Y REGISTRO DE HONORES
// ==========================================
export const getWeeks = async () => {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .order('startDate', { ascending: false });

  if (error) console.error('Error al obtener semanas:', error);
  return data || [];
};

export const getCurrentWeek = async () => {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('is_current', true)
    .maybeSingle();

  if (error) console.error('Error al obtener semana actual:', error);
  return data;
};

export const createWeek = async (title, startDate, endDate) => {
  await supabase.from('weeks').update({ is_current: false }).neq('id', 0);

  const { data, error } = await supabase
    .from('weeks')
    .insert([{ title, startDate, endDate, is_current: true, records: {} }])
    .select();

  if (error) console.error('Error al crear nueva semana:', error);
  return data;
};

export const addWeek = createWeek;
export const saveWeek = createWeek;

export const updateWeek = async (id, updates) => {
  const { data, error } = await supabase
    .from('weeks')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) console.error('Error al actualizar semana:', error);
  return data;
};

export const deleteWeek = async (id) => {
  const { error } = await supabase
    .from('weeks')
    .delete()
    .eq('id', id);

  if (error) console.error('Error al eliminar semana:', error);
};

export const updateWeekHonors = async (weekId, updatedRecords) => {
  const { data, error } = await supabase
    .from('weeks')
    .update({ records: updatedRecords })
    .eq('id', weekId)
    .select();

  if (error) console.error('Error al actualizar honores de la semana:', error);
  return data;
};

// ==========================================
// 4. CÁLCULO DE HONORES MENSUALES Y TOTALES
// ==========================================
export const getMonthlyHonors = async (year, month) => {
  const weeks = await getWeeks();
  const members = await getMembers();

  const filteredWeeks = weeks.filter((w) => {
    const d = new Date(w.startDate);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const totals = {};
  members.forEach((m) => {
    totals[m.game_id] = {
      member: m,
      totalHonors: 0,
    };
  });

  filteredWeeks.forEach((week) => {
    const records = week.records || {};
    Object.keys(records).forEach((game_id) => {
      if (totals[game_id]) {
        totals[game_id].totalHonors += Number(records[game_id]) || 0;
      }
    });
  });

  return Object.values(totals).sort((a, b) => b.totalHonors - a.totalHonors);
};

// ==========================================
// 5. PREMIOS Y RECONOCIMIENTOS (AWARDS)
// ==========================================
export const getAwards = async () => {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error al obtener premios:', error);
  return data || [];
};

export const addAward = async (awardData) => {
  const { data, error } = await supabase
    .from('awards')
    .insert([awardData])
    .select();

  if (error) console.error('Error al otorgar premio:', error);
  return data;
};

export const saveAward = addAward;

export const updateAward = async (id, updates) => {
  const { data, error } = await supabase
    .from('awards')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) console.error('Error al actualizar premio:', error);
  return data;
};

export const deleteAward = async (id) => {
  const { error } = await supabase
    .from('awards')
    .delete()
    .eq('id', id);

  if (error) console.error('Error al eliminar premio:', error);
};

// ==========================================
// 6. DATOS DE PRUEBA / SEED
// ==========================================
export const seedSampleData = async () => {
  console.log('Sembrando datos iniciales de prueba...');
  
  await saveClanSettings({
    clan_name: 'CRAZY JUNIOR',
    motto: 'Domina el campo de batalla',
    requirements: 'Honor semanal mínimo: 500',
  });

  await addMember('Líder Supremo', 'ID1001', 'Líder');
  await addMember('Jugador Pro', 'ID1002', 'Decano');
  
  return true;
};

// ==========================================
// 7. TORNEOS Y DINÁMICAS
// ==========================================
export const getTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error al obtener torneos:', error);
  return data || [];
};

export const createTournament = async (tournamentData) => {
  const { data, error } = await supabase
    .from('tournaments')
    .insert([tournamentData])
    .select();

  if (error) console.error('Error al crear torneo:', error);
  return data;
};

export const saveTournament = createTournament;

export const updateTournament = async (id, updates) => {
  const { data, error } = await supabase
    .from('tournaments')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) console.error('Error al actualizar torneo:', error);
  return data;
};

export const deleteTournament = async (id) => {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) console.error('Error al eliminar torneo:', error);
};

export const registerForTournament = async (tournament_id, player_name, game_id, contact_info = '') => {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .insert([{ tournament_id, player_name, game_id, contact_info }])
    .select();

  if (error) console.error('Error al inscribirse en el torneo:', error);
  return { data, error };
};

export const getTournamentRegistrations = async (tournament_id) => {
  const { data, error } = await supabase
    .from('tournament_registrations')
    .select('*')
    .eq('tournament_id', tournament_id)
    .order('registered_at', { ascending: true });

  if (error) console.error('Error al obtener inscripciones:', error);
  return data || [];
};