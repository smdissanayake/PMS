import React from 'react';
import { CalendarIcon, BedIcon, FileTextIcon } from 'lucide-react';
const WardAdmissionForm = ({
  onSubmit
}: {
  onSubmit: (data: any) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">Ward Admission</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Admission Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="date" name="admissionDate" id="admissionDate" required className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
              Ward
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="ward" name="ward" required className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select ward</option>
                <option value="3A">Ward 3A - General Medicine</option>
                <option value="3B">Ward 3B - Surgery</option>
                <option value="4A">Ward 4A - Cardiology</option>
                <option value="4B">Ward 4B - Neurology</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Admission
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea id="reason" name="reason" rows={4} required className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter the reason for admission..." />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
            Confirm Admission
          </button>
        </div>
      </form>
    </div>;
};
export default WardAdmissionForm;