import React, { useState } from 'react';
import { XIcon, SearchIcon, CalendarIcon } from 'lucide-react';

interface Surgery {
  patientName: string;
  refNo: string;
  uhid: string;
  surgeryName: string;
  date: string;
  time: string;
}

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Surgery) => void;
  initialValues?: Partial<Surgery> | null;
}

const AddSurgeryModal: React.FC<AddSurgeryModalProps> = ({ isOpen, onClose, onSubmit, initialValues }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    refNo: '',
    uhid: '',
    surgeryName: '',
    date: '',
    time: ''
  });

  // Sync initialValues to formData when modal opens for edit
  React.useEffect(() => {
    if (isOpen && initialValues) {
      setFormData({
        patientName: initialValues.patientName || '',
        refNo: initialValues.refNo || '',
        uhid: initialValues.uhid || '',
        surgeryName: initialValues.surgeryName || '',
        date: initialValues.date || '',
        time: initialValues.time || '',
      });
      setSearchQuery(initialValues.refNo || '');
    } else if (isOpen && !initialValues) {
      setFormData({
        patientName: '',
        refNo: '',
        uhid: '',
        surgeryName: '',
        date: '',
        time: ''
      });
      setSearchQuery('');
    }
  }, [isOpen, initialValues]);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: number; clinicRefNo: string; chb?: string; name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchType, setSearchType] = useState('clinicRefNo');

  // Add debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Add fetchSuggestions function
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/patients/search-suggestions?query=${encodeURIComponent(query)}&type=${encodeURIComponent(searchType)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      setSuggestions([]);
    }
  };

  // Create debounced version of fetchSuggestions
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Add handleSuggestionClick function
  const handleSuggestionClick = async (suggestion: { id: number; clinicRefNo: string; chb?: string; name: string }) => {
    setSearchQuery(searchType === 'clinicRefNo' ? suggestion.clinicRefNo : searchType === 'chb' ? (suggestion.chb || '') : suggestion.name);
    setShowSuggestions(false);
    setIsLoadingSearch(true);

    try {
      const response = await fetch(`/patients/search-by-clinic-ref?clinicRefNo=${encodeURIComponent(suggestion.clinicRefNo)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      const patientData = await response.json();
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          refNo: patientData.clinicRefNo,
          patientName: `${patientData.firstName} ${patientData.lastName}`,
          uhid: patientData.uhid || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData as Surgery);
      // Reset form and close modal on success
      setFormData({
        patientName: '',
        refNo: '',
        uhid: '',
        surgeryName: '',
        date: '',
        time: ''
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule surgery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl min-w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedule Surgery</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Patient
            </label>
            <div className="flex items-center gap-2 ">
              <select
                value={searchType}
                onChange={e => {
                  setSearchType(e.target.value);
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm "
                style={{ minWidth: 110 }}
              >
                <option value="clinicRefNo">Clinic Ref No</option>
                <option value="chb">CHB</option>
                <option value="name">Name</option>
              </select>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedFetchSuggestions(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={`Search by ${searchType === 'clinicRefNo' ? 'Clinic Ref No' : searchType === 'chb' ? 'CHB' : 'Patient Name'}...`}
                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                      >
                        <div className="font-medium text-gray-900">
                          {searchType === 'clinicRefNo' && suggestion.clinicRefNo}
                          {searchType === 'chb' && (suggestion.chb || '')}
                          {searchType === 'name' && suggestion.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {searchType !== 'clinicRefNo' && `Clinic Ref: ${suggestion.clinicRefNo}`}
                          {searchType !== 'chb' && `CHB: ${suggestion.chb || ''}`}
                          {searchType !== 'name' && `Name: ${suggestion.name}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input 
                type="text" 
                value={formData.patientName} 
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UHID
              </label>
              <input 
                type="text" 
                value={formData.uhid} 
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surgery Name
            </label>
            <input 
              type="text" 
              value={formData.surgeryName} 
              onChange={e => setFormData({
                ...formData,
                surgeryName: e.target.value
              })} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Enter surgery name"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Date
              </label>
              <div className="relative">
                <CalendarIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({
                    ...formData,
                    date: e.target.value
                  })} 
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Time
              </label>
              <input 
                type="time" 
                value={formData.time} 
                onChange={e => setFormData({
                  ...formData,
                  time: e.target.value
                })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Surgery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSurgeryModal;