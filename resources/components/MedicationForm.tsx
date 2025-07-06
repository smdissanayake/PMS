import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';


interface MedicationFormProps {
  onAdd: (medication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }) => void;
}


const MedicationForm = ({
  onAdd
}: MedicationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const commonMedications = [{
    name: 'Paracetamol 500mg',
    dosage: '500mg',
    frequency: 'Every 6 hours'
  }, {
    name: 'Amoxicillin 250mg',
    dosage: '250mg',
    frequency: 'Every 8 hours'
  }, {
    name: 'Ibuprofen 400mg',
    dosage: '400mg',
    frequency: 'Every 8 hours'
  }];


  const frequencyPresets = ['Once daily', 'Twice daily', 'Three times daily', 'Every 6 hours', 'Every 8 hours', 'As needed'];

  const durationPresets = ['3 days', '5 days', '7 days', '14 days', '1 month'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dosage && formData.frequency && formData.duration) {
      onAdd(formData);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };
  const handleQuickAdd = (medication: {
    name: string;
    dosage: string;
    frequency: string;
  }) => {
    setFormData({
      ...formData,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency
    });
  };
  return <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900">Add Medication</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Quick Add
          </div>
          <div className="flex flex-wrap gap-2">
            {commonMedications.map((med, index) => <button key={index} onClick={() => handleQuickAdd(med)} className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                {med.name}
              </button>)}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name
              </label>
              <input type="text" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage
              </label>
              <input type="text" value={formData.dosage} onChange={e => setFormData({
              ...formData,
              dosage: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select value={formData.frequency} onChange={e => setFormData({
              ...formData,
              frequency: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Select frequency</option>
                {frequencyPresets.map(freq => <option key={freq} value={freq}>
                    {freq}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select value={formData.duration} onChange={e => setFormData({
              ...formData,
              duration: e.target.value
            })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Select duration</option>
                {durationPresets.map(duration => <option key={duration} value={duration}>
                    {duration}
                  </option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <input type="text" value={formData.instructions} onChange={e => setFormData({
            ...formData,
            instructions: e.target.value
          })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Optional: Take with food, etc." />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
              <PlusIcon size={16} className="mr-1.5" />
              Add Medication
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default MedicationForm;