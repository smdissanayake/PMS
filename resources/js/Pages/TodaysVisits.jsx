import React from 'react';
import { Head } from '@inertiajs/react';
import TodaysVisitsTable from '../../components/TodaysVisitsTable';

export default function TodaysVisits() {
    return (
        <>
            <Head title="Today's Visits" />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <TodaysVisitsTable />
                </div>
            </div>
        </>
    );
} 