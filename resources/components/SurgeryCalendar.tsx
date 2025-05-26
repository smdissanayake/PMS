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
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [filteredSurgeries, setFilteredSurgeries] = useState<Surgery[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch surgeries from the database
  const fetchSurgeries = async () => {
    try {
      const response = await fetch('/surgeries', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch surgeries');
      }

      const data = await response.json();
      setSurgeries(data);
      filterSurgeriesByDate(selectedDate, data);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      setError('Failed to load surgeries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter surgeries by date
  const filterSurgeriesByDate = (date: string, surgeriesList: Surgery[] = surgeries) => {
    const filtered = surgeriesList.filter(surgery => surgery.date === date);
    setFilteredSurgeries(filtered);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    filterSurgeriesByDate(date);
  };

  useEffect(() => {
    fetchSurgeries();
  }, []);

  // Handle adding new surgery
  const handleAddSurgery = async (surgeryData: Omit<Surgery, 'id'>) => {
    try {
      const response = await fetch('/surgeries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(surgeryData),
      });

      if (!response.ok) {
        throw new Error('Failed to add surgery');
      }

      // Refresh the surgeries list
      await fetchSurgeries();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding surgery:', error);
      alert('Failed to add surgery. Please try again.');
    }
  };

  // Handle editing surgery
  const handleEditSurgery = async (id: string, updatedData: Partial<Surgery>) => {
    try {
      const response = await fetch(`/surgeries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update surgery');
      }

      // Refresh the surgeries list
      await fetchSurgeries();
    } catch (error) {
      console.error('Error updating surgery:', error);
      alert('Failed to update surgery. Please try again.');
    }
  };

  // Handle deleting surgery
  const handleDeleteSurgery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this surgery?')) {
      return;
    }

    try {
      const response = await fetch(`/surgeries/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete surgery');
      }

      // Refresh the surgeries list
      await fetchSurgeries();
    } catch (error) {
      console.error('Error deleting surgery:', error);
      alert('Failed to delete surgery. Please try again.');
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading surgeries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchSurgeries}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
            <button 
              onClick={() => setView('month')} 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <CalendarIcon size={16} className="inline-block mr-1.5" />
              Month
            </button>
            <button 
              onClick={() => setView('week')} 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ListIcon size={16} className="inline-block mr-1.5" />
              Week
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusIcon size={18} className="mr-1.5" />
            Add Surgery
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <SurgeryCalendarView 
              view={view} 
              surgeries={surgeries} 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        <div>
          <UpcomingSurgeries 
            surgeries={filteredSurgeries} 
            onEdit={handleEditSurgery} 
            onDelete={handleDeleteSurgery} 
            onView={handleViewSurgery}
            selectedDate={selectedDate}
          />
        </div>
      </div>
      <AddSurgeryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddSurgery} 
      />
    </div>
  );
};

export default SurgeryCalendar;