import React, { useState, useEffect } from "react";
import {
    CalendarIcon,
    FileTextIcon,
    SaveIcon,
    DollarSignIcon,
} from "lucide-react";
import PathologyUploader from "./PathologyUploader";
import { jsPDF } from "jspdf";
import axios from "axios"; // Import axios

interface FormErrors {
    date?: string;
    type?: string;
    notes?: string;
    general?: string; // For general API errors
}

interface SurgeryNoteData {
    id?: number;
    clinic_ref_no: string;
    surgery_date: string;
    surgery_type: string;
    surgery_notes: string;
    pathology_report_path?: string | null;
    created_at?: string;
    updated_at?: string;
}

interface SurgeryNotesFormProps {
    patientId: number | null;
    clinicRefNo: string;
}

const surgeryTypes = [
    "General Surgery",
    "Orthopedic Surgery",
    "Cardiac Surgery",
    "Neurosurgery",
    "Plastic Surgery",
    "Emergency Surgery",
    "Minimally Invasive Surgery",
];

const SurgeryNotesForm = ({ clinicRefNo }: SurgeryNotesFormProps) => {
    const [formData, setFormData] = useState({
        date: "",
        type: "",
        notes: "",
    });
    const [savedNotes, setSavedNotes] = useState<SurgeryNoteData[]>([]); // New state for saved notes, typed
    const [errors, setErrors] = useState<FormErrors>({}); // New state for validation errors
    const [estimateForm, setEstimateForm] = useState({
        patientName: "",
        surgery: "",
        timeForSurgery: "",
        stayInICU: "",
        stayInWards: "",
        implants: "",
        date: "",
        contact: "",
        surgeryEstimateRange: "",
        presidentialFund: "NO",
        niteAgrarian: "NO",
        agrarianDiagnosis: "NO",
        checkOnDrugs: "NO",
        admissionLetter: "NO",
        investigationSheet: "NO",
        initialDeposit: "",
        tempAdmissionDate: "",
        guardianName: "",
        guardianContact: "",
    });
    const [showEstimateForm, setShowEstimateForm] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState<string | null>(null);

    // Function to fetch surgery notes from the backend
    const fetchSurgeryNotes = async () => {
        if (!clinicRefNo) {
            setSavedNotes([]); // Clear notes if no clinicRefNo
            return;
        }
        try {
            const response = await axios.get(`/api/surgery-notes`, {
                params: { clinic_ref_no: clinicRefNo },
            });
            setSavedNotes(response.data);
        } catch (error) {
            console.error("Error fetching surgery notes:", error);
            setErrors({ general: "Failed to fetch surgery notes." });
        }
    };

    // Fetch notes on component mount and when clinicRefNo changes
    useEffect(() => {
        fetchSurgeryNotes();
    }, [clinicRefNo]); // Depend on clinicRefNo prop

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        if (!clinicRefNo) {
            newErrors.general =
                "Patient Clinic Ref No is missing. Cannot save.";
        }
        if (!formData.date) {
            newErrors.date = "Surgery Date is required.";
        }
        if (!formData.type) {
            newErrors.type = "Surgery Type is required.";
        }
        if (!formData.notes.trim()) {
            newErrors.notes = "Surgery Notes cannot be empty.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Stop submission if there are errors
        }

        setErrors({}); // Clear errors if validation passes

        try {
            // Send data to backend
            const response = await axios.post("/api/surgery-notes", {
                clinic_ref_no: clinicRefNo,
                surgery_date: formData.date,
                surgery_type: formData.type,
                surgery_notes: formData.notes,
                pathology_report_path: "path/to/uploaded/report.pdf", // Placeholder for actual path
            });
            console.log("Surgery note saved:", response.data);

            // After successful save, refetch notes to update the displayed list
            fetchSurgeryNotes();

            // Optionally clear the form after saving
            setFormData({
                date: "",
                type: "",
                notes: "",
            });
        } catch (error) {
            console.error("Error saving surgery note:", error);
            // Handle API errors (e.g., display a message to the user)
            if (axios.isAxiosError(error) && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                // Generic error message
                setErrors({
                    general: "An unexpected error occurred while saving.",
                });
            }
        }
    };

    const handleEstimateFormSubmit = (e) => {
        e.preventDefault();
        generatePDF();
        setShowEstimateForm(false);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Surgery Estimate Form", 10, 10);
        doc.text(`Patient Name: ${estimateForm.patientName}`, 10, 20);
        doc.text(`Surgery: ${estimateForm.surgery}`, 10, 30);
        doc.text(`Date: ${estimateForm.date}`, 10, 40);
        doc.text(`Time for Surgery: ${estimateForm.timeForSurgery}`, 10, 50);
        doc.text(`Stay in ICU: ${estimateForm.stayInICU}`, 10, 60);
        doc.text(`Stay in Wards: ${estimateForm.stayInWards}`, 10, 70);
        doc.text(`Implants: ${estimateForm.implants}`, 10, 80);
        doc.text(`Contact: ${estimateForm.contact}`, 10, 90);
        doc.text(
            `Surgery Estimate Range: ${estimateForm.surgeryEstimateRange}`,
            10,
            100
        );
        doc.text(
            `Presidential Fund: ${estimateForm.presidentialFund}`,
            10,
            110
        );
        doc.text(`NITE/Agrarian: ${estimateForm.niteAgrarian}`, 10, 120);
        doc.text(
            `Agrarian Diagnosis: ${estimateForm.agrarianDiagnosis}`,
            10,
            130
        );
        doc.text(`Check on Drugs: ${estimateForm.checkOnDrugs}`, 10, 140);
        doc.text(`Admission Letter: ${estimateForm.admissionLetter}`, 10, 150);
        doc.text(
            `Investigation Sheet: ${estimateForm.investigationSheet}`,
            10,
            160
        );
        doc.text(`Initial Deposit: ${estimateForm.initialDeposit}`, 10, 170);
        doc.text(
            `Temporary Admission Date: ${estimateForm.tempAdmissionDate}`,
            10,
            180
        );
        doc.text(`Guardian Name: ${estimateForm.guardianName}`, 10, 190);
        doc.text(`Guardian Contact: ${estimateForm.guardianContact}`, 10, 200);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfGenerated(pdfUrl);
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md w-full">
                <h3 className="text-xl font-semibold text-gray-800">
                    Surgery Notes
                </h3>
                <div className="space-x-3">
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                    >
                        <SaveIcon size={16} className="mr-2" />
                        Save Note
                    </button>
                    <button
                        onClick={() => setShowEstimateForm(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
                    >
                        <DollarSignIcon size={16} className="mr-2" />
                        Surgery Estimate Form
                    </button>
                </div>
            </div>
            <div className="grid gap-6 w-full">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
                        <h4 className="text-lg font-medium text-gray-800">
                            Surgery Details
                        </h4>
                    </div>
                    <form className="p-6 space-y-6 w-full">
                        {/* Display Clinic Ref No, not input */}
                        {/* <div className="w-full">
                            <label
                                htmlFor="clinicRefNoDisplay"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Patient Clinic Ref No
                            </label>
                            <p
                                id="clinicRefNoDisplay"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700"
                            >
                                {clinicRefNo || "N/A"}
                            </p>
                            {errors.general && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.general}
                                </p>
                            )}
                        </div> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="w-full">
                                <label
                                    htmlFor="surgeryDate"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Surgery Date
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="surgeryDate"
                                        name="surgeryDate"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                date: e.target.value,
                                            })
                                        }
                                        className={`pl-10 w-full px-3 py-2 border ${
                                            errors.date
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                        required
                                    />
                                    {errors.date && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="surgeryType"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Surgery Type
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="surgeryType"
                                        name="surgeryType"
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value,
                                            })
                                        }
                                        className={`pl-10 w-full px-3 py-2 border ${
                                            errors.type
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none`}
                                        required
                                    >
                                        <option value="">
                                            Select surgery type
                                        </option>
                                        {surgeryTypes.map((type) => (
                                            <option
                                                key={type}
                                                value={type}
                                                className="bg-white"
                                            >
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="surgeryNotes"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Surgery Notes
                            </label>
                            <div className="relative w-full">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FileTextIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="surgeryNotes"
                                    name="surgeryNotes"
                                    rows={6}
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            notes: e.target.value,
                                        })
                                    }
                                    className={`pl-10 w-full px-3 py-2 border ${
                                        errors.notes
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                    placeholder="Enter detailed surgery notes..."
                                    required
                                />
                                {errors.notes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <PathologyUploader />
            </div>

            {showEstimateForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl transform transition-all duration-300 ease-out scale-100 hover:scale-101">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <h4 className="text-xl font-semibold text-gray-800">
                                Surgery Estimate Form
                            </h4>
                            <button
                                onClick={() => setShowEstimateForm(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form
                            onSubmit={handleEstimateFormSubmit}
                            className="space-y-6 mt-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Name
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.patientName}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                patientName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Surgery
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.surgery}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                surgery: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={estimateForm.date}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                date: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time for Surgery
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.timeForSurgery}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                timeForSurgery: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stay in ICU
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.stayInICU}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                stayInICU: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stay in Wards
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.stayInWards}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                stayInWards: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Implants
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.implants}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                implants: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.contact}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                contact: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Surgery Estimate Range
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            estimateForm.surgeryEstimateRange
                                        }
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                surgeryEstimateRange:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Initial Deposit
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.initialDeposit}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                initialDeposit: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Temporary Admission Date
                                    </label>
                                    <input
                                        type="date"
                                        value={estimateForm.tempAdmissionDate}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                tempAdmissionDate:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guardian Name
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.guardianName}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                guardianName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guardian Contact
                                    </label>
                                    <input
                                        type="text"
                                        value={estimateForm.guardianContact}
                                        onChange={(e) =>
                                            setEstimateForm({
                                                ...estimateForm,
                                                guardianContact: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowEstimateForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
                                >
                                    <SaveIcon size={16} className="mr-2" />
                                    Generate PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {pdfGenerated && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-800">
                            Generated PDF
                        </h4>
                        <a
                            href={pdfGenerated}
                            download="surgery_estimate.pdf"
                            className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                        >
                            Download
                        </a>
                    </div>
                    <iframe
                        src={pdfGenerated}
                        width="100%"
                        height="600px"
                        title="PDF Viewer"
                        className="border border-gray-200 rounded-lg"
                    />
                </div>
            )}

            {/* New section for displaying saved surgery notes */}
            {savedNotes.length > 0 && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Saved Surgery Notes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedNotes.map((note, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Clinic Ref No:
                                    </span>{" "}
                                    {note.clinic_ref_no}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Date:</span>{" "}
                                    {note.surgery_date}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Type:</span>{" "}
                                    {note.surgery_type}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Notes:
                                    </span>{" "}
                                    {note.surgery_notes}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Pathology Report:
                                    </span>{" "}
                                    {note.pathology_report_path
                                        ? "Uploaded"
                                        : "Not Uploaded"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurgeryNotesForm;
