import React, { useState } from "react";
import {
    FileIcon,
    AlertTriangleIcon,
    CalendarIcon,
    BedIcon,
    PlusIcon,
    ExternalLinkIcon,
    XIcon,
} from "lucide-react";
import HistoryTimeline from "./HistoryTimeline";
import AddNoteModal from "./AddNoteModal";
import FileUploader from "./FileUploader";
import ReportCard from "./ReportCard";
import ViewerModal from "./ViewerModal";
import OrderForm from "./OrderForm";
import PrescriptionGenerator from "./PrescriptionGenerator";
import WardAdmission from "./WardAdmission";
import SurgeryNotesForm from "./SurgeryNotesForm";
import PatientHistoryForm from "./PatientHistoryForm";
import { InvestigationsTab } from "./InvestigationsTab";
interface TabContentProps {
    activeTab: string;
    patientData?: any | null;
    patientId?: number | null; // Make optional
    patientClinicRefNo?: string | null; // Make optional
    onRecordSaved?: (patientId: number) => void;
}
const TabContent = ({
    activeTab,
    patientData,
    patientId,
    patientClinicRefNo,
    onRecordSaved,
}: TabContentProps) => {

   const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPatientHistoryFormModalOpen, setIsPatientHistoryFormModalOpen] =
        useState(false);
    const [refreshNotes, setRefreshNotes] = useState(0);

    const handleAddNote = (newNote: any) => {
        if (typeof patientId === "number") {
            onRecordSaved?.(patientId);
        }
    };

    const handleNoteAdded = () => {
        setRefreshNotes((prev) => prev + 1);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "history":
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Patient History
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() =>
                                        setIsPatientHistoryFormModalOpen(true)
                                    }
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    <ExternalLinkIcon
                                        size={16}
                                        className="mr-1.5"
                                    />
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
                                        Patient has a history of asthma and
                                        seasonal allergies. Regular follow-up
                                        maintained. Last acute episode: March
                                        2023.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <HistoryTimeline
                            clinicRefNo={patientClinicRefNo || undefined}
                            key={refreshNotes}
                        />
                        <AddNoteModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleAddNote}
                            patientData={patientData}
                            onNoteAdded={handleNoteAdded}
                        />
                        {isPatientHistoryFormModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Patient History Form
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setIsPatientHistoryFormModalOpen(
                                                    false
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <XIcon size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <PatientHistoryForm
                                            patientId={patientId}
                                            patientClinicRefNo={
                                                patientClinicRefNo
                                            }
                                            onRecordSaved={onRecordSaved}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "investigations":
                return <InvestigationsTab />;
            case "orders":
                return (
                    <OrderForm
                        patientId={patientId}
                        patientClinicRefNo={patientClinicRefNo}
                    />
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
