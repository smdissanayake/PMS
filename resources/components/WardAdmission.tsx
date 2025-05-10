import React, { useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import WardAdmissionForm from './WardAdmissionForm';
import WardContentSection from './WardContentSection';
import DischargeModal from './DischargeModal';
const WardAdmission = () => {
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState<'pending' | 'admitted' | null>(null);
  const handleAdmission = (data: any) => {
    console.log('Admission data:', data);
    setAdmissionStatus('admitted');
  };
  const handleDischarge = (data: any) => {
    console.log('Discharge data:', data);
    setShowDischargeModal(false);
    setAdmissionStatus(null);
  };
  return <div className="space-y-6">
      {/* Alert for active admission */}
      {admissionStatus === 'admitted' && <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Patient is currently admitted to Ward 3A
              </p>
            </div>
          </div>
        </div>}
      {/* Main content */}
      <div className="grid gap-6">
        {admissionStatus !== 'admitted' ? <WardAdmissionForm onSubmit={handleAdmission} /> : <>
            <div className="flex justify-end">
              <button onClick={() => setShowDischargeModal(true)} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                Discharge Patient
              </button>
            </div>
            <WardContentSection />
          </>}
      </div>
      {/* Discharge Modal */}
      <DischargeModal isOpen={showDischargeModal} onClose={() => setShowDischargeModal(false)} onDischarge={handleDischarge} />
    </div>;
};
export default WardAdmission;