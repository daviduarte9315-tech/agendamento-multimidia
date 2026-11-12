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

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Prof. Ricardo Santos',
    email: 'coord.ricardo@escola.gov.br',
    role: 'admin',
    subject: 'Coordenação Pedagógica & TI',
    registrationNumber: 'MAT-88401',
    phone: '(63) 98411-2001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-1',
    name: 'Profª. Mariana Silva',
    email: 'prof.mariana@escola.gov.br',
    role: 'teacher',
    subject: 'História',
    registrationNumber: 'MAT-33102',
    phone: '(63) 99233-1042',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-2',
    name: 'Prof. Carlos Eduardo',
    email: 'prof.carlos@escola.gov.br',
    role: 'teacher',
    subject: 'Matemática',
    registrationNumber: 'MAT-33103',
    phone: '(63) 98112-9988',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-3',
    name: 'Profª. Juliana Costa',
    email: 'prof.juliana@escola.gov.br',
    role: 'teacher',
    subject: 'Ciências & Biologia',
    registrationNumber: 'MAT-33104',
    phone: '(63) 99901-4455',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-4',
    name: 'Prof. Roberto Almeida',
    email: 'prof.roberto@escola.gov.br',
    role: 'teacher',
    subject: 'Língua Portuguesa',
    registrationNumber: 'MAT-33105',
    phone: '(63) 98455-7766',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-teacher-5',
    name: 'Profª. Fernanda Lima',
    email: 'prof.fernanda@escola.gov.br',
    role: 'teacher',
    subject: 'Geografia',
    registrationNumber: 'MAT-33106',
    phone: '(63) 99122-3344',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_EQUIPMENTS: Equipment[] = [
  // 3 Datashows
  {
    id: 'equip-ds-01',
    name: 'Projetor Epson PowerLite X49 (Sala Multimídia)',
    category: 'datashow',
    patrimony: 'SEDUC-44012',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Armário A - Sala de Multimídia',
    condition: 'excellent',
    status: 'available',
    brandModel: 'Epson PowerLite X49 - 3600 Lumens HDMI',
    imageUrl: '/src/assets/images/equip_projector_1792669823450.jpg',
    notes: 'Acompanha controle remoto, cabo HDMI 5m e adaptador VGA/HDMI.',
  },
  {
    id: 'equip-ds-02',
    name: 'Projetor BenQ MX560 Alta Definição',
    category: 'datashow',
    patrimony: 'SEDUC-44013',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Armário dos Professores - Bloco 1',
    condition: 'good',
    status: 'available',
    brandModel: 'BenQ MX560 4000 Lumens',
    imageUrl: '/src/assets/images/equip_projector_1792669823450.jpg',
    notes: 'Ideal para ambientes claros e salas maiores. Cabo de alimentação de 3m.',
  },
  {
    id: 'equip-ds-03',
    name: 'Projetor Epson BrightLink Interativo Portátil',
    category: 'datashow',
    patrimony: 'SEDUC-44014',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Laboratório de Informática',
    condition: 'good',
    status: 'available',
    brandModel: 'Epson BrightLink 725Wi',
    imageUrl: '/src/assets/images/equip_projector_1792669823450.jpg',
    notes: 'Suporta caneta interativa e touch na parede. Canetas na gaveta 3 do lab.',
  },

  // 2 Televisões
  {
    id: 'equip-tv-01',
    name: 'Smart TV LG 65" 4K em Suporte Móvel com Rodas',
    category: 'tv',
    patrimony: 'SEDUC-88201',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Hall de Entrada dos Professores',
    condition: 'excellent',
    status: 'available',
    brandModel: 'LG UHD AI ThinQ 65UR7800',
    imageUrl: '/src/assets/images/equip_smart_tv_1792669822851.jpg',
    notes: 'Suporte ajustável com trava de rodas. Conexão Wi-Fi, YouTube e espelhamento AirPlay/Cast.',
  },
  {
    id: 'equip-tv-02',
    name: 'Smart TV Samsung 55" Cristal UHD com Suporte Móvel',
    category: 'tv',
    patrimony: 'SEDUC-88202',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Sala de Recursos Tecnológicos - Bloco B',
    condition: 'good',
    status: 'available',
    brandModel: 'Samsung CU7700 55"',
    imageUrl: '/src/assets/images/equip_smart_tv_1792669822851.jpg',
    notes: 'Cabo extensor de 10 metros acoplado na traseira do suporte.',
  },

  // 1 Carrinho com 30 Chromebooks
  {
    id: 'equip-cart-01',
    name: 'Carrinho Móvel de Chromebooks 01 (Conjunto 30 unidades)',
    category: 'chromebook_cart',
    patrimony: 'SEDUC-CART-01',
    type: 'set',
    totalQuantity: 30,
    storageLocation: 'Doca Tecnológica - Lab de TI',
    condition: 'excellent',
    status: 'available',
    brandModel: 'Carrinho Recarregável LocknCharge com 30 Dell Chromebook 3100',
    imageUrl: '/src/assets/images/equip_chromebook_cart_1792669823434.jpg',
    notes: 'Conjunto completo para turmas inteiras. Chave mestra na coordenação. Devolver plugado na tomada para recarga.',
  },

  // Chromebooks individuais
  {
    id: 'equip-cb-ind-01',
    name: 'Chromebooks Individuais Avulsos (Pacote de Unidades)',
    category: 'chromebook_individual',
    patrimony: 'SEDUC-CB-IND-01/10',
    type: 'individual',
    totalQuantity: 10,
    storageLocation: 'Armário B - Sala dos Professores',
    condition: 'good',
    status: 'available',
    brandModel: 'Dell Chromebook 3100 11.6"',
    imageUrl: '/src/assets/images/equip_chromebook_cart_1792669823434.jpg',
    notes: 'Para uso individual em pesquisas em grupo pequeno ou reforço escolar.',
  },

  // 2 Caixas de Som
  {
    id: 'equip-som-01',
    name: 'Caixa de Som Amplificada JBL EON com Bluetooth',
    category: 'sound',
    patrimony: 'SEDUC-SOM-01',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Armário de Áudio - Auditório',
    condition: 'excellent',
    status: 'available',
    brandModel: 'JBL EON One Compact 150W',
    imageUrl: '/src/assets/images/equip_sound_mic_1792669824117.jpg',
    notes: 'Bateria recarregável com duração de até 8 horas. Cabo P2 e Bluetooth disponíveis.',
  },
  {
    id: 'equip-som-02',
    name: 'Caixa de Som Multiuso Mondial 200W com Rodinhas',
    category: 'sound',
    patrimony: 'SEDUC-SOM-02',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: 'Almoxarifado Multimídia',
    condition: 'good',
    status: 'available',
    brandModel: 'Mondial Connect Party Plus 200W',
    imageUrl: '/src/assets/images/equip_sound_mic_1792669824117.jpg',
    notes: 'Fácil locomoção para pátio ou quadra coberta.',
  },

  // Microfones
  {
    id: 'equip-mic-01',
    name: 'Kit Microfone Duplo Sem Fio UHF Dylan',
    category: 'mic',
    patrimony: 'SEDUC-MIC-01',
    type: 'set',
    totalQuantity: 2,
    storageLocation: 'Gaveta 01 - Auditório',
    condition: 'excellent',
    status: 'available',
    brandModel: 'Dylan U-300 Pro UHF',
    imageUrl: '/src/assets/images/equip_sound_mic_1792669824117.jpg',
    notes: 'Receptor bivolt e 2 bastões sem fio. Pilhas AA recarregáveis inclusas.',
  },

  // 1 Kit Multimídia
  {
    id: 'equip-kit-01',
    name: 'Kit Multimídia Móvel Completo 01 (Projetor + Som + Cabos)',
    category: 'multimedia_kit',
    patrimony: 'SEDUC-KIT-01',
    type: 'set',
    totalQuantity: 1,
    storageLocation: 'Mala de Transporte 01 - Coordenação',
    condition: 'excellent',
    status: 'available',
    brandModel: 'Kit Integrado ProjEpson + Caixa Portátil + Kit Adaptadores',
    imageUrl: '/src/assets/images/equip_projector_1792669823450.jpg',
    notes: 'Maleta rígida para transporte rápido com projetor portátil, mini soundbar, apontador laser e cabos.',
  },
];

