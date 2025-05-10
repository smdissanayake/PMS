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
}
interface UpcomingSurgeriesProps {
  surgeries: Surgery[];
  onEdit: (id: string, data: Partial<Surgery>) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}
const UpcomingSurgeries = ({
  surgeries,
  onEdit,
  onDelete,
  onView
}: UpcomingSurgeriesProps) => {
  // Sort surgeries by date and time
  const sortedSurgeries = [...surgeries].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = (time: string) => {
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  return <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">Upcoming Surgeries</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedSurgeries.map(surgery => <div key={surgery.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">
                  {surgery.patientName}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {surgery.surgeryName}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(surgery.id, surgery)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                  <EditIcon size={16} />
                </button>
                <button onClick={() => onDelete(surgery.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <TrashIcon size={16} />
                </button>
                <button onClick={() => onView(surgery.id)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLinkIcon size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-gray-500">Ref: {surgery.refNo}</span>
              <span className="text-gray-500">UHID: {surgery.uhid}</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <ClockIcon size={12} className="mr-1" />
              {formatDate(surgery.date)} at {formatTime(surgery.time)}
            </div>
          </div>)}
        {sortedSurgeries.length === 0 && <div className="p-4 text-center text-sm text-gray-500">
            No upcoming surgeries scheduled
          </div>}
      </div>
    </div>;
};
export default UpcomingSurgeries;