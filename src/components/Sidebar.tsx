import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  BookmarkCheck,
  Tv2,
  CheckSquare,
  School,
  BarChart3,
  Settings,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
  UserPlus,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'new_booking'
  | 'schedule'
  | 'my_bookings'
  | 'equipments'
  | 'teachers'
  | 'approvals'
  | 'school_manage'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, bookings, resetToDemoData } = useApp();

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Painel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'new_booking' as NavTab,
      label: 'Novo Agendamento',
      icon: CalendarPlus,
      highlight: true,
      badge: 'Fácil ⭐',
      badgeColor: 'bg-amber-400 text-amber-950 font-black',
    },
    {
      id: 'schedule' as NavTab,
      label: 'Agenda Escolar',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'my_bookings' as NavTab,
      label: 'Minhas Reservas',
      icon: BookmarkCheck,
      badge: null,
    },
    {
      id: 'equipments' as NavTab,
      label: 'Equipamentos',
      icon: Tv2,
      badge: null,
    },
    {
      id: 'teachers' as NavTab,
      label: 'Professores',
      icon: UserPlus,
      badge: '+ Cadastrar',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
  ];

  const adminNavItems = [
    {
      id: 'approvals' as NavTab,
      label: 'Aprovações',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'school_manage' as NavTab,
      label: 'Estrutura Escolar',
      icon: School,
      badge: null,
    },
    {
      id: 'reports' as NavTab,
      label: 'Relatórios & Dados',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Configurações',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Menu Docente
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : item.highlight
                      ? 'text-blue-600 hover:bg-blue-50/50 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin / Coordinator Section */}
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Coordenação & TI
              </span>
              {currentUser.role === 'admin' ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                  Admin
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Restrito</span>
              )}
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isRestricted = currentUser.role !== 'admin' && item.id !== 'reports';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isRestricted) {
                      alert('Esta seção é restrita aos administradores e coordenadores da escola. Troque de perfil para Prof. Ricardo Santos no topo da página para explorar.');
                      return;
                    }
                    handleNavClick(item.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : isRestricted
                      ? 'text-slate-400 hover:bg-slate-50 opacity-75'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info & demo reset */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate">Versão 2.4 · Conectado</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja restaurar todos os dados para o padrão de demonstração da escola?')) {
                  resetToDemoData();
                  alert('Dados demonstrativos restaurados com sucesso!');
                }
              }}
              title="Redefinir dados demonstrativos"
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Redefinir</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
