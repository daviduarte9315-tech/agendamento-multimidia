export type Role = 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  subject?: string; // Disciplina principal do professor
  registrationNumber?: string; // Matrícula
  phone?: string;
  avatar?: string;
}

export type EquipmentCategory =
  | 'datashow'
  | 'tv'
  | 'chromebook_cart'
  | 'chromebook_individual'
  | 'sound'
  | 'mic'
  | 'multimedia_kit'
  | 'other';

export type EquipmentStatus = 'available' | 'reserved' | 'maintenance' | 'inactive';
export type EquipmentCondition = 'excellent' | 'good' | 'regular' | 'damaged';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  patrimony: string;
  type: 'individual' | 'set'; // Conjunto (ex: carrinho com 30) ou individual
  totalQuantity: number;
  storageLocation: string;
  condition: EquipmentCondition;
  status: EquipmentStatus;
  imageUrl?: string;
  brandModel: string;
  notes?: string;
  maintenanceReason?: string;
  maintenanceExpectedReturn?: string;
}

export interface SchoolClass {
  id: string;
  name: string; // Ex: "6º Ano A", "3º Ano Médio"
  grade: string;
  shift: 'morning' | 'afternoon' | 'evening';
  roomDefault?: string;
  studentCount?: number;
}

export interface SchoolSubject {
  id: string;
  name: string; // Ex: "História", "Matemática"
  color: string;
}

export interface Classroom {
  id: string;
  name: string; // Ex: "Sala 101", "Auditório"
  floor: string;
  capacity: number;
  hasSockets: boolean;
  hasProjectorScreen: boolean;
}

export interface SchoolPeriod {
  id: string;
  shift: 'morning' | 'afternoon' | 'evening';
  order: number;
  label: string; // Ex: "1ª Aula (07:30 - 08:20)"
  startTime: string; // "07:30"
  endTime: string; // "08:20"
}

export type BookingStatus = 'confirmed' | 'pending' | 'rejected' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  equipmentId: string; // Primeiro equipamento ou principal
  equipmentIds: string[]; // Lista de todos os equipamentos multimídia selecionados (1 ou mais)
  userId: string;
  date: string; // YYYY-MM-DD
  periodType: 'period' | 'custom';
  periodIds: string[]; // IDs dos períodos letivos selecionados (pode ser 1 ou múltiplos para geminadas)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  classId: string;
  subjectId: string;
  customSubjectName?: string; // Permite digitar a matéria livremente
  classroomId: string;
  purpose: string;
  quantityReserved: number;
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // ou 'all'
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface SchoolSettings {
  schoolName: string;
  academicYear: string;
  requireAdminApproval: boolean;
  allowConsecutivePeriods: boolean;
  maxDaysInAdvance: number;
  contactEmail: string;
}
