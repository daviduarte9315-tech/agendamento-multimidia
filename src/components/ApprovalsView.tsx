import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Tv,
  Projector,
  Laptop,
  Volume2,
  User,
  ShieldCheck,
} from 'lucide-react';
import { formatBrazilianDate } from '../utils/dateUtils';
import { Booking } from '../types';

export const ApprovalsView: React.FC = () => {
  const {
    bookings,
    equipments,
    users,
    classes,
    classrooms,
    approveBooking,
    rejectBooking,
    settings,
    updateSettings,
  } = useApp();

  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Equipamento alocado para evento pedagógico institucional.');

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingBookingId) {
      rejectBooking(rejectingBookingId, rejectReason);
      setRejectingBookingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Aprovações de Reservas (Coordenação)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analise e autorize solicitações de uso de equipamentos multimídia.
          </p>
        </div>

        {/* Setting Toggle: Require Approval */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Modo de Aprovação Prévia</span>
            <span className="text-[11px] text-slate-500">
              {settings.requireAdminApproval
                ? 'Ativado: Agendamentos entram como pendentes'
                : 'Desativado: Agendamentos confirmados na hora'}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireAdminApproval}
              onChange={(e) => updateSettings({ requireAdminApproval: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
          <h3 className="text-sm font-bold text-slate-900">Nenhuma solicitação pendente!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Todas as solicitações de recursos tecnológicos foram aprovadas ou o sistema está configurado
            para confirmação automática direta pelos professores.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-600">
            {pendingBookings.length} {pendingBookings.length === 1 ? 'solicitação aguardando' : 'solicitações aguardando'} decisão:
          </p>

          <div className="space-y-3">
            {pendingBookings.map((b) => {
              const equipIds = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
              const equipNames = equipIds.map((id) => equipments.find((e) => e.id === id)?.name).filter(Boolean).join(' + ') || 'Equipamento';
              const primaryEquip = equipments.find((e) => e.id === equipIds[0]);
              const teacher = users.find((u) => u.id === b.userId);
              const schoolClass = classes.find((c) => c.id === b.classId);
              const room = classrooms.find((r) => r.id === b.classroomId);

              return (
                <div
                  key={b.id}
                  className="rounded-xl border border-amber-200 bg-white p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{equipNames}</span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Pendente
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {equipIds.length} {equipIds.length === 1 ? 'item solicitado' : 'itens solicitados'}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-900">{formatBrazilianDate(b.date)}</p>
                      <p className="text-xs font-mono tabular-nums text-blue-700 font-bold">
                        {b.startTime} às {b.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Docente Solicitante
                      </span>
                      <span className="font-semibold text-slate-900">{teacher?.name}</span>
                      <span className="text-slate-500 block">{teacher?.email}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Turma e Local
                      </span>
                      <span className="font-semibold text-slate-900">{schoolClass?.name}</span>
                      <span className="text-slate-500 block">{room?.name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Objetivo Declarado
                      </span>
                      <p className="text-slate-800 italic line-clamp-2">"{b.purpose}"</p>
                    </div>
                  </div>

                  {/* Approve or Reject buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRejectingBookingId(b.id)}
                      className="rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Recusar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => approveBooking(b.id)}
                      className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Aprovar Reserva</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>Justificativa da Não Aprovação</span>
            </h3>
            <p className="text-xs text-slate-600">
              O professor receberá uma notificação explicativa informando o motivo da recusa da reserva.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motivo do Indeferimento *</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingBookingId(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-1.5 font-bold text-white hover:bg-red-700 shadow-xs"
                >
                  Confirmar Recusa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
