import React from 'react';
import { ClockIcon, EditIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';

interface Surgery {
  id: string;
  patientName: string;
  refNo: string;
  uhid: string;
  surgeryName: string;
  date: string;
  time: string;
  firstName?: string;
  lastName?: string;
}

interface UpcomingSurgeriesProps {
  surgeries: Surgery[];
  onEdit: (id: string, updatedData: Partial<Surgery>) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  selectedDate: string;
}

const UpcomingSurgeries: React.FC<UpcomingSurgeriesProps> = ({ 
  surgeries, 
  onEdit, 
  onDelete, 
  onView,
  selectedDate 
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Surgeries for {formatDate(selectedDate)}
      </h2>
      <div className="space-y-4">
        {surgeries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No surgeries scheduled for this date</p>
        ) : (
          surgeries.map(surgery => (
            <div key={surgery.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{surgery.patientName}</h3>
                  <p className="text-sm text-gray-500">Ref: {surgery.refNo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(surgery.id, surgery)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(surgery.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>Surgery: {surgery.surgeryName}</p>
                <p>Time: {formatTime(surgery.time)}</p>
              </div>
              <button
                onClick={() => onView(surgery.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Patient Details →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingSurgeries;