import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  MapPin,
  User,
  Users,
  Tv,
  Projector,
  Laptop,
  Volume2,
  CalendarDays,
  Plus,
} from 'lucide-react';
import {
  formatBrazilianDate,
  formatBrazilianLongDate,
  getTodayDateString,
  getWeekDates,
  getDaysInMonth,
} from '../utils/dateUtils';
import { Booking } from '../types';

interface ScheduleViewProps {
  onSelectBooking: (booking: Booking) => void;
  onOpenNewBooking: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  onSelectBooking,
  onOpenNewBooking,
}) => {
  const { bookings, equipments, users, classes, classrooms, subjects, periods } = useApp();

  const todayStr = getTodayDateString();

  // View mode
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDateStr, setCurrentDateStr] = useState<string>(todayStr);

  // Filters
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Date navigation helpers
  const handleDateShift = (days: number) => {
    const [y, m, d] = currentDateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    setCurrentDateStr(`${ny}-${nm}-${nd}`);
  };

  const handleMonthShift = (months: number) => {
    const [y, m, d] = currentDateStr.split('-').map(Number);
    const date = new Date(y, m - 1 + months, 1);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    setCurrentDateStr(`${ny}-${nm}-01`);
  };

  // Helper to format all equipment names for a booking
  const getBookingEquipNames = (b: Booking) => {
    const ids = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
    return ids.map((id) => equipments.find((e) => e.id === id)?.name).filter(Boolean).join(' + ') || 'Equipamento';
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (
      equipmentFilter !== 'all' &&
      !(b.equipmentIds ? b.equipmentIds.includes(equipmentFilter) : b.equipmentId === equipmentFilter)
    ) {
      return false;
    }
    if (teacherFilter !== 'all' && b.userId !== teacherFilter) return false;
    if (classFilter !== 'all' && b.classId !== classFilter) return false;
    if (roomFilter !== 'all' && b.classroomId !== roomFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const equipNames = getBookingEquipNames(b).toLowerCase();
      const teacher = users.find((u) => u.id === b.userId);
      const schoolClass = classes.find((c) => c.id === b.classId);
      const subject = subjects.find((s) => s.id === b.subjectId);
      const room = classrooms.find((r) => r.id === b.classroomId);
      const subjectName = (b.customSubjectName || subject?.name || '').toLowerCase();

      const match =
        equipNames.includes(q) ||
        teacher?.name.toLowerCase().includes(q) ||
        schoolClass?.name.toLowerCase().includes(q) ||
        subjectName.includes(q) ||
        room?.name.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q);

      if (!match) return false;
    }

    return true;
  });

  const weekDates = getWeekDates(currentDateStr);

  // Month days
  const [currYear, currMonth] = currentDateStr.split('-').map(Number);
  const daysInCurrentMonth = getDaysInMonth(currYear, currMonth - 1);
  const firstDayOfMonthWeekday = new Date(currYear, currMonth - 1, 1).getDay(); // 0 is Sun

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Confirmado</span>;
      case 'pending':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Pendente</span>;
      case 'rejected':
        return <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">Recusado</span>;
      case 'cancelled':
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Title, Mode Switcher & Date Stepper */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Agenda Escolar de Recursos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualização interativa das reservas em modos diário, semanal e mensal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View mode segmented buttons */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diária
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semanal
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensal
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Reservar</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (viewMode === 'monthly') handleMonthShift(-1);
              else if (viewMode === 'weekly') handleDateShift(-7);
              else handleDateShift(-1);
            }}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            title="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentDateStr(todayStr)}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hoje
          </button>

          <button
            type="button"
            onClick={() => {
              if (viewMode === 'monthly') handleMonthShift(1);
              else if (viewMode === 'weekly') handleDateShift(7);
              else handleDateShift(1);
            }}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            title="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="text-xs font-bold text-slate-900 ml-2 capitalize">
            {viewMode === 'monthly'
              ? new Date(currYear, currMonth - 1, 1).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })
              : viewMode === 'weekly'
              ? `Semana de ${formatBrazilianDate(weekDates[0].dateStr)} a ${formatBrazilianDate(
                  weekDates[4].dateStr
                )}`
              : formatBrazilianLongDate(currentDateStr)}
          </span>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar por turma, professor ou equipamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
            Equipamento
          </label>
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            <option value="all">Todos os Equipamentos</option>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
            Professor
          </label>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            <option value="all">Todos os Docentes</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
            Turma
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            <option value="all">Todas as Turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Turma {c.name} ({c.shift === 'morning' ? 'Matutino' : 'Vespertino'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
            Sala de Aula
          </label>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            <option value="all">Todas as Salas</option>
            {classrooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          >
            <option value="all">Todos os Status</option>
            <option value="confirmed">Confirmados</option>
            <option value="pending">Pendentes</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: DIÁRIA */}
      {viewMode === 'daily' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Grade de Horários do Dia · {formatBrazilianDate(currentDateStr)}
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">
              {filteredBookings.filter((b) => b.date === currentDateStr).length} reservas hoje
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {periods.map((p) => {
              const periodBookings = filteredBookings.filter(
                (b) =>
                  b.date === currentDateStr &&
                  (b.periodIds?.includes(p.id) ||
                    (b.startTime <= p.startTime && b.endTime >= p.endTime))
              );

              const isAfterMorningBreak = p.id === 'p-m4';
              const isTurnoChange = p.id === 'p-v1';
              const isAfterAfternoonBreak = p.id === 'p-v4';

              return (
                <React.Fragment key={p.id}>
                  {isAfterMorningBreak && (
                    <div className="bg-amber-50/80 border-y border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Intervalo / Recreio Matutino (após a 3ª aula)</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-amber-800">09:45 – 10:00 (15 min)</span>
                    </div>
                  )}

                  {isTurnoChange && (
                    <div className="bg-slate-100 border-y border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Turno Vespertino (Tarde)</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-600">Aulas das 13:00 às 17:25</span>
                    </div>
                  )}

                  {isAfterAfternoonBreak && (
                    <div className="bg-indigo-50/80 border-y border-indigo-200/60 px-4 py-2 flex items-center justify-between text-xs text-indigo-900">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Intervalo / Recreio Vespertino (após a 3ª aula)</span>
                      </span>
                      <span className="font-mono text-[11px] font-bold text-indigo-800">15:30 – 15:45 (15 min)</span>
                    </div>
                  )}

                  <div className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Period Time Column */}
                    <div className="sm:w-44 shrink-0">
                      <span className="font-semibold text-xs text-slate-800 block">{p.label}</span>
                      <span className="text-[11px] font-mono text-blue-700 tabular-nums">
                        {p.startTime} - {p.endTime}
                      </span>
                    </div>

                    {/* Bookings in this period */}
                    <div className="flex-1">
                      {periodBookings.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          Nenhum equipamento agendado neste horário.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {periodBookings.map((b) => {
                            const equip = equipments.find((e) => e.id === b.equipmentId);
                            const teacher = users.find((u) => u.id === b.userId);
                            const schoolClass = classes.find((c) => c.id === b.classId);
                            const room = classrooms.find((r) => r.id === b.classroomId);

                            return (
                              <div
                                key={b.id}
                                onClick={() => onSelectBooking(b)}
                                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50/60 p-3 hover:bg-blue-50/40 hover:border-blue-300 transition-all text-xs"
                              >
                                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                                  <span className="truncate">{getBookingEquipNames(b)}</span>
                                  {getStatusBadge(b.status)}
                                </div>
                                <div className="text-[11px] text-slate-600 space-y-0.5">
                                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                                    <User className="h-3 w-3 text-slate-400" />
                                    <span>{teacher?.name}</span>
                                  </p>
                                  <p className="flex items-center gap-1 text-slate-500">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    <span>{schoolClass?.name}</span>
                                    <span>·</span>
                                    <span>{b.customSubjectName || subjects.find((s) => s.id === b.subjectId)?.name || ''}</span>
                                    <span>·</span>
                                    <MapPin className="h-3 w-3 text-slate-400" />
                                    <span>{room?.name}</span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          </div>
        </div>
      )}

      {/* VIEW 2: SEMANAL */}
      {viewMode === 'weekly' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header: Days of the week */}
            <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-center divide-x divide-slate-200">
              {weekDates.map((w) => {
                const isToday = w.dateStr === todayStr;
                const count = filteredBookings.filter((b) => b.date === w.dateStr).length;

                return (
                  <div key={w.dateStr} className={`p-3 ${isToday ? 'bg-blue-50/60' : ''}`}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {w.dayName}
                    </p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {formatBrazilianDate(w.dateStr)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 tabular-nums">
                      {count} {count === 1 ? 'reserva' : 'reservas'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Grid Days Columns */}
            <div className="grid grid-cols-5 divide-x divide-slate-100 min-h-[400px]">
              {weekDates.map((w) => {
                const dayBookings = filteredBookings
                  .filter((b) => b.date === w.dateStr)
                  .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

                return (
                  <div key={w.dateStr} className="p-2 space-y-2">
                    {dayBookings.length === 0 ? (
                      <p className="text-[11px] text-slate-300 text-center py-8 italic">Sem reservas</p>
                    ) : (
                      dayBookings.map((b) => {
                        const equip = equipments.find((e) => e.id === b.equipmentId);
                        const teacher = users.find((u) => u.id === b.userId);
                        const schoolClass = classes.find((c) => c.id === b.classId);

                        return (
                          <div
                            key={b.id}
                            onClick={() => onSelectBooking(b)}
                            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs hover:border-blue-400 hover:bg-blue-50/20 transition-all text-xs"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-blue-700 font-semibold mb-1">
                              <span>
                                {b.startTime} - {b.endTime}
                              </span>
                              {getStatusBadge(b.status)}
                            </div>
                            <p className="font-bold text-slate-900 line-clamp-1 text-[11px]">
                              {getBookingEquipNames(b)}
                            </p>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5">{teacher?.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {schoolClass?.name} · {b.customSubjectName || subjects.find((s) => s.id === b.subjectId)?.name || ''}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MENSAL */}
      {viewMode === 'monthly' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-500 py-2.5">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfMonthWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] bg-slate-50/30 p-2" />
            ))}

            {daysInCurrentMonth.map((d) => {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, '0');
              const dt = String(d.getDate()).padStart(2, '0');
              const dateStr = `${y}-${m}-${dt}`;

              const isToday = dateStr === todayStr;
              const isSelected = dateStr === currentDateStr;
              const dayBookings = filteredBookings.filter((b) => b.date === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setCurrentDateStr(dateStr);
                    setViewMode('daily');
                  }}
                  className={`min-h-[95px] p-2 cursor-pointer transition-colors ${
                    isToday
                      ? 'bg-blue-50/40'
                      : isSelected
                      ? 'bg-slate-100/60'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1 rounded tabular-nums">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((b) => {
                      return (
                        <div
                          key={b.id}
                          className="truncate rounded bg-white px-1 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-100 shadow-2xs"
                        >
                          <span className="font-mono text-blue-700 mr-1">{b.startTime}</span>
                          <span>{getBookingEquipNames(b)}</span>
                        </div>
                      );
                    })}
                    {dayBookings.length > 2 && (
                      <span className="text-[9px] text-slate-400 pl-1">
                        +{dayBookings.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