export const INITIAL_CLASSES: SchoolClass[] = [
  // Turno Matutino (Manhã)
  { id: 'class-13-01', name: '13.01', grade: '1ª Série EM', shift: 'morning', roomDefault: 'Sala 201', studentCount: 32 },
  { id: 'class-14-01', name: '14.01', grade: '1ª Série EM', shift: 'morning', roomDefault: 'Sala 202', studentCount: 30 },
  { id: 'class-23-01', name: '23.01', grade: '2ª Série EM', shift: 'morning', roomDefault: 'Sala 203', studentCount: 31 },
  { id: 'class-24-01', name: '24.01', grade: '2ª Série EM', shift: 'morning', roomDefault: 'Sala 104', studentCount: 29 },
  { id: 'class-33-01', name: '33.01', grade: '3ª Série EM', shift: 'morning', roomDefault: 'Sala 105', studentCount: 33 },
  { id: 'class-34-01', name: '34.01', grade: '3ª Série EM', shift: 'morning', roomDefault: 'Sala 101', studentCount: 28 },

  // Turno Vespertino (Tarde)
  { id: 'class-62-01', name: '62.01', grade: '6º Ano EF', shift: 'afternoon', roomDefault: 'Sala 101', studentCount: 28 },
  { id: 'class-62-02', name: '62.02', grade: '6º Ano EF', shift: 'afternoon', roomDefault: 'Sala 102', studentCount: 27 },
  { id: 'class-72-01', name: '72.01', grade: '7º Ano EF', shift: 'afternoon', roomDefault: 'Sala 103', studentCount: 29 },
  { id: 'class-82-01', name: '82.01', grade: '8º Ano EF', shift: 'afternoon', roomDefault: 'Sala 104', studentCount: 30 },
  { id: 'class-92-01', name: '92.01', grade: '9º Ano EF', shift: 'afternoon', roomDefault: 'Sala 105', studentCount: 26 },
];

