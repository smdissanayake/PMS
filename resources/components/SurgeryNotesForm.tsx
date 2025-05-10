import React, { useState } from 'react';
import { CalendarIcon, FileTextIcon, SaveIcon } from 'lucide-react';
import PathologyUploader from './PathologyUploader';
const surgeryTypes = ['General Surgery', 'Orthopedic Surgery', 'Cardiac Surgery', 'Neurosurgery', 'Plastic Surgery', 'Emergency Surgery', 'Minimally Invasive Surgery'];
const SurgeryNotesForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    notes: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Surgery note data:', formData);
    // Handle form submission
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Surgery Notes</h3>
        <button onClick={handleSubmit} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
          <SaveIcon size={16} className="mr-1.5" />
          Save Note
        </button>
      </div>
      <div className="grid gap-6">
        {/* Main Surgery Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h4 className="font-medium text-gray-900">Surgery Details</h4>
          </div>
          <form className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="surgeryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Surgery Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="date" id="surgeryDate" name="surgeryDate" value={formData.date} onChange={e => setFormData({
                  ...formData,
                  date: e.target.value
                })} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>
              <div>
                <label htmlFor="surgeryType" className="block text-sm font-medium text-gray-700 mb-1">
                  Surgery Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="h-5 w-5 text-gray-400" />
                  </div>
                  <select id="surgeryType" name="surgeryType" value={formData.type} onChange={e => setFormData({
                  ...formData,
                  type: e.target.value
                })} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">Select surgery type</option>
                    {surgeryTypes.map(type => <option key={type} value={type}>
                        {type}
                      </option>)}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="surgeryNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea id="surgeryNotes" name="surgeryNotes" rows={6} value={formData.notes} onChange={e => setFormData({
                ...formData,
                notes: e.target.value
              })} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter detailed surgery notes..." required />
              </div>
            </div>
          </form>
        </div>
        {/* Pathology Reports Section */}
        <PathologyUploader />
      </div>
    </div>;
};
export default SurgeryNotesForm;