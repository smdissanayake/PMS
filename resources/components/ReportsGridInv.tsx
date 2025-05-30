import React, { useEffect, useState } from "react";
import { ReportCardInv } from "./ReportCardInv";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface ReportsGridProps {
    viewMode: "grid" | "list";
    patientClinicRefNo: string;
}

interface Report {
    id: number;
    fileName: string;
    uploadDate: string;
    fileType: string;
    thumbnailUrl: string | null;
    status: string;
    notes: string | null;
    orderType: string;
    patientName: string;
}

export const ReportsGridInv: React.FC<ReportsGridProps> = ({ viewMode, patientClinicRefNo }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/investigation-reports?patient_clinic_ref_no=${patientClinicRefNo}`);
            if (response.data.status === 'success') {
                setReports(response.data.data);
            } else {
                setError('Failed to fetch reports');
            }
        } catch (err) {
            setError('Failed to fetch reports');
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [patientClinicRefNo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                {error}
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="text-center text-gray-500 p-4">
                No reports found
            </div>
        );
    }

    return (
        <div
            className={
                viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col space-y-3"
            }
        >
            {reports.map((report) => (
                <ReportCardInv
                    key={report.id}
                    report={report}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
};
