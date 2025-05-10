import React, { useEffect, useState } from 'react';
import { PlusIcon, CalendarIcon, ListIcon } from 'lucide-react';
import SurgeryCalendarView from './SurgeryCalendarView';
import UpcomingSurgeries from './UpcomingSurgeries';
import AddSurgeryModal from './AddSurgeryModal';
interface Surgery {
  id: string;
  patientName: string;
  refNo: string;
  uhid: string;
  surgeryName: string;
  date: string;
  time: string;
}
const SurgeryCalendar = () => {
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [surgeries, setSurgeries] = useState<Surgery[]>([{
    id: '1',
    patientName: 'John Doe',
    refNo: 'CR-2024-001',
    uhid: 'UH-123456',
    surgeryName: 'Craniotomy',
    date: '2024-03-15',
    time: '09:00'
  }, {
    id: '2',
    patientName: 'Jane Smith',
    refNo: 'CR-2024-002',
    uhid: 'UH-123457',
    surgeryName: 'Spinal Fusion',
    date: '2024-03-18',
    time: '10:30'
  }]);
  // Handle adding new surgery
  const handleAddSurgery = (surgeryData: Omit<Surgery, 'id'>) => {
    const newSurgery = {
      ...surgeryData,
      id: Date.now().toString()
    };
    setSurgeries([...surgeries, newSurgery]);
    setIsAddModalOpen(false);
  };
  // Handle editing surgery
  const handleEditSurgery = (id: string, updatedData: Partial<Surgery>) => {
    setSurgeries(surgeries.map(surgery => surgery.id === id ? {
      ...surgery,
      ...updatedData
    } : surgery));
  };
  // Handle deleting surgery
  const handleDeleteSurgery = (id: string) => {
    setSurgeries(surgeries.filter(surgery => surgery.id !== id));
  };
  // Handle view surgery details
  const handleViewSurgery = (id: string) => {
    const surgery = surgeries.find(s => s.id === id);
    if (surgery) {
      // Open in main window if we're in a popup
      if (window.opener) {
        window.opener.location.href = `/patient/${surgery.uhid}`;
        window.close();
      } else {
        // Navigate in the same window
        window.location.href = `/patient/${surgery.uhid}`;
      }
    }
  };
  return <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Surgery Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage upcoming surgeries
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button onClick={() => setView('month')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <CalendarIcon size={16} className="inline-block mr-1.5" />
              Month
            </button>
            <button onClick={() => setView('week')} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <ListIcon size={16} className="inline-block mr-1.5" />
              Week
            </button>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
            <PlusIcon size={18} className="mr-1.5" />
            Add Surgery
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <SurgeryCalendarView view={view} surgeries={surgeries} />
          </div>
        </div>
        <div>
          <UpcomingSurgeries surgeries={surgeries} onEdit={handleEditSurgery} onDelete={handleDeleteSurgery} onView={handleViewSurgery} />
        </div>
      </div>
      <AddSurgeryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddSurgery} />
    </div>;
};
export default SurgeryCalendar;