import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface PatientVisit {
    id: number;
    clinicRefNo: string;
    type: string;
    comments: string;
    date: string;
    created_at: string;
    patient: {
        firstName: string;
        lastName: string;
    };
}

const TodaysVisitsTable = () => {
    const [visits, setVisits] = useState<PatientVisit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTodaysVisits();
    }, []);

    const fetchTodaysVisits = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/patient-notes/today');
            setVisits(response.data.visits); // <-- FIXED LINE
            setError(null);
        } catch (err) {
            setError('Failed to fetch today\'s visits. Please try again later.');
            console.error('Error fetching visits:', err);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Today's Patient Visits</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Ref No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {visits.map((visit) => (
                            <tr key={visit.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.clinicRefNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {`${visit.patient?.firstName || ''} ${visit.patient?.lastName || ''}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{visit.comments}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(visit.created_at).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodaysVisitsTable; 