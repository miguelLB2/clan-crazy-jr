export const initialClanSettings = {
  clanName: "CRAZY JR",
  motto: "¡Dominando las salas con pura adrenalina y honor!",
  logoUrl: "/assets/logo.png",
  whatsappUrl: "https://chat.whatsapp.com/ejemplo-crazy-junior",
  discordUrl: "https://discord.gg/ejemplo-crazy-junior",
  requirements: "Nivel 50+, actividad constante en salas de clan los fines de semana, cumplir con los honores semanales y respeto mutuo."
};

export const initialMembers = [
  { id: 'm1', name: 'CJ_APOCALIPSIS', gameId: '2984719284', role: 'Líder', avatarUrl: '' },
  { id: 'm2', name: 'CJ_VULCANO', gameId: '3819284751', role: 'Sublíder', avatarUrl: '' },
  { id: 'm3', name: 'CJ_VALKIRIA', gameId: '4729183920', role: 'Sublíder', avatarUrl: '' },
  { id: 'm4', name: 'CJ_SHADOW', gameId: '1928374650', role: 'Miembro', avatarUrl: '' },
  { id: 'm5', name: 'CJ_KRAKEN', gameId: '5829104829', role: 'Miembro', avatarUrl: '' },
  { id: 'm6', name: 'CJ_INFERNO', gameId: '6920194827', role: 'Miembro', avatarUrl: '' },
  { id: 'm7', name: 'CJ_TITAN', gameId: '8492019482', role: 'Miembro', avatarUrl: '' },
  { id: 'm8', name: 'CJ_VIPER', gameId: '7482910492', role: 'Miembro', avatarUrl: '' },
  { id: 'm9', name: 'CJ_PHANTOM', gameId: '9182736450', role: 'Miembro', avatarUrl: '' },
  { id: 'm10', name: 'CJ_BLAZE', gameId: '4019284756', role: 'Miembro', avatarUrl: '' },
];

export const initialWeeks = [
  {
    id: 'w2',
    title: 'Semana 44 (28 Oct - 03 Nov)',
    startDate: '2026-10-28',
    endDate: '2026-11-03',
    isCurrent: true,
    records: [
      { memberId: 'm1', memberName: 'CJ_APOCALIPSIS', honors: 2450 },
      { memberId: 'm2', memberName: 'CJ_VULCANO', honors: 2180 },
      { memberId: 'm3', memberName: 'CJ_VALKIRIA', honors: 1920 },
      { memberId: 'm4', memberName: 'CJ_SHADOW', honors: 1850 },
      { memberId: 'm5', memberName: 'CJ_KRAKEN', honors: 1620 },
      { memberId: 'm6', memberName: 'CJ_INFERNO', honors: 1480 },
      { memberId: 'm7', memberName: 'CJ_TITAN', honors: 1390 },
      { memberId: 'm8', memberName: 'CJ_VIPER', honors: 1250 },
      { memberId: 'm9', memberName: 'CJ_PHANTOM', honors: 1100 },
      { memberId: 'm10', memberName: 'CJ_BLAZE', honors: 950 },
    ]
  },
  {
    id: 'w1',
    title: 'Semana 43 (21 Oct - 27 Oct)',
    startDate: '2026-10-21',
    endDate: '2026-10-27',
    isCurrent: false,
    records: [
      { memberId: 'm2', memberName: 'CJ_VULCANO', honors: 2510 },
      { memberId: 'm1', memberName: 'CJ_APOCALIPSIS', honors: 2300 },
      { memberId: 'm3', memberName: 'CJ_VALKIRIA', honors: 2050 },
      { memberId: 'm5', memberName: 'CJ_KRAKEN', honors: 1900 },
      { memberId: 'm4', memberName: 'CJ_SHADOW', honors: 1750 },
      { memberId: 'm6', memberName: 'CJ_INFERNO', honors: 1500 },
      { memberId: 'm7', memberName: 'CJ_TITAN', honors: 1420 },
      { memberId: 'm8', memberName: 'CJ_VIPER', honors: 1300 },
      { memberId: 'm10', memberName: 'CJ_BLAZE', honors: 1120 },
      { memberId: 'm9', memberName: 'CJ_PHANTOM', honors: 980 },
    ]
  }
];

export const initialAwards = [
  {
    id: 'a1',
    title: 'MVP de la Semana',
    description: 'Jugador con el mayor puntaje de honores y desempeño sobresaliente en el clan.',
    winnerName: 'CJ_APOCALIPSIS',
    icon: 'Trophy',
    dateOrPeriod: 'Semana 44'
  },
  {
    id: 'a2',
    title: 'Más Constante',
    description: 'Siempre activo en salas y aportando honores de manera ininterrumpida.',
    winnerName: 'CJ_VULCANO',
    icon: 'Flame',
    dateOrPeriod: 'Octubre 2026'
  },
  {
    id: 'a3',
    title: 'Mejor Novato',
    description: 'Nuevo ingreso con la mejor adaptación, respeto y compromiso.',
    winnerName: 'CJ_BLAZE',
    icon: 'Star',
    dateOrPeriod: 'Octubre 2026'
  },
  {
    id: 'a4',
    title: 'Premio Mensual de Honor',
    description: 'Máximo reconocimiento por su lealtad, liderazgo y espíritu de clan.',
    winnerName: 'CJ_VALKIRIA',
    icon: 'Crown',
    dateOrPeriod: 'Octubre 2026'
  }
];
