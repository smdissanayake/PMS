import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import PatientProfile from "../../components/PatientProfile";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import DashboardContent from "../../components/DashboardContent";

export default function Home() {
    const [activeTab, setActiveTab] = useState("investigations");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
            />
            <div className="flex-1 flex flex-col">
                <Header
                    isSidebarCollapsed={isSidebarCollapsed}
                    toggleSidebar={() =>
                        setIsSidebarCollapsed(!isSidebarCollapsed)
                    }
                />
                <main className="flex-1 p-6">
                    {activeTab === "investigations" && <InvestigationsTab />}
                    {activeTab === "patients" && <PatientsTab />}
                    {activeTab === "appointments" && (
                        <div className="text-center text-gray-500 mt-20">
                            Appointments tab content
                        </div>
                    )}
                    {activeTab === "messages" && (
                        <div className="text-center text-gray-500 mt-20">
                            Messages tab content
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div className="text-center text-gray-500 mt-20">
                            Analytics tab content
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
