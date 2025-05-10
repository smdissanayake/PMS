import React, { useState } from 'react';
import { CheckIcon, PlusIcon, UploadIcon, XIcon } from 'lucide-react';
interface OrderCategory {
  name: string;
  items: {
    id: string;
    label: string;
    requiresInput?: boolean;
    requiresFasting?: boolean;
  }[];
}
const InvestigationOrderForm = () => {
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const categories: OrderCategory[] = [{
    name: 'Spine Investigations',
    items: [{
      id: 'cervical_spine',
      label: 'Cervical Spine + Contrast',
      requiresFasting: true
    }, {
      id: 'lumbar_spine',
      label: 'Lumbar Spine + Contrast',
      requiresFasting: true
    }, {
      id: 'dorsal_spine',
      label: 'Dorsal Spine + Contrast',
      requiresFasting: true
    }, {
      id: 'whole_spine',
      label: 'Whole Spine + Contrast',
      requiresFasting: true
    }, {
      id: 'spine_screening',
      label: 'MRI Spine Screening Protocol',
      requiresFasting: true
    }, {
      id: 'backache_protocol',
      label: 'MRI Scan Backache Protocol',
      requiresFasting: true
    }, {
      id: 'spine_xray_scoliosis',
      label: 'X ray Whole Spine for Scoliosis AP/Lateral'
    }, {
      id: 'spine_xray_regional',
      label: 'X ray Cervical / Dorsal / Lumbar Spine AP Lateral / Lateral in Flexion / Extension'
    }]
  }, {
    name: 'Neuro Investigations',
    items: [{
      id: 'brain_mri_complete',
      label: 'MRI Scan Brain with MRA/MRV/MRS + Contrast',
      requiresFasting: true
    }, {
      id: 'brain_mri_limited',
      label: 'MRI Scan Brain-Limited Protocol',
      requiresFasting: true
    }, {
      id: 'dsa',
      label: 'Digital Subtraction Angiography',
      requiresFasting: true
    }, {
      id: 'brain_ct',
      label: 'CT Scan Brain + Contrast / CTA',
      requiresFasting: true
    }, {
      id: 'nerve_conduction',
      label: 'Nerve Conduction Study'
    }, {
      id: 'eeg',
      label: 'EEG and Report'
    }, {
      id: 'vep',
      label: 'Visual Evoke Potential'
    }, {
      id: 'perimetry',
      label: 'Visual Perimetry'
    }]
  }, {
    name: 'Cardiology',
    items: [{
      id: 'ecg',
      label: 'ECG'
    }, {
      id: 'echo',
      label: 'Echocardiogram'
    }, {
      id: 'stress',
      label: 'Stress Test',
      requiresInput: true
    }]
  }, {
    name: 'Laboratory',
    items: [{
      id: 'blood',
      label: 'Blood Test',
      requiresFasting: true
    }, {
      id: 'urine',
      label: 'Urine Test'
    }, {
      id: 'pcr',
      label: 'PCR Test'
    }]
  }, {
    name: 'Respiratory',
    items: [{
      id: 'pft',
      label: 'Pulmonary Function Test'
    }, {
      id: 'oxygen',
      label: 'Oxygen Saturation Test'
    }]
  }, {
    name: 'Other Investigations',
    items: [{
      id: 'audiogram',
      label: 'Audiogram'
    }, {
      id: 'pcr_other',
      label: 'PCR'
    }, {
      id: 'cxr',
      label: 'CXR'
    }, {
      id: 'other',
      label: 'Other (Specify)',
      requiresInput: true
    }]
  }];
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };
  const handleCustomInput = (orderId: string, value: string) => {
    setCustomInputs(prev => ({
      ...prev,
      [orderId]: value
    }));
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleGeneratePDF = () => {
    // Handle PDF generation
    console.log({
      priority,
      notes,
      selectedOrders,
      customInputs,
      uploadedFiles
    });
  };
  return <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Investigation Order Form
        </h3>
        <button onClick={handleGeneratePDF} disabled={selectedOrders.length === 0} className={`
            inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
            transition-colors
            ${selectedOrders.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}>
          Generate PDF Order Form
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Priority and Notes Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="normal">Normal Priority</option>
                <option value="urgent">Urgent Priority</option>
                <option value="stat">Stat Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Add any special instructions or notes..." />
            </div>
          </div>
          {/* Investigation Categories */}
          <div className="space-y-4">
            {categories.map(category => <div key={category.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map(item => <div key={item.id} className="flex items-start space-x-3">
                        <div onClick={() => handleOrderSelect(item.id)} className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border cursor-pointer transition-colors ${selectedOrders.includes(item.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {selectedOrders.includes(item.id) && <CheckIcon className="w-full h-full text-white p-0.5" />}
                        </div>
                        <div className="flex-grow">
                          <label className="text-sm text-gray-900 cursor-pointer">
                            {item.label}
                            {item.requiresFasting && <span className="ml-2 text-xs text-amber-600">
                                (Requires fasting)
                              </span>}
                          </label>
                          {item.requiresInput && selectedOrders.includes(item.id) && <input type="text" value={customInputs[item.id] || ''} onChange={e => handleCustomInput(item.id, e.target.value)} className="mt-2 w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Specify details..." />}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>)}
          </div>
          {/* Manual Form Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
              <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                      Upload scanned forms
                    </span>
                    <input type="file" className="sr-only" multiple onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
              </div>
            </div>
            {uploadedFiles.length > 0 && <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => <div key={index} className="relative group rounded-lg border border-gray-200 p-2">
                    <button onClick={() => handleRemoveFile(index)} className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <XIcon size={14} />
                    </button>
                    <p className="text-xs text-gray-600 truncate">
                      {file.name}
                    </p>
                  </div>)}
              </div>}
          </div>
        </div>
        {/* Order Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Selected Orders</h4>
            </div>
            <div className="p-6">
              {selectedOrders.length === 0 ? <p className="text-sm text-gray-500 text-center">
                  No orders selected
                </p> : <div className="space-y-3">
                  {selectedOrders.map(orderId => {
                const category = categories.find(cat => cat.items.some(item => item.id === orderId));
                const item = category?.items.find(item => item.id === orderId);
                if (!item) return null;
                return <div key={orderId} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="pr-2">
                          <p className="text-sm text-gray-900">{item.label}</p>
                          {customInputs[orderId] && <p className="text-xs text-gray-500 mt-1">
                              {customInputs[orderId]}
                            </p>}
                        </div>
                        <button onClick={() => handleOrderSelect(orderId)} className="text-gray-400 hover:text-red-500">
                          <XIcon size={16} />
                        </button>
                      </div>;
              })}
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default InvestigationOrderForm;