import React, { useState, useEffect } from "react";
import {
    CheckIcon,
    PlusIcon,
    FileTextIcon,
    XIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import Swal from 'sweetalert2';

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
    age?: number;
}

interface OrderFormProps {
    patientId: string;
    patientClinicRefNo: string;
    patientName?: any | null; // Assuming patientData structure
}

interface SavedOrder {
    id: number;
    type: string;
    sub_type: string | null;
    additional_type: string | null;
    consultant_name: string | null;
    notes: string | null;
    order_date: string;
    age: number | null;
    created_at: string;
    status: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
    patientId,
    patientClinicRefNo,
    patientName,
}) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [orders, setOrders] = useState<OrderEntry[]>([]);
    const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavedOrdersExpanded, setIsSavedOrdersExpanded] = useState(false);
    const [dateFilter, setDateFilter] = useState<'today' | 'all' | 'custom'>('today');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
    const handleGenerateOrderSummary = async () => {
        // Store orders in localStorage
        localStorage.setItem("orderData", JSON.stringify(orders));
        
        // Open a new window
        const newWindow = window.open("", "_blank", "width=800,height=600");

        if (newWindow) {
            // Get the absolute URL for the logo
            const logoUrl = window.location.origin + "/images/logo_asiri.png";
            // Generate HTML content
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Medical Order Form</title>
  <style>
    body {
      background-color: #f3f4f6;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border: 1px solid #d1d5db;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header img {
      max-width: 120px;
      margin-bottom: 10px;
    }
    .header h1 {
      font-size: 24px;
      color: #1d4ed8;
      margin-bottom: 5px;
    }
    .header p {
      font-size: 14px;
      color: #374151;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #2563eb;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 10px;
      padding-bottom: 5px;
    }
    .info p {
      font-size: 14px;
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Letterhead / Header -->
    <div class="header">
      <img src="${logoUrl}" alt="Asiri Logo" />
      <h1>Medical Order Form</h1>
      <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <!-- Patient Information Section -->
    <div class="section">
      <div class="section-title">Patient Information</div>
      <div class="info">
        <p><strong>Name:</strong> ${patientName?.name || "N/A"}</p>
        <p><strong>Age:</strong> ${patientName?.age || "N/A"}</p>
        <p><strong>Gender:</strong> ${patientName?.gender || "N/A"}</p>
</p>
      </div>
    </div>

    <!-- Order Blocks -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      ${orders
          .map(
              (order) => `
        <div style="background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 1rem;">
          <p style="color: #1d4ed8; font-weight: 600; margin-bottom: 0.5rem;">${
              order.type
          } ${order.subType || ""} ${order.additionalType || ""}</p>
          <p style="font-size: 0.875rem; color: #374151;"><strong>Consultant Name:</strong> ${
              order.consultantName || "—"
          }</p>
          <p style="font-size: 0.875rem; color: #374151; margin-top: 0.25rem;"><strong>Special Notes:</strong> ${
              order.specialNotes || "—"
          }</p>
        </div>
      `
          )
          .join("")}
    </div>

    <!-- Signature -->
    <div style="margin-top: 2.5rem; border-top: 1px solid #e5e7eb; padding-top: 1.5rem; font-size: 0.875rem;">
      <p style="margin-bottom: 0.5rem; color: #374151;">Doctor's Signature:</p>
      <div style="width: 16rem; height: 3rem; border-bottom: 1px solid #9ca3af;"></div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 2.5rem; text-align: center; font-size: 0.75rem; color: #6b7280;">
      <p>If you have any questions about this form, please contact:</p>
      <p>Tel: (000) 000-0000 | Email: clinic@example.com</p>
      <p style="color: #2563eb; font-weight: 600; margin-top: 0.5rem;">THANK YOU FOR YOUR VISIT!</p>
    </div>
  </div>
</body>
</html>

            `;

            // Write HTML content to the new window
            newWindow.document.write(htmlContent);
            newWindow.document.close();

            // Immediately open print window
            // newWindow.print();
            

            // Close window after printing
            newWindow.onafterprint = () => {
                newWindow.close();
                // After printing, save to database
                saveOrderToDatabase();
            };

            // Fallback close after delay
            setTimeout(() => {
                newWindow.close();
                // After printing, save to database
                saveOrderToDatabase();
            }, 100);
        } else {
            alert("Please allow pop-ups for this site.");
        }
    };
    
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const fetchSavedOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/medical-orders/patient/${patientClinicRefNo}`);
            const data = await response.json();
            
            if (response.ok) {
                // The response is already an array of orders, no need to access data.data
                const pendingOrders = data.filter((order: SavedOrder) => order.status === 'pending');
                setSavedOrders(pendingOrders);
            } else {
                console.error('Failed to fetch orders:', data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/medical-orders/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setSavedOrders(savedOrders.filter(order => order.id !== orderId));
                    Toast.fire({
                        icon: "success",
                        title: "Order deleted successfully"
                    });
                } else {
                    throw new Error(data.message || 'Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                Toast.fire({
                    icon: "error",
                    title: "Failed to delete order"
                });
            }
        }
    };

    const saveOrderToDatabase = async () => {
        try {
            // Process each order individually
            for (const order of orders) {
            // Prepare data for API request
            const orderData = {
                patient_id: patientId,
                patient_clinic_ref_no: patientClinicRefNo,
                    type: order.type,
                    sub_type: order.subType,
                    additional_type: order.additionalType,
                    consultant_name: order.consultantName,
                    notes: order.specialNotes,
                    order_date: order.orderDate,
                    age: order.age,
                    status: 'pending' // Set initial status as pending
                };
                
                console.log('Sending order data:', orderData);
            
                // Send POST request to the API endpoint for each order
            const response = await fetch('/medical-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to save order');
                }
            }
            
            console.log('All orders saved successfully');
            Toast.fire({
                icon: "success",
                title: "Orders saved successfully"
            });
            
            // Refresh the orders list
            fetchSavedOrders();
            
        } catch (error) {
            console.error('Error saving orders:', error);
            Toast.fire({
                icon: "error",
                title: "Failed to save orders"
            });
        }
    };

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
            age: patientName?.age || null
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

    // Fetch saved orders when component mounts
    useEffect(() => {
        fetchSavedOrders();
    }, [patientClinicRefNo]);

    const getFilteredAndSortedOrders = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return savedOrders
            .filter(order => {
                const orderDate = new Date(order.created_at);
                orderDate.setHours(0, 0, 0, 0);

                if (dateFilter === 'today') {
                    return orderDate.getTime() === today.getTime();
                } else if (dateFilter === 'custom') {
                    const compareDate = new Date(selectedDate);
                    compareDate.setHours(0, 0, 0, 0);
                    return orderDate.getTime() === compareDate.getTime();
                }
                return true;
            })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        setSelectedDate(newDate);
        setDateFilter('custom');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* report name */}
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

            {/* Saved Orders Section */}
            <div className="bg-emerald-200 rounded-xl border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setIsSavedOrdersExpanded(!isSavedOrdersExpanded)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-emerald-300 border-b border-gray-200"
                >
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-white" />
                        <span className="font-medium text-white">
                            Saved Orders
                        </span>
                    </div>
                    {isSavedOrdersExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-white" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                </button>

                {isSavedOrdersExpanded && (
                    <div className="p-6 space-y-4">
                        {/* Date Filter */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Show:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDateFilter('today')}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            dateFilter === 'today'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => setDateFilter('all')}
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            dateFilter === 'all'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        All Orders
                                    </button>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigateDate('prev')}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500"
                                >
                                    <ChevronLeftIcon size={20} />
                                </button>
                                <button
                                    onClick={() => setDateFilter('custom')}
                                    className={`px-3 py-1 text-sm rounded-full ${
                                        dateFilter === 'custom'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {selectedDate.toLocaleDateString()}
                                </button>
                                <button
                                    onClick={() => navigateDate('next')}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500"
                                >
                                    <ChevronRightIcon size={20} />
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading orders...</p>
                            </div>
                        ) : getFilteredAndSortedOrders().length > 0 ? (
                            <div className="space-y-4">
                                {getFilteredAndSortedOrders().map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {order.type}
                                                </h4>
                                                {order.sub_type && (
                                                    <span className="text-gray-600">
                                                        {order.sub_type}
                                                    </span>
                                                )}
                                                {order.additional_type && (
                                                    <span className="text-gray-600">
                                                        {order.additional_type}
                                                    </span>
                                                )}
                                            </div>
                                            {order.consultant_name && (
                                                <p className="text-sm text-gray-600">
                                                    Consultant: {order.consultant_name}
                                                </p>
                                            )}
                                            {order.notes && (
                                                <p className="text-sm text-gray-500">
                                                    {order.notes}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400">
                                                Created: {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                {dateFilter === 'today' 
                                    ? 'No orders found for today'
                                    : dateFilter === 'custom'
                                    ? `No orders found for ${selectedDate.toLocaleDateString()}`
                                    : 'No saved orders found'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default OrderForm;