export const INITIAL_SUBJECTS: SchoolSubject[] = [
  { id: 'sub-hist', name: 'História', color: '#b45309' },
  { id: 'sub-mat', name: 'Matemática', color: '#1d4ed8' },
  { id: 'sub-bio', name: 'Ciências & Biologia', color: '#15803d' },
  { id: 'sub-port', name: 'Língua Portuguesa', color: '#0369a1' },
  { id: 'sub-geo', name: 'Geografia', color: '#0f766e' },
  { id: 'sub-fis', name: 'Física', color: '#6d28d9' },
  { id: 'sub-qui', name: 'Química', color: '#be185d' },
  { id: 'sub-art', name: 'Artes', color: '#c026d3' },
  { id: 'sub-ing', name: 'Língua Inglesa', color: '#4338ca' },
  { id: 'sub-edfis', name: 'Educação Física', color: '#ea580c' },
];

export const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'room-1', name: 'Sala 1', floor: 'Térreo', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-2', name: 'Sala 2', floor: 'Térreo', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-3', name: 'Sala 3', floor: 'Térreo', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-4', name: 'Sala 4', floor: '1º Andar', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-5', name: 'Sala 5', floor: '1º Andar', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-6', name: 'Sala 6', floor: '1º Andar', capacity: 35, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-biblioteca', name: 'Biblioteca', floor: 'Térreo', capacity: 50, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-laboratorio', name: 'Laboratório', floor: '1º Andar', capacity: 40, hasSockets: true, hasProjectorScreen: true },
  { id: 'room-patio', name: 'Pátio', floor: 'Área Externa Coberta', capacity: 150, hasSockets: true, hasProjectorScreen: false },
];

