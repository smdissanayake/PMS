import React, { useState } from "react";

import PatientInfoCard from "./PatientInfoCard";
import TabNavigation from "./TabNavigation";
import TabContent from "./TabContent";
import FloatingActionButton from "./FloatingActionButton";

const PatientProfile = () => {
    const [activeTab, setActiveTab] = useState("history");
    const patientData = {
        name: "Sarah Johnson",
        nic: "970123-45-6789",
        age: "27",
        gender: "Female",
        address: "123 Medical Avenue, Healthcare City, 54321",
        category: "Outpatient",
    };
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Patient Profile
            </h1>
            <PatientInfoCard patient={patientData} />
            <div className="mt-8 bg-white rounded-lg shadow-sm">
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <TabContent activeTab={activeTab} />
            </div>
            <FloatingActionButton />
        </div>
    );
};
export default PatientProfile;
