import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  GraduationCap,
  BookOpen,
  MapPin,
  Clock,
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
} from 'lucide-react';
import { Classroom, SchoolClass, SchoolPeriod, SchoolSubject, User } from '../types';

type ManageTab = 'classes' | 'subjects' | 'rooms' | 'periods' | 'users';

interface AdminSchoolManageViewProps {
  initialTab?: ManageTab;
  autoOpenAddUser?: boolean;
}

export const AdminSchoolManageView: React.FC<AdminSchoolManageViewProps> = ({
  initialTab = 'classes',
  autoOpenAddUser = false,
}) => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    classrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    periods,
    addPeriod,
    updatePeriod,
    deletePeriod,
    users,
    addUser,
    updateUser,
    deleteUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ManageTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
    if (autoOpenAddUser) {
      setIsUserModalOpen(true);
    }
  }, [initialTab, autoOpenAddUser]);

  // Modals for CRUD
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState<Omit<SchoolClass, 'id'>>({
    name: '',
    grade: '6º EF',
    shift: 'morning',
    roomDefault: 'Sala 101',
    studentCount: 30,
  });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState<Omit<SchoolSubject, 'id'>>({
    name: '',
    color: '#1d4ed8',
  });

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState<Omit<Classroom, 'id'>>({
    name: '',
    floor: 'Térreo',
    capacity: 35,
    hasSockets: true,
    hasProjectorScreen: true,
  });

  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [periodForm, setPeriodForm] = useState<Omit<SchoolPeriod, 'id'>>({
    shift: 'morning',
    order: 6,
    label: '',
    startTime: '13:00',
    endTime: '13:50',
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(autoOpenAddUser);
  const [userForm, setUserForm] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'teacher',
    subject: 'Ciências',
    registrationNumber: 'MAT-7700',
    phone: '',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Estrutura Escolar e Cadastros
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gerenciamento pedagógico de turmas, disciplinas, salas, horários de aula e quadro docente.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'classes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Turmas ({classes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'subjects'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Disciplinas ({subjects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'rooms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Salas de Aula ({classrooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('periods')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'periods'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Horários de Aula ({periods.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Professores & Usuários ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: TURMAS */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Turmas Cadastradas</h3>
            <button
              type="button"
              onClick={() => setIsClassModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Turma</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Turma {c.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {c.shift === 'morning' ? 'Matutino' : 'Vespertino'}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                    <p>Série: {c.grade}</p>
                    <p>Alunos matriculados: <span className="tabular-nums font-mono">{c.studentCount || 30}</span></p>
                    <p>Sala Padrão: {c.roomDefault || 'Não definida'}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir a turma ${c.name}?`)) deleteClass(c.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DISCIPLINAS */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Disciplinas Escolares</h3>
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Disciplina</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs font-bold text-slate-900 truncate">{s.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Excluir a disciplina ${s.name}?`)) deleteSubject(s.id);
                  }}
                  className="text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SALAS DE AULA */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Salas de Aula e Espaços</h3>
            <button
              type="button"
              onClick={() => setIsRoomModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Sala</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {classrooms.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{r.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{r.floor}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                    <p>Capacidade: <span className="font-mono tabular-nums">{r.capacity}</span> alunos</p>
                    <p className="flex items-center gap-1">
                      <span>Tomadas elétricas:</span>
                      <span className="font-semibold text-emerald-700">{r.hasSockets ? 'Sim' : 'Não'}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <span>Tela de projeção:</span>
                      <span className="font-semibold text-blue-700">{r.hasProjectorScreen ? 'Instalada' : 'Não'}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir o espaço ${r.name}?`)) deleteClassroom(r.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HORÁRIOS DE AULA */}
      {activeTab === 'periods' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Períodos e Horários Letivos</h3>
            <button
              type="button"
              onClick={() => setIsPeriodModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Horário</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Turno</th>
                  <th className="p-3">Descrição da Aula</th>
                  <th className="p-3">Início</th>
                  <th className="p-3">Término</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-700">
                      {p.shift === 'morning' ? 'Matutino' : 'Vespertino'}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{p.label}</td>
                    <td className="p-3 font-mono text-blue-700 tabular-nums">{p.startTime}</td>
                    <td className="p-3 font-mono text-blue-700 tabular-nums">{p.endTime}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remover horário ${p.label}?`)) deletePeriod(p.id);
                        }}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USUÁRIOS & PROFESSORES */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Quadro de Professores e Gestores</h3>
            <button
              type="button"
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Professor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{u.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        u.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrador' : 'Professor'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                  <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                    <p>Disciplina: <span className="font-semibold text-slate-800">{u.subject || 'Geral'}</span></p>
                    <p>Matrícula SEDUC: <span className="font-mono text-slate-500">{u.registrationNumber}</span></p>
                    <p>Telefone: {u.phone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remover acesso de ${u.name}?`)) deleteUser(u.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD CLASS */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cadastrar Nova Turma</h3>
              <button onClick={() => setIsClassModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addClass(classForm);
                setIsClassModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Nome da Turma *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 62.01, 13.01"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Série / Etapa</label>
                  <input
                    type="text"
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Turno</label>
                  <select
                    value={classForm.shift}
                    onChange={(e) =>
                      setClassForm({ ...classForm, shift: e.target.value as 'morning' | 'afternoon' })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="morning">Matutino</option>
                    <option value="afternoon">Vespertino</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cadastrar Nova Disciplina</h3>
              <button onClick={() => setIsSubjectModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSubject(subjectForm);
                setIsSubjectModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Nome da Disciplina *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Robótica Educacional"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Cor Identificadora</label>
                <input
                  type="color"
                  value={subjectForm.color}
                  onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                  className="h-8 w-16 cursor-pointer rounded border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROOM */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cadastrar Sala ou Espaço</h3>
              <button onClick={() => setIsRoomModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addClassroom(roomForm);
                setIsRoomModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Nome do Espaço *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Laboratório Maker"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Andar / Pavimento</label>
                  <input
                    type="text"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Capacidade (Alunos)</label>
                  <input
                    type="number"
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 30 })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomForm.hasSockets}
                    onChange={(e) => setRoomForm({ ...roomForm, hasSockets: e.target.checked })}
                  />
                  <span>Tomadas elétricas</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roomForm.hasProjectorScreen}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, hasProjectorScreen: e.target.checked })
                    }
                  />
                  <span>Tela para projeção</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PERIOD */}
      {isPeriodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Novo Período de Aula</h3>
              <button onClick={() => setIsPeriodModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPeriod({
                  ...periodForm,
                  label: periodForm.label || `${periodForm.startTime} às ${periodForm.endTime}`,
                });
                setIsPeriodModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Rótulo / Descrição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 6ª Aula Matutino (12:00 - 12:50)"
                  value={periodForm.label}
                  onChange={(e) => setPeriodForm({ ...periodForm, label: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Horário Inicial</label>
                  <input
                    type="time"
                    value={periodForm.startTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Horário Término</label>
                  <input
                    type="time"
                    value={periodForm.endTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, endTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPeriodModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Cadastrar Professor / Usuário</h3>
              <button onClick={() => setIsUserModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addUser(userForm);
                setIsUserModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Profª. Ana Beatriz"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">E-mail Institucional *</label>
                  <input
                    type="email"
                    required
                    placeholder="prof.ana@escola.gov.br"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Perfil de Acesso</label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({ ...userForm, role: e.target.value as 'teacher' | 'admin' })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <option value="teacher">Professor</option>
                    <option value="admin">Administrador / Coordenação</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Disciplina Principal</label>
                  <input
                    type="text"
                    placeholder="Ex: Química"
                    value={userForm.subject}
                    onChange={(e) => setUserForm({ ...userForm, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Matrícula SEDUC</label>
                  <input
                    type="text"
                    placeholder="MAT-9901"
                    value={userForm.registrationNumber}
                    onChange={(e) => setUserForm({ ...userForm, registrationNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
