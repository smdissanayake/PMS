import React from 'react';
import { Head } from '@inertiajs/react';
import PatientDetailsTable from '../../components/PatientDetailsTable';

export default function PatientDetails() {
    return (
        <>
            <Head title="Patient Details" />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <PatientDetailsTable />
                </div>
            </div>
        </>
    );
} 