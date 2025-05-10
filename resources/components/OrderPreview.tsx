import React from 'react';
import { FileTextIcon, AlertCircleIcon, TrashIcon } from 'lucide-react';
interface OrderPreviewProps {
  selectedOrders: string[];
  priority: string;
  notes: string;
  onRemoveOrder: (id: string) => void;
}
const OrderPreview = ({
  selectedOrders,
  priority,
  notes,
  onRemoveOrder
}: OrderPreviewProps) => {
  const getPriorityStyle = () => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  // Mock data for order details (in a real app, this would come from a database)
  const orderDetails: Record<string, {
    name: string;
    requiresFasting: boolean;
  }> = {
    mri: {
      name: 'MRI Scan',
      requiresFasting: false
    },
    ct: {
      name: 'CT Scan',
      requiresFasting: false
    },
    xray: {
      name: 'X-Ray',
      requiresFasting: false
    },
    cbc: {
      name: 'Complete Blood Count',
      requiresFasting: true
    },
    ecg: {
      name: 'ECG',
      requiresFasting: false
    },
    pft: {
      name: 'Pulmonary Function Test',
      requiresFasting: false
    }
  };
  if (selectedOrders.length === 0) {
    return <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-500 text-sm">No orders selected</h3>
        <p className="text-gray-400 text-xs mt-1">
          Select orders to preview them here
        </p>
      </div>;
  }
  return <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Order Summary</h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle()}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {selectedOrders.map(orderId => <div key={orderId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <div className="text-sm text-gray-900">
                  {orderDetails[orderId]?.name}
                </div>
                {orderDetails[orderId]?.requiresFasting && <div className="flex items-center mt-1 text-xs text-amber-600">
                    <AlertCircleIcon size={12} className="mr-1" />
                    Requires fasting
                  </div>}
              </div>
              <button onClick={() => onRemoveOrder(orderId)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <TrashIcon size={16} />
              </button>
            </div>)}
        </div>
        {notes && <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-700 mb-1">
              Additional Notes
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              {notes}
            </p>
          </div>}
      </div>
    </div>;
};
export default OrderPreview;