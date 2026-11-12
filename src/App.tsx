/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewBookingView } from './components/NewBookingView';
import { ScheduleView } from './components/ScheduleView';
import { MyBookingsView } from './components/MyBookingsView';
import { EquipmentsView } from './components/EquipmentsView';
import { ApprovalsView } from './components/ApprovalsView';
import { AdminSchoolManageView } from './components/AdminSchoolManageView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { Booking } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [preselectedEquipmentId, setPreselectedEquipmentId] = useState<string | undefined>(undefined);

  const handleOpenNewBooking = (equipId?: string) => {
    setPreselectedEquipmentId(equipId);
    setCurrentTab('new_booking');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onToggleSidebarMobile={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        isSidebarOpenMobile={isSidebarOpenMobile}
        onOpenNewBooking={() => handleOpenNewBooking()}
        onNavigateToTeachers={() => setCurrentTab('teachers')}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'new_booking') setPreselectedEquipmentId(undefined);
          }}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigate={(tab) => setCurrentTab(tab)}
                onSelectBooking={(b) => setSelectedBookingForDetails(b)}
              />
            )}

            {currentTab === 'new_booking' && (
              <NewBookingView
                preselectedEquipmentId={preselectedEquipmentId}
                onBookingSuccess={() => setCurrentTab('schedule')}
              />
            )}

            {currentTab === 'schedule' && (
              <ScheduleView
                onSelectBooking={(b) => setSelectedBookingForDetails(b)}
                onOpenNewBooking={() => handleOpenNewBooking()}
              />
            )}

            {currentTab === 'my_bookings' && (
              <MyBookingsView
                onSelectBooking={(b) => setSelectedBookingForDetails(b)}
                onOpenNewBooking={() => handleOpenNewBooking()}
              />
            )}

            {currentTab === 'equipments' && (
              <EquipmentsView
                onReserveEquipment={(id) => handleOpenNewBooking(id)}
              />
            )}

            {currentTab === 'teachers' && (
              <AdminSchoolManageView initialTab="users" autoOpenAddUser={true} />
            )}

            {currentTab === 'approvals' && <ApprovalsView />}

            {currentTab === 'school_manage' && <AdminSchoolManageView />}

            {currentTab === 'reports' && <ReportsView />}

            {currentTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
