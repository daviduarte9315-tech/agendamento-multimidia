import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tv,
  Projector,
  Laptop,
  Volume2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Plus,
  Search,
} from 'lucide-react';
import { formatBrazilianDate, getTodayDateString } from '../utils/dateUtils';
import { Booking } from '../types';

interface MyBookingsViewProps {
  onSelectBooking: (booking: Booking) => void;
  onOpenNewBooking: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onSelectBooking,
  onOpenNewBooking,
}) => {
  const { currentUser, bookings, equipments, classes, classrooms, subjects, cancelBooking } = useApp();

  const todayStr = getTodayDateString();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // User's own bookings
  const myBookings = bookings.filter((b) => b.userId === currentUser.id);

  const filteredBookings = myBookings.filter((b) => {
    if (statusFilter === 'active') {
      if (b.status === 'cancelled' || b.status === 'rejected') return false;
      if (b.date < todayStr) return false;
    } else if (statusFilter === 'completed') {
      if (b.status === 'cancelled' || b.status === 'rejected') return false;
      if (b.date >= todayStr) return false;
    } else if (statusFilter === 'cancelled') {
      if (b.status !== 'cancelled' && b.status !== 'rejected') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const equip = equipments.find((e) => e.id === b.equipmentId);
      const schoolClass = classes.find((c) => c.id === b.classId);
      const room = classrooms.find((r) => r.id === b.classroomId);

      const match =
        equip?.name.toLowerCase().includes(q) ||
        schoolClass?.name.toLowerCase().includes(q) ||
        room?.name.toLowerCase().includes(q) ||
        b.purpose.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Minhas Reservas de Equipamentos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Histórico e agendamentos ativos vinculados ao seu perfil docente ({currentUser.name}).
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Fazer Nova Reserva</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Próximas & Ativas ({myBookings.filter((b) => b.status !== 'cancelled' && b.date >= todayStr).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Histórico Concluído
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('cancelled')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'cancelled'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Canceladas
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({myBookings.length})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar em minhas reservas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Nenhuma reserva encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Você não possui reservas nesta categoria no momento.
          </p>
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Agendar Equipamento</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const equipIds = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
            const equipNames =
              equipIds.map((id) => equipments.find((e) => e.id === id)?.name).filter(Boolean).join(' + ') ||
              'Equipamento';
            const primaryEquip = equipments.find((e) => e.id === equipIds[0]);
            const schoolClass = classes.find((c) => c.id === b.classId);
            const room = classrooms.find((r) => r.id === b.classroomId);

            const isPast = b.date < todayStr;
            const isCancelled = b.status === 'cancelled' || b.status === 'rejected';

            return (
              <div
                key={b.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 bg-white shadow-xs transition-all ${
                  isCancelled ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div
                  onClick={() => onSelectBooking(b)}
                  className="cursor-pointer flex items-start gap-4 flex-1"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    {primaryEquip?.category === 'datashow' && <Projector className="h-6 w-6" />}
                    {primaryEquip?.category === 'tv' && <Tv className="h-6 w-6" />}
                    {primaryEquip?.category === 'chromebook_cart' && <Laptop className="h-6 w-6" />}
                    {(primaryEquip?.category === 'sound' || primaryEquip?.category === 'mic') && (
                      <Volume2 className="h-6 w-6" />
                    )}
                    {!['datashow', 'tv', 'chromebook_cart', 'sound', 'mic'].includes(
                      primaryEquip?.category || ''
                    ) && <Calendar className="h-6 w-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{equipNames}</span>
                      {b.status === 'confirmed' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Confirmada
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Em Análise
                        </span>
                      )}
                      {b.status === 'cancelled' && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Cancelada
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Turma {schoolClass?.name}</span>
                      <span>·</span>
                      <span className="text-slate-700 font-medium">
                        {b.customSubjectName || subjects.find((s) => s.id === b.subjectId)?.name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {room?.name}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">
                        {equipIds.length} {equipIds.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 italic">"{b.purpose}"</p>
                  </div>
                </div>

                {/* Date & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-slate-900">{formatBrazilianDate(b.date)}</p>
                    <p className="text-xs font-mono tabular-nums text-blue-700 font-semibold">
                      {b.startTime} às {b.endTime}
                    </p>
                  </div>

                  {!isCancelled && !isPast && (
                    <button
                      type="button"
                      onClick={() => {
                        const reason = prompt('Informe o motivo do cancelamento da reserva:');
                        if (reason !== null) {
                          cancelBooking(b.id, reason);
                        }
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
