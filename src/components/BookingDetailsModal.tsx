import React from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Tv,
  Projector,
  Laptop,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Tag,
} from 'lucide-react';
import { formatBrazilianDate, formatBrazilianLongDate } from '../utils/dateUtils';

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
}) => {
  const {
    equipments,
    users,
    classes,
    subjects,
    classrooms,
    currentUser,
    cancelBooking,
    approveBooking,
    rejectBooking,
  } = useApp();

  if (!booking) return null;

  const equip = equipments.find((e) => e.id === booking.equipmentId);
  const teacher = users.find((u) => u.id === booking.userId);
  const schoolClass = classes.find((c) => c.id === booking.classId);
  const subject = subjects.find((s) => s.id === booking.subjectId);
  const room = classrooms.find((r) => r.id === booking.classroomId);

  const canCancel =
    (currentUser.id === booking.userId || currentUser.role === 'admin') &&
    booking.status !== 'cancelled' &&
    booking.status !== 'rejected';

  const canDecide = currentUser.role === 'admin' && booking.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Detalhes da Reserva</h3>
            <p className="text-[11px] font-mono text-slate-400">ID: {booking.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Equipment Hero Preview (supports multiple items) */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Equipamentos Solicitados ({booking.equipmentIds?.length || 1})
          </span>
          <div className="space-y-2">
            {(booking.equipmentIds && booking.equipmentIds.length > 0
              ? booking.equipmentIds
              : [booking.equipmentId]
            ).map((eqId) => {
              const item = equipments.find((e) => e.id === eqId);
              if (!item) return null;
              return (
                <div key={item.id} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-14 rounded object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-100 text-blue-700 shrink-0">
                      <Tv className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Patrimônio: {item.patrimony}</p>
                    <p className="text-[10px] text-slate-600">Local: {item.storageLocation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-slate-100 p-3 bg-white space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Docente</span>
            <p className="font-bold text-slate-900">{teacher?.name}</p>
            <p className="text-[11px] text-slate-500">{teacher?.email}</p>
          </div>

          <div className="rounded-lg border border-slate-100 p-3 bg-white space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Data e Horário</span>
            <p className="font-bold text-slate-900">{formatBrazilianDate(booking.date)}</p>
            <p className="font-mono text-blue-700 tabular-nums font-semibold">
              {booking.startTime} às {booking.endTime}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 p-3 bg-white space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Turma & Disciplina</span>
            <p className="font-bold text-slate-900">
              Turma {schoolClass?.name}{' '}
              <span className="text-[10px] font-normal text-slate-500">
                ({schoolClass?.shift === 'morning' ? 'Matutino' : 'Vespertino'})
              </span>
            </p>
            <p className="text-[11px] text-slate-500">
              {booking.customSubjectName || subject?.name || 'Disciplina Geral'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 p-3 bg-white space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Sala de Utilização</span>
            <p className="font-bold text-slate-900">{room?.name}</p>
            <p className="text-[11px] text-slate-500">{room?.floor}</p>
          </div>
        </div>

        {/* Objective */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs space-y-1">
          <span className="text-[10px] font-semibold uppercase text-slate-400">
            Objetivo Pedagógico / Atividade
          </span>
          <p className="text-slate-800 italic">"{booking.purpose}"</p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500">Situação da Reserva:</span>
          <div>
            {booking.status === 'confirmed' && (
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                Confirmada no Sistema
              </span>
            )}
            {booking.status === 'pending' && (
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                Pendente de Aprovação
              </span>
            )}
            {booking.status === 'cancelled' && (
              <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                Cancelada ({booking.cancellationReason || 'Cancelado pelo usuário'})
              </span>
            )}
            {booking.status === 'rejected' && (
              <span className="font-bold text-red-700 bg-red-50 px-2 py-1 rounded">
                Recusada: {booking.rejectionReason}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          {canDecide && (
            <>
              <button
                type="button"
                onClick={() => {
                  const reason = prompt('Informe o motivo da recusa:') || 'Não especificado';
                  rejectBooking(booking.id, reason);
                  onClose();
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => {
                  approveBooking(booking.id);
                  onClose();
                }}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Aprovar
              </button>
            </>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja realmente cancelar este agendamento?')) {
                  cancelBooking(booking.id, 'Cancelado pelo usuário');
                  onClose();
                }
              }}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Cancelar Agendamento
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
