import React from 'react';
import { CalendarIcon, PillIcon, FileTextIcon } from 'lucide-react';
interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  medications?: string[];
  type: 'check-up' | 'emergency' | 'follow-up';
}
interface HistoryTimelineProps {
  entries: TimelineEntry[];
}
const HistoryTimeline = ({
  entries
}: HistoryTimelineProps) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  return <div className="space-y-6">
      {entries.map((entry, index) => <div key={index} className="relative">
          {/* Timeline line */}
          {index !== entries.length - 1 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />}
          {/* Entry card */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm text-gray-500">{entry.date}</span>
                  <h4 className="font-medium text-gray-900 mt-0.5">
                    {entry.title}
                  </h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyles(entry.type)}`}>
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{entry.description}</p>
              {entry.medications && entry.medications.length > 0 && <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                    <PillIcon size={16} />
                    <span>Medications Prescribed</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.medications.map((med, idx) => <span key={idx} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                        {med}
                      </span>)}
                  </div>
                </div>}
            </div>
          </div>
        </div>)}
    </div>;
};
export default HistoryTimeline;