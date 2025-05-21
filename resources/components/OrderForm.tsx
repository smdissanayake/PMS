import React, { useState } from "react";
import {
    CheckIcon,
    PlusIcon,
    FileTextIcon,
    XIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react";
interface Investigation {
    id: string;
    type: string;
    subType?: string;
    additionalType?: string;
    consultantName?: string;
    specialNotes?: string;
}
interface OrderEntry extends Investigation {
    orderDate: string;
}
const OrderForm = () => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [orders, setOrders] = useState<OrderEntry[]>([]);
    // Form state for each investigation type
    const [mriSpineForm, setMriSpineForm] = useState({
        subType: "",
        contrast: "",
        consultantName: "",
        specialNotes: "",
    });
    const [selectedInvestigation, setSelectedInvestigation] = useState({
        type: "",
        subType: "",
        additionalType: "",
        consultantName: "",
        specialNotes: "",
    });
    const investigations = [
        {
            id: "mri_spine",
            title: "MRI Spine",
            options: {
                types: [
                    "Cervical Spine",
                    "Lumbar Spine",
                    "Dorsal Spine",
                    "Whole Spine",
                ],
                contrast: ["with Contrast", "without Contrast"],
            },
        },
        {
            id: "mri_screening",
            title: "MRI Screening Protocol",
            noDropdowns: true,
        },
        {
            id: "mri_brain",
            title: "MRI Scan Brain",
            options: {
                types: ["MRA", "MRV", "MRS"],
                contrast: ["with Contrast"],
            },
        },
        {
            id: "mri_limited",
            title: "MRI Scan Brain-Limited Protocol",
            noDropdowns: true,
        },
        {
            id: "dsa",
            title: "Digital Subtraction Angiography",
            noDropdowns: true,
        },
        {
            id: "ct_scan",
            title: "CT Scan",
            options: {
                types: ["Brain", "CTA"],
                contrast: ["with Contrast", "without Contrast"],
            },
        },
        {
            id: "nerve",
            title: "Nerve Conduction Study",
            noDropdowns: true,
        },
        {
            id: "eeg",
            title: "EEG and Report",
            noDropdowns: true,
        },
        {
            id: "vep",
            title: "Visual Evoke Potential",
            noDropdowns: true,
        },
        {
            id: "perimetry",
            title: "Visual Perimetry",
            noDropdowns: true,
        },
        {
            id: "xray_scoliosis",
            title: "X-ray Whole Spine for Scoliosis",
            options: {
                types: ["AP", "Lateral"],
            },
        },
        {
            id: "xray_spine",
            title: "X-ray Spine",
            options: {
                types: ["Cervical", "Dorsal", "Lumbar"],
                views: ["AP Lateral", "Lateral in Flexion", "Extension"],
            },
        },
    ];
    const handleSectionToggle = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
        setSelectedInvestigation({
            type: "",
            subType: "",
            additionalType: "",
            consultantName: "",
            specialNotes: "",
        });
    };
    const handleGenerateOrderSummary = () => {
        // Store orders in localStorage
        localStorage.setItem("orderData", JSON.stringify(orders));

        // Open a new window
        const newWindow = window.open("", "_blank", "width=800,height=600");

        if (newWindow) {
            // Generate HTML content
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Medical Forder Form</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans">
  <div class="max-w-4xl mx-auto bg-white p-8 mt-10">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="mb-2">
        <img src="https://via.placeholder.com/50x50" alt="Logo" class="mx-auto">
      </div>
      <h1 class="text-2xl font-bold text-blue-700">Medical Forder Form</h1>
      <p class="text-sm text-gray-500">Order Form Number: <strong>#12365</strong></p>
      <p class="text-sm text-gray-500">Order Date: <strong>${new Date().toLocaleDateString()}</strong></p>
    </div>

    <!-- Patient / Consultant Info -->
    <div class="grid grid-cols-2 gap-8 mb-6 text-sm">
      <div>
        <h2 class="font-semibold text-blue-600 border-b pb-1 mb-2">Patient Info</h2>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>DOB:</strong> 01/01/1980</p>
        <p><strong>Address:</strong> 123 Health St, Cityville</p>
        <p><strong>Phone:</strong> (123) 456-7890</p>
      </div>
      <div>
        <h2 class="font-semibold text-blue-600 border-b pb-1 mb-2">Consultant Info</h2>
        <p><strong>Name:</strong> Dr. Jane Smith</p>
        <p><strong>Department:</strong> Internal Medicine</p>
        <p><strong>Clinic:</strong> MedicaCare Center</p>
        <p><strong>Phone:</strong> (321) 654-0987</p>
      </div>
    </div>

    <!-- Order Blocks -->
    <div class="space-y-6">
      ${orders
          .map(
              (order) => `
        <div class="bg-gray-50 border border-gray-300 rounded-md p-4">
          <p class="text-blue-700 font-semibold mb-2">${order.type}</p>
          <p class="text-sm text-gray-700"><strong>Description:</strong> ${
              order.subType || "—"
          }</p>
          <p class="text-sm text-gray-700 mt-1"><strong>Special Notes:</strong> ${
              order.specialNotes || "—"
          }</p>
        </div>
      `
          )
          .join("")}
    </div>

    <!-- Signature -->
    <div class="mt-10 border-t pt-6 text-sm">
      <p class="mb-2 text-gray-700">Doctor's Signature:</p>
      <div class="w-64 h-12 border-b border-gray-400"></div>
    </div>

    <!-- Footer -->
    <div class="mt-10 text-center text-xs text-gray-500">
      <p>If you have any questions about this form, please contact:</p>
      <p>Tel: (000) 000-0000 | Email: clinic@example.com</p>
      <p class="text-blue-600 font-semibold mt-2">THANK YOU FOR YOUR VISIT!</p>
    </div>
  </div>
</body>
</html>
            `;

            // Write HTML content to the new window
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            alert("Please allow pop-ups for this site.");
        }
    };

    // print template

    const handleAddOrder = (investigationId: string) => {
        const investigation = investigations.find(
            (inv) => inv.id === investigationId
        );
        if (!investigation) return;
        if (!selectedInvestigation.type && !investigation.noDropdowns) {
            alert("Please select required options");
            return;
        }
        const newOrder: OrderEntry = {
            id: Date.now().toString(),
            orderDate: new Date().toISOString(),
            type: investigation.title,
            subType: selectedInvestigation.type,
            additionalType: selectedInvestigation.additionalType,
            consultantName: selectedInvestigation.consultantName,
            specialNotes: selectedInvestigation.specialNotes,
        };
        setOrders([...orders, newOrder]);
        setSelectedInvestigation({
            type: "",
            subType: "",
            additionalType: "",
            consultantName: "",
            specialNotes: "",
        });
        setExpandedSection(null);
    };
    const renderInvestigationForm = (
        investigation: (typeof investigations)[0]
    ) => {
        return (
            <div className="space-y-4">
                {!investigation.noDropdowns && investigation.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type*
                            </label>
                            <select
                                value={selectedInvestigation.type}
                                onChange={(e) =>
                                    setSelectedInvestigation({
                                        ...selectedInvestigation,
                                        type: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select type</option>
                                {investigation.options.types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {investigation.options.contrast && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contrast*
                                </label>
                                <select
                                    value={selectedInvestigation.additionalType}
                                    onChange={(e) =>
                                        setSelectedInvestigation({
                                            ...selectedInvestigation,
                                            additionalType: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select contrast</option>
                                    {investigation.options.contrast.map(
                                        (contrast) => (
                                            <option
                                                key={contrast}
                                                value={contrast}
                                            >
                                                {contrast}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                        {investigation.options.views && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    View*
                                </label>
                                <select
                                    value={selectedInvestigation.additionalType}
                                    onChange={(e) =>
                                        setSelectedInvestigation({
                                            ...selectedInvestigation,
                                            additionalType: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select view</option>
                                    {investigation.options.views.map((view) => (
                                        <option key={view} value={view}>
                                            {view}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Consultant Name (optional)
                        </label>
                        <input
                            type="text"
                            value={selectedInvestigation.consultantName}
                            onChange={(e) =>
                                setSelectedInvestigation({
                                    ...selectedInvestigation,
                                    consultantName: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter consultant name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Notes (optional)
                        </label>
                        <input
                            type="text"
                            value={selectedInvestigation.specialNotes}
                            onChange={(e) =>
                                setSelectedInvestigation({
                                    ...selectedInvestigation,
                                    specialNotes: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Add any special notes"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => handleAddOrder(investigation.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <PlusIcon size={16} className="mr-1.5" />
                        Add to Order
                    </button>
                </div>
            </div>
        );
    };
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
                {investigations.map((investigation) => (
                    <div
                        key={investigation.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                        <button
                            onClick={() =>
                                handleSectionToggle(investigation.id)
                            }
                            className="w-full px-6 py-4 flex items-center justify-between text-left bg-gray-50 border-b border-gray-200"
                        >
                            <span className="font-medium text-gray-900">
                                {investigation.title}
                            </span>
                            {expandedSection === investigation.id ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                        {expandedSection === investigation.id && (
                            <div className="p-6">
                                {renderInvestigationForm(investigation)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {orders.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Order Summary
                    </h3>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">
                                            {order.type}
                                        </h4>
                                        {order.subType && (
                                            <h4 className="font-medium text-gray-900">
                                                {order.subType}
                                            </h4>
                                        )}
                                        {order.additionalType && (
                                            <h4 className="font-medium text-gray-900">
                                                {order.additionalType}
                                            </h4>
                                        )}
                                    </div>
                                    {order.consultantName && (
                                        <p className="text-sm text-gray-600">
                                            Consultant: {order.consultantName}
                                        </p>
                                    )}
                                    {order.specialNotes && (
                                        <p className="text-sm text-gray-500">
                                            {order.specialNotes}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        setOrders(
                                            orders.filter(
                                                (o) => o.id !== order.id
                                            )
                                        )
                                    }
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            onClick={handleGenerateOrderSummary}
                            className="w-full py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                            <FileTextIcon size={18} className="mr-2" />
                            Generate Order Summary
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default OrderForm;
