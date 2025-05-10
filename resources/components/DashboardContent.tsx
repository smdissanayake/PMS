import React from "react";
import { PlusIcon } from "lucide-react";
import StatisticsCards from "./StatisticsCards";
const DashboardContent = () => {
    return (
        <div className="space-y-4 flex-1">
            <StatisticsCards />
            {/* Drug List Section */}
            <div className="bg-white rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Drug list
                    </h2>
                    <button className="inline-flex items-center px-4 py-2 bg-[#4287f5] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusIcon size={18} className="mr-1.5" />
                        Add Drug
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Total categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Drugs Classes
                        </div>
                        <div className="text-2xl font-semibold">8</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">All Drugs</div>
                        <div className="text-2xl font-semibold">1520</div>
                    </div>
                </div>
            </div>
            {/* Order Form Section */}
            <div className="bg-white rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Order Form Edit
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Form Categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Form Categories
                        </div>
                        <div className="text-2xl font-semibold">20</div>
                    </div>
                </div>
            </div>
            {/* History Upload Section */}
            <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Old History & Examination Form upload
                    </h2>
                    <button className="inline-flex items-center px-4 py-2 bg-[#4287f5] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                        <PlusIcon size={18} className="mr-1.5" />
                        Add From
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DashboardContent;
