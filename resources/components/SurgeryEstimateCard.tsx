import React from "react";

interface SurgeryEstimateCardProps {
    estimate: any;
    onClose: () => void;
    onEdit: (estimate: any) => void; // New prop for edit action
    onDelete: (id: number) => void; // New prop for delete action
}

const SurgeryEstimateCard: React.FC<SurgeryEstimateCardProps> = ({
    estimate,
    onClose,
    onEdit,
    onDelete,
}) => {
    if (!estimate) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg rounded-md bg-white">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
                    Surgery Estimate Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 overflow-y-auto max-h-[70vh] pr-4">
                    <p>
                        <strong>Patient Name:</strong> {estimate.patient_name}
                    </p>
                    <p>
                        <strong>Surgery:</strong> {estimate.surgery}
                    </p>
                    <p>
                        <strong>Date:</strong> {estimate.date}
                    </p>
                    <p>
                        <strong>Contact:</strong> {estimate.contact}
                    </p>
                    <p>
                        <strong>Whatsapp:</strong> {estimate.whatsapp}
                    </p>
                    <p>
                        <strong>Surgery Estimate Range:</strong>{" "}
                        {estimate.surgery_estimate_range}
                    </p>
                    <p>
                        <strong>Time for Surgery:</strong>{" "}
                        {estimate.time_for_surgery || "N/A"}
                    </p>
                    <p>
                        <strong>Stay in ICU / HDU:</strong>{" "}
                        {estimate.stay_in_icu || "N/A"}
                    </p>
                    <p>
                        <strong>Stay in Wards:</strong>{" "}
                        {estimate.stay_in_wards || "N/A"}
                    </p>
                    <p>
                        <strong>Implants:</strong>{" "}
                        {estimate.implants_general || "N/A"}
                    </p>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                            Funding Information
                        </h3>
                        <p>
                            <strong>Presidential Fund:</strong>{" "}
                            {estimate.presidential_fund}{" "}
                            {estimate.presidential_fund_date
                                ? `(Date: ${estimate.presidential_fund_date})`
                                : ""}
                        </p>
                        <p>
                            <strong>Presidential Fund Dr Diagnosis:</strong>{" "}
                            {estimate.presidential_fund_diagnosis}{" "}
                            {estimate.presidential_fund_diagnosis_date
                                ? `(Date: ${estimate.presidential_fund_diagnosis_date})`
                                : ""}
                        </p>
                        <p>
                            <strong>NITF (Agrahara) Quotation:</strong>{" "}
                            {estimate.nitf_agrahara}{" "}
                            {estimate.nitf_agrahara_date
                                ? `(Date: ${estimate.nitf_agrahara_date})`
                                : ""}
                        </p>
                        <p>
                            <strong>NITF (Agrahara) Dr Diagnosis:</strong>{" "}
                            {estimate.nitf_agrahara_diagnosis}{" "}
                            {estimate.nitf_agrahara_diagnosis_date
                                ? `(Date: ${estimate.nitf_agrahara_diagnosis_date})`
                                : ""}
                        </p>
                        <p>
                            <strong>Open Quotations:</strong>{" "}
                            {estimate.open_quotations}{" "}
                            {estimate.open_quotations_date
                                ? `(Date: ${estimate.open_quotations_date})`
                                : ""}
                        </p>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                            Checklist
                        </h3>
                        <p>
                            <strong>Check-On Drugs:</strong>{" "}
                            {estimate.check_on_drugs}
                        </p>
                        <p>
                            <strong>Implant Prescription:</strong>{" "}
                            {estimate.implant_prescription}
                        </p>
                        <p>
                            <strong>Admission Letter:</strong>{" "}
                            {estimate.admission_letter}
                        </p>
                        <p>
                            <strong>Investigation Sheet:</strong>{" "}
                            {estimate.investigation_sheet}
                        </p>
                        <p>
                            <strong>Initial Deposit Amount:</strong>{" "}
                            {estimate.initial_deposit || "N/A"}
                        </p>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                            Admission & Consultation
                        </h3>
                        <p>
                            <strong>
                                Temporary Date and Time of Admission:
                            </strong>{" "}
                            {estimate.temp_admission_date || "N/A"}
                        </p>
                        <p>
                            <strong>Consultation Date of Anesthetist:</strong>{" "}
                            {estimate.anesthetist_consultation_date || "N/A"}
                        </p>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                            Guardian & Coordinator
                        </h3>
                        <p>
                            <strong>Name of the Guardian:</strong>{" "}
                            {estimate.guardian_name || "N/A"}
                        </p>
                        <p>
                            <strong>Contact No (Guardian):</strong>{" "}
                            {estimate.guardian_contact || "N/A"}
                        </p>
                        <p>
                            <strong>Medical Coordinator:</strong>{" "}
                            {estimate.medical_coordinator || "N/A"}
                        </p>
                    </div>

                    {estimate.implant_request_data && (
                        <div className="md:col-span-2 mt-4">
                            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                                Implant Request Details
                            </h3>
                            <p>
                                <strong>Patient Name (Implant):</strong>{" "}
                                {estimate.implant_request_data.patientName}
                            </p>
                            <p>
                                <strong>Age (Implant):</strong>{" "}
                                {estimate.implant_request_data.age || "N/A"}
                            </p>
                            <p>
                                <strong>NIC / Passport No (Implant):</strong>{" "}
                                {estimate.implant_request_data.nicPassport ||
                                    "N/A"}
                            </p>
                            <p>
                                <strong>Address (Implant):</strong>{" "}
                                {estimate.implant_request_data.address || "N/A"}
                            </p>
                            <p>
                                <strong>Contact No (Implant):</strong>{" "}
                                {estimate.implant_request_data.contact || "N/A"}
                            </p>
                            <p>
                                <strong>Surgery Date (Implant):</strong>{" "}
                                {estimate.implant_request_data.surgeryDate ||
                                    "N/A"}
                            </p>
                            {estimate.implant_request_data.implants &&
                                estimate.implant_request_data.implants.length >
                                    0 && (
                                    <div className="mt-2">
                                        <p className="font-medium">Implants:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            {estimate.implant_request_data.implants.map(
                                                (item: any, index: number) => (
                                                    <li key={index}>
                                                        {item.description} -
                                                        Quantity:{" "}
                                                        {item.quantity || "N/A"}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            <p>
                                <strong>Remarks:</strong>{" "}
                                {estimate.implant_request_data.remarks || "N/A"}
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure you want to delete this estimate?"
                                )
                            ) {
                                onDelete(estimate.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurgeryEstimateCard;
