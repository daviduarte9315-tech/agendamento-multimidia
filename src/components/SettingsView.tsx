import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useApp();

  const [form, setForm] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Configurações e Regras da Escola
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Parâmetros gerais de agendamento e políticas de uso dos recursos tecnológicos.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Identificação Institucional</h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nome da Unidade Escolar *
            </label>
            <input
              type="text"
              required
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ano Letivo</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">E-mail do Suporte TI</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Políticas de Agendamento</h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requireAdminApproval}
                onChange={(e) => setForm({ ...form, requireAdminApproval: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Exigir aprovação prévia da Coordenação
                </span>
                <span className="text-[11px] text-slate-500">
                  Se ativado, novas reservas de professores entram como "Pendentes" e exigem liberação
                  na aba de Aprovações.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowConsecutivePeriods}
                onChange={(e) => setForm({ ...form, allowConsecutivePeriods: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-semibold text-slate-900 block">
                  Permitir agendamento de aulas geminadas (consecutivas)
                </span>
                <span className="text-[11px] text-slate-500">
                  Permite aos professores selecionar dois ou mais períodos contínuos para a mesma aula.
                </span>
              </div>
            </label>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Antecedência máxima para reservas (dias)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={form.maxDaysInAdvance}
                onChange={(e) =>
                  setForm({ ...form, maxDaysInAdvance: parseInt(e.target.value) || 30 })
                }
                className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Tem certeza de que deseja restaurar os dados para o padrão demonstrativo da SEDUC? Todas as alterações manuais serão resetadas.')) {
                resetToDemoData();
                setForm(settings);
                alert('Dados redefinidos com sucesso!');
              }
            }}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Redefinir Dados Fictícios</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
