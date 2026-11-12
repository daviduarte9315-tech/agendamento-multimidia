export function formatBrazilianDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatBrazilianLongDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getTodayDateString(): string {
  // Retorna a data de hoje conforme o contexto (2026-10-22)
  return '2026-10-22';
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isTimeRangeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  // Intervalos colidem se o início de um for estritamente menor que o fim do outro e vice-versa
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

export function getDaysInMonth(year: number, monthIndex: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getWeekDates(baseDateStr: string): { date: Date; dateStr: string; dayName: string }[] {
  const [year, month, day] = baseDateStr.split('-').map(Number);
  const current = new Date(year, month - 1, day);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday
  
  // A semana escolar começa na segunda-feira (1) até sexta-feira (5) ou sábado (6)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const week = [];
  for (let i = 0; i < 5; i++) { // Seg a Sex
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dt}`;
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    week.push({
      date: d,
      dateStr,
      dayName: dayName.replace('.', '').toUpperCase(),
    });
  }
  return week;
}