export const INITIAL_PERIODS: SchoolPeriod[] = [
  // Turno Matutino (Início às 07:15, aulas de 50 min, recreio de 15 min após a 3ª aula, sem 6ª aula)
  { id: 'p-m1', shift: 'morning', order: 1, label: '1ª Aula Matutino (07:15 - 08:05)', startTime: '07:15', endTime: '08:05' },
  { id: 'p-m2', shift: 'morning', order: 2, label: '2ª Aula Matutino (08:05 - 08:55)', startTime: '08:05', endTime: '08:55' },
  { id: 'p-m3', shift: 'morning', order: 3, label: '3ª Aula Matutino (08:55 - 09:45)', startTime: '08:55', endTime: '09:45' },
  // Recreio Matutino (15 min): 09:45 - 10:00
  { id: 'p-m4', shift: 'morning', order: 4, label: '4ª Aula Matutino (10:00 - 10:50)', startTime: '10:00', endTime: '10:50' },
  { id: 'p-m5', shift: 'morning', order: 5, label: '5ª Aula Matutino (10:50 - 11:40)', startTime: '10:50', endTime: '11:40' },

  // Turno Vespertino (Início às 13:00 até 13:50, aulas de 50 min, recreio de 15 min após a 3ª aula)
  { id: 'p-v1', shift: 'afternoon', order: 6, label: '1ª Aula Vespertino (13:00 - 13:50)', startTime: '13:00', endTime: '13:50' },
  { id: 'p-v2', shift: 'afternoon', order: 7, label: '2ª Aula Vespertino (13:50 - 14:40)', startTime: '13:50', endTime: '14:40' },
  { id: 'p-v3', shift: 'afternoon', order: 8, label: '3ª Aula Vespertino (14:40 - 15:30)', startTime: '14:40', endTime: '15:30' },
  // Recreio Vespertino (15 min): 15:30 - 15:45
  { id: 'p-v4', shift: 'afternoon', order: 9, label: '4ª Aula Vespertino (15:45 - 16:35)', startTime: '15:45', endTime: '16:35' },
  { id: 'p-v5', shift: 'afternoon', order: 10, label: '5ª Aula Vespertino (16:35 - 17:25)', startTime: '16:35', endTime: '17:25' },
];

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'Escola Estadual Presidente Vargas',
  academicYear: '2026',
  requireAdminApproval: false, // Pode ser ativado nas configurações
  allowConsecutivePeriods: true,
  maxDaysInAdvance: 30,
  contactEmail: 'multimidia@escolavargas.seduc.gov.br',
};

