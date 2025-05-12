import React, { useState } from "react";
import { FileDownIcon } from "lucide-react";
import OrderTypeSelector from "./OrderTypeSelector";
import OrderPreview from "./OrderPreview";
import RecentReportsSection from "./RecentReportsSection";
import ReportUploadSection from "./ReportUploadSection";


const OrderForm = () => {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [priority, setPriority] = useState("normal");
    const [notes, setNotes] = useState("");
    const [activeReportTab, setActiveReportTab] = useState<"recent" | "upload">(
        "recent"
    );
    const handleOrderSelect = (orderId: string) => {
        setSelectedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };
    const handleRemoveOrder = (orderId: string) => {
        setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    };
    const handleGeneratePDF = () => {
        // Handle PDF generation logic here
        console.log("Generating PDF for orders:", selectedOrders);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Generate Order Form
                    </h3>
                    <button
                        onClick={handleGeneratePDF}
                        disabled={selectedOrders.length === 0}
                        className={`
            inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
            transition-colors
            ${
                selectedOrders.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
            }
          `}
                    >
                        <FileDownIcon size={16} className="mr-1.5" />
                        Generate PDF
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority Level
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="normal">Normal Priority</option>
                                <option value="high">High Priority</option>
                                <option value="urgent">Urgent Priority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add any special instructions or notes..."
                            />
                        </div>
                        <OrderTypeSelector
                            selectedOrders={selectedOrders}
                            onOrderSelect={handleOrderSelect}
                        />
                    </div>
                    <div className="lg:sticky lg:top-6">
                        <OrderPreview
                            selectedOrders={selectedOrders}
                            priority={priority}
                            notes={notes}
                            onRemoveOrder={handleRemoveOrder}
                        />
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Reports
                    </h3>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setActiveReportTab("recent")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                activeReportTab === "recent"
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Recent Reports
                        </button>
                        <button
                            onClick={() => setActiveReportTab("upload")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                activeReportTab === "upload"
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Upload Reports
                        </button>
                    </div>
                </div>
                {activeReportTab === "recent" ? (
                    <RecentReportsSection />
                ) : (
                    <ReportUploadSection />
                )}
            </div>
        </>
    );
};
export default OrderForm;
