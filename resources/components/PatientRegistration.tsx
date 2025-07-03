import React, { useState } from 'react';
import { ArrowLeftIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon, SearchIcon } from 'lucide-react';
import Swal from 'sweetalert2';

interface FormData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  address: string;
  clinicRefNo: string;
  nic: string;
  uhid: string;
  chb: string;
  category: string;
}

interface PatientRegistrationProps {
  onCancel: () => void;
  onSuccess?: () => void; // Optional: callback on successful registration
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onCancel,
  onSuccess
}) => {
  const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    address: '',
    clinicRefNo: '',
    nic: '',
    uhid: '',
    chb: '',
    category: ''
  };
  
  // Form states
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Search states
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("clinicRefNo");
  const [suggestions, setSuggestions] = useState<Array<{ id: number; clinicRefNo: string; chb: string; name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // Debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch suggestions function
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `/patients/search-suggestions?query=${encodeURIComponent(query)}&type=${encodeURIComponent(searchType)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
          },
        }
      );

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Create debounced version of fetchSuggestions
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle search function
  const handleSearch = async (selectedValue?: string) => {
    const searchValue = selectedValue || searchQuery;

    if (!searchValue.trim()) {
      setError(`Please enter a ${searchType === 'clinicRefNo' ? 'Clinic Reference Number' : searchType === 'chb' ? 'CHB Number' : 'Patient Name'}.`);
      return;
    }

    setIsLoadingSearch(true);
    setError(null);
    setShowSuggestions(false);

    try {
      let endpoint = '';
      let paramName = '';
      
      // Determine endpoint and parameter name based on search type
      switch (searchType) {
        case 'chb':
          endpoint = '/patients/search-by-chb';
          paramName = 'chb';
          break;
        case 'name':
          endpoint = '/patients/search-by-name';
          paramName = 'name';
          break;
        case 'clinicRefNo':
        default:
          endpoint = '/patients/search-by-clinic-ref';
          paramName = 'clinicRefNo';
          break;
      }

      const response = await fetch(
        `${endpoint}?${paramName}=${encodeURIComponent(searchValue)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || `Error: ${response.status}`);
      } else {
        // Populate form with patient data
        setFormData({
          firstName: result.firstName,
          lastName: result.lastName,
          birthday: result.birthday ? result.birthday.replace(/-/g, '/') : '',
          gender: result.gender,
          address: result.address,
          clinicRefNo: result.clinicRefNo,
          nic: result.nic,
          uhid: result.uhid,
          chb: result.chb,
          category: result.category
        });
        setSelectedPatientId(result.id);
        setIsUpdateMode(true);
        setSearchQuery(searchValue);
        
        Swal.fire({
          icon: 'success',
          title: 'Patient Found!',
          text: 'Patient details loaded. You can now update the information.',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: {
    id: number;
    clinicRefNo: string;
    chb: string;
    name: string;
  }) => {
    // Use the appropriate field based on search type
    let searchValue = '';
    switch (searchType) {
      case 'chb':
        searchValue = suggestion.chb;
        break;
      case 'name':
        searchValue = suggestion.name;
        break;
      case 'clinicRefNo':
      default:
        searchValue = suggestion.clinicRefNo;
        break;
    }
    setSearchQuery(searchValue);
    handleSearch(searchValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});
    setSuccessMessage(null);

    try {
      const method = isUpdateMode ? 'PUT' : 'POST';
      const url = isUpdateMode ? `/patients/${selectedPatientId}` : '/patients';
      
      // For update, exclude clinicRefNo from the data
      const submitData = isUpdateMode 
        ? { ...formData, clinicRefNo: undefined } 
        : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          setValidationErrors(responseData.errors);
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please correct the validation errors.',
            confirmButtonColor: '#3085d6',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: responseData.message || 'An unexpected error occurred. Please try again.',
            confirmButtonColor: '#3085d6',
          });
        }
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: responseData.message || (isUpdateMode ? 'Patient updated successfully!' : 'Patient registered successfully!'),
        confirmButtonColor: '#3085d6',
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset form and states
      setFormData(initialFormData);
      setIsUpdateMode(false);
      setSelectedPatientId(null);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error('Submission failed:', err);
      if (!error && !Object.keys(validationErrors).length) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please correct the validation errors.',
          confirmButtonColor: '#3085d6',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setValidationErrors({});
    setError(null);
    setSuccessMessage(null);
    setIsUpdateMode(false);
    setSelectedPatientId(null);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSwitchToCreate = () => {
    setIsUpdateMode(false);
    setSelectedPatientId(null);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setFormData(initialFormData);
    setError(null);
    setValidationErrors({});
  };

  const handleSwitchToUpdate = () => {
    setIsUpdateMode(true);
    setFormData(initialFormData);
    setError(null);
    setValidationErrors({});
  };

  return (
    <div>
      {/* Mode Selection */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            {isUpdateMode ? 'Update Patient' : 'Register New Patient'}
          </h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleSwitchToCreate}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isUpdateMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              New Patient
            </button>
            <button
              type="button"
              onClick={handleSwitchToUpdate}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isUpdateMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Update Patient
            </button>
          </div>
        </div>

        {/* Search Section - Only show in update mode */}
        {isUpdateMode && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Search for a patient to update their information:
            </p>
            <div className="flex items-center space-x-2">
              {/* Search Type Dropdown */}
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
              >
                <option value="clinicRefNo">Clinic Ref No</option>
                <option value="chb">CHB</option>
                <option value="name">Name</option>
              </select>
              
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedFetchSuggestions(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={`Search by ${searchType === 'clinicRefNo' ? 'Clinic Ref No' : searchType === 'chb' ? 'CHB' : 'Patient Name'}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <div className="font-medium text-gray-900">
                          {searchType === 'clinicRefNo' && suggestion.clinicRefNo}
                          {searchType === 'chb' && suggestion.chb}
                          {searchType === 'name' && suggestion.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {searchType !== 'clinicRefNo' && `Clinic Ref: ${suggestion.clinicRefNo}`}
                          {searchType !== 'chb' && `CHB: ${suggestion.chb}`}
                          {searchType !== 'name' && `Name: ${suggestion.name}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isLoadingSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
              >
                {isLoadingSearch ? "Searching..." : "Search"}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              {isUpdateMode ? 'Update Patient Information' : 'Personal Information'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isUpdateMode ? 'Update patient details (Clinic Reference Number cannot be changed)' : 'Basic patient details'}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday (YYYY/MM/DD)
                </label>
                <input 
                  type="text" 
                  name="birthday" 
                  value={formData.birthday || ''} 
                  onChange={handleInputChange} 
                  placeholder="YYYY/MM/DD"
                  pattern="\d{4}/\d{2}/\d{2}"
                  className={`w-full px-4 py-2.5 border ${validationErrors.birthday ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.gender ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white`}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`w-full px-4 py-2.5 border ${validationErrors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Medical Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Patient identification details
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Reference Number
                </label>
                <input 
                  type="text" 
                  name="clinicRefNo" 
                  value={formData.clinicRefNo} 
                  onChange={handleInputChange} 
                  className={`w-full px-4 py-2.5 border ${validationErrors.clinicRefNo ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} 
                  required 
                  readOnly={isUpdateMode}
                  style={{ backgroundColor: isUpdateMode ? '#f3f4f6' : 'white' }}
                />
                {validationErrors.clinicRefNo && <p className="text-xs text-red-500 mt-1">{validationErrors.clinicRefNo.join(', ')}</p>}
                {isUpdateMode && <p className="text-xs text-gray-500 mt-1">Clinic Reference Number cannot be changed</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIC Number
                </label>
                <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.nic ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UHID
                </label>
                <input 
                  type="text" 
                  name="uhid" 
                  value={formData.uhid} 
                  onChange={handleInputChange} 
                  className={`w-full px-4 py-2.5 border ${validationErrors.uhid ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} 
                  style={{ backgroundColor: 'white' }}
                />
                {validationErrors.uhid && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.uhid[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CHB
                </label>
                <input type="text" name="chb" value={formData.chb} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.chb ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select name="category" value={formData.category} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white`}>
                  <option value="">Select Category</option>
                  
                  <option value="Neck Pain">Neck Pain</option>
                  <option value="Back Pain">Back Pain</option>
                  <option value="Headache">Headache</option>
                  <option value="Vascular">Vascular</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Brain Tumors">Brain Tumors</option>
                  <option value="Spinal Tumors">Spinal Tumors</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-end space-x-4">
              <button type="button" onClick={handleClear} disabled={isLoading} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:opacity-50">
                Clear
              </button>
              <button type="submit" disabled={isLoading || (isUpdateMode && !selectedPatientId)} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center disabled:opacity-50">
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <SaveIcon size={18} className="mr-2" />
                )}
                {isLoading ? 'Saving...' : (isUpdateMode ? 'Update Patient' : 'Register Patient')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
