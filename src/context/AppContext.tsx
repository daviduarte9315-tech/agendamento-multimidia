import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Booking,
  Classroom,
  Equipment,
  NotificationItem,
  SchoolClass,
  SchoolPeriod,
  SchoolSettings,
  SchoolSubject,
  User,
} from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_CLASSES,
  INITIAL_CLASSROOMS,
  INITIAL_EQUIPMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PERIODS,
  INITIAL_SETTINGS,
  INITIAL_SUBJECTS,
  INITIAL_USERS,
} from '../data/mockData';
import { isTimeRangeOverlapping } from '../utils/dateUtils';

interface AvailabilityResult {
  available: boolean;
  conflictBooking?: Booking;
  conflictTeacher?: User;
  conflictReason?: string;
  similarEquipments?: Equipment[];
  alternativeSlots?: { startTime: string; endTime: string; label: string }[];
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  equipments: Equipment[];
  classes: SchoolClass[];
  subjects: SchoolSubject[];
  classrooms: Classroom[];
  periods: SchoolPeriod[];
  bookings: Booking[];
  notifications: NotificationItem[];
  settings: SchoolSettings;
  
  // Bookings
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    success: boolean;
    error?: string;
    booking?: Booking;
  };
  updateBooking: (id: string, updates: Partial<Booking>) => { success: boolean; error?: string };
  cancelBooking: (id: string, reason?: string) => void;
  approveBooking: (id: string) => void;
  rejectBooking: (id: string, reason: string) => void;
  checkEquipmentAvailability: (
    equipmentIdOrIds: string | string[],
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ) => AvailabilityResult;

  // Equipments
  addEquipment: (data: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  toggleEquipmentMaintenance: (
    id: string,
    inMaintenance: boolean,
    reason?: string,
    expectedReturn?: string
  ) => void;

  // School Entities
  addClass: (data: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;

  addClassroom: (data: Omit<Classroom, 'id'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;

  addSubject: (data: Omit<SchoolSubject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<SchoolSubject>) => void;
  deleteSubject: (id: string) => void;

  addPeriod: (data: Omit<SchoolPeriod, 'id'>) => void;
  updatePeriod: (id: string, updates: Partial<SchoolPeriod>) => void;
  deletePeriod: (id: string) => void;

  addUser: (data: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;

  // Settings & Reset
  updateSettings: (settings: Partial<SchoolSettings>) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'agenda_multimidia_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Erro ao carregar dados do localStorage', e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Erro ao salvar dados no localStorage', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    const found = users.find((u) => u.id === savedId);
    return found || users[1]; // Começa com a Profª Mariana Silva por padrão
  });

  const [equipments, setEquipments] = useState<Equipment[]>(() =>
    loadFromStorage('equipments', INITIAL_EQUIPMENTS)
  );
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const loaded = loadFromStorage('classes', INITIAL_CLASSES);
    // Verifica se os novos códigos das turmas (ex: 62.01, 13.01) estão presentes
    const hasNewClassCodes = loaded && loaded.some((c: SchoolClass) => c.name === '62.01' || c.name === '13.01');
    if (!hasNewClassCodes) {
      return INITIAL_CLASSES;
    }
    return loaded;
  });
  const [subjects, setSubjects] = useState<SchoolSubject[]>(() =>
    loadFromStorage('subjects', INITIAL_SUBJECTS)
  );
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const loaded = loadFromStorage('classrooms', INITIAL_CLASSROOMS);
    // Verifica se as novas salas (Sala 1..6, Biblioteca, Laboratório, Pátio) estão presentes
    const hasNewRooms =
      loaded &&
      loaded.some((r: Classroom) => r.name === 'Sala 1' || r.name === 'Biblioteca' || r.name === 'Pátio');
    if (!hasNewRooms) {
      return INITIAL_CLASSROOMS;
    }
    return loaded;
  });
  const [periods, setPeriods] = useState<SchoolPeriod[]>(() => {
    const loaded = loadFromStorage('periods', INITIAL_PERIODS);
    // Garante que os horários reflitam:
    // - Matutino: início às 07:15, recreio de 15 min após 3ª aula (p-m3 termina às 09:45, p-m4 começa às 10:00), sem 6ª aula
    // - Vespertino: início às 13:00 (50 min), recreio de 15 min após 3ª aula (p-v3 termina às 15:30, p-v4 começa às 15:45)
    const isUpToDate =
      loaded &&
      loaded.length === 10 &&
      loaded.find((p) => p.id === 'p-m1')?.startTime === '07:15' &&
      loaded.find((p) => p.id === 'p-m3')?.endTime === '09:45' &&
      loaded.find((p) => p.id === 'p-m4')?.startTime === '10:00' &&
      loaded.find((p) => p.id === 'p-v1')?.startTime === '13:00' &&
      loaded.find((p) => p.id === 'p-v3')?.endTime === '15:30' &&
      loaded.find((p) => p.id === 'p-v4')?.startTime === '15:45' &&
      !loaded.some((p) => p.id === 'p-m6');

    if (!isUpToDate) {
      return INITIAL_PERIODS;
    }
    return loaded;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const loaded = loadFromStorage('bookings', INITIAL_BOOKINGS);
    const hasObsolete = loaded.some(
      (b: Booking) =>
        b.classId === 'class-6a' ||
        b.classId === 'class-8a' ||
        b.periodIds?.includes('p-m6') ||
        (b.periodIds?.includes('p-m4') && b.startTime === '10:05')
    );
    if (hasObsolete) {
      return INITIAL_BOOKINGS;
    }
    return loaded.map((b) => ({
      ...b,
      equipmentIds: b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId],
    }));
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );
  const [settings, setSettings] = useState<SchoolSettings>(() =>
    loadFromStorage('settings', INITIAL_SETTINGS)
  );

  // Sync to storage
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUser.id);
    }
  }, [currentUser]);
  useEffect(() => saveToStorage('equipments', equipments), [equipments]);
  useEffect(() => saveToStorage('classes', classes), [classes]);
  useEffect(() => saveToStorage('subjects', subjects), [subjects]);
  useEffect(() => saveToStorage('classrooms', classrooms), [classrooms]);
  useEffect(() => saveToStorage('periods', periods), [periods]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('settings', settings), [settings]);

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const checkEquipmentAvailability = (
    equipmentIdOrIds: string | string[],
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): AvailabilityResult => {
    const idsToCheck = Array.isArray(equipmentIdOrIds)
      ? equipmentIdOrIds
      : [equipmentIdOrIds];

    if (idsToCheck.length === 0) {
      return { available: false, conflictReason: 'Nenhum equipamento selecionado.' };
    }

    for (const eqId of idsToCheck) {
      const targetEquip = equipments.find((e) => e.id === eqId);
      if (!targetEquip) {
        return { available: false, conflictReason: 'Equipamento não localizado no sistema.' };
      }

      if (targetEquip.status === 'maintenance') {
        return {
          available: false,
          conflictReason: `O equipamento "${targetEquip.name}" está bloqueado em manutenção: ${targetEquip.maintenanceReason || 'Reparo técnico'}.`,
          similarEquipments: equipments.filter(
            (e) => e.category === targetEquip.category && !idsToCheck.includes(e.id) && e.status === 'available'
          ),
        };
      }

      if (targetEquip.status === 'inactive') {
        return {
          available: false,
          conflictReason: `O equipamento "${targetEquip.name}" está inativo no momento.`,
          similarEquipments: equipments.filter(
            (e) => e.category === targetEquip.category && !idsToCheck.includes(e.id) && e.status === 'available'
          ),
        };
      }

      // Procura reservas ativas no mesmo equipamento e data com colisão de horário
      const activeBookings = bookings.filter(
        (b) =>
          (b.equipmentIds ? b.equipmentIds.includes(eqId) : b.equipmentId === eqId) &&
          b.date === date &&
          (b.status === 'confirmed' || b.status === 'pending') &&
          b.id !== excludeBookingId
      );

      const collidingBooking = activeBookings.find((b) =>
        isTimeRangeOverlapping(startTime, endTime, b.startTime, b.endTime)
      );

      if (collidingBooking) {
        const conflictTeacher = users.find((u) => u.id === collidingBooking.userId);

        const similarEquipments = equipments.filter((e) => {
          if (idsToCheck.includes(e.id) || e.category !== targetEquip.category || e.status !== 'available') {
            return false;
          }
          const eBookings = bookings.filter(
            (b) =>
              (b.equipmentIds ? b.equipmentIds.includes(e.id) : b.equipmentId === e.id) &&
              b.date === date &&
              (b.status === 'confirmed' || b.status === 'pending') &&
              b.id !== excludeBookingId
          );
          return !eBookings.some((b) =>
            isTimeRangeOverlapping(startTime, endTime, b.startTime, b.endTime)
          );
        });

        const commonPeriods = periods.filter((p) => {
          const hasBookingInPeriod = activeBookings.some((b) =>
            isTimeRangeOverlapping(p.startTime, p.endTime, b.startTime, b.endTime)
          );
          return !hasBookingInPeriod;
        });

        const alternativeSlots = commonPeriods.slice(0, 3).map((p) => ({
          startTime: p.startTime,
          endTime: p.endTime,
          label: p.label,
        }));

        return {
          available: false,
          conflictBooking: collidingBooking,
          conflictTeacher,
          conflictReason: `O equipamento "${targetEquip.name}" já está reservado das ${collidingBooking.startTime} às ${collidingBooking.endTime} pelo(a) ${conflictTeacher?.name || 'outro professor'}.`,
          similarEquipments,
          alternativeSlots,
        };
      }
    }

    return { available: true };
  };

  const addBooking = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    // Normalizar lista de equipamentos
    const equipIds =
      bookingData.equipmentIds && bookingData.equipmentIds.length > 0
        ? bookingData.equipmentIds
        : [bookingData.equipmentId];

    // Validação estrita de disponibilidade de todos os equipamentos selecionados
    const availability = checkEquipmentAvailability(
      equipIds,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime
    );

    if (!availability.available) {
      return {
        success: false,
        error: availability.conflictReason || 'Equipamento(s) indisponíveis para este período.',
      };
    }

    // Processamento de matéria escrita livremente (se informada)
    let finalSubjectId = bookingData.subjectId;
    if (bookingData.customSubjectName && bookingData.customSubjectName.trim()) {
      const customName = bookingData.customSubjectName.trim();
      const existing = subjects.find(
        (s) => s.name.toLowerCase() === customName.toLowerCase()
      );
      if (existing) {
        finalSubjectId = existing.id;
      } else {
        const newSubject: SchoolSubject = {
          id: `sub-custom-${Date.now()}`,
          name: customName,
          color: '#2563eb',
        };
        setSubjects((prev) => [...prev, newSubject]);
        finalSubjectId = newSubject.id;
      }
    }

    const initialStatus = settings.requireAdminApproval ? 'pending' : 'confirmed';

    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      equipmentId: equipIds[0],
      equipmentIds: equipIds,
      subjectId: finalSubjectId,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    const equipNames = equipIds
      .map((id) => equipments.find((e) => e.id === id)?.name || 'Equipamento')
      .join(', ');
    const teacher = users.find((u) => u.id === bookingData.userId);

    // Adiciona notificação para o usuário
    addNotification({
      userId: bookingData.userId,
      title: initialStatus === 'confirmed' ? 'Reserva confirmada!' : 'Reserva enviada para análise',
      message: `${equipNames} agendado(s) para ${bookingData.date} (${bookingData.startTime} - ${bookingData.endTime}).`,
      type: initialStatus === 'confirmed' ? 'success' : 'info',
      bookingId: newBooking.id,
    });

    // Se requer aprovação, notifica os administradores
    if (initialStatus === 'pending') {
      addNotification({
        userId: 'all',
        title: 'Nova reserva pendente de aprovação',
        message: `${teacher?.name || 'Professor'} solicitou ${equipNames} para ${bookingData.date} (${bookingData.startTime} - ${bookingData.endTime}).`,
        type: 'warning',
        bookingId: newBooking.id,
      });
    }

    return { success: true, booking: newBooking };
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const existing = bookings.find((b) => b.id === id);
    if (!existing) {
      return { success: false, error: 'Reserva não encontrada.' };
    }

    const checkDate = updates.date || existing.date;
    const checkStart = updates.startTime || existing.startTime;
    const checkEnd = updates.endTime || existing.endTime;
    const checkEquip = updates.equipmentId || existing.equipmentId;

    if (
      updates.date ||
      updates.startTime ||
      updates.endTime ||
      updates.equipmentId
    ) {
      const availability = checkEquipmentAvailability(
        checkEquip,
        checkDate,
        checkStart,
        checkEnd,
        id
      );

      if (!availability.available) {
        return {
          success: false,
          error: availability.conflictReason || 'Novo horário em conflito com outra reserva.',
        };
      }
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
      )
    );

    addNotification({
      userId: existing.userId,
      title: 'Reserva atualizada',
      message: `Sua reserva foi atualizada com sucesso para ${checkDate} (${checkStart} - ${checkEnd}).`,
      type: 'info',
      bookingId: id,
    });

    return { success: true };
  };

  const cancelBooking = (id: string, reason?: string) => {
    const existing = bookings.find((b) => b.id === id);
    if (!existing) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'cancelled',
              cancellationReason: reason || 'Cancelado pelo usuário',
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    const equip = equipments.find((e) => e.id === existing.equipmentId);

    addNotification({
      userId: existing.userId,
      title: 'Reserva cancelada',
      message: `A reserva do item "${equip?.name}" foi cancelada e o equipamento está liberado.`,
      type: 'warning',
      bookingId: id,
    });
  };

  const approveBooking = (id: string) => {
    const existing = bookings.find((b) => b.id === id);
    if (!existing) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'confirmed', updatedAt: new Date().toISOString() } : b
      )
    );

    const equip = equipments.find((e) => e.id === existing.equipmentId);

    addNotification({
      userId: existing.userId,
      title: 'Reserva Aprovada!',
      message: `A coordenação aprovou sua reserva do item "${equip?.name}" para ${existing.date}.`,
      type: 'success',
      bookingId: id,
    });
  };

  const rejectBooking = (id: string, reason: string) => {
    const existing = bookings.find((b) => b.id === id);
    if (!existing) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'rejected',
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    const equip = equipments.find((e) => e.id === existing.equipmentId);

    addNotification({
      userId: existing.userId,
      title: 'Reserva Não Autorizada',
      message: `Sua solicitação do item "${equip?.name}" foi recusada pela coordenação. Motivo: ${reason}`,
      type: 'alert',
      bookingId: id,
    });
  };

  // CRUD Equipamentos
  const addEquipment = (data: Omit<Equipment, 'id'>) => {
    const newEquip: Equipment = {
      ...data,
      id: `equip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setEquipments((prev) => [...prev, newEquip]);

    addNotification({
      userId: 'all',
      title: 'Novo equipamento cadastrado',
      message: `${newEquip.name} (Patrimônio: ${newEquip.patrimony}) adicionado ao inventário escolar.`,
      type: 'info',
    });
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEquipment = (id: string) => {
    setEquipments((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEquipmentMaintenance = (
    id: string,
    inMaintenance: boolean,
    reason?: string,
    expectedReturn?: string
  ) => {
    setEquipments((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: inMaintenance ? 'maintenance' : 'available',
              maintenanceReason: inMaintenance ? reason : undefined,
              maintenanceExpectedReturn: inMaintenance ? expectedReturn : undefined,
            }
          : e
      )
    );

    const target = equipments.find((e) => e.id === id);
    if (inMaintenance && target) {
      addNotification({
        userId: 'all',
        title: 'Equipamento em manutenção',
        message: `${target.name} foi temporariamente bloqueado para reparos técnicos (${reason || 'Manutenção'}).`,
        type: 'alert',
      });
    }
  };

  // CRUD Entidades Escolares
  const addClass = (data: Omit<SchoolClass, 'id'>) => {
    const item: SchoolClass = { ...data, id: `class-${Date.now()}` };
    setClasses((prev) => [...prev, item]);
  };
  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };
  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const addClassroom = (data: Omit<Classroom, 'id'>) => {
    const item: Classroom = { ...data, id: `room-${Date.now()}` };
    setClassrooms((prev) => [...prev, item]);
  };
  const updateClassroom = (id: string, updates: Partial<Classroom>) => {
    setClassrooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };
  const deleteClassroom = (id: string) => {
    setClassrooms((prev) => prev.filter((r) => r.id !== id));
  };

  const addSubject = (data: Omit<SchoolSubject, 'id'>) => {
    const item: SchoolSubject = { ...data, id: `sub-${Date.now()}` };
    setSubjects((prev) => [...prev, item]);
  };
  const updateSubject = (id: string, updates: Partial<SchoolSubject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };
  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addPeriod = (data: Omit<SchoolPeriod, 'id'>) => {
    const item: SchoolPeriod = { ...data, id: `p-${Date.now()}` };
    setPeriods((prev) => [...prev, item]);
  };
  const updatePeriod = (id: string, updates: Partial<SchoolPeriod>) => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deletePeriod = (id: string) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  };

  const addUser = (data: Omit<User, 'id'>) => {
    const item: User = { ...data, id: `user-${Date.now()}` };
    setUsers((prev) => [...prev, item]);
  };
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };
  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Notificações
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Configurações
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]); // Mariana Silva
    setEquipments(INITIAL_EQUIPMENTS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setClassrooms(INITIAL_CLASSROOMS);
    setPeriods(INITIAL_PERIODS);
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        equipments,
        classes,
        subjects,
        classrooms,
        periods,
        bookings,
        notifications,
        settings,
        addBooking,
        updateBooking,
        cancelBooking,
        approveBooking,
        rejectBooking,
        checkEquipmentAvailability,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        toggleEquipmentMaintenance,
        addClass,
        updateClass,
        deleteClass,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addSubject,
        updateSubject,
        deleteSubject,
        addPeriod,
        updatePeriod,
        deletePeriod,
        addUser,
        updateUser,
        deleteUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateSettings,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
