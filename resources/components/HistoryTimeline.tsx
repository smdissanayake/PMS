import React, { useState, useEffect } from 'react';
import { CalendarIcon, FileTextIcon, FilterIcon } from 'lucide-react';

interface PatientNote {
  id: number;
  clinicRefNo: string;
  type: string;
  comments: string;
  modifications: string;
  date: string;
  created_at: string;
  updated_at: string;
}

interface HistoryTimelineProps {
  clinicRefNo?: string;
  key?: number;
}

const HistoryTimeline = ({ clinicRefNo }: HistoryTimelineProps) => {
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    if (clinicRefNo) {
      fetchNotes();
    }
  }, [clinicRefNo]);

  const fetchNotes = async () => {
    if (!clinicRefNo) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/patient-notes?clinicRefNo=${encodeURIComponent(clinicRefNo)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient notes');
      }

      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching notes');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'spacial-not':
        return 'bg-purple-100 text-purple-800';
      case 'visit-note':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotes = notes.filter(note => {
    const noteDate = new Date(note.date);
    const filterDate = dateFilter ? new Date(dateFilter) : null;
    
    const matchesDate = !filterDate || noteDate.toDateString() === filterDate.toDateString();
    const matchesType = !typeFilter || note.type === typeFilter;
    
    return matchesDate && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <FilterIcon size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="dateFilter" className="text-sm text-gray-600">Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="typeFilter" className="text-sm text-gray-600">Type:</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="spacial-not">Spacial Note</option>
            <option value="visit-note">Visit Note</option>
          </select>
        </div>

        {(dateFilter || typeFilter) && (
          <button
            onClick={() => {
              setDateFilter('');
              setTypeFilter('');
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading notes...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notes found</div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm text-gray-500">{note.date}</span>
                          <h4 className="font-medium text-gray-900 mt-0.5">
                            {note.type === 'spacial-not' ? 'Spacial Note' : 'Visit Note'}
                          </h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyles(note.type)}`}>
                          {note.type === 'spacial-not' ? 'Spacial Note' : 'Visit Note'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Comments</h5>
                          <p className="text-sm text-gray-600 mt-1">{note.comments}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Modifications</h5>
                          <p className="text-sm text-gray-600 mt-1">{note.modifications}</p>
                        </div>
                      </div>

                      {/* <div className="mt-3 text-xs text-gray-500">
                        Last updated: {new Date(note.updated_at).toLocaleString()}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTimeline;