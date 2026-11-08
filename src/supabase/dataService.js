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

  if (!supabase) {
    return {
      id: 'm_' + Date.now(),
      name,
      gameId: gameIdVal,
      role: roleVal,
      avatarUrl: avatarVal,
      fecha: new Date().toISOString()
    };
  }

  const { data, error } = await supabase
    .from('members')
    .insert([payload])
    .select();

  if (error) {
    console.error('Error al agregar miembro en Supabase:', error);
    return {
      id: 'm_' + Date.now(),
      name,
      gameId: gameIdVal,
      role: roleVal,
      avatarUrl: avatarVal,
      fecha: new Date().toISOString()
    };
  }

  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id || ('m_' + Date.now()),
      gameId: row.game_id || row.gameId || '',
      avatarUrl: row.avatar_url || row.avatarUrl || ''
    };
  }
  return { id: 'm_' + Date.now(), ...payload, gameId: gameIdVal, avatarUrl: avatarVal };
};

export const saveMember = addMember;

export const updateMember = async (idOrGameId, updates) => {
  if (!supabase) {
    return { id: idOrGameId, ...updates, gameId: updates.gameId || updates.game_id || '' };
  }
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

  if (error) {
    console.error('Error al actualizar miembro:', error);
    return { id: idOrGameId, ...updates };
  }
  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id || idOrGameId,
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
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error al obtener semanas:', error);
  return (data || []).map(w => {
    let recs = [];
    if (Array.isArray(w.records)) {
      recs = w.records;
    } else if (w.records && typeof w.records === 'object') {
      recs = Object.entries(w.records).map(([mId, h]) => ({
        memberId: mId,
        honors: Number(h) || 0
      }));
    }
    return {
      ...w,
      id: w.id,
      title: w.title || '',
      startDate: w.start_date || w.startDate || '',
      endDate: w.end_date || w.endDate || '',
      isCurrent: w.is_current !== undefined ? Boolean(w.is_current) : Boolean(w.isCurrent),
      records: recs
    };
  });
};

export const getCurrentWeek = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('is_current', true)
    .maybeSingle();

  if (error) console.error('Error al obtener semana actual:', error);
  if (data) {
    return {
      ...data,
      id: data.id,
      title: data.title || '',
      startDate: data.start_date || data.startDate || '',
      endDate: data.end_date || data.endDate || '',
      isCurrent: true,
      records: Array.isArray(data.records) ? data.records : []
    };
  }
  return null;
};

export const addWeek = async (weekDataOrTitle, startDate, endDate, isCurrent = false, records = []) => {
  let title = weekDataOrTitle;
  let start = startDate || '';
  let end = endDate || '';
  let current = Boolean(isCurrent);
  let recs = records || [];

  if (typeof weekDataOrTitle === 'object' && weekDataOrTitle !== null) {
    title = weekDataOrTitle.title || '';
    start = weekDataOrTitle.startDate || weekDataOrTitle.start_date || '';
    end = weekDataOrTitle.endDate || weekDataOrTitle.end_date || '';
    current = weekDataOrTitle.isCurrent !== undefined ? Boolean(weekDataOrTitle.isCurrent) : Boolean(weekDataOrTitle.is_current);
    recs = weekDataOrTitle.records || [];
  }

  const payload = {
    title,
    start_date: start,
    end_date: end,
    is_current: current,
    records: Array.isArray(recs) ? recs : []
  };

  if (!supabase) {
    return {
      id: 'w_' + Date.now(),
      title,
      startDate: start,
      endDate: end,
      isCurrent: current,
      records: payload.records
    };
  }

  if (current) {
    try {
      await supabase.from('weeks').update({ is_current: false }).neq('title', '___none___');
    } catch (e) {
      console.warn('Error al desactivar semana previa:', e);
    }
  }

  const { data, error } = await supabase
    .from('weeks')
    .insert([payload])
    .select();

  if (error) {
    console.error('Error al crear nueva semana en Supabase:', error);
    return {
      id: 'w_' + Date.now(),
      title,
      startDate: start,
      endDate: end,
      isCurrent: current,
      records: payload.records
    };
  }

  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id,
      title: row.title,
      startDate: row.start_date || row.startDate || start,
      endDate: row.end_date || row.endDate || end,
      isCurrent: row.is_current !== undefined ? Boolean(row.is_current) : current,
      records: Array.isArray(row.records) ? row.records : payload.records
    };
  }
  return {
    id: 'w_' + Date.now(),
    title,
    startDate: start,
    endDate: end,
    isCurrent: current,
    records: payload.records
  };
};

export const createWeek = addWeek;
export const saveWeek = addWeek;

