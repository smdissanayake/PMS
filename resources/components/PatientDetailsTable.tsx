import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface Patient {
    id: number;
    clinicRefNo: string;
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    address: string;
    nic: string;
    uhid: string;
    category: string;
}

const PatientDetailsTable = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/patients');
            setPatients(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch patients. Please try again later.');
            console.error('Error fetching patients:', err);
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Patient Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Ref No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.clinicRefNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${patient.firstName} ${patient.lastName}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nic}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.birthday}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientDetailsTable; 