// Gera data de hoje no formato YYYY-MM-DD
const todayStr = '2026-10-22';
const tomorrowStr = '2026-10-23';
const nextMondayStr = '2026-10-26';
const nextTuesdayStr = '2026-10-27';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-01',
    equipmentId: 'equip-ds-01', // Projetor Epson X49
    equipmentIds: ['equip-ds-01', 'equip-som-01'], // Projetor + Caixa de Som
    userId: 'user-teacher-1', // Profª Mariana
    date: todayStr,
    periodType: 'period',
    periodIds: ['p-m1', 'p-m2'],
    startTime: '07:15',
    endTime: '08:55',
    classId: 'class-23-01', // Turma 23.01
    subjectId: 'sub-hist',
    classroomId: 'room-4', // Sala 4
    purpose: 'Exibição de documentário sobre a Revolução Industrial e debate guiado.',
    quantityReserved: 1,
    status: 'confirmed',
    createdAt: '2026-10-20T10:15:00Z',
    updatedAt: '2026-10-20T10:15:00Z',
  },
  {
    id: 'book-02',
    equipmentId: 'equip-cart-01', // Carrinho de Chromebooks
    equipmentIds: ['equip-cart-01'],
    userId: 'user-teacher-2', // Prof Carlos
    date: todayStr,
    periodType: 'period',
    periodIds: ['p-m4', 'p-m5'],
    startTime: '10:00',
    endTime: '11:40',
    classId: 'class-33-01', // Turma 33.01
    subjectId: 'sub-mat',
    classroomId: 'room-5', // Sala 5
    purpose: 'Oficina prática com software GeoGebra e resolução de desafios de geometria plana.',
    quantityReserved: 30,
    status: 'confirmed',
    createdAt: '2026-10-21T08:30:00Z',
    updatedAt: '2026-10-21T08:30:00Z',
  },
  {
    id: 'book-03',
    equipmentId: 'equip-tv-01', // TV 65"
    equipmentIds: ['equip-tv-01'],
    userId: 'user-teacher-3', // Profª Juliana
    date: todayStr,
    periodType: 'period',
    periodIds: ['p-v1', 'p-v2'],
    startTime: '13:00',
    endTime: '14:40',
    classId: 'class-62-01', // Turma 62.01 Vespertino
    subjectId: 'sub-bio',
    classroomId: 'room-1', // Sala 1
    purpose: 'Apresentação em alta definição de modelos 3D de células eucariontes e vírus.',
    quantityReserved: 1,
    status: 'confirmed',
    createdAt: '2026-10-21T14:00:00Z',
    updatedAt: '2026-10-21T14:00:00Z',
  },
  {
    id: 'book-04',
    equipmentId: 'equip-ds-02', // Projetor BenQ
    equipmentIds: ['equip-ds-02', 'equip-mic-01'],
    userId: 'user-teacher-4', // Prof Roberto
    date: tomorrowStr,
    periodType: 'period',
    periodIds: ['p-m1', 'p-m2'],
    startTime: '07:15',
    endTime: '08:55',
    classId: 'class-13-01', // Turma 13.01
    subjectId: 'sub-port',
    classroomId: 'room-2', // Sala 2
    purpose: 'Seminário de literatura: análise de poemas modernistas com slides e microfone.',
    quantityReserved: 1,
    status: 'confirmed',
    createdAt: '2026-10-21T16:20:00Z',
    updatedAt: '2026-10-21T16:20:00Z',
  },
  {
    id: 'book-05',
    equipmentId: 'equip-kit-01', // Kit Multimídia
    equipmentIds: ['equip-kit-01'],
    userId: 'user-teacher-5', // Profª Fernanda
    date: tomorrowStr,
    periodType: 'period',
    periodIds: ['p-v2', 'p-v3'],
    startTime: '13:50',
    endTime: '15:30',
    classId: 'class-72-01', // Turma 72.01 Vespertino
    subjectId: 'sub-geo',
    classroomId: 'room-3', // Sala 3
    purpose: 'Navegação em tempo real pelo Google Earth e análise de biomas brasileiros.',
    quantityReserved: 1,
    status: 'confirmed',
    createdAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-22T08:00:00Z',
  },
  {
    id: 'book-06',
    equipmentId: 'equip-som-01', // Caixa JBL
    equipmentIds: ['equip-som-01', 'equip-mic-01'],
    userId: 'user-teacher-4',
    date: nextMondayStr,
    periodType: 'period',
    periodIds: ['p-m4', 'p-m5'],
    startTime: '10:00',
    endTime: '11:40',
    classId: 'class-34-01', // Turma 34.01
    subjectId: 'sub-port',
    classroomId: 'room-patio', // Pátio
    purpose: 'Ensaio de declamação de poesia e teatro para o festival literário da escola.',
    quantityReserved: 1,
    status: 'confirmed',
    createdAt: '2026-10-22T09:00:00Z',
    updatedAt: '2026-10-22T09:00:00Z',
  },
  {
    id: 'book-07',
    equipmentId: 'equip-cart-01', // Carrinho de Chromebooks
    equipmentIds: ['equip-cart-01'],
    userId: 'user-teacher-3',
    date: nextTuesdayStr,
    periodType: 'period',
    periodIds: ['p-m1', 'p-m2'],
    startTime: '07:15',
    endTime: '08:55',
    classId: 'class-14-01', // Turma 14.01
    subjectId: 'sub-bio',
    classroomId: 'room-laboratorio', // Laboratório
    purpose: 'Simulação virtual de genética mendeliana no portal PhET Interactive.',
    quantityReserved: 30,
    status: 'confirmed',
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'Novo recurso disponível',
    message: 'O Carrinho Móvel de Chromebooks 01 já está disponível para agendamentos de turmas completas.',
    type: 'info',
    read: false,
    createdAt: '2026-10-20T08:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-teacher-1',
    title: 'Reserva confirmada com sucesso',
    message: 'Seu agendamento do Projetor Epson PowerLite para hoje (07:30 - 09:10) na Sala 104 foi confirmado.',
    type: 'success',
    read: true,
    createdAt: '2026-10-20T10:15:00Z',
    bookingId: 'book-01',
  },
  {
    id: 'notif-3',
    userId: 'user-teacher-2',
    title: 'Reserva confirmada com sucesso',
    message: 'Seu agendamento do Carrinho de Chromebooks para hoje (09:30 - 11:10) na Sala 105 foi confirmado.',
    type: 'success',
    read: false,
    createdAt: '2026-10-21T08:30:00Z',
    bookingId: 'book-02',
  },
  {
    id: 'notif-4',
    userId: 'all',
    title: 'Lembrete de devolução e conservação',
    message: 'Lembre-se de retornar os equipamentos ao armário de origem e plugá-los na tomada ao término da aula.',
    type: 'info',
    read: false,
    createdAt: '2026-10-22T07:00:00Z',
  },
];
