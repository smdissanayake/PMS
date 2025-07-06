import React, { useState } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import PatientProfile from "../../components/PatientProfile";
import Sidebar from "../../components/Sidebar";
import { Header } from "../../components/Header";
import DashboardContent from "../../components/DashboardContent";
import SurgeryCalendar from "../../components/SurgeryCalendar";
import PatientHistoryForm from "../../components/PatientHistoryForm";
import { PatientRegistration } from "../../components/PatientRegistration";
import PatiantReport from "./../../components/PetiantReport";

export default function Home() {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <>
            <Head title="Dashboard" />
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
                        user={auth?.user}
                    />

                    {/* Scrollable main section */}
                    <main className="flex-1 overflow-auto p-6">
                        {activeTab === "dashboard" && <DashboardContent />}

                        {activeTab === "registerpatient" && <PatientRegistration />}

                        {activeTab === "search" && <PatientProfile />}

                        {activeTab === "sergerycalendar" && <SurgeryCalendar />}

                        {activeTab === "reports" && <PatiantReport/>}
                        
                    </main>
                </div>
            </div>
        </>
    );
}
