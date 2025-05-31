import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import StatisticsCards from "./StatisticsCards";
import AddDrugModal from "./AddDrugModal";
import axios from "axios"; // Import axios
import Swal from "sweetalert2"; // Import SweetAlert2

interface Patient {
    id: number;
    clinicRefNo: string;
    firstName: string;
    lastName: string;
    name: string;
}

const DashboardContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // For Add Drug Modal
    const [isFormUploadModalOpen, setIsFormUploadModalOpen] = useState(false); // For Form Upload Modal
    const [clinicRefNo, setClinicRefNo] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [patientClinicRefNos, setPatientClinicRefNos] = useState<Patient[]>(
        []
    );
    const [filteredClinicRefNos, setFilteredClinicRefNos] = useState<Patient[]>(
        []
    );
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (isFormUploadModalOpen) {
            fetchPatientClinicRefNos();
        }
    }, [isFormUploadModalOpen]);

    const fetchPatientClinicRefNos = async () => {
        try {
            const response = await axios.get("/api/patients");
            const patientsWithNames = response.data.map((patient: any) => ({
                ...patient,
                name: `${patient.firstName} ${patient.lastName}`
            }));
            setPatientClinicRefNos(patientsWithNames);
            setFilteredClinicRefNos(patientsWithNames);
        } catch (error) {
            console.error("Error fetching patient clinic ref numbers:", error);
            if (axios.isAxiosError(error)) {
                console.error(
                    "Axios error details:",
                    error.response?.data,
                    error.response?.status,
                    error.response?.headers
                );
            }
            Swal.fire(
                "Error!",
                "Failed to load patient clinic numbers. Please check console for details.",
                "error"
            );
        }
    };

    const handleAddDrugClick = () => {
        console.log("Add Drug button clicked");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddDrug = (drugDetails: any) => {
        console.log("Adding drug:", drugDetails);
    };

    const handleFormUploadClick = () => {
        console.log("Add Form button clicked");
        setIsFormUploadModalOpen(true);
    };

    const handleCloseFormUploadModal = () => {
        setIsFormUploadModalOpen(false);
        setClinicRefNo("");
        setSelectedFile(null);
        setFilteredClinicRefNos([]); // Clear filtered list on close
        setShowDropdown(false); // Hide dropdown on close
    };

    const handleAddForm = async () => {
        if (!clinicRefNo || !selectedFile) {
            Swal.fire(
                "Warning!",
                "Please enter Clinic Ref No and upload a file.",
                "warning"
            );
            return;
        }

        const formData = new FormData();
        formData.append("clinic_ref_no", clinicRefNo);
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(
                "/api/patient-reports",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Report added successfully:", response.data);
            Swal.fire("Success!", "Report uploaded successfully.", "success");
            handleCloseFormUploadModal();
        } catch (error) {
            console.error("Error uploading report:", error);
            Swal.fire("Error!", "Failed to upload report.", "error");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Check if file is a PDF
            if (file.type === 'application/pdf') {
                Swal.fire(
                    "Error!",
                    "PDF files are not allowed. Please upload JPG or PNG files only.",
                    "error"
                );
                return;
            }
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                Swal.fire(
                    "Error!",
                    "Only image files (JPG, PNG) are allowed.",
                    "error"
                );
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleClinicRefNoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value.trim(); // Trim whitespace from input
        setClinicRefNo(value);
        
        // Only show suggestions if there's input
        if (value) {
            const lowerCaseValue = value.toLowerCase();
            const filtered = patientClinicRefNos.filter((patient) =>
                patient.clinicRefNo.toLowerCase().includes(lowerCaseValue)
            );
            
            // Sort filtered results to prioritize those starting with the input
            const sorted = filtered.sort((a, b) => {
                const aStartsWith = a.clinicRefNo.toLowerCase().startsWith(lowerCaseValue);
                const bStartsWith = b.clinicRefNo.toLowerCase().startsWith(lowerCaseValue);

                if (aStartsWith && !bStartsWith) {
                    return -1; // a comes first
                } else if (!aStartsWith && bStartsWith) {
                    return 1; // b comes first
                } else {
                    // If both start with or neither start with, maintain original order or sort alphabetically
                    return a.clinicRefNo.localeCompare(b.clinicRefNo);
                }
            });

            setFilteredClinicRefNos(sorted);
            setShowDropdown(sorted.length > 0); // Show dropdown only if there are suggestions
        } else {
            setFilteredClinicRefNos([]);
            setShowDropdown(false);
        }
    };

    const handleSelectClinicRefNo = (selectedRefNo: string) => {
        setClinicRefNo(selectedRefNo);
        setShowDropdown(false);
    };

    // Add click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.clinic-ref-input-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="space-y-4 flex-1">
            <StatisticsCards />
            {/* Drug List Section */}
            <div className="bg-white rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Drug list
                    </h2>
                    <div
                        className="inline-flex items-center px-4 py-2 bg-[#4287f5] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        onClick={handleAddDrugClick}
                    >
                        <PlusIcon size={18} className="mr-1.5" />
                        Add Drug
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Total categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Drugs Classes
                        </div>
                        <div className="text-2xl font-semibold">8</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">All Drugs</div>
                        <div className="text-2xl font-semibold">1520</div>
                    </div>
                </div>
            </div>
            {/* Order Form Section */}
            <div className="bg-white rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Order Form Edit
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Form Categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Form Categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                </div>
            </div>
            {/* History Upload Section */}
            <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Old History & Examination Form upload
                    </h2>
                    <button
                        className="inline-flex items-center px-4 py-2 bg-[#4287f5] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={handleFormUploadClick}
                    >
                        <PlusIcon size={18} className="mr-1.5" />
                        Add Form
                    </button>
                </div>
            </div>

            {/* Add Drug Modal */}
            <AddDrugModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddDrug={handleAddDrug}
            />

            {/* Form Upload Modal */}
            {isFormUploadModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-xl w-1/2 max-w-md relative shadow-2xl transform transition-all">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleCloseFormUploadModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Upload New Report
                        </h3>
                        <div className="space-y-6">
                            <div className="relative clinic-ref-input-container">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Clinic Ref No
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={clinicRefNo}
                                        onChange={handleClinicRefNoChange}
                                        onFocus={() => clinicRefNo.trim() && setShowDropdown(true)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter or search Clinic Ref No"
                                    />
                                    {showDropdown && filteredClinicRefNos.length > 0 && (
                                         <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                             {filteredClinicRefNos.map((patient) => (
                                                 <li
                                                     key={patient.id}
                                                     className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors last:border-b-0"
                                                     onClick={() => handleSelectClinicRefNo(patient.clinicRefNo)}
                                                 >
                                                     <div className="font-medium text-gray-900">{patient.clinicRefNo}</div>
                                                     <div className="text-sm text-gray-500">{patient.name}</div>
                                                 </li>
                                             ))}
                                         </ul>
                                    )}
                                </div>
                            </div>
                            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                <div className="space-y-2">
                                    <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        JPG, PNG up to 2MB
                                    </p>
                                </div>
                                {selectedFile && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="ml-2 text-sm text-green-700">{selectedFile.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                onClick={handleCloseFormUploadModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                onClick={handleAddForm}
                            >
                                Upload Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DashboardContent;
