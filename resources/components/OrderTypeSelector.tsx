import React from 'react';
import { CheckIcon, AlertCircleIcon } from 'lucide-react';
interface OrderType {
  id: string;
  name: string;
  category: string;
  requiresFasting: boolean;
  commonlyOrdered: boolean;
}
interface OrderTypeSelectorProps {
  selectedOrders: string[];
  onOrderSelect: (id: string) => void;
}
const OrderTypeSelector = ({
  selectedOrders,
  onOrderSelect
}: OrderTypeSelectorProps) => {
  const orderTypes: Record<string, OrderType[]> = {
    Imaging: [{
      id: 'mri',
      name: 'MRI Scan',
      category: 'Imaging',
      requiresFasting: false,
      commonlyOrdered: true
    }, {
      id: 'ct',
      name: 'CT Scan',
      category: 'Imaging',
      requiresFasting: false,
      commonlyOrdered: true
    }, {
      id: 'xray',
      name: 'X-Ray',
      category: 'Imaging',
      requiresFasting: false,
      commonlyOrdered: true
    }, {
      id: 'ultrasound',
      name: 'Ultrasound',
      category: 'Imaging',
      requiresFasting: false,
      commonlyOrdered: true
    }],
    Laboratory: [{
      id: 'cbc',
      name: 'Complete Blood Count',
      category: 'Laboratory',
      requiresFasting: true,
      commonlyOrdered: true
    }, {
      id: 'metabolic',
      name: 'Comprehensive Metabolic Panel',
      category: 'Laboratory',
      requiresFasting: true,
      commonlyOrdered: true
    }, {
      id: 'lipid',
      name: 'Lipid Panel',
      category: 'Laboratory',
      requiresFasting: true,
      commonlyOrdered: true
    }, {
      id: 'thyroid',
      name: 'Thyroid Function Tests',
      category: 'Laboratory',
      requiresFasting: true,
      commonlyOrdered: false
    }],
    Cardiology: [{
      id: 'ecg',
      name: 'ECG',
      category: 'Cardiology',
      requiresFasting: false,
      commonlyOrdered: true
    }, {
      id: 'echo',
      name: 'Echocardiogram',
      category: 'Cardiology',
      requiresFasting: false,
      commonlyOrdered: false
    }, {
      id: 'stress',
      name: 'Stress Test',
      category: 'Cardiology',
      requiresFasting: true,
      commonlyOrdered: false
    }],
    Respiratory: [{
      id: 'pft',
      name: 'Pulmonary Function Test',
      category: 'Respiratory',
      requiresFasting: false,
      commonlyOrdered: true
    }, {
      id: 'spo2',
      name: 'Oxygen Saturation Test',
      category: 'Respiratory',
      requiresFasting: false,
      commonlyOrdered: true
    }]
  };
  return <div className="space-y-6">
      {Object.entries(orderTypes).map(([category, tests]) => <div key={category} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">{category}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {tests.map(test => <label key={test.id} className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedOrders.includes(test.id) ? 'bg-blue-50' : ''}`}>
                <input type="checkbox" checked={selectedOrders.includes(test.id)} onChange={() => onOrderSelect(test.id)} className="hidden" />
                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${selectedOrders.includes(test.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {selectedOrders.includes(test.id) && <CheckIcon size={14} className="text-white" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">{test.name}</span>
                    {test.commonlyOrdered && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Common
                      </span>}
                  </div>
                  {test.requiresFasting && <div className="flex items-center mt-1 text-xs text-amber-600">
                      <AlertCircleIcon size={12} className="mr-1" />
                      Requires fasting
                    </div>}
                </div>
              </label>)}
          </div>
        </div>)}
    </div>;
};
export default OrderTypeSelector;