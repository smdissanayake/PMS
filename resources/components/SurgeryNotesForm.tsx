import React, { useState, useEffect } from "react";
import {
    CalendarIcon,
    FileTextIcon,
    SaveIcon,
    DollarSignIcon,
    UploadCloudIcon,
    XIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    InfoIcon,
    HistoryIcon, // Added for View History button
} from "lucide-react";
import PathologyUploader from "./PathologyUploader";
import axios from "axios"; // Import axios
import SurgeryEstimateCard from "./SurgeryEstimateCard"; // Import the new component
import jsPDF from "jspdf";
interface FormErrors {
    date?: string;
    type?: string;
    notes?: string;
    general?: string;
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
    patientData?: {
        name: string;
        age: string;
        nic: string; // Changed from nic_passport_no to nic
        address: string;
        contact_no: string;
    } | null;
}

interface ImplantItem {
    description: string;
    quantity: string;
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

const initialEstimateFormState = {
    patientName: "",
    surgery: "",
    timeForSurgery: "",
    stayInICU: "",
    stayInWards: "",
    implants: "",
    date: "",
    contact: "",
    whatsapp: "",
    surgeryEstimateRange: "",
    presidentialFund: "NO",
    presidentialFundDate: "",
    presidentialFundDiagnosis: "NO",
    presidentialFundDiagnosisDate: "",
    nitfAgrahara: "NO",
    nitfAgraharaDate: "",
    nitfAgraharaDiagnosis: "NO",
    nitfAgraharaDiagnosisDate: "",
    openQuotations: "NO",
    openQuotationsDate: "",
    checkOnDrugs: "NO",
    implantPrescription: "NO",
    admissionLetter: "NO",
    investigationSheet: "NO",
    initialDeposit: "",
    tempAdmissionDate: "",
    anesthetistConsultationDate: "",
    guardianName: "",
    guardianContact: "",
    medicalCoordinator: "",
    implantRequest: {
        patientName: "",
        age: "",
        nicPassport: "",
        address: "",
        contact: "",
        surgeryDate: "",
        implants: [
            {
                description:
                    "Pedicle Screw Fixation (Element MIS, Augmentation S4)",
                quantity: "",
            },
            { description: "Lumbar PEEK Cage", quantity: "" },
            { description: "Kyphoplasty", quantity: "" },
            { description: "Cervical PEEK Cage", quantity: "" },
            {
                description:
                    "Anterior Cervical Plates (01 Level, 02 Level, 03 Level, 04 Level, Screws)",
                quantity: "",
            },
            { description: "Motion Disc", quantity: "" },
            { description: "Lateral Mass Screw Fixation", quantity: "" },
            { description: "Occipital Plate Fixation", quantity: "" },
        ],
        remarks: "",
    },
};

const SurgeryNotesForm = ({
    clinicRefNo,
    patientData,
}: SurgeryNotesFormProps) => {
    console.log("SurgeryNotesForm received patientData:", patientData);
    console.log("Patient NIC from patientData:", patientData?.nic); // Explicitly log NIC
    const [formData, setFormData] = useState({
        date: "",
        type: "",
        notes: "",
    });
    const [selectedPathologyFiles, setSelectedPathologyFiles] = useState<
        Array<{ file: File; preview: string | null; name: string }>
    >([]);
    const pathologyFileInputRef = React.useRef<HTMLInputElement>(null);

    const [savedNotes, setSavedNotes] = useState<SurgeryNoteData[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<SurgeryNoteData[]>([]); // New state for filtered notes
    const [searchDate, setSearchDate] = useState(""); // New state for search date
    const [errors, setErrors] = useState<FormErrors>({});
    const [estimateForm, setEstimateForm] = useState(initialEstimateFormState);
    const [showEstimateForm, setShowEstimateForm] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState<string | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [isNotesCollapsed, setIsNotesCollapsed] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [estimateFormErrors, setEstimateFormErrors] = useState<{
        [key: string]: string;
    }>({});
    const [expandedSections, setExpandedSections] = useState({
        general: true,
        funding: true,
        implant: true,
    });
    const [showEstimateCards, setShowEstimateCards] = useState(false);
    const [patientEstimates, setPatientEstimates] = useState([]);
    const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
    const [showSingleEstimateModal, setShowSingleEstimateModal] =
        useState(false);
    const [showPastEstimatesModal, setShowPastEstimatesModal] = useState(false); // New state for past estimates modal

    useEffect(() => {
        if (patientData) {
            setEstimateForm((prev) => ({
                ...prev,
                patientName: patientData.name || "",
                contact: patientData.contact_no || "",
                implantRequest: {
                    ...prev.implantRequest,
                    patientName: patientData.name || "",
                    age:
                        patientData.age !== undefined &&
                        patientData.age !== null
                            ? String(patientData.age)
                            : "", // Ensure age is always a string, default to empty string if not available
                    nicPassport: patientData.nic || "",
                    address: patientData.address || "",
                    contact: patientData.contact_no || "",
                },
            }));
        }
    }, [patientData]);

    const fetchSurgeryNotes = async () => {
        if (!clinicRefNo) {
            setSavedNotes([]);
            setFilteredNotes([]);
            return;
        }
        try {
            const response = await axios.get(`/api/surgery-notes`, {
                params: { clinic_ref_no: clinicRefNo },
            });
            setSavedNotes(response.data);
            setFilteredNotes(response.data); // Initialize filteredNotes with all notes
        } catch (error) {
            console.error("Error fetching surgery notes:", error);
            setErrors({ general: "Failed to fetch surgery notes." });
        }
    };

    useEffect(() => {
        fetchSurgeryNotes();
    }, [clinicRefNo]);

    const handlePathologyFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const newFiles = files.map((file) => {
            const typedFile = file as File;
            return {
                file: typedFile,
                preview: URL.createObjectURL(typedFile),
                name: typedFile.name,
            };
        });
        setSelectedPathologyFiles(newFiles);
    };

    const handleRemovePathologyFile = (indexToRemove: number) => {
        setSelectedPathologyFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handlePathologyUploadClick = () =>
        pathologyFileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent) => {
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
            return;
        }

        setErrors({});

        const data = new FormData();
        data.append("clinic_ref_no", clinicRefNo);
        data.append("surgery_date", formData.date);
        data.append("surgery_type", formData.type);
        data.append("surgery_notes", formData.notes);

        selectedPathologyFiles.forEach((fileObj, index) => {
            data.append(`pathology_reports[${index}]`, fileObj.file);
        });

        try {
            const response = await axios.post("/api/surgery-notes", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Surgery note saved:", response.data);

            fetchSurgeryNotes();

            setFormData({
                date: "",
                type: "",
                notes: "",
            });
            setSelectedPathologyFiles([]);
            if (pathologyFileInputRef.current) {
                pathologyFileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error saving surgery note:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: "An unexpected error occurred while saving.",
                });
            }
        }
    };

    const handleEstimateFormChange = (field: string, value: string) => {
        setEstimateForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        setEstimateFormErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleImplantRequestChange = (field: string, value: string) => {
        setEstimateForm((prev) => ({
            ...prev,
            implantRequest: {
                ...prev.implantRequest,
                [field]: value,
            },
        }));
        setEstimateFormErrors((prev) => ({
            ...prev,
            [`implant_${field}`]: "",
        }));
    };

    const handleImplantItemChange = (index: number, quantity: string) => {
        setEstimateForm((prev) => {
            const updatedImplants = [...prev.implantRequest.implants];
            updatedImplants[index] = {
                ...updatedImplants[index],
                quantity,
            };
            return {
                ...prev,
                implantRequest: {
                    ...prev.implantRequest,
                    implants: updatedImplants,
                },
            };
        });
    };

    const validateEstimateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!estimateForm.patientName.trim()) {
            newErrors.patientName = "Patient Name is required.";
        }
        if (!estimateForm.surgery.trim()) {
            newErrors.surgery = "Surgery is required.";
        }
        if (!estimateForm.date) {
            newErrors.date = "Date is required.";
        }
        if (!estimateForm.surgeryEstimateRange.trim()) {
            newErrors.surgeryEstimateRange =
                "Surgery Estimate Range is required.";
        }
        if (!estimateForm.implantRequest.patientName.trim()) {
            newErrors.implant_patientName =
                "Implant Request Patient Name is required.";
        }
        return newErrors;
    };

    const handleEstimateFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateEstimateForm();
        if (Object.keys(validationErrors).length > 0) {
            setEstimateFormErrors(validationErrors);
            return;
        }
        setIsGeneratingPDF(true);
        try {
            console.log("Submitting Surgery Estimate Form with:", {
                ...estimateForm,
                clinic_ref_no: clinicRefNo,
            });
            const response = await axios.post("/api/surgery-estimates", {
                ...estimateForm,
                clinic_ref_no: clinicRefNo,
            });
            console.log("Surgery estimate saved successfully:", response.data);
            generatePDF();
            // Reset form fields, preserving pre-loaded patient data
            setEstimateForm((prev) => {
                const resetState = { ...initialEstimateFormState };
                if (patientData) {
                    resetState.patientName = patientData.name || "";
                    resetState.contact = patientData.contact_no || "";
                    resetState.implantRequest = {
                        ...resetState.implantRequest,
                        patientName: patientData.name || "",
                        age:
                            patientData.age !== undefined &&
                            patientData.age !== null
                                ? String(patientData.age)
                                : "",
                        nicPassport: patientData.nic || "",
                        address: patientData.address || "",
                        contact: patientData.contact_no || "",
                    };
                }
                return resetState;
            });
            setEstimateFormErrors({}); // Clear errors
            setShowEstimateForm(false);
        } catch (error) {
            console.error("Error saving surgery estimate:", error);
            if (axios.isAxiosError(error)) {
                console.error("Axios error response:", error.response);
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    console.error(
                        "Backend validation errors:",
                        JSON.stringify(error.response.data.errors, null, 2)
                    ); // Log validation errors as a string
                    setEstimateFormErrors(error.response.data.errors);
                } else {
                    setEstimateFormErrors({
                        general:
                            error.response?.data?.message ||
                            "An unexpected error occurred while saving the estimate.",
                    });
                }
            } else {
                setEstimateFormErrors({
                    general:
                        "An unexpected error occurred while saving the estimate.",
                });
            }
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("CENTRAL HOSPITAL", 20, 20);
        doc.setFontSize(14);
        doc.text("SURGERY ESTIMATE FORM", 20, 30);
        doc.text("Brain & Spine Information Centre", 20, 40);
        doc.setFontSize(12);
        doc.text(`Patient Name: ${estimateForm.patientName}`, 20, 50);
        doc.text(`Surgery: ${estimateForm.surgery}`, 20, 60);
        doc.text(`Time for Surgery: ${estimateForm.timeForSurgery}`, 20, 70);
        doc.text(`Stay in ICU / HDU: ${estimateForm.stayInICU}`, 20, 80);
        doc.text(`Stay in Wards: ${estimateForm.stayInWards}`, 20, 90);
        doc.text(`Implants: ${estimateForm.implants}`, 20, 100);
        doc.text(`Date: ${estimateForm.date}`, 20, 110);
        doc.text(`Dr. Sunil Perera – Consultant Neurosurgeon`, 20, 120);
        doc.text(`Contact: ${estimateForm.contact}`, 20, 130);
        doc.text(`Whatsapp: ${estimateForm.whatsapp}`, 20, 140);
        doc.text(
            `Surgery Estimate / Range: ${estimateForm.surgeryEstimateRange}`,
            20,
            150
        );
        doc.text(
            `Presidential Fund Quotation: ${estimateForm.presidentialFund} ${
                estimateForm.presidentialFundDate
                    ? `(Date: ${estimateForm.presidentialFundDate})`
                    : ""
            }`,
            20,
            160
        );
        doc.text(
            `Presidential Fund Dr Diagnosis: ${
                estimateForm.presidentialFundDiagnosis
            } ${
                estimateForm.presidentialFundDiagnosisDate
                    ? `(Date: ${estimateForm.presidentialFundDiagnosisDate})`
                    : ""
            }`,
            20,
            170
        );
        doc.text(
            `NITF (Agrahara) Quotation: ${estimateForm.nitfAgrahara} ${
                estimateForm.nitfAgraharaDate
                    ? `(Date: ${estimateForm.nitfAgraharaDate})`
                    : ""
            }`,
            20,
            180
        );
        doc.text(
            `NITF (Agrahara) Dr Diagnosis: ${
                estimateForm.nitfAgraharaDiagnosis
            } ${
                estimateForm.nitfAgraharaDiagnosisDate
                    ? `(Date: ${estimateForm.nitfAgraharaDiagnosisDate})`
                    : ""
            }`,
            20,
            190
        );
        doc.text(
            `Open Quotations: ${estimateForm.openQuotations} ${
                estimateForm.openQuotationsDate
                    ? `(Date: ${estimateForm.openQuotationsDate})`
                    : ""
            }`,
            20,
            200
        );
        doc.text(`Check-On Drugs: ${estimateForm.checkOnDrugs}`, 20, 210);
        doc.text(
            `Implant Prescription: ${estimateForm.implantPrescription}`,
            20,
            220
        );
        doc.text(`Admission Letter: ${estimateForm.admissionLetter}`, 20, 230);
        doc.text(
            `Investigation Sheet: ${estimateForm.investigationSheet}`,
            20,
            240
        );
        doc.text(
            `Initial Deposit Amount: ${estimateForm.initialDeposit}`,
            20,
            250
        );
        doc.text(
            `Temporary Date and Time of Admission: ${estimateForm.tempAdmissionDate}`,
            20,
            260
        );
        doc.text(
            `Consultation Date of Anesthetist: ${estimateForm.anesthetistConsultationDate}`,
            20,
            270
        );
        doc.text("GUARDIAN INFO:", 20, 280);
        doc.text(`Name of the Guardian: ${estimateForm.guardianName}`, 20, 290);
        doc.text(`Contact No: ${estimateForm.guardianContact}`, 20, 300);
        doc.text(
            "I hereby declare that the above data collection and filling was done in the presence of the patient and visitors.",
            20,
            310
        );
        doc.text(`Date: ${estimateForm.date}`, 20, 320);
        doc.text(
            `Medical Coordinator: ${estimateForm.medicalCoordinator}`,
            20,
            330
        );

        // Implant Request Form
        doc.addPage();
        doc.setFontSize(14);
        doc.text("IMPLANT REQUEST FORM", 20, 20);
        doc.setFontSize(12);
        doc.text(
            `Patient Name: ${estimateForm.implantRequest.patientName}`,
            20,
            30
        );
        doc.text(`Age: ${estimateForm.implantRequest.age}`, 20, 40);
        doc.text(
            `NIC / Passport No: ${estimateForm.implantRequest.nicPassport}`,
            20,
            50
        );
        doc.text(`Address: ${estimateForm.implantRequest.address}`, 20, 60);
        doc.text(`Contact No: ${estimateForm.implantRequest.contact}`, 20, 70);
        doc.text(
            `Surgery Date: ${estimateForm.implantRequest.surgeryDate}`,
            20,
            80
        );

        // Implant Table
        doc.text(
            "NO   ITEM DESCRIPTION                          QUANTITY",
            20,
            90
        );
        doc.text("--------------------------------------------------", 20, 95);
        estimateForm.implantRequest.implants.forEach((implant, index) => {
            const y = 100 + index * 10;
            doc.text(
                `${String(index + 1).padStart(
                    2,
                    "0"
                )}   ${implant.description.padEnd(40, " ")} ${
                    implant.quantity
                }`,
                20,
                y
            );
        });
        doc.text(`Remarks: ${estimateForm.implantRequest.remarks}`, 20, 180);

        // Company Information
        doc.text("MedAcc (Pvt) Ltd", 20, 200);
        doc.text(
            "No.07, Manel Peiris, Sirimal Uyana, 10320, Ratmalana, Sri Lanka",
            20,
            210
        );
        doc.text("Tel: +94 (0) 112 72 6454 / +94 (0) 112 716 668", 20, 220);
        doc.text("Hotline: +94 (0) 77 068 032", 20, 230);
        doc.text("Email: info@medacc.co", 20, 240);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfGenerated(pdfUrl);
        setShowPdfModal(true);
    };

    const toggleNotesCollapse = () => {
        setIsNotesCollapsed(!isNotesCollapsed);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Handle search by date
    const handleSearchByDate = () => {
        if (!searchDate) {
            setFilteredNotes(savedNotes); // Reset to all notes if search is empty
            return;
        }

        const filtered = savedNotes.filter((note) => {
            const noteDate = new Date(note.surgery_date)
                .toISOString()
                .split("T")[0];
            return noteDate === searchDate;
        });

        setFilteredNotes(filtered);
    };

    // Reset search
    const handleResetSearch = () => {
        setSearchDate("");
        setFilteredNotes(savedNotes);
    };

    const fetchPatientEstimates = async () => {
        if (!clinicRefNo) {
            alert("Clinic Ref No is required to fetch past estimates.");
            return;
        }
        try {
            const response = await axios.get(
                `/api/surgery-estimates/${clinicRefNo}`
            );
            const processedEstimates = response.data.map((estimate: any) => {
                if (
                    estimate.implant_request_data &&
                    typeof estimate.implant_request_data === "string"
                ) {
                    try {
                        estimate.implant_request_data = JSON.parse(
                            estimate.implant_request_data
                        );
                    } catch (e) {
                        console.error(
                            "Failed to parse implant_request_data:",
                            e
                        );
                        estimate.implant_request_data = null; // Set to null if parsing fails
                    }
                }
                return estimate;
            });
            setPatientEstimates(processedEstimates);
            setShowPastEstimatesModal(true); // Show the past estimates modal
            setShowEstimateCards(true); // Still keep this for internal logic if needed, but modal controls visibility
        } catch (error) {
            console.error("Error fetching patient estimates:", error);
            alert("Failed to fetch past estimates.");
        }
    };

    const handleViewEstimateClick = (estimate: any) => {
        setSelectedEstimate(estimate);
        setShowSingleEstimateModal(true);
    };

    const handleEditEstimate = (estimate: any) => {
        // Load the estimate data into the form for editing
        setEstimateForm({
            patientName: estimate.patient_name || "",
            surgery: estimate.surgery || "",
            timeForSurgery: estimate.time_for_surgery || "",
            stayInICU: estimate.stay_in_icu || "",
            stayInWards: estimate.stay_in_wards || "",
            implants: estimate.implants_general || "",
            date: estimate.date || "",
            contact: estimate.contact || "",
            whatsapp: estimate.whatsapp || "",
            surgeryEstimateRange: estimate.surgery_estimate_range || "",
            presidentialFund: estimate.presidential_fund || "NO",
            presidentialFundDate: estimate.presidential_fund_date || "",
            presidentialFundDiagnosis:
                estimate.presidential_fund_diagnosis || "NO",
            presidentialFundDiagnosisDate:
                estimate.presidential_fund_diagnosis_date || "",
            nitfAgrahara: estimate.nitf_agrahara || "NO",
            nitfAgraharaDate: estimate.nitf_agrahara_date || "",
            nitfAgraharaDiagnosis: estimate.nitf_agrahara_diagnosis || "NO",
            nitfAgraharaDiagnosisDate:
                estimate.nitf_agrahara_diagnosis_date || "",
            openQuotations: estimate.open_quotations || "NO",
            openQuotationsDate: estimate.open_quotations_date || "",
            checkOnDrugs: estimate.check_on_drugs || "NO",
            implantPrescription: estimate.implant_prescription || "NO",
            admissionLetter: estimate.admission_letter || "NO",
            investigationSheet: estimate.investigation_sheet || "NO",
            initialDeposit: estimate.initial_deposit || "",
            tempAdmissionDate: estimate.temp_admission_date || "",
            anesthetistConsultationDate:
                estimate.anesthetist_consultation_date || "",
            guardianName: estimate.guardian_name || "",
            guardianContact: estimate.guardian_contact || "",
            medicalCoordinator: estimate.medical_coordinator || "",
            implantRequest: estimate.implant_request_data || {
                patientName: "",
                age: "",
                nicPassport: "",
                address: "",
                contact: "",
                surgeryDate: "",
                implants: [],
                remarks: "",
            },
        });
        setShowSingleEstimateModal(false); // Close the display card
        setShowEstimateForm(true); // Open the form for editing
        setErrors({}); // Clear any previous errors
        setEstimateFormErrors({}); // Clear any previous estimate form errors
    };

    const handleDeleteEstimate = async (id: number) => {
        try {
            await axios.delete(`/api/surgery-estimates/${id}`);
            alert("Estimate deleted successfully!");
            setShowSingleEstimateModal(false); // Close the display card
            fetchPatientEstimates(); // Refresh the list of estimates
        } catch (error) {
            console.error("Error deleting estimate:", error);
            alert("Failed to delete estimate.");
        }
    };

    const handleCloseEstimateModal = () => {
        setSelectedEstimate(null);
        setShowSingleEstimateModal(false);
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="flex items-center justify-end space-x-4">
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
                <button
                    type="button"
                    onClick={fetchPatientEstimates}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-sm"
                >
                    <HistoryIcon size={16} className="mr-2" />
                    View Past Estimates
                </button>
            </div>
            <div className="grid gap-6 w-full mt-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-full">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
                        <h4 className="text-lg font-medium text-gray-800">
                            Surgery Details
                        </h4>
                    </div>
                    <form className="p-6 space-y-6 w-full">
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
                                        className={`pl-10 w-full px-4 py-2.5 border ${
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
                                        <FileTextIcon className="h-5 w-5 text-gray-400" />{" "}
                                        {/* Added icon */}
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
                                        className={`pl-10 w-full px-4 py-2.5 border ${
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
                                    className={`pl-10 w-full px-4 py-2.5 border ${
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
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h4 className="font-medium text-gray-900">
                                    Pathology Reports
                                </h4>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <div className="text-center">
                                        <input
                                            type="file"
                                            id="pathology-file-upload"
                                            name="pathology-file-upload"
                                            className="hidden"
                                            multiple
                                            onChange={handlePathologyFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            ref={pathologyFileInputRef}
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePathologyUploadClick}
                                            className="cursor-pointer"
                                        >
                                            <UploadCloudIcon
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                                                Upload pathology reports
                                            </span>
                                        </button>
                                        <p className="mt-1 text-xs text-gray-500">
                                            PDF, JPG, PNG up to 10MB each
                                        </p>
                                    </div>
                                </div>
                                {selectedPathologyFiles.length > 0 && (
                                    <div className="mt-6 divide-y divide-gray-100">
                                        {selectedPathologyFiles.map(
                                            (file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between py-3"
                                                >
                                                    <div className="flex items-center">
                                                        <FileTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {file.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemovePathologyFile(
                                                                index
                                                            )
                                                        }
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        aria-label="Remove file"
                                                    >
                                                        <XIcon size={16} />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showEstimateForm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transform transition-all duration-300 ease-out">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-2xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-full">
                                    <h4 className="text-2xl font-bold">
                                        CENTRAL HOSPITAL Surgery Estimate Form
                                    </h4>
                                    <p className="text-sm mt-2">
                                        Brain & Spine Information Centre
                                    </p>
                                    <p className="text-sm">
                                        Dr. Sunil Perera – Consultant
                                        Neurosurgeon
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowEstimateForm(false)}
                                    className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors duration-200"
                                    aria-label="Close form"
                                >
                                    <XIcon size={24} />
                                </button>
                            </div>
                        </div>
                        <form
                            onSubmit={handleEstimateFormSubmit}
                            className="space-y-6"
                        >
                            {/* General Information Section */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("general")}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <h5 className="text-lg font-semibold text-gray-800">
                                        General Information
                                    </h5>
                                    {expandedSections.general ? (
                                        <ChevronUpIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    )}
                                </button>
                                {expandedSections.general && (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Patient Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={estimateForm.patientName}
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "patientName",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${
                                                    estimateFormErrors.patientName
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400`}
                                                required
                                            />
                                            {estimateFormErrors.patientName && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        estimateFormErrors.patientName
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Surgery *
                                            </label>
                                            <input
                                                type="text"
                                                value={estimateForm.surgery}
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "surgery",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${
                                                    estimateFormErrors.surgery
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400`}
                                                required
                                            />
                                            {estimateFormErrors.surgery && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {estimateFormErrors.surgery}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    value={estimateForm.date}
                                                    onChange={(e) =>
                                                        handleEstimateFormChange(
                                                            "date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`pl-10 w-full px-4 py-2.5 border ${
                                                        estimateFormErrors.date
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400`}
                                                    required
                                                />
                                            </div>
                                            {estimateFormErrors.date && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {estimateFormErrors.date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Time for Surgery
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.timeForSurgery
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "timeForSurgery",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stay in ICU / HDU
                                            </label>
                                            <input
                                                type="text"
                                                value={estimateForm.stayInICU}
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "stayInICU",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
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
                                                    handleEstimateFormChange(
                                                        "stayInWards",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
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
                                                    handleEstimateFormChange(
                                                        "implants",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
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
                                                    handleEstimateFormChange(
                                                        "contact",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Whatsapp
                                            </label>
                                            <input
                                                type="text"
                                                value={estimateForm.whatsapp}
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "whatsapp",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Surgery Estimate Range *
                                                <span title="Enter the estimated cost range for the surgery (e.g., $5000-$7000)">
                                                    <InfoIcon
                                                        size={16}
                                                        className="inline-block ml-1 text-gray-400 hover:text-blue-500 cursor-help"
                                                    />
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.surgeryEstimateRange
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "surgeryEstimateRange",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-4 py-2.5 border ${
                                                    estimateFormErrors.surgeryEstimateRange
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400`}
                                                required
                                            />
                                            {estimateFormErrors.surgeryEstimateRange && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        estimateFormErrors.surgeryEstimateRange
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Funding and Quotation Section */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("funding")}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <h5 className="text-lg font-semibold text-gray-800">
                                        Funding and Quotation Details
                                    </h5>
                                    {expandedSections.funding ? (
                                        <ChevronUpIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    )}
                                </button>
                                {expandedSections.funding && (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Presidential Fund Quotation
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.presidentialFund
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "presidentialFund",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                            {estimateForm.presidentialFund ===
                                                "YES" && (
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm.presidentialFundDate
                                                        }
                                                        onChange={(e) =>
                                                            handleEstimateFormChange(
                                                                "presidentialFundDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                        placeholder="Date of Issue"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Presidential Fund Dr Diagnosis
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.presidentialFundDiagnosis
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "presidentialFundDiagnosis",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                            {estimateForm.presidentialFundDiagnosis ===
                                                "YES" && (
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm.presidentialFundDiagnosisDate
                                                        }
                                                        onChange={(e) =>
                                                            handleEstimateFormChange(
                                                                "presidentialFundDiagnosisDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                        placeholder="Date of Issue"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                NITF (Agrahara) Quotation
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.nitfAgrahara
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "nitfAgrahara",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                            {estimateForm.nitfAgrahara ===
                                                "YES" && (
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm.nitfAgraharaDate
                                                        }
                                                        onChange={(e) =>
                                                            handleEstimateFormChange(
                                                                "nitfAgraharaDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                        placeholder="Date of Issue"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                NITF (Agrahara) Dr Diagnosis
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.nitfAgraharaDiagnosis
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "nitfAgraharaDiagnosis",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                            {estimateForm.nitfAgraharaDiagnosis ===
                                                "YES" && (
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm.nitfAgraharaDiagnosisDate
                                                        }
                                                        onChange={(e) =>
                                                            handleEstimateFormChange(
                                                                "nitfAgraharaDiagnosisDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                        placeholder="Date of Issue"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Open Quotations
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.openQuotations
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "openQuotations",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                            {estimateForm.openQuotations ===
                                                "YES" && (
                                                <div className="relative mt-2">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm.openQuotationsDate
                                                        }
                                                        onChange={(e) =>
                                                            handleEstimateFormChange(
                                                                "openQuotationsDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                        placeholder="Date of Issue"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Check-On Drugs
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.checkOnDrugs
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "checkOnDrugs",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Implant Prescription
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.implantPrescription
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "implantPrescription",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Admission Letter
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.admissionLetter
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "admissionLetter",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Investigation Sheet
                                            </label>
                                            <select
                                                value={
                                                    estimateForm.investigationSheet
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "investigationSheet",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            >
                                                <option value="NO">NO</option>
                                                <option value="YES">YES</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Initial Deposit Amount
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.initialDeposit
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "initialDeposit",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Temporary Date and Time of
                                                Admission
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.tempAdmissionDate
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "tempAdmissionDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Consultation Date of Anesthetist
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    value={
                                                        estimateForm.anesthetistConsultationDate
                                                    }
                                                    onChange={(e) =>
                                                        handleEstimateFormChange(
                                                            "anesthetistConsultationDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Guardian Name
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.guardianName
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "guardianName",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Guardian Contact
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.guardianContact
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "guardianContact",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medical Coordinator
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    estimateForm.medicalCoordinator
                                                }
                                                onChange={(e) =>
                                                    handleEstimateFormChange(
                                                        "medicalCoordinator",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Implant Request Section */}
                            <div className="border border-gray-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => toggleSection("implant")}
                                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <h5 className="text-lg font-semibold text-gray-800">
                                        Implant Request Form
                                    </h5>
                                    {expandedSections.implant ? (
                                        <ChevronUpIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    )}
                                </button>
                                {expandedSections.implant && (
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Patient Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        estimateForm
                                                            .implantRequest
                                                            .patientName
                                                    }
                                                    onChange={(e) =>
                                                        handleImplantRequestChange(
                                                            "patientName",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-4 py-2.5 border ${
                                                        estimateFormErrors.implant_patientName
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400`}
                                                    required
                                                />
                                                {estimateFormErrors.implant_patientName && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            estimateFormErrors.implant_patientName
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Age
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        estimateForm
                                                            .implantRequest.age
                                                    }
                                                    onChange={(e) =>
                                                        handleImplantRequestChange(
                                                            "age",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    NIC / Passport No
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        estimateForm
                                                            .implantRequest
                                                            .nicPassport
                                                    }
                                                    onChange={(e) =>
                                                        handleImplantRequestChange(
                                                            "nicPassport",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        estimateForm
                                                            .implantRequest
                                                            .address
                                                    }
                                                    onChange={(e) =>
                                                        handleImplantRequestChange(
                                                            "address",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Contact No
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        estimateForm
                                                            .implantRequest
                                                            .contact
                                                    }
                                                    onChange={(e) =>
                                                        handleImplantRequestChange(
                                                            "contact",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Surgery Date
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={
                                                            estimateForm
                                                                .implantRequest
                                                                .surgeryDate
                                                        }
                                                        onChange={(e) =>
                                                            handleImplantRequestChange(
                                                                "surgeryDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                                                Implant Items
                                            </h6>
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-blue-50">
                                                            <th className="border border-gray-200 p-3 text-left text-sm font-semibold text-gray-700">
                                                                No
                                                            </th>
                                                            <th className="border border-gray-200 p-3 text-left text-sm font-semibold text-gray-700">
                                                                Item Description
                                                            </th>
                                                            <th className="border border-gray-200 p-3 text-left text-sm font-semibold text-gray-700">
                                                                Quantity
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {estimateForm.implantRequest.implants.map(
                                                            (
                                                                implant,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={index}
                                                                    className={
                                                                        index %
                                                                            2 ===
                                                                        0
                                                                            ? "bg-white"
                                                                            : "bg-gray-50"
                                                                    }
                                                                >
                                                                    <td className="border border-gray-200 p-3 text-sm">
                                                                        {String(
                                                                            index +
                                                                                1
                                                                        ).padStart(
                                                                            2,
                                                                            "0"
                                                                        )}
                                                                    </td>
                                                                    <td className="border border-gray-200 p-3 text-sm">
                                                                        {
                                                                            implant.description
                                                                        }
                                                                    </td>
                                                                    <td className="border border-gray-200 p-3">
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                implant.quantity
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleImplantItemChange(
                                                                                    index,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Remarks
                                            </label>
                                            <textarea
                                                value={
                                                    estimateForm.implantRequest
                                                        .remarks
                                                }
                                                onChange={(e) =>
                                                    handleImplantRequestChange(
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm hover:border-blue-400"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowEstimateForm(false)}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isGeneratingPDF}
                                    className={`inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md ${
                                        isGeneratingPDF
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isGeneratingPDF ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                />
                                            </svg>
                                            Generating...
                                        </span>
                                    ) : (
                                        <>
                                            <SaveIcon
                                                size={16}
                                                className="mr-2"
                                            />
                                            Generate PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPdfModal && pdfGenerated && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transform transition-all duration-300 ease-out">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-2xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-full">
                                    <h4 className="text-2xl font-bold">
                                        Surgery Estimate PDF
                                    </h4>
                                    <p className="text-sm mt-2">
                                        Preview your generated estimate
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPdfModal(false)}
                                    className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors duration-200"
                                    aria-label="Close PDF preview"
                                >
                                    <XIcon size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="mb-6">
                            <iframe
                                src={pdfGenerated}
                                width="100%"
                                height="500px"
                                title="PDF Viewer"
                                className="border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowPdfModal(false)}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                            >
                                Close
                            </button>
                            <a
                                href={pdfGenerated}
                                download="surgery_estimate.pdf"
                                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md"
                            >
                                <SaveIcon size={16} className="mr-2" />
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {savedNotes.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">
                            Saved Surgery Notes
                        </h4>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) =>
                                        setSearchDate(e.target.value)
                                    }
                                    className="pl-10 w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Select date to search"
                                />
                            </div>
                            <button
                                onClick={handleSearchByDate}
                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleResetSearch}
                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                            >
                                Reset
                            </button>
                            <button
                                onClick={toggleNotesCollapse}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                aria-label={
                                    isNotesCollapsed
                                        ? "Expand notes"
                                        : "Collapse notes"
                                }
                            >
                                {isNotesCollapsed ? (
                                    <>
                                        Show Notes
                                        <ChevronDownIcon
                                            size={20}
                                            className="ml-1"
                                        />
                                    </>
                                ) : (
                                    <>
                                        Hide Notes
                                        <ChevronUpIcon
                                            size={20}
                                            className="ml-1"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    {!isNotesCollapsed && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-in-out">
                            {filteredNotes.length > 0 ? (
                                filteredNotes.map((note, index) => (
                                    <div
                                        key={index}
                                        className="relative bg-white p-5 rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
                                    >
                                        <div className="border-b border-gray-200 pb-3 mb-3">
                                            <p className="text-sm font-medium text-gray-500">
                                                <span className="font-semibold text-gray-800">
                                                    Clinic Ref No:
                                                </span>{" "}
                                                {note.clinic_ref_no}
                                            </p>
                                            <p className="text-sm font-medium text-gray-500">
                                                <span className="font-semibold text-gray-800">
                                                    Date:
                                                </span>{" "}
                                                {new Date(
                                                    note.surgery_date
                                                ).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-800">
                                                    Type:
                                                </span>{" "}
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {note.surgery_type}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-800">
                                                    Notes:
                                                </span>{" "}
                                                <span className="line-clamp-3">
                                                    {note.surgery_notes}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-gray-800 mb-2">
                                                Pathology Reports:
                                            </p>
                                            {note.pathology_report_path &&
                                            JSON.parse(
                                                note.pathology_report_path
                                            ).length > 0 ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {JSON.parse(
                                                        note.pathology_report_path
                                                    ).map(
                                                        (
                                                            path: string,
                                                            fileIndex: number
                                                        ) => {
                                                            const isImage =
                                                                /\.(jpeg|jpg|png)$/i.test(
                                                                    path
                                                                );
                                                            const isPdf =
                                                                /\.pdf$/i.test(
                                                                    path
                                                                );
                                                            const fileName =
                                                                path
                                                                    .split("/")
                                                                    .pop(); // Extract file name

                                                            return (
                                                                <div
                                                                    key={
                                                                        fileIndex
                                                                    }
                                                                    className="flex flex-col items-center border border-gray-200 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                                                >
                                                                    {isImage && (
                                                                        <img
                                                                            src={`/${path}`}
                                                                            alt={`Pathology Report ${
                                                                                fileIndex +
                                                                                1
                                                                            }`}
                                                                            className="w-16 h-16 object-cover rounded-md mb-2"
                                                                        />
                                                                    )}
                                                                    {isPdf && (
                                                                        <FileTextIcon className="h-10 w-10 text-red-500 mb-2" />
                                                                    )}
                                                                    <a
                                                                        href={`/${path}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium underline transition_colors duration-200 text-center"
                                                                    >
                                                                        {
                                                                            fileName
                                                                        }
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">
                                                    No Reports Uploaded
                                                </p>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 rounded-lg ring-2 ring-transparent hover:ring-blue-200 transition-all duration-300 pointer-events-none" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 col-span-full text-center">
                                    No notes found for the selected date.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showPastEstimatesModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transform transition-all duration-300 ease-out">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-t-2xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-full">
                                    <h4 className="text-2xl font-bold">
                                        Past Surgery Estimates
                                    </h4>
                                    <p className="text-sm mt-2">
                                        Review previous surgery estimates for
                                        this patient
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setShowPastEstimatesModal(false)
                                    }
                                    className="text-white hover:bg-indigo-700 rounded-full p-2 transition-colors duration-200"
                                    aria-label="Close past estimates"
                                >
                                    <XIcon size={24} />
                                </button>
                            </div>
                        </div>

                        {patientEstimates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {patientEstimates.map((estimate: any) => (
                                    <div
                                        key={estimate.id}
                                        className="bg-blue-50 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                        onClick={() =>
                                            handleViewEstimateClick(estimate)
                                        }
                                    >
                                        <p className="font-semibold text-lg">
                                            {estimate.surgery}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Date: {estimate.date}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Range:{" "}
                                            {estimate.surgery_estimate_range}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-600 text-center">
                                No past estimates found for this patient.
                            </p>
                        )}

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowPastEstimatesModal(false)}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSingleEstimateModal && (
                <SurgeryEstimateCard
                    estimate={selectedEstimate}
                    onClose={handleCloseEstimateModal}
                    onEdit={handleEditEstimate}
                    onDelete={handleDeleteEstimate}
                />
            )}
        </div>
    );
};

export default SurgeryNotesForm;
