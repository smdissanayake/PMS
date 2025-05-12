import React, { useState } from 'react';
import { FileIcon, AlertTriangleIcon, CalendarIcon, BedIcon, PlusIcon, ExternalLinkIcon } from 'lucide-react';
import HistoryTimeline from './HistoryTimeline';
import AddNoteModal from './AddNoteModal';
import FileUploader from './FileUploader';
import ReportCard from './ReportCard';
import ViewerModal from './ViewerModal';
import OrderForm from './OrderForm';
import PrescriptionGenerator from './PrescriptionGenerator';
import WardAdmission from './WardAdmission';
import SurgeryNotesForm from './SurgeryNotesForm';
import PatientHistoryForm from './PatientHistoryForm';
interface TabContentProps {
  activeTab: string;
  patientId?: number | null; // Make optional
  patientClinicRefNo?: string | null; // Make optional
}
const TabContent = ({
  activeTab,
  patientId,
  patientClinicRefNo
}: TabContentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatientHistoryFormModalOpen, setIsPatientHistoryFormModalOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([{
    date: 'May 15, 2023',
    title: 'Annual Check-up',
    description: 'Regular check-up. Patient reports good compliance with maintenance inhaler. No acute asthma episodes in the past 3 months.',
    medications: ['Albuterol Inhaler', 'Loratadine 10mg'],
    type: 'check-up'
  }, {
    date: 'March 3, 2023',
    title: 'Emergency Visit',
    description: 'Acute asthma exacerbation. Patient presented with wheezing and shortness of breath. Responded well to nebulizer treatment.',
    medications: ['Albuterol Nebulizer', 'Prednisone 40mg'],
    type: 'emergency'
  }, {
    date: 'January 15, 2023',
    title: 'Follow-up Visit',
    description: 'Post-emergency follow-up. Symptoms have improved. Adjusted medication dosage.',
    medications: ['Albuterol Inhaler', 'Fluticasone 250mcg'],
    type: 'follow-up'
  }]);
  const handleAddNote = (newNote: any) => {
    setHistoryEntries([newNote, ...historyEntries]);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Patient History
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsPatientHistoryFormModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                >
                  <ExternalLinkIcon size={16} className="mr-1.5" />
                  Open Full History Form
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon size={16} className="mr-1.5" />
                  New Note
                </button>
              </div>
            </div>
            {/* PatientHistoryForm is now in a modal */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Medical Summary
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Patient has a history of asthma and seasonal allergies.
                    Regular follow-up maintained. Last acute episode: March
                    2023.
                  </p>
                </div>
              </div>
            </div>
            <HistoryTimeline entries={historyEntries} />
            <AddNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddNote} />

                        {isPatientHistoryFormModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl transform transition-all flex flex-col">
                                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            Patient Full History Form
                                        </h4>
                                        <button
                                            onClick={() =>
                                                setIsPatientHistoryFormModalOpen(
                                                    false
                                                )
                                            }
                                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                                        <PatientHistoryForm />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "investigations":
                return (
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Investigations
                        </h3>
                        <InvestigationsTab />
                    </div>
                );
            case "orders":
                return (
                    <div className="p-6">
                        <OrderForm />
                    </div>
                );
            case "drugs":
                return <PrescriptionGenerator />;
            case "ward":
                return <WardAdmission />;
            case "surgery":
                return <SurgeryNotesForm />;
            default:
                return <div className="p-4">Select a tab to view content</div>;
        }
    };
    return (
        <div className="p-6 transition-all duration-300 ease-in-out">
            {renderContent()}
        </div>
    );
};
export default TabContent;
