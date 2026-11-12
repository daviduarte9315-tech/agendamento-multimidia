import { Booking, Classroom, Equipment, SchoolClass, SchoolSubject, User } from '../types';
import { formatBrazilianDate } from './dateUtils';

export function exportBookingsToCSV(
  bookings: Booking[],
  equipments: Equipment[],
  users: User[],
  classes: SchoolClass[],
  subjects: SchoolSubject[],
  classrooms: Classroom[]
) {
  const getEquipName = (id: string) => equipments.find((e) => e.id === id)?.name || id;
  const getEquipPatrimony = (id: string) => equipments.find((e) => e.id === id)?.patrimony || '';
  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || id;
  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || id;
  const getSubjectName = (id: string) => subjects.find((s) => s.id === id)?.name || id;
  const getClassroomName = (id: string) => classrooms.find((r) => r.id === id)?.name || id;

  const headers = [
    'ID Reserva',
    'Data da Aula',
    'Horário Inicial',
    'Horário Final',
    'Equipamento',
    'Patrimônio',
    'Professor Responsável',
    'Turma',
    'Disciplina',
    'Sala de Uso',
    'Finalidade / Objetivo',
    'Status',
  ];

  const rows = bookings.map((b) => {
    const equipIds = b.equipmentIds && b.equipmentIds.length > 0 ? b.equipmentIds : [b.equipmentId];
    const equipNames = equipIds.map(getEquipName).join(' + ');
    const equipPatrimonies = equipIds.map(getEquipPatrimony).join(' / ');
    const subject = b.customSubjectName || getSubjectName(b.subjectId);

    return [
      `"${b.id}"`,
      `"${formatBrazilianDate(b.date)}"`,
      `"${b.startTime}"`,
      `"${b.endTime}"`,
      `"${equipNames.replace(/"/g, '""')}"`,
      `"${equipPatrimonies}"`,
      `"${getUserName(b.userId).replace(/"/g, '""')}"`,
      `"${getClassName(b.classId).replace(/"/g, '""')}"`,
      `"${subject.replace(/"/g, '""')}"`,
      `"${getClassroomName(b.classroomId).replace(/"/g, '""')}"`,
      `"${(b.purpose || '').replace(/"/g, '""')}"`,
      `"${b.status.toUpperCase()}"`,
    ];
  });

  const csvContent =
    '\uFEFF' + // UTF-8 BOM para garantir acentos corretos no Excel brasileiro
    [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `relatorio_agendamentos_multimidia_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
