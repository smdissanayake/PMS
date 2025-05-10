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
}
const AddSurgeryModal = ({
  isOpen,
  onClose,
  onSubmit
}: AddSurgeryModalProps) => {
  const [formData, setFormData] = useState<Surgery>({
    patientName: '',
    refNo: '',
    uhid: '',
    surgeryName: '',
    date: '',
    time: ''
  });
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      patientName: '',
      refNo: '',
      uhid: '',
      surgeryName: '',
      date: '',
      time: ''
    });
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Schedule New Surgery
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <input type="text" value={formData.patientName} onChange={e => setFormData({
            ...formData,
            patientName: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinic Reference No
              </label>
              <input type="text" value={formData.refNo} onChange={e => setFormData({
              ...formData,
              refNo: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UHID
              </label>
              <input type="text" value={formData.uhid} onChange={e => setFormData({
              ...formData,
              uhid: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surgery Name
            </label>
            <select value={formData.surgeryName} onChange={e => setFormData({
            ...formData,
            surgeryName: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
              <option value="">Select surgery type</option>
              <option value="Craniotomy">Craniotomy</option>
              <option value="Spinal Fusion">Spinal Fusion</option>
              <option value="Brain Tumor Removal">Brain Tumor Removal</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Date
              </label>
              <div className="relative">
                <CalendarIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="date" value={formData.date} onChange={e => setFormData({
                ...formData,
                date: e.target.value
              })} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Time
              </label>
              <input type="time" value={formData.time} onChange={e => setFormData({
              ...formData,
              time: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
              Schedule Surgery
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddSurgeryModal;