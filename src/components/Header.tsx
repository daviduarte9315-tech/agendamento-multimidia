import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Check,
  ChevronDown,
  Calendar,
  Shield,
  User as UserIcon,
  LogOut,
  Sliders,
  Menu,
  X,
  UserPlus,
} from 'lucide-react';
import { formatBrazilianLongDate, getTodayDateString } from '../utils/dateUtils';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
  isSidebarOpenMobile: boolean;
  onOpenNewBooking: () => void;
  onNavigateToTeachers?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebarMobile,
  isSidebarOpenMobile,
  onOpenNewBooking,
  onNavigateToTeachers,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const todayStr = getTodayDateString();
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
      {/* Zone 1: Brand & School */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menu"
        >
          {isSidebarOpenMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              AM
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900 md:text-lg">
              Agenda Multimídia Escolar
            </span>
          </div>
          <span className="hidden text-xs text-slate-500 sm:inline">
            {settings.schoolName} · Ano Letivo {settings.academicYear}
          </span>
        </div>
      </div>

      {/* Zone 2: Date display & Quick stats */}
      <div className="hidden items-center gap-2 text-xs font-medium text-slate-600 lg:flex">
        <Calendar className="h-4 w-4 text-blue-600" />
        <span className="capitalize">{formatBrazilianLongDate(todayStr)}</span>
      </div>

      {/* Zone 3: Actions, Notifications & User Switcher */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick New Booking Button */}
        <button
          type="button"
          onClick={onOpenNewBooking}
          className="hidden rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all sm:flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Novo Agendamento</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white tabular-nums">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-semibold text-slate-900">
                  Notificações ({unreadNotifications.length} não lidas)
                </span>
                {unreadNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">Nenhuma notificação no momento.</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 border border-blue-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span>{n.title}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </div>
                      <p className="text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
              {currentUser.role === 'admin' ? (
                <Shield className="h-4 w-4" />
              ) : (
                currentUser.name.charAt(currentUser.name.indexOf(' ') + 1) || 'P'
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {currentUser.role === 'admin' ? 'Administrador' : currentUser.subject || 'Professor'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="font-mono text-slate-400">{currentUser.registrationNumber}</span>
                  <span>·</span>
                  <span>{currentUser.role === 'admin' ? 'Acesso Administrativo' : 'Acesso Docente'}</span>
                </div>
              </div>

              {/* Quick Profile Switcher for Testing & Demonstration */}
              <div className="py-2">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Alternar Usuário para Teste
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {u.role === 'admin' ? 'Coordenação/Admin' : u.subject}
                        </p>
                      </div>
                      {u.id === currentUser.id && <Check className="h-4 w-4 text-blue-600 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>

                {onNavigateToTeachers && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigateToTeachers();
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>+ Cadastrar Novo Professor</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
