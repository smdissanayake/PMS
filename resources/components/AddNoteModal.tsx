import React, { useState } from 'react';
import { XIcon, PlusIcon } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patientData?: any | null;
  onNoteAdded?: () => void;
}

const AddNoteModal = ({
  isOpen,
  onClose,
  onSubmit,
  patientData,
  onNoteAdded
}: AddNoteModalProps) => {
  const [formData, setFormData] = useState({
    type: 'select',
    comments: '',
    modifications: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    type?: string;
    comments?: string;
    modifications?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      type?: string;
      comments?: string;
      modifications?: string;
    } = {};

    if (formData.type === 'select') {
      errors.type = 'Please select a note type';
    }

    if (!formData.comments.trim()) {
      errors.comments = 'Comments cannot be empty';
    }

    if (!formData.modifications.trim()) {
      errors.modifications = 'Modifications cannot be empty';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

      const response = await fetch('/patient-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          clinicRefNo: patientData?.clinicRefNo,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create patient note');
      }

      // Reset form first
      setFormData({
        type: 'select',
        comments: '',
        modifications: ''
      });
      
      // Call onSubmit with the new note data
      onSubmit(data.patientNote);
      
      // Call onNoteAdded callback to refresh the notes list
      onNoteAdded?.();
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Note</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select 
              value={formData.type} 
              onChange={e => {
                setFormData({
                  ...formData,
                  type: e.target.value
                });
                setValidationErrors(prev => ({ ...prev, type: undefined }));
              }} 
              className={`w-full px-3 py-2 border ${validationErrors.type ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              disabled={isSubmitting}
            >
              <option value="select">Select</option>
              <option value="spacial-not">Spacial Note</option>
              <option value="visit-note">Visit Note</option>
            </select>
            {validationErrors.type && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <input 
              type="text" 
              value={formData.comments} 
              onChange={e => {
                setFormData({
                  ...formData,
                  comments: e.target.value
                });
                setValidationErrors(prev => ({ ...prev, comments: undefined }));
              }} 
              className={`w-full px-3 py-2 border ${validationErrors.comments ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              disabled={isSubmitting}
            />
            {validationErrors.comments && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.comments}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modifications
            </label>
            <textarea 
              value={formData.modifications} 
              onChange={e => {
                setFormData({
                  ...formData,
                  modifications: e.target.value
                });
                setValidationErrors(prev => ({ ...prev, modifications: undefined }));
              }} 
              className={`w-full px-3 py-2 border ${validationErrors.modifications ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows={4} 
              disabled={isSubmitting}
            />
            {validationErrors.modifications && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.modifications}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <PlusIcon size={16} className="mr-1" />
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
