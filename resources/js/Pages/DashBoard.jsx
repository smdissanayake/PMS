import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Sidebar from "../../components/Sidebar";
import { Header } from "../../components/Header";
import DashboardContent from "../../components/DashboardContent";

export default function DashBoard({ auth }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-screen bg-gray-100">
                <Sidebar isCollapsed={isSidebarCollapsed} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header 
                        isSidebarCollapsed={isSidebarCollapsed} 
                        toggleSidebar={toggleSidebar}
                        user={auth.user}
                    />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        <DashboardContent />
                    </main>
                </div>
            </div>
        </>
    );
}
