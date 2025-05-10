import React, { useState } from 'react';
import { ArrowLeftIcon, SaveIcon, AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  address: string;
  clinicRefNo: string;
  nic: string;
  uhid: string;
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
    age: '',
    gender: '',
    address: '',
    clinicRefNo: '',
    nic: '',
    uhid: '',
    category: ''
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});
    setSuccessMessage(null);

    try {
      const response = await fetch('/patients', { // Changed URL from /api/patients
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          setValidationErrors(responseData.errors);
          setError('Please correct the validation errors.');
        } else {
          setError(responseData.message || 'An unexpected error occurred. Please try again.');
        }
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      setSuccessMessage(responseData.message || 'Patient registered successfully!');
      setFormData(initialFormData); // Reset form
      if (onSuccess) {
        onSuccess();
      }
      // Optionally, redirect or close modal after a delay
      // setTimeout(() => {
      //   onCancel();
      // }, 2000);

    } catch (err) {
      console.error('Submission failed:', err);
      if (!error && !Object.keys(validationErrors).length) {
        setError('Failed to submit the form. Please check your network connection and try again.');
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">Basic patient details</p>
          </div>
          <div className="p-6">
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-300 text-green-700 flex items-center">
                <CheckCircle2Icon size={18} className="mr-2" />
                {successMessage}
              </div>
            )}
            {error && !Object.keys(validationErrors).length && ( // Show general error if no specific validation errors
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-300 text-red-700 flex items-center">
                <AlertCircleIcon size={18} className="mr-2" />
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.firstName && <p className="text-xs text-red-500 mt-1">{validationErrors.firstName.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.lastName && <p className="text-xs text-red-500 mt-1">{validationErrors.lastName.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.age ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.age && <p className="text-xs text-red-500 mt-1">{validationErrors.age.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.gender ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white`} required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && <p className="text-xs text-red-500 mt-1">{validationErrors.gender.join(', ')}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`w-full px-4 py-2.5 border ${validationErrors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.address && <p className="text-xs text-red-500 mt-1">{validationErrors.address.join(', ')}</p>}
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
                <input type="text" name="clinicRefNo" value={formData.clinicRefNo} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.clinicRefNo ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.clinicRefNo && <p className="text-xs text-red-500 mt-1">{validationErrors.clinicRefNo.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIC Number
                </label>
                <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.nic ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.nic && <p className="text-xs text-red-500 mt-1">{validationErrors.nic.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UHID
                </label>
                <input type="text" name="uhid" value={formData.uhid} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.uhid ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`} required />
                {validationErrors.uhid && <p className="text-xs text-red-500 mt-1">{validationErrors.uhid.join(', ')}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select name="category" value={formData.category} onChange={handleInputChange} className={`w-full px-4 py-2.5 border ${validationErrors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white`} required>
                  <option value="">Select Category</option>
                  <option value="Brain Tumors">Brain Tumors</option>
                  <option value="Brain And Spinal Tumors">Brain And Spinal Tumors</option>
                  <option value="Back Pain">Back Pain</option>
                  <option value="Neck Pain">Neck Pain</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Other">Other</option>
                </select>
                {validationErrors.category && <p className="text-xs text-red-500 mt-1">{validationErrors.category.join(', ')}</p>}
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-end space-x-4">
              <button type="button" onClick={onCancel} disabled={isLoading} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center disabled:opacity-50">
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <SaveIcon size={18} className="mr-2" />
                )}
                {isLoading ? 'Saving...' : 'Register Patient'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
