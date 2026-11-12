import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Smile,
  Tv,
  Projector,
  Laptop,
  Volume2,
  Mic,
  Sun,
  Sunset,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { formatBrazilianDate, getTodayDateString } from '../utils/dateUtils';
import { Equipment } from '../types';

interface KidsBookingViewProps {
  onBookingSuccess: () => void;
  preselectedEquipmentId?: string;
  onSwitchToAdvanced?: () => void;
}

export const KidsBookingView: React.FC<KidsBookingViewProps> = ({
  onBookingSuccess,
  preselectedEquipmentId,
  onSwitchToAdvanced,
}) => {
  const {
    currentUser,
    equipments,
    classes,
    subjects,
    classrooms,
    periods,
    addBooking,
    checkEquipmentAvailability,
  } = useApp();

  const todayStr = getTodayDateString();

  // Wizard Step: 1 = Equipamento, 2 = Dia & Turno, 3 = Turma & Sala, 4 = Confirmar
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(() => {
    if (preselectedEquipmentId) return [preselectedEquipmentId];
    return equipments[0]?.id ? [equipments[0].id] : [];
  });

  // Date selection with friendly presets
  const [selectedDatePreset, setSelectedDatePreset] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [date, setDate] = useState<string>(todayStr);

  // Shift & Class Period (simple selector)
  const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon'>('morning');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('p-m1');

  // School Class
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const morningClass = classes.find((c) => c.shift === 'morning');
    return morningClass ? morningClass.id : classes[0]?.id || '';
  });

  // Subject: simple one-click or write
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('Língua Portuguesa');
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');
  const [isTypingSubject, setIsTypingSubject] = useState<boolean>(false);

  // Classroom
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(classrooms[0]?.id || '');

  // Feedback & Success
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper date calculations
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const handleDatePreset = (preset: 'today' | 'tomorrow' | 'other') => {
    setSelectedDatePreset(preset);
    if (preset === 'today') setDate(todayStr);
    else if (preset === 'tomorrow') setDate(getTomorrowStr());
  };

  // When shift changes, auto pick first period and suitable class
  const handleShiftChange = (shift: 'morning' | 'afternoon') => {
    setSelectedShift(shift);
    const firstPeriod = periods.find((p) => p.shift === shift);
    if (firstPeriod) setSelectedPeriodId(firstPeriod.id);

    const matchClass = classes.find((c) => c.shift === shift);
    if (matchClass) setSelectedClassId(matchClass.id);
  };

  const handleToggleEquipment = (id: string) => {
    if (selectedEquipmentIds.includes(id)) {
      if (selectedEquipmentIds.length > 1) {
        setSelectedEquipmentIds(selectedEquipmentIds.filter((item) => item !== id));
      }
    } else {
      setSelectedEquipmentIds([...selectedEquipmentIds, id]);
    }
  };

  // Get active period object
  const currentPeriod = periods.find((p) => p.id === selectedPeriodId) || periods[0];
  const startTime = currentPeriod?.startTime || '07:15';
  const endTime = currentPeriod?.endTime || '08:05';

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedRoom = classrooms.find((r) => r.id === selectedClassroomId);
  const selectedEquipsList = equipments.filter((e) => selectedEquipmentIds.includes(e.id));

  // Quick subject chips
  const popularSubjects = [
    { name: 'Língua Portuguesa', emoji: '📚', color: 'bg-blue-100 text-blue-900 border-blue-200' },
    { name: 'Matemática', emoji: '🔢', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { name: 'Ciências', emoji: '🔬', color: 'bg-green-100 text-green-900 border-green-200' },
    { name: 'História', emoji: '🏛️', color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { name: 'Artes', emoji: '🎨', color: 'bg-purple-100 text-purple-900 border-purple-200' },
    { name: 'Educação Física', emoji: '⚽', color: 'bg-orange-100 text-orange-900 border-orange-200' },
  ];

  // Helper for equipment icon
  const getEquipmentIcon = (category: string) => {
    switch (category) {
      case 'datashow':
        return <Projector className="h-8 w-8 text-blue-600" />;
      case 'tv':
        return <Tv className="h-8 w-8 text-indigo-600" />;
      case 'chromebook_cart':
      case 'chromebook_single':
        return <Laptop className="h-8 w-8 text-cyan-600" />;
      case 'sound':
        return <Volume2 className="h-8 w-8 text-emerald-600" />;
      case 'mic':
        return <Mic className="h-8 w-8 text-purple-600" />;
      default:
        return <Sparkles className="h-8 w-8 text-amber-600" />;
    }
  };

  // Friendly short names for kids
  const getFriendlyName = (eq: Equipment) => {
    if (eq.category === 'datashow') return 'Projetor / Datashow';
    if (eq.category === 'tv') return 'Televisão Smart TV';
    if (eq.category === 'chromebook_cart') return 'Carrinho de Computadores';
    if (eq.category === 'sound') return 'Caixa de Som';
    if (eq.category === 'mic') return 'Microfone Sem Fio';
    if (eq.category === 'multimedia_kit') return 'Maleta Kit Multimídia';
    return eq.name;
  };

  const handleFinalConfirm = () => {
    setErrorMessage(null);

    if (selectedEquipmentIds.length === 0) {
      setErrorMessage('Por favor, escolha pelo menos um equipamento!');
      setStep(1);
      return;
    }

    // Check availability
    const check = checkEquipmentAvailability(selectedEquipmentIds, date, startTime, endTime);
    if (!check.available) {
      setErrorMessage(
        check.conflictReason ||
          'Ops! Esse equipamento já está ocupado nesse horário. Escolha outro horário ou equipamento!'
      );
      return;
    }

    const finalSubjectName = isTypingSubject && customSubjectInput.trim()
      ? customSubjectInput.trim()
      : selectedSubjectName;

    const res = addBooking({
      equipmentId: selectedEquipmentIds[0],
      equipmentIds: selectedEquipmentIds,
      userId: currentUser.id,
      date,
      periodType: 'period',
      periodIds: [selectedPeriodId],
      startTime,
      endTime,
      classId: selectedClassId,
      subjectId: 'sub-kids',
      customSubjectName: finalSubjectName,
      classroomId: selectedClassroomId,
      purpose: `Aula divertida com recursos multimídia (${finalSubjectName})`,
      quantityReserved: 1,
    });

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onBookingSuccess();
      }, 1600);
    } else {
      setErrorMessage(res.error || 'Não foi possível salvar o agendamento.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner with Kids Mode Indicator */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-md text-2xl font-black">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-950">
                  Agendamento Fácil
                </h1>
                <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-900 border border-amber-300">
                  Modo Super Simples
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/80 font-medium mt-0.5">
                Reserve em 3 cliques rápidos com botões grandes e imagens claras!
              </p>
            </div>
          </div>

          {onSwitchToAdvanced && (
            <button
              type="button"
              onClick={onSwitchToAdvanced}
              className="rounded-xl border border-amber-300 bg-white/90 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-white shadow-xs transition-all self-start sm:self-auto"
            >
              Ir para Modo Completo
            </button>
          )}
        </div>

        {/* Step Progress Bar (Big & Friendly) */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-amber-200/60">
          {[
            { num: 1, title: 'O que você quer?' },
            { num: 2, title: 'Quando?' },
            { num: 3, title: 'Qual turma?' },
            { num: 4, title: 'Confirmar!' },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all text-center ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-500/40'
                    : isDone
                    ? 'bg-amber-200/70 text-amber-900 font-bold'
                    : 'bg-white/60 text-amber-800/60 font-medium'
                }`}
              >
                <span className="text-xs sm:text-sm">
                  {isDone ? '✓' : `Passo ${s.num}`}
                </span>
                <span className="text-[10px] sm:text-xs line-clamp-1 hidden sm:inline">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Celebration Overlay */}
      {isSuccess && (
        <div className="rounded-3xl border-2 border-emerald-400 bg-emerald-50 p-8 text-center shadow-lg animate-in fade-in zoom-in duration-200 space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white text-4xl shadow-md animate-bounce">
            🎉
          </div>
          <h2 className="text-2xl font-black text-emerald-900">
            Prontinho! Agendado com Sucesso!
          </h2>
          <p className="text-base text-emerald-800 font-bold">
            {selectedEquipsList.map((e) => e.name).join(' + ')}
          </p>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-emerald-800 border border-emerald-200 shadow-xs">
            <span>📅 {formatBrazilianDate(date)}</span>
            <span>·</span>
            <span>⏰ {startTime} às {endTime}</span>
            <span>·</span>
            <span>🏫 Turma {selectedClass?.name}</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold pt-2">
            Abrindo a agenda da escola...
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-xs sm:text-sm text-red-800 font-bold flex items-center gap-3 shadow-xs">
          <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: O QUE VOCÊ QUER USAR? */}
      {step === 1 && !isSuccess && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>1. Escolha os Equipamentos</span>
                <span className="text-xl">📺</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toque nos cartões para escolher o que você vai precisar. Pode tocar em mais de um!
              </p>
            </div>
            <span className="rounded-xl bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
              {selectedEquipmentIds.length} selecionado{selectedEquipmentIds.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Big, Touchable Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {equipments.map((eq) => {
              const isSelected = selectedEquipmentIds.includes(eq.id);
              const isMaintenance = eq.status === 'maintenance';

              return (
                <button
                  key={eq.id}
                  type="button"
                  disabled={isMaintenance}
                  onClick={() => handleToggleEquipment(eq.id)}
                  className={`relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                    isMaintenance
                      ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-md ring-4 ring-blue-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Big picture or friendly icon */}
                    {eq.imageUrl ? (
                      <img
                        src={eq.imageUrl}
                        alt={eq.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 shrink-0">
                        {getEquipmentIcon(eq.category)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-2">
                          {getFriendlyName(eq)}
                        </span>
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {eq.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">📍 {eq.storageLocation}</span>
                    {isMaintenance ? (
                      <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Em Manutenção
                      </span>
                    ) : isSelected ? (
                      <span className="font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                        ✓ Escolhido!
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Disponível
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={selectedEquipmentIds.length === 0}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>Avançar para o Dia e Hora</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUANDO VAI USAR? */}
      {step === 2 && !isSuccess && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>2. Qual é o Dia e a Aula?</span>
                <span className="text-xl">⏰</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha o dia e o horário da aula (todas as aulas têm 50 minutos!).
              </p>
            </div>
          </div>

          {/* A. Friendly Day Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Escolha o Dia:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDatePreset('today')}
                className={`rounded-2xl border-2 p-3.5 text-center transition-all ${
                  selectedDatePreset === 'today'
                    ? 'border-blue-600 bg-blue-50/80 font-black text-blue-900 shadow-sm ring-2 ring-blue-500/30'
                    : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-lg">☀️</span>
                <span className="text-xs sm:text-sm block font-extrabold">Hoje</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatBrazilianDate(todayStr)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDatePreset('tomorrow')}
                className={`rounded-2xl border-2 p-3.5 text-center transition-all ${
                  selectedDatePreset === 'tomorrow'
                    ? 'border-blue-600 bg-blue-50/80 font-black text-blue-900 shadow-sm ring-2 ring-blue-500/30'
                    : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-lg">📅</span>
                <span className="text-xs sm:text-sm block font-extrabold">Amanhã</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatBrazilianDate(getTomorrowStr())}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDatePreset('other')}
                className={`rounded-2xl border-2 p-3.5 text-center transition-all ${
                  selectedDatePreset === 'other'
                    ? 'border-blue-600 bg-blue-50/80 font-black text-blue-900 shadow-sm ring-2 ring-blue-500/30'
                    : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-lg">🗓️</span>
                <span className="text-xs sm:text-sm block font-extrabold">Outro Dia</span>
                <span className="text-[10px] text-slate-500 font-mono">Escolher data</span>
              </button>
            </div>

            {selectedDatePreset === 'other' && (
              <div className="pt-2">
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl border-2 border-blue-400 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xs focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* B. Turno Switch (Morning or Afternoon) */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2. Escolha o Turno da Aula:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleShiftChange('morning')}
                className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                  selectedShift === 'morning'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-black shadow-sm ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                }`}
              >
                <Sun className="h-6 w-6 text-amber-500" />
                <div className="text-left">
                  <span className="block text-sm font-extrabold">Turno Manhã</span>
                  <span className="text-[11px] text-slate-500 font-normal">07:15 até 11:40</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShiftChange('afternoon')}
                className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                  selectedShift === 'afternoon'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-black shadow-sm ring-2 ring-indigo-400/30'
                    : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                }`}
              >
                <Sunset className="h-6 w-6 text-indigo-500" />
                <div className="text-left">
                  <span className="block text-sm font-extrabold">Turno Tarde</span>
                  <span className="text-[11px] text-slate-500 font-normal">13:00 até 17:25</span>
                </div>
              </button>
            </div>
          </div>

          {/* C. Big Period Buttons with 15min break noted */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                3. Toque na Aula Desejada:
              </label>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Recreio de 15 min após a 3ª aula ☕
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {periods
                .filter((p) => p.shift === selectedShift)
                .map((p, idx) => {
                  const isSelected = selectedPeriodId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPeriodId(p.id)}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all text-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-black shadow-md ring-2 ring-blue-500/40 scale-[1.03]'
                          : 'border-slate-200 bg-white text-slate-800 font-bold hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-black">
                        {idx + 1}ª Aula
                      </span>
                      <span className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-blue-100' : 'text-blue-700 font-bold'}`}>
                        {p.startTime} - {p.endTime}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        50 minutos
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              <span>Avançar para a Turma</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: QUAL TURMA E MATÉRIA? */}
      {step === 3 && !isSuccess && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>3. Turma, Matéria e Sala</span>
                <span className="text-xl">🏫</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha a turma que vai assistir à aula e a matéria!
              </p>
            </div>
          </div>

          {/* A. Turmas (Filtered to the selected shift or all) */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Toque na Turma:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {classes
                .filter((c) => c.shift === selectedShift)
                .map((c) => {
                  const isSelected = selectedClassId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedClassId(c.id)}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-black shadow-md ring-2 ring-blue-500/30 scale-[1.02]'
                          : 'border-slate-200 bg-white text-slate-800 font-bold hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base font-black">Turma {c.name}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {c.grade}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* B. Matéria com botões rápidos ou digitação */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2. Escolha a Matéria / Disciplina:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularSubjects.map((sub) => {
                const isSelected = !isTypingSubject && selectedSubjectName === sub.name;
                return (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectName(sub.name);
                      setIsTypingSubject(false);
                    }}
                    className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-black shadow-xs ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{sub.emoji}</span>
                    <span className="text-xs font-extrabold">{sub.name}</span>
                  </button>
                );
              })}

              {/* Option to type custom subject */}
              <button
                type="button"
                onClick={() => setIsTypingSubject(true)}
                className={`flex items-center gap-2 rounded-2xl border-2 p-3 text-left transition-all ${
                  isTypingSubject
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-black ring-2 ring-purple-500/30'
                    : 'border-dashed border-slate-300 bg-slate-50 text-slate-700 font-bold hover:bg-white'
                }`}
              >
                <span className="text-xl">✍️</span>
                <span className="text-xs font-extrabold">Escrever Outra</span>
              </button>
            </div>

            {isTypingSubject && (
              <div className="pt-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  autoFocus
                  placeholder="Digite aqui o nome da matéria..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  className="w-full rounded-2xl border-2 border-purple-500 bg-purple-50/20 px-4 py-3 text-sm font-bold text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            )}
          </div>

          {/* C. Sala de Aula */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              3. Onde vai ser a aula? (Sala):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classrooms.map((room) => {
                const isSelected = selectedClassroomId === room.id;
                const emoji =
                  room.name.toLowerCase().includes('biblioteca')
                    ? '📚'
                    : room.name.toLowerCase().includes('laborat')
                    ? '🔬'
                    : room.name.toLowerCase().includes('pátio') || room.name.toLowerCase().includes('patio')
                    ? '🌳'
                    : '🏫';
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedClassroomId(room.id)}
                    className={`rounded-2xl border-2 p-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-black shadow-xs ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{emoji} {room.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{room.floor}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              <span>Ver Resumo e Confirmar</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVISÃO E CONFIRMAÇÃO COM 1 CLIQUE */}
      {step === 4 && !isSuccess && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <span>4. Tudo Certo! Confira seu Agendamento:</span>
                <span className="text-xl">✨</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Veja o resumo abaixo e clique no botão grande verde para agendar.
              </p>
            </div>
          </div>

          {/* Summary Big Card */}
          <div className="rounded-3xl border-2 border-blue-200 bg-blue-50/50 p-6 space-y-4">
            {/* Equipments */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 block mb-2">
                Equipamentos que você vai usar:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedEquipsList.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 border border-blue-200 shadow-xs"
                  >
                    <span className="text-lg">📺</span>
                    <span className="text-xs font-black text-slate-900">{eq.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* When and Where Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl bg-white p-3.5 border border-blue-100 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Data da Aula</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  📅 {formatBrazilianDate(date)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-blue-100 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Horário da Aula</span>
                <p className="text-sm font-black text-blue-700 mt-0.5 font-mono">
                  ⏰ {startTime} até {endTime}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">50 minutos</span>
              </div>

              <div className="rounded-2xl bg-white p-3.5 border border-blue-100 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Turma & Sala</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  🏫 Turma {selectedClass?.name}
                </p>
                <span className="text-[10px] text-slate-500">📍 {selectedRoom?.name}</span>
              </div>
            </div>

            {/* Subject */}
            <div className="rounded-2xl bg-white p-3.5 border border-blue-100 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Matéria / Conteúdo</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                📖 {isTypingSubject && customSubjectInput ? customSubjectInput : selectedSubjectName}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Mudar alguma coisa</span>
            </button>

            <button
              type="button"
              onClick={handleFinalConfirm}
              className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-10 py-4 text-base font-black text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all animate-pulse hover:animate-none"
            >
              <CheckCircle2 className="h-6 w-6" />
              <span>Confirmar Meu Agendamento Agora!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
