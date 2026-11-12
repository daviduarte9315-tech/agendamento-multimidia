import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Tv,
  Projector,
  Laptop,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
  Plus,
  PenTool,
  List,
} from 'lucide-react';
import { formatBrazilianDate, getTodayDateString } from '../utils/dateUtils';
import { Equipment } from '../types';
import { KidsBookingView } from './KidsBookingView';

interface NewBookingViewProps {
  onBookingSuccess: () => void;
  preselectedEquipmentId?: string;
}

export const NewBookingView: React.FC<NewBookingViewProps> = ({
  onBookingSuccess,
  preselectedEquipmentId,
}) => {
  // Booking Mode: 'simple' (kids/super easy) or 'complete' (advanced)
  const [bookingMode, setBookingMode] = useState<'simple' | 'complete'>('simple');
  const {
    currentUser,
    users,
    equipments,
    classes,
    subjects,
    classrooms,
    periods,
    addBooking,
    checkEquipmentAvailability,
  } = useApp();

  const todayStr = getTodayDateString();

  // Multi-equipment selection: array of IDs
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(() => {
    if (preselectedEquipmentId) return [preselectedEquipmentId];
    return equipments[0]?.id ? [equipments[0].id] : [];
  });

  const [date, setDate] = useState<string>(todayStr);

  // Time mode: 'periods' or 'custom'
  const [timeMode, setTimeMode] = useState<'periods' | 'custom'>('periods');
  const [selectedPeriodIds, setSelectedPeriodIds] = useState<string[]>(['p-m1']);
  const [customStartTime, setCustomStartTime] = useState<string>('07:15');
  const [customEndTime, setCustomEndTime] = useState<string>('08:05');

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? '');

  // Subject: select existing OR write freely
  const [subjectMode, setSubjectMode] = useState<'select' | 'custom'>('select');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id ?? '');
  const [customSubjectText, setCustomSubjectText] = useState<string>('');

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(classrooms[0]?.id ?? '');
  const [purpose, setPurpose] = useState<string>('');

  // Category filter for equipment picker
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Availability Check State
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<{
    available: boolean;
    conflictReason?: string;
    similarEquipments?: Equipment[];
    alternativeSlots?: { startTime: string; endTime: string; label: string }[];
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Compute times
  const getComputedTimes = () => {
    if (timeMode === 'custom') {
      return { startTime: customStartTime, endTime: customEndTime };
    }

    if (selectedPeriodIds.length === 0) {
      return { startTime: '07:15', endTime: '08:05' };
    }

    const selectedPeriods = periods
      .filter((p) => selectedPeriodIds.includes(p.id))
      .sort((a, b) => a.order - b.order);

    const startTime = selectedPeriods[0]?.startTime || '07:15';
    const endTime = selectedPeriods[selectedPeriods.length - 1]?.endTime || '08:05';

    return { startTime, endTime };
  };

  // Reset checks on change
  useEffect(() => {
    setHasChecked(false);
    setCheckResult(null);
    setErrorMessage(null);
  }, [selectedEquipmentIds, date, selectedPeriodIds, customStartTime, customEndTime, timeMode]);

  // Toggle equipment selection (multiselect)
  const handleToggleEquipment = (id: string) => {
    if (selectedEquipmentIds.includes(id)) {
      if (selectedEquipmentIds.length > 1) {
        setSelectedEquipmentIds(selectedEquipmentIds.filter((item) => item !== id));
      }
    } else {
      setSelectedEquipmentIds([...selectedEquipmentIds, id]);
    }
  };

  // Toggle class period
  const handlePeriodToggle = (periodId: string) => {
    if (selectedPeriodIds.includes(periodId)) {
      if (selectedPeriodIds.length > 1) {
        setSelectedPeriodIds(selectedPeriodIds.filter((id) => id !== periodId));
      }
    } else {
      setSelectedPeriodIds([...selectedPeriodIds, periodId]);
    }
  };

  const handleCheckAvailability = () => {
    const { startTime, endTime } = getComputedTimes();
    if (selectedEquipmentIds.length === 0) {
      setErrorMessage('Selecione pelo menos um equipamento.');
      return;
    }
    if (!date) {
      setErrorMessage('Informe a data da aula.');
      return;
    }

    const res = checkEquipmentAvailability(selectedEquipmentIds, date, startTime, endTime);
    setCheckResult(res);
    setHasChecked(true);
    setErrorMessage(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedEquipmentIds.length === 0) {
      setErrorMessage('Selecione pelo menos um produto multimídia.');
      return;
    }

    const { startTime, endTime } = getComputedTimes();

    // Check availability
    const res = checkEquipmentAvailability(selectedEquipmentIds, date, startTime, endTime);
    if (!res.available) {
      setCheckResult(res);
      setHasChecked(true);
      setErrorMessage(res.conflictReason || 'Equipamento(s) indisponível(is) no horário.');
      return;
    }

    const effectivePurpose = purpose.trim() || 'Aula com recurso multimídia';

    const addRes = addBooking({
      equipmentId: selectedEquipmentIds[0],
      equipmentIds: selectedEquipmentIds,
      userId: currentUser.id,
      date,
      periodType: timeMode === 'periods' ? 'period' : 'custom',
      periodIds: selectedPeriodIds,
      startTime,
      endTime,
      classId: selectedClassId,
      subjectId: subjectMode === 'custom' ? 'sub-custom' : selectedSubjectId,
      customSubjectName: subjectMode === 'custom' ? customSubjectText.trim() : undefined,
      classroomId: selectedClassroomId,
      purpose: effectivePurpose,
      quantityReserved: 1,
    });

    if (addRes.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onBookingSuccess();
      }, 1300);
    } else {
      setErrorMessage(addRes.error || 'Erro ao registrar agendamento.');
    }
  };

  const filteredEquipments = equipments.filter((eq) => {
    if (categoryFilter === 'all') return true;
    return eq.category === categoryFilter;
  });

  const { startTime: computedStart, endTime: computedEnd } = getComputedTimes();

  const selectedEquipmentsList = equipments.filter((e) => selectedEquipmentIds.includes(e.id));

  // If in super simple / kids mode, render the kid-friendly wizard view!
  if (bookingMode === 'simple') {
    return (
      <div className="space-y-4">
        {/* Friendly Mode Switcher Banner */}
        <div className="flex items-center justify-between rounded-2xl bg-white border border-slate-200 px-4 py-2.5 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white font-bold text-xs">
              ⭐
            </span>
            <span className="font-bold text-slate-800">
              Modo Fácil ativado (ideal para crianças e reservas rápidas)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBookingMode('complete')}
            className="font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-300"
          >
            Mudar para Modo Tradicional
          </button>
        </div>

        <KidsBookingView
          preselectedEquipmentId={preselectedEquipmentId}
          onBookingSuccess={onBookingSuccess}
          onSwitchToAdvanced={() => setBookingMode('complete')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Novo Agendamento
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              Modo Tradicional
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aulas matutinas a partir de 07:15 e vespertinas a partir das 13:00 (50 min cada, recreio de 15 min após a 3ª aula).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to Kids / Easy Mode */}
          <button
            type="button"
            onClick={() => setBookingMode('simple')}
            className="flex items-center gap-1.5 rounded-lg border-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
          >
            <span>⭐</span>
            <span>Ativar Modo Fácil</span>
          </button>

          {/* Selected equipments counter */}
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-200 text-xs font-semibold text-blue-800">
            <Check className="h-4 w-4 text-blue-600" />
            <span>
              {selectedEquipmentIds.length}{' '}
              {selectedEquipmentIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </span>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center animate-in fade-in zoom-in duration-150">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-1" />
          <h3 className="text-base font-bold text-emerald-900">Agendamento Realizado com Sucesso!</h3>
          <p className="text-xs text-emerald-700">
            {selectedEquipmentsList.map((e) => e.name).join(' + ')} reservado(s) para {formatBrazilianDate(date)} ({computedStart} às {computedEnd}).
          </p>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">Abrindo a agenda escolar...</p>
        </div>
      )}

      <form onSubmit={handleConfirmBooking} className="space-y-5">
        {/* SECTION 1: EQUIPAMENTOS (Multi-select) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  1
                </span>
                <span>Selecione os Equipamentos Multimídia (pode marcar mais de um)</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Clique nos cards para incluir ou remover equipamentos da mesma reserva (ex: Projetor + Som + Microfone).
              </p>
            </div>

            {/* Quick Filter tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'datashow', label: 'Datashows' },
                { id: 'tv', label: 'TVs' },
                { id: 'chromebook_cart', label: 'Chromebooks' },
                { id: 'sound', label: 'Som & Mic' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    categoryFilter === tab.id
                      ? 'bg-white text-blue-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredEquipments.map((eq) => {
              const isSelected = selectedEquipmentIds.includes(eq.id);
              const isMaintenance = eq.status === 'maintenance';

              return (
                <div
                  key={eq.id}
                  onClick={() => {
                    if (isMaintenance) return;
                    handleToggleEquipment(eq.id);
                  }}
                  className={`relative cursor-pointer rounded-xl border p-3 transition-all ${
                    isMaintenance
                      ? 'border-amber-200 bg-amber-50/40 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/25 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    {eq.imageUrl ? (
                      <img
                        src={eq.imageUrl}
                        alt={eq.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                        {eq.category === 'datashow' && <Projector className="h-7 w-7" />}
                        {eq.category === 'tv' && <Tv className="h-7 w-7" />}
                        {eq.category === 'chromebook_cart' && <Laptop className="h-7 w-7" />}
                        {(eq.category === 'sound' || eq.category === 'mic') && (
                          <Volume2 className="h-7 w-7" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {eq.name}
                        </p>
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {eq.patrimony}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 truncate">{eq.storageLocation}</span>
                        {isMaintenance ? (
                          <span className="text-amber-700 font-bold">Manutenção</span>
                        ) : isSelected ? (
                          <span className="text-blue-700 font-bold">Selecionado</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Disponível</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Equipments Pills */}
          {selectedEquipmentsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-500 text-[11px] font-medium">Itens no agendamento:</span>
              {selectedEquipmentsList.map((eq) => (
                <span
                  key={eq.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100/70 border border-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-900"
                >
                  <span>{eq.name}</span>
                  {selectedEquipmentIds.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEquipment(eq.id);
                      }}
                      className="text-blue-500 hover:text-blue-800 ml-1 text-sm font-bold"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: QUANDO (07:15 aulas de 50 min) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                2
              </span>
              <span>Data e Aula (Início às 07:15 · 50 min cada)</span>
            </h2>

            {/* Mode switch */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setTimeMode('periods')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  timeMode === 'periods'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Por Aula da Escola
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('custom')}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  timeMode === 'custom'
                    ? 'bg-white font-bold text-blue-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Horário Manual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Utilização
              </label>
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formatBrazilianDate(date)}
              </span>
            </div>

            <div className="sm:col-span-3 space-y-2">
              {timeMode === 'periods' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between mb-1.5 gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Turno Matutino (Manhã) · Início 07:15
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Recreio após a 3ª aula (09:45 - 10:00 · 15 min)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {periods
                        .filter((p) => p.shift === 'morning')
                        .map((p) => {
                          const isChecked = selectedPeriodIds.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handlePeriodToggle(p.id)}
                              className={`flex flex-col justify-center rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors ${
                                isChecked
                                  ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 shadow-xs ring-1 ring-blue-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{p.label.replace(' Matutino', '').split('(')[0].trim()}</span>
                              <span className="font-mono text-[10px] tabular-nums text-blue-700 font-semibold">
                                {p.startTime} - {p.endTime}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between mb-1.5 gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Turno Vespertino (Tarde) · 13:00 às 13:50
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Recreio após a 3ª aula (15:30 - 15:45 · 15 min)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {periods
                        .filter((p) => p.shift === 'afternoon')
                        .map((p) => {
                          const isChecked = selectedPeriodIds.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handlePeriodToggle(p.id)}
                              className={`flex flex-col justify-center rounded-lg border px-2 py-1.5 text-left text-xs transition-colors ${
                                isChecked
                                  ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900 shadow-xs ring-1 ring-indigo-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{p.label.replace(' Vespertino', '').split('(')[0].trim()}</span>
                              <span className="font-mono text-[10px] tabular-nums text-indigo-700 font-semibold">
                                {p.startTime} - {p.endTime}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Horário Inicial
                    </label>
                    <input
                      type="time"
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Horário Final
                    </label>
                    <input
                      type="time"
                      value={customEndTime}
                      onChange={(e) => setCustomEndTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium pt-1">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span>Duração Selecionada:</span>
                <span className="font-mono tabular-nums text-blue-700 font-bold">
                  {computedStart} até {computedEnd}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TURMA, MATÉRIA (ESCREVER OU SELECIONAR) E SALA */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
              3
            </span>
            <span>Turma, Matéria e Sala de Aula</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Turma */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Turma *</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <optgroup label="Turno Matutino (Manhã)">
                  {classes
                    .filter((c) => c.shift === 'morning')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Turma {c.name} ({c.grade})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Turno Vespertino (Tarde)">
                  {classes
                    .filter((c) => c.shift === 'afternoon')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Turma {c.name} ({c.grade})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Matéria: com opção de escrever! */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Matéria / Disciplina *</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSubjectMode('select')}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      subjectMode === 'select'
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubjectMode('custom')}
                    className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                      subjectMode === 'custom'
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <PenTool className="h-2.5 w-2.5" />
                    <span>Escrever</span>
                  </button>
                </div>
              </div>

              {subjectMode === 'select' ? (
                <div className="space-y-1">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setSubjectMode('custom');
                      } else {
                        setSelectedSubjectId(e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                    <option value="__custom__">+ Digitar outra matéria...</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Digite o nome da matéria..."
                    value={customSubjectText}
                    onChange={(e) => setCustomSubjectText(e.target.value)}
                    className="w-full rounded-lg border border-blue-400 bg-blue-50/20 px-3 py-2 text-xs font-semibold text-blue-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <p className="text-[10px] text-blue-600 font-medium">
                    ✓ Matéria livre: será adicionada automaticamente ao sistema.
                  </p>
                </div>
              )}
            </div>

            {/* Sala */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sala de Aula / Espaço *
              </label>
              <select
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {classrooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Finalidade rápida */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Finalidade / Conteúdo da Aula (Opcional)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ex: Exibição de slides e vídeo sobre Revolução Industrial"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-[10px] text-slate-400">Sugestões rápidas:</span>
              {[
                'Apresentação de Slides',
                'Exibição de Filme / Vídeo',
                'Pesquisa em Grupo no Chromebook',
                'Seminário dos Alunos',
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setPurpose(sug)}
                  className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Availability Feedback Box */}
        {hasChecked && checkResult && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              checkResult.available
                ? 'border-emerald-200 bg-emerald-50/70'
                : 'border-red-200 bg-red-50/70'
            }`}
          >
            <div className="flex items-start gap-3">
              {checkResult.available ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 w-full text-xs">
                <h4
                  className={`font-bold ${
                    checkResult.available ? 'text-emerald-900' : 'text-red-900'
                  }`}
                >
                  {checkResult.available
                    ? `Todos os ${selectedEquipmentsList.length} equipamentos selecionados estão 100% disponíveis!`
                    : 'Conflito de Horário Encontrado'}
                </h4>
                <p className={checkResult.available ? 'text-emerald-700' : 'text-red-700'}>
                  {checkResult.available
                    ? `Os recursos (${selectedEquipmentsList.map((e) => e.name).join(', ')}) estão livres no dia ${formatBrazilianDate(date)} das ${computedStart} às ${computedEnd}.`
                    : checkResult.conflictReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleCheckAvailability}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Clock className="h-4 w-4 text-slate-500" />
            <span>Verificar Disponibilidade</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-7 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Confirmar Agendamento</span>
          </button>
        </div>
      </form>
    </div>
  );
};