export const updateWeek = async (id, updates) => {
  const dbUpdates = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
  if (updates.start_date !== undefined) dbUpdates.start_date = updates.start_date;
  if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
  if (updates.end_date !== undefined) dbUpdates.end_date = updates.end_date;
  if (updates.isCurrent !== undefined) dbUpdates.is_current = Boolean(updates.isCurrent);
  if (updates.is_current !== undefined) dbUpdates.is_current = Boolean(updates.is_current);
  if (updates.records !== undefined) dbUpdates.records = Array.isArray(updates.records) ? updates.records : [];

  if (!supabase) {
    return {
      id,
      ...updates,
      startDate: updates.startDate || updates.start_date || '',
      endDate: updates.endDate || updates.end_date || '',
      isCurrent: updates.isCurrent !== undefined ? Boolean(updates.isCurrent) : Boolean(updates.is_current),
      records: Array.isArray(updates.records) ? updates.records : []
    };
  }

  if (dbUpdates.is_current) {
    try {
      await supabase.from('weeks').update({ is_current: false }).neq('id', id);
    } catch (e) {
      console.warn('Error al desactivar semana previa:', e);
    }
  }

  const { data, error } = await supabase
    .from('weeks')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error al actualizar semana en Supabase:', error);
    return {
      id,
      ...updates,
      startDate: updates.startDate || updates.start_date || '',
      endDate: updates.endDate || updates.end_date || '',
      isCurrent: updates.isCurrent !== undefined ? Boolean(updates.isCurrent) : Boolean(updates.is_current),
      records: Array.isArray(updates.records) ? updates.records : []
    };
  }

  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id || id,
      title: row.title || updates.title,
      startDate: row.start_date || row.startDate || updates.startDate,
      endDate: row.end_date || row.endDate || updates.endDate,
      isCurrent: row.is_current !== undefined ? Boolean(row.is_current) : Boolean(updates.isCurrent),
      records: Array.isArray(row.records) ? row.records : (Array.isArray(updates.records) ? updates.records : [])
    };
  }
  return { id, ...updates, records: Array.isArray(updates.records) ? updates.records : [] };
};

export const deleteWeek = async (id) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('weeks')
    .delete()
    .eq('id', id);

  if (error) console.error('Error al eliminar semana:', error);
};

export const updateWeekHonors = async (weekId, updatedRecords) => {
  return await updateWeek(weekId, { records: updatedRecords });
};

// ==========================================
// 4. CÁLCULO DE HONORES MENSUALES Y TOTALES
// ==========================================
export const getMonthlyHonors = async (year, month) => {
  const weeks = await getWeeks();
  const members = await getMembers();

  const filteredWeeks = weeks.filter((w) => {
    const d = new Date(w.startDate || w.start_date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const totals = {};
  members.forEach((m) => {
    totals[m.game_id || m.gameId] = {
      member: m,
      totalHonors: 0,
    };
  });

  filteredWeeks.forEach((week) => {
    const records = Array.isArray(week.records) ? week.records : [];
    records.forEach((r) => {
      const gId = r.gameId || r.game_id || r.memberId;
      if (totals[gId]) {
        totals[gId].totalHonors += Number(r.honors) || 0;
      }
    });
  });

  return Object.values(totals).sort((a, b) => b.totalHonors - a.totalHonors);
};

// ==========================================
// 5. PREMIOS Y RECONOCIMIENTOS (AWARDS)
// ==========================================
export const getAwards = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('Error al obtener premios:', error);
  return (data || []).map(a => ({
    ...a,
    winnerName: a.winnerName || a.winner_name || '',
    dateOrPeriod: a.dateOrPeriod || a.date_or_period || ''
  }));
};

export const addAward = async (awardData) => {
  const payload = {
    title: awardData.title,
    description: awardData.description || '',
    winner_name: awardData.winnerName || awardData.winner_name || '',
    icon: awardData.icon || 'Trophy',
    date_or_period: awardData.dateOrPeriod || awardData.date_or_period || ''
  };

  if (!supabase) {
    return { id: 'a_' + Date.now(), ...awardData, ...payload };
  }

  const { data, error } = await supabase
    .from('awards')
    .insert([payload])
    .select();

  if (error) {
    console.error('Error al otorgar premio en Supabase:', error);
    return { id: 'a_' + Date.now(), ...awardData };
  }

  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id || ('a_' + Date.now()),
      winnerName: row.winner_name || row.winnerName || '',
      dateOrPeriod: row.date_or_period || row.dateOrPeriod || ''
    };
  }
  return { id: 'a_' + Date.now(), ...awardData };
};

export const saveAward = addAward;

export const updateAward = async (id, updates) => {
  const dbUpdates = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.winnerName !== undefined) dbUpdates.winner_name = updates.winnerName;
  if (updates.winner_name !== undefined) dbUpdates.winner_name = updates.winner_name;
  if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
  if (updates.dateOrPeriod !== undefined) dbUpdates.date_or_period = updates.dateOrPeriod;
  if (updates.date_or_period !== undefined) dbUpdates.date_or_period = updates.date_or_period;

  if (!supabase) {
    return { id, ...updates };
  }

  const { data, error } = await supabase
    .from('awards')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error al actualizar premio en Supabase:', error);
    return { id, ...updates };
  }

  const row = (data && data[0]) ? data[0] : null;
  if (row) {
    return {
      ...row,
      id: row.id || id,
      winnerName: row.winner_name || row.winnerName || '',
      dateOrPeriod: row.date_or_period || row.dateOrPeriod || ''
    };
  }
  return { id, ...updates };
};

export const deleteAward = async (id) => {
  if (!supabase) return;
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