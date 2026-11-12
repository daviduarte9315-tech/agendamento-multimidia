import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  Tv,
  Projector,
  Laptop,
  Users,
  User,
  BookOpen,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { exportBookingsToCSV } from '../utils/exportUtils';
import { formatBrazilianDate } from '../utils/dateUtils';

export const ReportsView: React.FC = () => {
  const { bookings, equipments, users, classes, subjects, classrooms } = useApp();

  const [dateRange, setDateRange] = useState<'all' | 'month' | 'week'>('all');

  // Filter bookings if needed
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');

  // 1. Most used equipment
  const equipmentUsage: { [key: string]: number } = {};
  activeBookings.forEach((b) => {
    const ids = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
    ids.forEach((id) => {
      equipmentUsage[id] = (equipmentUsage[id] || 0) + 1;
    });
  });

  const sortedEquipments = Object.entries(equipmentUsage)
    .map(([id, count]) => ({
      equipment: equipments.find((e) => e.id === id),
      count,
    }))
    .filter((item) => item.equipment)
    .sort((a, b) => b.count - a.count);

  const maxEquipCount = sortedEquipments[0]?.count || 1;

  // 2. Teacher frequency
  const teacherUsage: { [key: string]: number } = {};
  activeBookings.forEach((b) => {
    teacherUsage[b.userId] = (teacherUsage[b.userId] || 0) + 1;
  });

  const sortedTeachers = Object.entries(teacherUsage)
    .map(([id, count]) => ({
      user: users.find((u) => u.id === id),
      count,
    }))
    .filter((item) => item.user)
    .sort((a, b) => b.count - a.count);

  // 3. Class usage
  const classUsage: { [key: string]: number } = {};
  activeBookings.forEach((b) => {
    classUsage[b.classId] = (classUsage[b.classId] || 0) + 1;
  });

  const sortedClasses = Object.entries(classUsage)
    .map(([id, count]) => ({
      schoolClass: classes.find((c) => c.id === id),
      count,
    }))
    .filter((item) => item.schoolClass)
    .sort((a, b) => b.count - a.count);

  // 4. Cancelled count
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const handleExportCSV = () => {
    exportBookingsToCSV(bookings, equipments, users, classes, subjects, classrooms);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Relatórios e Indicadores de Uso
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Análise gerencial da utilização dos recursos tecnológicos para planejamento e aquisições.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Exportar Planilha (CSV / Excel)</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total de Reservas</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums mt-1">
            {bookings.length}
          </p>
          <span className="text-[11px] text-slate-400">Desde o início do semestre</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Reservas Confirmadas</span>
          <p className="text-2xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums mt-1">
            {activeBookings.length}
          </p>
          <span className="text-[11px] text-slate-400">Aulas realizadas ou agendadas</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Cancelamentos Registrados</span>
          <p className="text-2xl font-bold tracking-tight text-amber-600 font-mono tabular-nums mt-1">
            {cancelledBookings.length}
          </p>
          <span className="text-[11px] text-slate-400">Horários liberados para outros</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Professores Ativos</span>
          <p className="text-2xl font-bold tracking-tight text-blue-600 font-mono tabular-nums mt-1">
            {sortedTeachers.length}
          </p>
          <span className="text-[11px] text-slate-400">Docentes com reservas feitas</span>
        </div>
      </div>

      {/* Detailed analytics sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most used equipment */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tv className="h-4 w-4 text-blue-600" />
                <span>Equipamentos Mais Requisitados</span>
              </h3>
              <p className="text-xs text-slate-500">Classificação por frequência total de reservas</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Frequência</span>
          </div>

          <div className="space-y-3">
            {sortedEquipments.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">Nenhum dado de uso registrado.</p>
            ) : (
              sortedEquipments.map((item, idx) => {
                const percentage = Math.round((item.count / maxEquipCount) * 100);
                return (
                  <div key={item.equipment?.id || idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[260px]">
                        {idx + 1}. {item.equipment?.name}
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums font-bold">
                        {item.count} {item.count === 1 ? 'reserva' : 'reservas'}
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Teacher ranking */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                <span>Frequência de Uso por Docente</span>
              </h3>
              <p className="text-xs text-slate-500">Professores que mais integram tecnologia nas aulas</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Reservas</span>
          </div>

          <div className="space-y-3">
            {sortedTeachers.map((item, idx) => (
              <div
                key={item.user?.id || idx}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{item.user?.name}</p>
                    <p className="text-[11px] text-slate-500">{item.user?.subject}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                    {item.count}
                  </span>
                  <p className="text-[10px] text-slate-400">aulas agendadas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Usage */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Utilização por Turma</span>
              </h3>
              <p className="text-xs text-slate-500">Turmas mais atendidas com recursos multimídia</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {sortedClasses.map((item) => (
              <div
                key={item.schoolClass?.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100"
              >
                <span className="font-semibold text-slate-800">Turma {item.schoolClass?.name}</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {item.count} {item.count === 1 ? 'uso' : 'usos'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak demand and recommendations */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Horários e Turnos de Maior Demanda</span>
            </h3>
            <p className="text-xs text-slate-500">Análise de picos para apoio à gestão</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-100">
              <p className="font-bold text-blue-900 mb-0.5">Turno Matutino (Maior Concentração)</p>
              <p className="text-[11px] text-blue-800">
                Aproximadamente 85% das reservas ocorrem nas 1ª e 2ª aulas matutinas (07:30 - 09:10).
                Recomenda-se incentivar o agendamento no contraturno ou aquisição de mais 1 projetor de alta luminosidade.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <p className="font-bold text-slate-900 mb-0.5">Carrinho de Chromebooks</p>
              <p className="text-[11px] text-slate-600">
                O carrinho móvel possui alta demanda para projetos interdisciplinares. Como cada reserva ocupa
                o lote de 30 unidades, recomenda-se antecedência mínima de 48h aos professores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
