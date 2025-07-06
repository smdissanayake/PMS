import React, { useState } from "react";
import { FileUploaderInv } from "./FileUploaderInv";
import { ReportsGridInv } from "./ReportsGridInv";
import { GridIcon, ListIcon } from "lucide-react";

interface InvestigationsTabProps {
    patientId: string;
    patientClinicRefNo: string;
    patientName?: string | null;
}

export const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ 
    patientClinicRefNo,
    patientId,
    patientName
}) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${
                            viewMode === "grid"
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <GridIcon size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${
                            viewMode === "list"
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>
            <FileUploaderInv 
                patientClinicRefNo={patientClinicRefNo} 
                patientId={patientId} 
                patientName={patientName} 
            />
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                    Recent Reports
                </h2>
                <ReportsGridInv 
                    viewMode={viewMode} 
                    patientClinicRefNo={patientClinicRefNo}
                />
            </div>
        </div>
    );
};
