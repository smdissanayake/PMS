import React, { useState, useEffect } from "react";
import { AlertCircleIcon } from "lucide-react";
import WardAdmissionForm from "./WardAdmissionForm";
import WardContentSection from "./WardContentSection";
import DischargeModal from "./DischargeModal";
import axios from "axios";

interface WardAdmissionProps {
    patientId: number | null;
    clinicRefNo: string;
}

// Add type for individual admission record
interface AdmissionRecord {
    id: number;
    admission_date: string;
    discharge_date: string;
    icu: string;
    ward: string;
    image_paths: string[];
    created_at: string; // Assuming this is used for the "May 25, 2025" date
    // Add any other relevant fields from your API response
}

const WardAdmission = ({ patientId, clinicRefNo }: WardAdmissionProps) => {
    const [showDischargeModal, setShowDischargeModal] = useState(false);
    const [activeAdmissions, setActiveAdmissions] = useState<AdmissionRecord[]>([]); // Store admission data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to check if the patient has any ward admissions
    const fetchActiveAdmissions = async () => { // Renamed for clarity
        if (!patientId) {
            setActiveAdmissions([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<AdmissionRecord[]>( // Expect an array of AdmissionRecord
                `/api/patients/${patientId}/ward-admissions`
            );
            setActiveAdmissions(response.data); // Store the actual data
        } catch (err) {
            console.error("Failed to fetch active admissions:", err);
            setError("Failed to fetch admission status.");
            setActiveAdmissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveAdmissions();
    }, [patientId]);

    const handleDischarge = (data: any) => {
        console.log("Discharge data:", data);
        setShowDischargeModal(false);
        // After discharge, re-fetch admissions
        fetchActiveAdmissions();
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                Loading ward admission status...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
        );
    }

    const hasActiveAdmission = activeAdmissions.length > 0; // Determine based on fetched data

    return (
        <div className="space-y-6">
            {/* Alert for active admission */}
            {hasActiveAdmission && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircleIcon
                                className="h-5 w-5 text-blue-400"
                                aria-hidden="true"
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Patient is currently admitted to a ward.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Main content */}
            <div className="grid gap-6">
                {!hasActiveAdmission ? (
                    <WardAdmissionForm
                        patientId={patientId}
                        clinicRefNo={clinicRefNo}
                    />
                ) : (
                    <>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDischargeModal(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Discharge Patient
                            </button>
                        </div>
                        <WardContentSection admissions={activeAdmissions} /> {/* Pass admissions data */}
                    </>
                )}
            </div>
            {/* Discharge Modal */}
            <DischargeModal
                isOpen={showDischargeModal}
                onClose={() => setShowDischargeModal(false)}
                onDischarge={handleDischarge}
            />
        </div>
    );
};

export default WardAdmission;
