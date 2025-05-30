import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import StatisticsCards from "./StatisticsCards";
import AddDrugModal from "./AddDrugModal";
import axios from "axios"; // Import axios
import Swal from "sweetalert2"; // Import SweetAlert2

interface Patient {
    id: number;
    clinicRefNo: string;
    // Add other patient properties if needed
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
            setPatientClinicRefNos(response.data);
            setFilteredClinicRefNos(response.data); // Initialize filtered list
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
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleClinicRefNoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setClinicRefNo(value);
        if (value) {
            setFilteredClinicRefNos(
                patientClinicRefNos.filter((patient) =>
                    patient.clinicRefNo
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            setShowDropdown(true);
        } else {
            setFilteredClinicRefNos(patientClinicRefNos);
            setShowDropdown(false);
        }
    };

    const handleSelectClinicRefNo = (selectedRefNo: string) => {
        setClinicRefNo(selectedRefNo);
        setShowDropdown(false); // Hide dropdown after selection
    };

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
                    <div className="bg-white p-6 rounded-lg w-1/2 max-w-md relative">
                        <h3 className="text-lg font-semibold mb-4">
                            Upload New Report
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Clinic Ref No
                                </label>
                                <input
                                    type="text"
                                    value={clinicRefNo}
                                    onChange={handleClinicRefNoChange}
                                    onFocus={() => setShowDropdown(true)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="Enter or search Clinic Ref No"
                                />
                                {showDropdown &&
                                    filteredClinicRefNos.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto rounded-md shadow-lg mt-1">
                                            {filteredClinicRefNos.map(
                                                (patient) => (
                                                    <li
                                                        key={patient.id}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() =>
                                                            handleSelectClinicRefNo(
                                                                patient.clinicRefNo
                                                            )
                                                        }
                                                    >
                                                        {patient.clinicRefNo}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                            </div>
                            <div className="border-dashed border-2 border-blue-300 p-6 text-center">
                                <p className="text-gray-600">
                                    Drag and drop files here
                                </p>
                                <p className="text-gray-600">
                                    or click to browse
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Supported formats: PDF, JPG, PNG
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-blue-500 hover:underline"
                                >
                                    Browse files
                                </label>
                                {selectedFile && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                                onClick={handleCloseFormUploadModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-[#4287f5] text-white rounded-lg"
                                onClick={handleAddForm}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DashboardContent;
