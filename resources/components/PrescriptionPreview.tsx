import React from 'react';
import { XIcon, PrinterIcon } from 'lucide-react';
interface PrescriptionPreviewProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  nextVisit: string;
  onClose: () => void;
}
const PrescriptionPreview = ({
  medications,
  nextVisit,
  onClose
}: PrescriptionPreviewProps) => {
  const handlePrint = () => {
    window.print();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl m-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Prescription Preview
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
              <PrinterIcon size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <XIcon size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Hospital/Doctor Info */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              City General Hospital
            </h2>
            <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
            <p className="text-sm text-gray-600">Medical License: 12345</p>
          </div>
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Patient: Sarah Johnson</p>
              <p className="text-gray-600">Age: 27</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600">ID: 970123-45-6789</p>
            </div>
          </div>
          {/* Rx Symbol */}
          <div className="text-2xl font-serif text-gray-800 border-b border-gray-200 pb-2">
            ℞
          </div>
          {/* Medications */}
          <div className="space-y-4">
            {medications.map((med, index) => <div key={med.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500">{index + 1}.</span>
                  <div>
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.dosage} - {med.frequency} - {med.duration}
                    </p>
                    {med.instructions && <p className="text-sm text-gray-500 italic mt-1">
                        Note: {med.instructions}
                      </p>}
                  </div>
                </div>
              </div>)}
          </div>
          {/* Next Visit */}
          {nextVisit && <div className="border-t border-gray-200 pt-4 mt-6">
              <p className="text-sm text-gray-600">
                Next appointment: {new Date(nextVisit).toLocaleDateString()}
              </p>
            </div>}
          {/* Signature */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <div className="text-right">
              <div className="h-12 border-b border-gray-300 w-40 mb-1"></div>
              <p className="text-sm text-gray-600">Doctor's Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PrescriptionPreview;