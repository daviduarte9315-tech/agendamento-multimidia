import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarPlus,
  Tv,
  Projector,
  Laptop,
  Volume2,
  Calendar,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
} from 'lucide-react';
import { formatBrazilianDate, formatBrazilianLongDate, getTodayDateString } from '../utils/dateUtils';
import { NavTab } from './Sidebar';
import { Booking } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectBooking }) => {
  const { currentUser, equipments, bookings, classrooms, classes, subjects, users } = useApp();

  const todayStr = getTodayDateString();

  // Metrics
  const totalEquips = equipments.length;
  const availableEquips = equipments.filter((e) => e.status === 'available').length;
  const maintenanceEquips = equipments.filter((e) => e.status === 'maintenance');

  // Bookings today
  const todayBookings = bookings.filter((b) => b.date === todayStr && b.status === 'confirmed');

  // User's upcoming bookings
  const userUpcomingBookings = bookings
    .filter(
      (b) =>
        b.userId === currentUser.id &&
        b.date >= todayStr &&
        (b.status === 'confirmed' || b.status === 'pending')
    )
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  // Category counts
  const categoryStats = [
    {
      category: 'datashow',
      name: 'Projetores & Datashows',
      icon: Projector,
      count: equipments.filter((e) => e.category === 'datashow').length,
      available: equipments.filter((e) => e.category === 'datashow' && e.status === 'available').length,
    },
    {
      category: 'tv',
      name: 'Smart TVs Móveis',
      icon: Tv,
      count: equipments.filter((e) => e.category === 'tv').length,
      available: equipments.filter((e) => e.category === 'tv' && e.status === 'available').length,
    },
    {
      category: 'chromebook_cart',
      name: 'Carrinhos de Chromebooks',
      icon: Laptop,
      count: equipments.filter((e) => e.category === 'chromebook_cart').length,
      available: equipments.filter((e) => e.category === 'chromebook_cart' && e.status === 'available').length,
    },
    {
      category: 'sound',
      name: 'Áudio & Microfones',
      icon: Volume2,
      count: equipments.filter((e) => e.category === 'sound' || e.category === 'mic').length,
      available: equipments.filter((e) => (e.category === 'sound' || e.category === 'mic') && e.status === 'available').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-sm md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{formatBrazilianLongDate(todayStr)}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Olá, {currentUser.name}!
            </h1>
            <p className="max-w-xl text-sm text-blue-100/90 leading-relaxed">
              Bem-vindo ao sistema de agendamento de recursos multimídia. Reserve equipamentos
              para suas aulas, consulte a disponibilidade em tempo real e evite conflitos de horário.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('new_booking')}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-md hover:bg-blue-50 active:scale-95 transition-all whitespace-nowrap"
            >
              <CalendarPlus className="h-5 w-5 text-blue-600" />
              <span>Novo Agendamento</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              <span>Ver Agenda Geral</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row (tabular numbers, single elevation) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          onClick={() => onNavigate('equipments')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Equipamentos Livres</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {availableEquips}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">de {totalEquips} total</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Prontos para reserva imediata</p>
        </div>

        <div
          onClick={() => onNavigate('schedule')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Reservas Hoje</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {todayBookings.length}
            </span>
            <span className="text-xs text-slate-500">aulas hoje</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Equipamentos em uso no colégio</p>
        </div>

        <div
          onClick={() => onNavigate('my_bookings')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Meus Agendamentos</span>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {userUpcomingBookings.length}
            </span>
            <span className="text-xs text-slate-500">programados</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Suas reservas ativas futuras</p>
        </div>

        <div
          onClick={() => onNavigate('equipments')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Manutenções</span>
            <AlertTriangle className={`h-4 w-4 ${maintenanceEquips.length > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {maintenanceEquips.length}
            </span>
            <span className="text-xs text-slate-500">em reparo</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {maintenanceEquips.length > 0 ? 'Temporariamente indisponíveis' : 'Nenhum equipamento quebrado'}
          </p>
        </div>
      </div>

      {/* Maintenance alert if any */}
      {maintenanceEquips.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Aviso da Coordenação · Equipamento(s) em Manutenção
              </h4>
              <div className="space-y-1 text-xs text-amber-900">
                {maintenanceEquips.map((eq) => (
                  <p key={eq.id}>
                    <span className="font-semibold">{eq.name}:</span> {eq.maintenanceReason || 'Em revisão técnica'} (Retorno previsto: {eq.maintenanceExpectedReturn || 'A definir'}).
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: My Next Bookings & Today's Schedule Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: User Bookings & Quick Categories */}
        <div className="space-y-6 lg:col-span-2">
          {/* User's Upcoming Bookings */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Seus Próximos Agendamentos</h3>
                <p className="text-xs text-slate-500">Equipamentos reservados em seu nome para as próximas aulas</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('my_bookings')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver todos</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {userUpcomingBookings.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Você não tem agendamentos futuros</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Precisa de um projetor, TV móvel ou carrinho de notebooks para sua aula?
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('new_booking')}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>Agendar Agora</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userUpcomingBookings.slice(0, 3).map((b) => {
                  const equipIds = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
                  const equipNames = equipIds.map((id) => equipments.find((e) => e.id === id)?.name).filter(Boolean).join(' + ') || 'Equipamento';
                  const primaryEquip = equipments.find((e) => e.id === equipIds[0]);
                  const room = classrooms.find((r) => r.id === b.classroomId);
                  const schoolClass = classes.find((c) => c.id === b.classId);
                  const subject = subjects.find((s) => s.id === b.subjectId);

                  const isToday = b.date === todayStr;

                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectBooking(b)}
                      className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          {primaryEquip?.category === 'datashow' && <Projector className="h-5 w-5" />}
                          {primaryEquip?.category === 'tv' && <Tv className="h-5 w-5" />}
                          {primaryEquip?.category === 'chromebook_cart' && <Laptop className="h-5 w-5" />}
                          {(primaryEquip?.category === 'sound' || primaryEquip?.category === 'mic') && (
                            <Volume2 className="h-5 w-5" />
                          )}
                          {!['datashow', 'tv', 'chromebook_cart', 'sound', 'mic'].includes(primaryEquip?.category || '') && (
                            <Calendar className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{equipNames}</span>
                            {isToday && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Hoje
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">Turma {schoolClass?.name}</span>
                            <span>·</span>
                            <span>{b.customSubjectName || subject?.name}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {room?.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            "{b.purpose}"
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
                        <span className="text-xs font-semibold text-slate-800">
                          {formatBrazilianDate(b.date)}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-blue-700 font-medium">
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Equipment Categories */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Categorias de Equipamentos</h3>
                <p className="text-xs text-slate-500">Recursos tecnológicos mantidos pela escola</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('equipments')}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Ver todos
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categoryStats.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.category}
                    onClick={() => onNavigate('equipments')}
                    className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center hover:bg-blue-50/40 hover:border-blue-200 transition-all"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-xs text-blue-600 mb-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-snug">{cat.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-emerald-700 tabular-nums">{cat.available}</span> livres
                      {' '}de <span className="tabular-nums">{cat.count}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Agenda Preview & Quick Action */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Agenda de Hoje</h3>
                <p className="text-xs text-slate-500">{formatBrazilianDate(todayStr)}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Expandir
              </button>
            </div>

            {todayBookings.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                Nenhum equipamento reservado para hoje até o momento.
              </p>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((b) => {
                  const equipIds = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
                  const equipNames = equipIds.map((id) => equipments.find((e) => e.id === id)?.name).filter(Boolean).join(' + ') || 'Equipamento';
                  const teacher = users.find((u) => u.id === b.userId);
                  const schoolClass = classes.find((c) => c.id === b.classId);
                  const room = classrooms.find((r) => r.id === b.classroomId);

                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectBooking(b)}
                      className="cursor-pointer rounded-lg border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
                        <span className="truncate max-w-[150px]">{equipNames}</span>
                        <span className="font-mono text-blue-700 tabular-nums shrink-0">
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <p className="font-medium text-slate-800">{teacher?.name}</p>
                        <p>
                          {schoolClass?.name} · {room?.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>Ver Grade Diária Completa</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Guidelines Box */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Instruções da Escola</span>
            </h4>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
              <li>Retire o equipamento com 10 min de antecedência na Sala Multimídia.</li>
              <li>Aulas geminadas ocupam dois períodos consecutivos.</li>
              <li>Conflitos de reserva são bloqueados automaticamente pelo sistema.</li>
              <li>Devolva o Carrinho de Chromebooks sempre conectado à tomada de recarga.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
