import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
    XIcon,
    EyeIcon,
    Trash2Icon,
    DownloadIcon,
    PlusIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react";

const MySwal = withReactContent(Swal);

interface WardAdmission {
    id: number;
    patient_id: number;
    clinic_ref_no: string;
    admission_date: string | null;
    discharge_date: string | null;
    icu: string | null;
    ward: string | null;
    image_paths: string[];
    created_at: string;
    updated_at: string;
}

interface WardAdmissionFormProps {
    patientId: number | null;
    clinicRefNo: string;
}

const WardAdmissionForm = ({
    patientId,
    clinicRefNo,
}: WardAdmissionFormProps) => {
    const [admissions, setAdmissions] = useState<WardAdmission[]>([]);
    const [tempFiles, setTempFiles] = useState<
        Array<{
            file: File;
            preview: string | null;
            uploadTime: string;
            type: string;
        }>
    >([]);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [searchDate, setSearchDate] = useState<string>("");
    const [admissionDate, setAdmissionDate] = useState("");
    const [dischargeDate, setDischargeDate] = useState("");
    const [icu, setIcu] = useState("");
    const [ward, setWard] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isCardSectionCollapsed, setIsCardSectionCollapsed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchAdmissions = async () => {
        if (!patientId) {
            setAdmissions([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `/api/patients/${patientId}/ward-admissions`
            );
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setAdmissions(data);
        } catch (err: unknown) {
            console.error("Failed to fetch ward admissions:", err);
            setError("Failed to load ward admissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, [patientId]);

    useEffect(() => {
        return () => {
            tempFiles.forEach((fileObj) => {
                if (fileObj.preview) URL.revokeObjectURL(fileObj.preview);
            });
        };
    }, [tempFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {

            const newFiles = files
                .map((file) => {
                    const typedFile = file as File;
                    const maxSize = 10 * 1024 * 1024;
                    if (typedFile.size > maxSize) {
                        MySwal.fire({
                            icon: "error",
                            title: "File Size Error",
                            text: `File "${typedFile.name}" exceeds 10MB limit.`,
                            confirmButtonColor: "#2563eb",
                        });
                        return null;
                    }
                    const acceptedTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                    ];
                    if (!acceptedTypes.includes(typedFile.type)) {
                        MySwal.fire({
                            icon: "error",
                            title: "File Type Error",
                            text: `File "${typedFile.name}" is not a supported type. Only JPG, PNG, and GIF are allowed.`,
                            confirmButtonColor: "#2563eb",
                        });
                        return null;
                    }
                    const uploadTime = new Date().toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                    return {
                        file: typedFile,
                        preview: URL.createObjectURL(typedFile),
                        uploadTime,
                        type: typedFile.type,
                    };
                })
                .filter((item) => item !== null) as Array<{
                    file: File;
                    preview: string;
                    uploadTime: string;
                    type: string;
                }>;



            setTempFiles(newFiles);
            setFormError(null);
        }
    };

    const handleRemoveTempFile = (fileIndex: number) => {
        setTempFiles((prev) => {
            const updatedFiles = [...prev];
            const fileToRemove = updatedFiles[fileIndex];
            updatedFiles.splice(fileIndex, 1);
            if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
            return updatedFiles;
        });
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinicRefNo) {
            MySwal.fire({
                icon: "warning",
                title: "Form Incomplete",
                text: "Please ensure patient is selected.",
                confirmButtonColor: "#2563eb",
            });
            return;
        }
        setFormError(null);
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("clinicRefNo", clinicRefNo);
        formData.append("admission_date", admissionDate || "");
        formData.append("discharge_date", dischargeDate || "");
        formData.append("icu", icu || "");
        formData.append("ward", ward || "");
        tempFiles.forEach((fileObj, index) => {
            formData.append(`images[${index}]`, fileObj.file);
        });

        try {
            const response = await axios.post(
                "/api/ward-admissions",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            MySwal.fire({
                icon: "success",
                title: "Success",
                text: "Ward admission added successfully!",
                confirmButtonColor: "#2563eb",
            });
            setFormError(null);
            setAdmissionDate("");
            setDischargeDate("");
            setIcu("");
            setWard("");
            setTempFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchAdmissions();
        } catch (err: unknown) {
            console.error("Failed to add ward admission:", err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                    confirmButtonColor: "#2563eb",
                });
            } else if (axios.isAxiosError(err) && err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let errorMessages = "";
                for (const key in errors) {
                    errorMessages += `${errors[key].join(", ")}\n`;
                }
                setError(errorMessages);
                MySwal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: errorMessages,
                    confirmButtonColor: "#2563eb",
                });
            } else {
                setError("An unexpected error occurred.");
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred.",
                    confirmButtonColor: "#2563eb",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        const result = await MySwal.fire({
            icon: "warning",
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this ward admission record?",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#dc2626",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/ward-admissions/${id}`);
            MySwal.fire({
                icon: "success",
                title: "Deleted",
                text: "Ward admission record deleted successfully!",
                confirmButtonColor: "#2563eb",
            });
            fetchAdmissions();
        } catch (err: unknown) {
            console.error("Failed to delete ward admission:", err);
            setError("Failed to delete ward admission.");
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete ward admission.",
                confirmButtonColor: "#2563eb",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleView = (imagePaths: string[]) => {
        setModalImages(imagePaths);
    };

    const handleDownloadCard = (imagePaths: string[]) => {
        imagePaths.forEach((path) => {
            const a = document.createElement("a");
            a.href = path;
            a.download = path.substring(path.lastIndexOf("/") + 1);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

    const closeModal = () => setModalImages([]);

    const toggleCardSection = () => {
        setIsCardSectionCollapsed((prev) => !prev);
    };

    const filteredAdmissions = searchDate
        ? admissions.filter(
            (admission) =>
                admission.admission_date && admission.admission_date.split("T")[0] === searchDate
        )
        : admissions;

    return (
        <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                    Ward Admission
                </h3>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 flex items-center"
                    disabled={loading}
                >
                    {loading ? (
                        "Adding..."
                    ) : (
                        <>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add
                        </>
                    )}
                </button>
            </div>
            <form className="p-4 space-y-6" onSubmit={(e) => e.preventDefault()}>
                {formError && (
                    <p className="text-red-500 text-sm">{formError}</p>
                )}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admission Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={admissionDate}
                                onChange={(e) =>
                                    setAdmissionDate(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discharge Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={dischargeDate}
                                onChange={(e) =>
                                    setDischargeDate(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ICU (Optional)
                        </label>
                        <input
                            type="text"
                            value={icu}
                            onChange={(e) => setIcu(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter ICU details"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ward (Optional)
                        </label>
                        <input
                            type="text"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Enter ward details"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images (Optional)
                    </label>
                    <div
                        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors duration-200 w-full cursor-pointer"
                        onClick={handleUploadClick}
                    >
                        <input
                            type="file"
                            id="fileUpload"
                            name="fileUpload"
                            accept="image/jpeg,image/png,image/gif"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-500 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-sm font-medium text-gray-700">
                                Drag and drop files here <br /> or click to
                                browse
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Supported formats: JPG, PNG, GIF
                            </p>
                        </div>
                    </div>
                    {tempFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {tempFiles.map((file, fileIndex) => (
                                <div key={fileIndex} className="relative">
                                    <img
                                        src={file.preview || ""}
                                        alt={file.file.name}
                                        className="w-full h-auto rounded-lg object-cover"
                                        style={{ maxHeight: "100px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveTempFile(fileIndex)
                                        }
                                        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Search Admissions
                    </h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search by Admission Date
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                            />
                            <button
                                type="button"
                                onClick={() => setSearchDate("")}
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                            Admission Records
                        </h4>
                        <button
                            type="button"
                            onClick={toggleCardSection}
                            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                            aria-label={
                                isCardSectionCollapsed
                                    ? "Expand Admission Records"
                                    : "Collapse Admission Records"
                            }
                        >
                            {isCardSectionCollapsed ? (
                                <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                                <ChevronUpIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {!isCardSectionCollapsed && (
                        <>
                            {loading && (
                                <p className="text-center text-blue-500">
                                    Loading admissions...
                                </p>
                            )}
                            {error && (
                                <p className="text-center text-red-500">
                                    {error}
                                </p>
                            )}
                            {filteredAdmissions.length > 0 ? (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredAdmissions.map((admission) => (
                                        <div
                                            key={admission.id}
                                            className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(
                                                            admission.created_at
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteCard(
                                                            admission.id
                                                        )
                                                    }
                                                    className="p-1 text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
                                                >
                                                    <Trash2Icon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            {admission.image_paths &&
                                                admission.image_paths.length >
                                                0 && (
                                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                                        {admission.image_paths.map(
                                                            (path, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative"
                                                                >
                                                                    <img
                                                                        src={
                                                                            path
                                                                        }
                                                                        alt={`Admission Image ${index}`}
                                                                        className="w-full h-auto rounded-lg object-contain"
                                                                        style={{
                                                                            maxHeight:
                                                                                "100px",
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            <div className="text-sm text-gray-700 mb-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Admission date
                                                    </span>
                                                    <span>
                                                        {admission.admission_date
                                                            ? admission.admission_date.split("T")[0]
                                                            : "Not specified"
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Discharge date
                                                    </span>
                                                    <span>
                                                        {admission.discharge_date
                                                            ? admission.discharge_date.split("T")[0]
                                                            : "Not specified"
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        ICU:
                                                    </span>
                                                    <span>{admission.icu || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Ward:
                                                    </span>
                                                    <span>
                                                        {admission.ward || "Not specified"}
                                                    </span>
                                                </div>
                                            </div>
                                            {admission.image_paths &&
                                                admission.image_paths.length >
                                                0 && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    admission.image_paths
                                                                )
                                                            }
                                                            className="flex-1 px-3 py-1 text-sm font-medium text-white bg-blue-300 rounded flex items-center justify-center"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-1" />
                                                            view
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDownloadCard(
                                                                    admission.image_paths
                                                                )
                                                            }
                                                            className="flex-1 px-3 py-1 text-sm font-medium text-white bg-blue-300 rounded flex items-center justify-center"
                                                        >
                                                            <DownloadIcon className="h-4 w-4 mr-1" />
                                                            download
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                searchDate && (
                                    <p className="text-center text-gray-500">
                                        No admissions found for the selected
                                        date.
                                    </p>
                                )
                            )}
                        </>
                    )}
                </div>
            </form>
            {modalImages.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg p-4 max-w-4xl w-full">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {modalImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Preview ${index}`}
                                    className="w-full h-auto rounded-lg object-contain"
                                    style={{ maxHeight: "70vh" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardAdmissionForm;
