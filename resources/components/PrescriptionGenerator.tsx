import React, { useState } from 'react';
import { CalendarIcon, PrinterIcon, PlusIcon, XIcon } from 'lucide-react';
import MedicationForm from './MedicationForm';
import PrescriptionPreview from './PrescriptionPreview';
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}
const PrescriptionGenerator = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [nextVisit, setNextVisit] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const handleAddMedication = (medication: Medication) => {
    setMedications([...medications, {
      ...medication,
      id: Date.now().toString()
    }]);
  };
  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };
  const handleGeneratePrescription = () => {
    setShowPreview(true);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Prescription Generator
        </h3>
        <button onClick={handleGeneratePrescription} disabled={medications.length === 0} className={`
            inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
            transition-colors
            ${medications.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}>
          <PrinterIcon size={16} className="mr-1.5" />
          Generate Prescription
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MedicationForm onAdd={handleAddMedication} />
          {medications.length > 0 && <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-900">
                  Current Prescription
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {medications.map(med => <div key={med.id} className="p-4 flex items-start justify-between hover:bg-gray-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {med.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{med.frequency}</p>
                      {med.instructions && <p className="text-sm text-gray-500 italic">
                          {med.instructions}
                        </p>}
                      <p className="text-sm text-gray-500">
                        Duration: {med.duration}
                      </p>
                    </div>
                    <button onClick={() => handleRemoveMedication(med.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <XIcon size={16} />
                    </button>
                  </div>)}
              </div>
            </div>}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Next Appointment</h3>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-gray-400" />
              <input type="date" value={nextVisit} onChange={e => setNextVisit(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      </div>
      {showPreview && <PrescriptionPreview medications={medications} nextVisit={nextVisit} onClose={() => setShowPreview(false)} />}
    </div>;
};
export default PrescriptionGenerator;