import React, { useState, useRef, useEffect } from "react";
import {
    XIcon,
    EyeIcon,
    Trash2Icon,
    DownloadIcon,
    PlusIcon,
} from "lucide-react";
import axios from "axios";

interface WardAdmission {
    id: number;
    patient_id: number;
    clinic_ref_no: string;
    admission_date: string;
    discharge_date: string;
    icu: string;
    ward: string;
    image_paths: string[]; // Ensure backend returns this
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [admissionDate, setAdmissionDate] = useState("");
    const [dischargeDate, setDischargeDate] = useState("");
    const [icu, setIcu] = useState("");
    const [ward, setWard] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setAdmissions(response.data); // Ensure response.data contains image_paths
        } catch (err) {
            console.error("Failed to fetch ward admissions:", err);
            setError("Failed to load ward admissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, [patientId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            if (files.length < 2) {
                alert("Please select at least 2 images to upload.");
                return;
            }

            const newFiles = files
                .map((file) => {
                    const typedFile = file as File;
                    const maxSize = 10 * 1024 * 1024;
                    if (typedFile.size > maxSize) {
                        alert(`File "${typedFile.name}" exceeds 10MB limit.`);
                        return null;
                    }
                    const acceptedTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                    ];
                    if (!acceptedTypes.includes(typedFile.type)) {
                        alert(
                            `File "${typedFile.name}" is not a supported type. Only JPG, PNG, and GIF are allowed.`
                        );
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

            if (newFiles.length < 2) {
                alert(
                    "One or more files failed validation. Please select at least 2 valid images."
                );
                return;
            }

            setTempFiles(newFiles);
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
        if (!admissionDate || !dischargeDate || !icu || !ward || !clinicRefNo) {
            alert(
                "Please fill all fields (Admission Date, Discharge Date, ICU, Ward, and ensure patient is selected)."
            );
            return;
        }

        if (tempFiles.length < 2) {
            alert("Please upload at least 2 images.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("clinicRefNo", clinicRefNo);
        formData.append("admission_date", admissionDate);
        formData.append("discharge_date", dischargeDate);
        formData.append("icu", icu);
        formData.append("ward", ward);
        tempFiles.forEach((fileObj, index) => {
            formData.append(`images[${index}]`, fileObj.file); // Send images to backend
        });

        try {
            const response = await axios.post(
                "/api/ward-admissions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Ward admission added successfully!");
            setAdmissionDate("");
            setDischargeDate("");
            setIcu("");
            setWard("");
            setTempFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchAdmissions(); // Refresh to display new admission with images
        } catch (err: any) {
            console.error("Failed to add ward admission:", err);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                setError(err.response.data.message);
                alert(`Error: ${err.response.data.message}`);
            } else if (
                err.response &&
                err.response.data &&
                err.response.data.errors
            ) {
                const errors = err.response.data.errors;
                let errorMessages = "";
                for (const key in errors) {
                    errorMessages += `${errors[key].join(", ")}\n`;
                }
                setError(errorMessages);
                alert(`Validation Error:\n${errorMessages}`);
            } else {
                setError("An unexpected error occurred.");
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this ward admission record?"
            )
        ) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/api/ward-admissions/${id}`);
            alert("Ward admission record deleted successfully!");
            fetchAdmissions(); // Refresh the list
        } catch (err) {
            console.error("Failed to delete ward admission:", err);
            setError("Failed to delete ward admission.");
            alert("Failed to delete ward admission.");
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
            a.download = path.substring(path.lastIndexOf("/") + 1); // Extract filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };

    const closeModal = () => setModalImages([]);

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
            <form className="p-4 space-y-6">
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admission Date
                            </label>
                            <input
                                type="date"
                                value={admissionDate}
                                onChange={(e) =>
                                    setAdmissionDate(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discharge Date
                            </label>
                            <input
                                type="date"
                                value={dischargeDate}
                                onChange={(e) =>
                                    setDischargeDate(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ICU
                        </label>
                        <input
                            type="text"
                            value={icu}
                            onChange={(e) => setIcu(e.target.value)}
                            placeholder="Enter ICU details"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ward
                        </label>
                        <input
                            type="text"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            placeholder="Enter ward details"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images (Min 2, Optional)
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

                {loading && (
                    <p className="text-center text-blue-500">
                        Loading admissions...
                    </p>
                )}
                {error && <p className="text-center text-red-500">{error}</p>}

                {admissions.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {admissions.map((admission) => (
                            <div
                                key={admission.id}
                                className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Admission ID: {admission.id}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                admission.created_at
                                            ).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteCard(admission.id)
                                        }
                                        className="p-1 text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
                                    >
                                        <Trash2Icon className="h-5 w-5" />
                                    </button>
                                </div>
                                {admission.image_paths &&
                                    admission.image_paths.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            {admission.image_paths.map(
                                                (path, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={path}
                                                            alt={`Admission Image ${index}`}
                                                            className="w-full h-auto rounded-lg object-cover"
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
                                            Admission:
                                        </span>
                                        <span>{admission.admission_date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">
                                            Discharge:
                                        </span>
                                        <span>{admission.discharge_date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">
                                            ICU:
                                        </span>
                                        <span>{admission.icu}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">
                                            Ward:
                                        </span>
                                        <span>{admission.ward}</span>
                                    </div>
                                </div>
                                {admission.image_paths &&
                                    admission.image_paths.length > 0 && (
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
                )}
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
