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
  medications?: any[];
  next_appointment_date?: string;
  item_name?: string;
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
          <div className="max-h-[720px] overflow-y-auto p-4 space-y-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <FileTextIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm text-gray-500 font-medium">{note.date}</span>
                          <h4 className="font-semibold text-gray-900 mt-1 text-lg">
                            {note.type === 'spacial-not' ? 'Spacial Note' : 'Visit Note'}
                          </h4>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeStyles(note.type)}`}>
                          {note.type === 'spacial-not' ? 'Spacial Note' : 'Visit Note'}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">Comments</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">{note.comments}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">Modifications</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">{note.modifications}</p>
                        </div>

                        {/* Prescription Details */}
                        {note.medications && (() => {
                          try {
                            const medications = typeof note.medications === 'string' 
                              ? JSON.parse(note.medications) 
                              : note.medications;
                              
                            if (Array.isArray(medications) && medications.length > 0) {
                              return (
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <h5 className="text-sm font-semibold text-blue-700 mb-3">Prescription</h5>
                                  <div className="space-y-3">
                                    {medications.map((med: any, index: number) => (
                                      <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-sm font-semibold text-blue-600">{med.name}</span>
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            {med.dosage}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                          <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                                          <p><span className="font-medium">Duration:</span> {med.duration}</p>
                                        </div>
                                        {med.instructions && (
                                          <p className="mt-2 text-sm text-gray-600 italic border-t border-gray-100 pt-2">
                                            <span className="font-medium">Instructions:</span> {med.instructions}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          } catch (error) {
                            console.error('Error parsing medications:', error);
                            return null;
                          }
                        })()}

                        {/* Special Items */}
                        {note.item_name && note.item_name !== 'null' && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-purple-700 mb-2">Special Items</h5>
                            <p className="text-sm text-purple-600">{note.item_name}</p>
                          </div>
                        )}

                        {/* Next Appointment Date */}
                        {note.next_appointment_date && note.next_appointment_date !== 'null' && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-green-700 mb-2">Next Appointment</h5>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-green-600" />
                              <p className="text-sm text-green-600">
                                {new Date(note.next_appointment_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
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