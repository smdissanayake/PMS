import React, { useState } from 'react';
import { XIcon, PlusIcon } from 'lucide-react';
interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}
const AddNoteModal = ({
  isOpen,
  onClose,
  onSubmit
}: AddNoteModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'check-up',
    description: '',
    medications: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      medications: formData.medications.split(',').map(med => med.trim()).filter(med => med),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Note</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input type="text" value={formData.title} onChange={e => setFormData({
            ...formData,
            title: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="check-up">Check-up</option>
              <option value="emergency">Emergency</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications (comma-separated)
            </label>
            <input type="text" value={formData.medications} onChange={e => setFormData({
            ...formData,
            medications: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Amoxicillin 500mg, Ibuprofen 400mg" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors inline-flex items-center">
              <PlusIcon size={16} className="mr-1" />
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddNoteModal;