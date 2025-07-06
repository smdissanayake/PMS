import React from 'react';
import { XIcon } from 'lucide-react';
interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDischarge: (data: any) => void;
}
const DischargeModal = ({
  isOpen,
  onClose,
  onDischarge
}: DischargeModalProps) => {
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onDischarge(data);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Discharge Patient
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="dischargeDate" className="block text-sm font-medium text-gray-700 mb-1">
              Discharge Date
            </label>
            <input type="date" id="dischargeDate" name="dischargeDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="dischargeSummary" className="block text-sm font-medium text-gray-700 mb-1">
              Discharge Summary
            </label>
            <textarea id="dischargeSummary" name="dischargeSummary" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter discharge summary and follow-up instructions..." />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors">
              Confirm Discharge
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default DischargeModal;