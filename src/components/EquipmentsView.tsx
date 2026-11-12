import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Equipment,
  EquipmentCategory,
  EquipmentCondition,
  EquipmentStatus,
} from '../types';
import {
  Tv,
  Projector,
  Laptop,
  Volume2,
  Plus,
  Search,
  Wrench,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Tag,
  Layers,
  X,
  Calendar,
} from 'lucide-react';
import { getTodayDateString } from '../utils/dateUtils';

interface EquipmentsViewProps {
  onReserveEquipment: (equipmentId: string) => void;
}

export const EquipmentsView: React.FC<EquipmentsViewProps> = ({ onReserveEquipment }) => {
  const {
    equipments,
    currentUser,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    toggleEquipmentMaintenance,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [maintenanceModalEquip, setMaintenanceModalEquip] = useState<Equipment | null>(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    name: '',
    category: 'datashow',
    patrimony: '',
    type: 'individual',
    totalQuantity: 1,
    storageLocation: '',
    condition: 'good',
    status: 'available',
    brandModel: '',
    notes: '',
    imageUrl: '',
  });

  // Maintenance form
  const [maintenanceReason, setMaintenanceReason] = useState('Troca de lâmpada e revisão do filtro');
  const [maintenanceReturnDate, setMaintenanceReturnDate] = useState('2026-10-30');

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: 'datashow',
      patrimony: `SEDUC-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'individual',
      totalQuantity: 1,
      storageLocation: 'Sala dos Professores',
      condition: 'good',
      status: 'available',
      brandModel: '',
      notes: '',
      imageUrl: '/src/assets/images/equip_projector_1792669823450.jpg',
    });
    setEditingEquipment(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (equip: Equipment) => {
    setEditingEquipment(equip);
    setFormData({
      name: equip.name,
      category: equip.category,
      patrimony: equip.patrimony,
      type: equip.type,
      totalQuantity: equip.totalQuantity,
      storageLocation: equip.storageLocation,
      condition: equip.condition,
      status: equip.status,
      brandModel: equip.brandModel,
      notes: equip.notes || '',
      imageUrl: equip.imageUrl || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.patrimony.trim()) {
      alert('Nome e Patrimônio são obrigatórios.');
      return;
    }

    if (editingEquipment) {
      updateEquipment(editingEquipment.id, formData);
    } else {
      addEquipment(formData);
    }
    setIsCreateModalOpen(false);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceModalEquip) return;

    const inMaintenance = maintenanceModalEquip.status !== 'maintenance';
    toggleEquipmentMaintenance(
      maintenanceModalEquip.id,
      inMaintenance,
      inMaintenance ? maintenanceReason : undefined,
      inMaintenance ? maintenanceReturnDate : undefined
    );
    setMaintenanceModalEquip(null);
  };

  const filteredEquipments = equipments.filter((eq) => {
    if (categoryFilter !== 'all' && eq.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && eq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        eq.name.toLowerCase().includes(q) ||
        eq.patrimony.toLowerCase().includes(q) ||
        eq.brandModel.toLowerCase().includes(q) ||
        eq.storageLocation.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getCategoryIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'datashow':
        return <Projector className="h-4 w-4" />;
      case 'tv':
        return <Tv className="h-4 w-4" />;
      case 'chromebook_cart':
      case 'chromebook_individual':
        return <Laptop className="h-4 w-4" />;
      case 'sound':
      case 'mic':
        return <Volume2 className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const getConditionLabel = (condition: EquipmentCondition) => {
    switch (condition) {
      case 'excellent':
        return 'Excelente / Novo';
      case 'good':
        return 'Bom Estado';
      case 'regular':
        return 'Regular / Uso Frequente';
      case 'damaged':
        return 'Danificado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Inventário e Controle de Equipamentos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de aparelhos multimídia, patrimônios, localização física e manutenção.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Cadastrar Equipamento</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="all">Todas as Categorias</option>
            <option value="datashow">Datashows & Projetores</option>
            <option value="tv">Smart TVs</option>
            <option value="chromebook_cart">Carrinho de Chromebooks</option>
            <option value="chromebook_individual">Chromebooks Individuais</option>
            <option value="sound">Caixas de Som</option>
            <option value="mic">Microfones Sem Fio</option>
            <option value="multimedia_kit">Kits Multimídia</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
          >
            <option value="all">Todos os Status</option>
            <option value="available">Disponível</option>
            <option value="maintenance">Em Manutenção</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="w-full sm:w-72">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por patrimônio, nome ou sala..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Equipments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipments.map((eq) => {
          const isMaintenance = eq.status === 'maintenance';

          return (
            <div
              key={eq.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-4 shadow-xs transition-all ${
                isMaintenance
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Image */}
                {eq.imageUrl ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={eq.imageUrl}
                      alt={eq.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                      {getCategoryIcon(eq.category)}
                      <span className="capitalize">{eq.category.replace('_', ' ')}</span>
                    </div>

                    <div className="absolute top-2 right-2">
                      {isMaintenance ? (
                        <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Manutenção
                        </span>
                      ) : eq.status === 'available' ? (
                        <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Disponível
                        </span>
                      ) : (
                        <span className="rounded bg-slate-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                    {getCategoryIcon(eq.category)}
                  </div>
                )}

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{eq.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{eq.brandModel}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Patrimônio SEDUC:</span>
                    <span className="font-mono font-semibold text-slate-800">{eq.patrimony}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tipo de Recurso:</span>
                    <span className="font-medium text-slate-700">
                      {eq.type === 'set' ? `Conjunto (${eq.totalQuantity} unidades)` : 'Unidade Individual'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Local de Guarda:</span>
                    <span className="text-slate-700 truncate max-w-[180px] text-right font-medium">
                      {eq.storageLocation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estado:</span>
                    <span className="text-slate-700 font-medium">
                      {getConditionLabel(eq.condition)}
                    </span>
                  </div>

                  {isMaintenance && eq.maintenanceReason && (
                    <div className="rounded bg-amber-50 p-2 text-[11px] text-amber-900 border border-amber-200 mt-2">
                      <p className="font-bold flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-amber-700" />
                        <span>Manutenção em andamento</span>
                      </p>
                      <p className="mt-0.5">{eq.maintenanceReason}</p>
                      {eq.maintenanceExpectedReturn && (
                        <p className="text-[10px] text-amber-700 mt-0.5 font-mono">
                          Previsão: {eq.maintenanceExpectedReturn}
                        </p>
                      )}
                    </div>
                  )}

                  {eq.notes && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-50">
                      {eq.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={isMaintenance}
                  onClick={() => onReserveEquipment(eq.id)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold text-center transition-all ${
                    isMaintenance
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xs'
                  }`}
                >
                  {isMaintenance ? 'Bloqueado' : 'Reservar este Equipamento'}
                </button>

                {currentUser.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setMaintenanceModalEquip(eq)}
                      title={isMaintenance ? 'Desbloquear manutenção' : 'Bloquear para manutenção'}
                      className={`rounded-lg p-2 transition-colors ${
                        isMaintenance
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Wrench className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(eq)}
                      title="Editar ficha"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Deseja remover o equipamento "${eq.name}" do patrimônio?`)) {
                          deleteEquipment(eq.id);
                        }
                      }}
                      title="Excluir equipamento"
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT EQUIPMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingEquipment ? 'Editar Equipamento' : 'Cadastrar Novo Equipamento'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome do Equipamento *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Datashow Epson Sala Multimídia"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as EquipmentCategory })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="datashow">Datashow / Projetor</option>
                    <option value="tv">Televisão / Smart TV</option>
                    <option value="chromebook_cart">Carrinho de Chromebooks</option>
                    <option value="chromebook_individual">Chromebook Individual</option>
                    <option value="sound">Caixa de Som</option>
                    <option value="mic">Microfone</option>
                    <option value="multimedia_kit">Kit Multimídia</option>
                    <option value="other">Outro Equipamento</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patrimônio / Tombo *</label>
                  <input
                    type="text"
                    value={formData.patrimony}
                    onChange={(e) => setFormData({ ...formData, patrimony: e.target.value })}
                    placeholder="Ex: SEDUC-55021"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Unidade</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'individual' | 'set',
                        totalQuantity: e.target.value === 'set' ? 30 : 1,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="individual">Unidade Individual (1 aparelho)</option>
                    <option value="set">Conjunto / Lote (ex: Carrinho)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantidade de Itens no Conjunto
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Local de Guarda</label>
                  <input
                    type="text"
                    value={formData.storageLocation}
                    onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                    placeholder="Ex: Armário B dos Professores"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado de Conservação</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value as EquipmentCondition })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="excellent">Excelente / Novo</option>
                    <option value="good">Bom Estado</option>
                    <option value="regular">Regular</option>
                    <option value="damaged">Danificado</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Marca / Modelo Técnico</label>
                  <input
                    type="text"
                    value={formData.brandModel}
                    onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                    placeholder="Ex: Epson PowerLite X49 3600 Lumens HDMI"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Observações / Acessórios</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: Acompanha cabos HDMI, VGA e controle remoto na bolsa."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAINTENANCE TOGGLE MODAL */}
      {maintenanceModalEquip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-600" />
                <span>
                  {maintenanceModalEquip.status === 'maintenance'
                    ? 'Desbloquear da Manutenção'
                    : 'Bloquear Equipamento para Manutenção'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setMaintenanceModalEquip(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Equipamento:{' '}
              <span className="font-bold text-slate-900">{maintenanceModalEquip.name}</span> (
              {maintenanceModalEquip.patrimony})
            </p>

            {maintenanceModalEquip.status === 'maintenance' ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  O equipamento voltará a ficar disponível para agendamento por todos os professores.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMaintenanceModalEquip(null)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleMaintenanceSubmit}
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-700"
                  >
                    Confirmar Retorno ao Uso
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMaintenanceSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motivo do Bloqueio *</label>
                  <input
                    type="text"
                    value={maintenanceReason}
                    onChange={(e) => setMaintenanceReason(e.target.value)}
                    placeholder="Ex: Troca de lâmpada do projetor ou conector danificado"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Previsão de Retorno Técnico
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={maintenanceReturnDate}
                    onChange={(e) => setMaintenanceReturnDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200">
                  Ao bloquear, nenhum professor poderá selecionar este aparelho para reserva até sua liberação.
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMaintenanceModalEquip(null)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-600 px-4 py-1.5 font-bold text-white hover:bg-amber-700 shadow-xs"
                  >
                    Bloquear Equipamento
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
